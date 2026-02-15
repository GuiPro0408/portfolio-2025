import ActiveFilterChips from '@/Components/Filters/ActiveFilterChips';
import ListboxSelect from '@/Components/Filters/ListboxSelect';
import SectionHeading from '@/Components/SectionHeading';
import PublicLayout from '@/Layouts/PublicLayout';
import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
} from '@headlessui/react';
import { Head, Link, router } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useState } from 'react';

const defaultFilters = {
    q: '',
    stack: '',
    sort: 'editorial',
};

function toTags(stack) {
    if (!stack) {
        return [];
    }

    return stack
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 3);
}

function parseFilterStack(stack) {
    if (!stack) {
        return [];
    }

    return stack
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
}

function StackMultiSelect({ selectedValues, onChange, options }) {
    const selectedLabels = options
        .filter((option) => selectedValues.includes(option.value))
        .map((option) => option.label);
    const buttonLabel =
        selectedLabels.length === 0
            ? 'All stacks'
            : selectedLabels.length <= 2
              ? selectedLabels.join(', ')
              : `${selectedLabels.length} stacks selected`;

    return (
        <label className="projects-filter-label">
            Stack
            <Listbox value={selectedValues} onChange={onChange} multiple>
                <div className="projects-filter-select">
                    <ListboxButton className="projects-filter-select-button">
                        <span>{buttonLabel}</span>
                        <span
                            className="projects-filter-select-icon"
                            aria-hidden="true"
                        >
                            ▾
                        </span>
                    </ListboxButton>
                    <ListboxOptions className="projects-filter-options">
                        {options.map((option) => (
                            <ListboxOption
                                key={option.value}
                                value={option.value}
                                className="projects-filter-option projects-filter-option-multi"
                            >
                                {option.label}
                            </ListboxOption>
                        ))}
                    </ListboxOptions>
                </div>
            </Listbox>
        </label>
    );
}

function ProjectSkeletonGrid() {
    return (
        <div className="project-grid project-grid-skeleton mt-8" aria-busy="true">
            {Array.from({ length: 6 }).map((_, index) => (
                <article
                    key={`project-skeleton-${index}`}
                    className="project-card card-surface project-card-skeleton"
                >
                    <div className="project-card-body">
                        <div className="skeleton-line skeleton-title" />
                        <div className="skeleton-line" />
                        <div className="skeleton-line skeleton-short" />
                    </div>
                </article>
            ))}
        </div>
    );
}

export default function Index({ projects, contact, filters, availableStacks }) {
    const initialFilters = { ...defaultFilters, ...(filters ?? {}) };
    const [query, setQuery] = useState(initialFilters.q);
    const [stack, setStack] = useState(parseFilterStack(initialFilters.stack));
    const [sort, setSort] = useState(initialFilters.sort);
    const [isListLoading, setIsListLoading] = useState(false);

    useEffect(() => {
        setQuery(initialFilters.q);
        setStack(parseFilterStack(initialFilters.stack));
        setSort(initialFilters.sort);
        setIsListLoading(false);
    }, [initialFilters.q, initialFilters.stack, initialFilters.sort]);

    const stackFilterOptions = useMemo(
        () =>
            (availableStacks ?? []).map((stackItem) => ({
                value: stackItem,
                label: stackItem,
            })),
        [availableStacks],
    );

    const sortFilterOptions = useMemo(
        () => [
            { value: 'editorial', label: 'Editorial' },
            { value: 'newest', label: 'Newest' },
            { value: 'oldest', label: 'Oldest' },
        ],
        [],
    );

    const sortLabelByValue = useMemo(
        () =>
            Object.fromEntries(
                sortFilterOptions.map((option) => [option.value, option.label]),
            ),
        [sortFilterOptions],
    );

    const visitWithFilters = useCallback((nextFilters, options = {}) => {
        const queryParams = Object.fromEntries(
            Object.entries(nextFilters).filter(
                ([, value]) => value !== '' && value !== null && value !== undefined,
            ),
        );

        setIsListLoading(true);

        router.get(route('projects.index'), queryParams, {
            only: ['projects', 'filters', 'availableStacks'],
            preserveState: true,
            preserveScroll: true,
            replace: options.replace ?? true,
            onFinish: () => setIsListLoading(false),
        });
    }, []);

    const visitWithUrl = useCallback((url) => {
        if (!url) {
            return;
        }

        setIsListLoading(true);

        router.visit(url, {
            method: 'get',
            only: ['projects', 'filters'],
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onFinish: () => setIsListLoading(false),
        });
    }, []);

    useEffect(() => {
        const nextFilters = {
            q: query.trim(),
            stack: stack.join(','),
            sort,
        };

        const currentFilters = {
            q: initialFilters.q,
            stack: initialFilters.stack,
            sort: initialFilters.sort,
        };

        if (JSON.stringify(nextFilters) === JSON.stringify(currentFilters)) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            visitWithFilters(nextFilters);
        }, 300);

        return () => window.clearTimeout(timeoutId);
    }, [query, stack, sort, initialFilters.q, initialFilters.stack, initialFilters.sort, visitWithFilters]);

    const resetFilters = useCallback(() => {
        setQuery(defaultFilters.q);
        setStack([]);
        setSort(defaultFilters.sort);
        visitWithFilters(defaultFilters);
    }, [visitWithFilters]);

    const activeFilterChips = useMemo(() => {
        const chips = [];

        if (query.trim() !== '') {
            chips.push({
                key: 'q',
                label: 'Search',
                value: query.trim(),
            });
        }

        stack.forEach((token) => {
            chips.push({
                key: `stack:${token}`,
                label: 'Stack',
                value: token,
                token,
            });
        });

        if (sort !== defaultFilters.sort) {
            chips.push({
                key: 'sort',
                label: 'Sort',
                value: sortLabelByValue[sort] ?? sort,
            });
        }

        return chips;
    }, [query, stack, sort, sortLabelByValue]);

    const removeChip = useCallback((chip) => {
        if (chip.key === 'q') {
            setQuery('');
            return;
        }

        if (chip.key === 'sort') {
            setSort(defaultFilters.sort);
            return;
        }

        if (chip.key.startsWith('stack:')) {
            setStack((currentStack) =>
                currentStack.filter((token) => token !== chip.token),
            );
        }
    }, []);

    const metaDescription =
        'Published software projects showcasing delivery quality, architecture, and measurable outcomes.';
    const canonicalUrl = route('projects.index');

    const structuredData = useMemo(
        () => ({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Published Projects',
            description: metaDescription,
            url: canonicalUrl,
            hasPart: projects.data.map((project) => ({
                '@type': 'CreativeWork',
                name: project.title,
                url: route('projects.show', project.slug),
            })),
        }),
        [canonicalUrl, metaDescription, projects.data],
    );

    return (
        <>
            <Head title="Projects">
                <meta name="description" content={metaDescription} />
                <meta property="og:title" content="Projects | Guillaume Juste" />
                <meta property="og:description" content={metaDescription} />
                <meta name="twitter:card" content="summary" />
                <link rel="canonical" href={canonicalUrl} />
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            </Head>

            <PublicLayout contact={contact}>
                <section className="public-shell section-block reveal">
                    <SectionHeading
                        eyebrow="Portfolio"
                        title="Published Projects"
                        description="A curated list of shipped work, ordered by editorial priority."
                    />

                    <div className="projects-filter-form card-surface mt-6">
                        <label className="projects-filter-label projects-filter-search">
                            Search
                            <input
                                type="search"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Title, summary, stack..."
                                className="projects-filter-input"
                            />
                        </label>

                        <StackMultiSelect
                            selectedValues={stack}
                            onChange={setStack}
                            options={stackFilterOptions}
                        />

                        <ListboxSelect
                            label="Sort"
                            value={sort}
                            onChange={setSort}
                            options={sortFilterOptions}
                            labelClassName="projects-filter-label"
                            containerClassName="projects-filter-select"
                            buttonClassName="projects-filter-select-button"
                            iconClassName="projects-filter-select-icon"
                            optionsClassName="projects-filter-options"
                            optionClassName="projects-filter-option"
                            ariaLabel="Sort projects"
                        />

                        <button
                            type="button"
                            onClick={resetFilters}
                            className="button-secondary projects-filter-action"
                        >
                            Reset
                        </button>
                    </div>

                    <ActiveFilterChips
                        chips={activeFilterChips}
                        onRemove={removeChip}
                        onClearAll={resetFilters}
                    />

                    {isListLoading ? (
                        <ProjectSkeletonGrid />
                    ) : projects.data.length === 0 ? (
                        <p className="card-surface empty-note mt-8">
                            No published projects yet.
                        </p>
                    ) : (
                        <div className="project-grid mt-8">
                            {projects.data.map((project) => {
                                const tags = toTags(project.stack);

                                return (
                                    <article
                                        key={project.id}
                                        className="project-card card-surface"
                                    >
                                        <div className="project-card-body">
                                            <h2 className="project-card-title">
                                                <Link
                                                    href={route(
                                                        'projects.show',
                                                        project.slug,
                                                    )}
                                                    prefetch="hover"
                                                    cacheFor="30s"
                                                >
                                                    {project.title}
                                                </Link>
                                            </h2>
                                            <p className="project-card-summary">
                                                {project.summary}
                                            </p>

                                            {tags.length > 0 && (
                                                <ul
                                                    className="tag-list"
                                                    aria-label="Project stack"
                                                >
                                                    {tags.map((tag) => (
                                                        <li
                                                            key={`${project.id}-${tag}`}
                                                            className="tag-item"
                                                        >
                                                            {tag}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}

                                            <Link
                                                href={route(
                                                    'projects.show',
                                                    project.slug,
                                                )}
                                                className="project-link"
                                                prefetch="hover"
                                                cacheFor="30s"
                                            >
                                                View project
                                            </Link>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}

                    <nav
                        className="mt-10 flex items-center justify-between text-sm"
                        aria-label="Projects pagination"
                    >
                        <p className="text-[var(--muted)]">
                            Page {projects.current_page} of {projects.last_page}
                        </p>
                        <div className="flex gap-3">
                            {projects.prev_page_url && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        visitWithUrl(projects.prev_page_url)
                                    }
                                    className="button-secondary"
                                    disabled={isListLoading}
                                >
                                    Previous
                                </button>
                            )}
                            {projects.next_page_url && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        visitWithUrl(projects.next_page_url)
                                    }
                                    className="button-secondary"
                                    disabled={isListLoading}
                                >
                                    Next
                                </button>
                            )}
                        </div>
                    </nav>
                </section>
            </PublicLayout>
        </>
    );
}
