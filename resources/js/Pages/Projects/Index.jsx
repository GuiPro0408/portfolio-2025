import PublicLayout from '@/Layouts/PublicLayout';
import SectionHeading from '@/Components/SectionHeading';
import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
} from '@headlessui/react';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

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

function FilterSelect({ label, value, onChange, options }) {
    const selectedOption =
        options.find((option) => option.value === value) ?? options[0];

    return (
        <label className="projects-filter-label">
            {label}
            <Listbox value={selectedOption.value} onChange={onChange}>
                <div className="projects-filter-select">
                    <ListboxButton className="projects-filter-select-button">
                        <span>{selectedOption.label}</span>
                        <span className="projects-filter-select-icon" aria-hidden="true">
                            ▾
                        </span>
                    </ListboxButton>
                    <ListboxOptions className="projects-filter-options">
                        {options.map((option) => (
                            <ListboxOption
                                key={option.value || 'all'}
                                value={option.value}
                                className="projects-filter-option"
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
                        <span className="projects-filter-select-icon" aria-hidden="true">
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

export default function Index({ projects, contact, filters, availableStacks }) {
    const initialFilters = { ...defaultFilters, ...(filters ?? {}) };
    const stackOptions = availableStacks ?? [];
    const [query, setQuery] = useState(initialFilters.q);
    const [stack, setStack] = useState(parseFilterStack(initialFilters.stack));
    const [sort, setSort] = useState(initialFilters.sort);

    useEffect(() => {
        setQuery(initialFilters.q);
        setStack(parseFilterStack(initialFilters.stack));
        setSort(initialFilters.sort);
    }, [initialFilters.q, initialFilters.stack, initialFilters.sort]);

    const visitWithFilters = (nextFilters) => {
        const queryParams = Object.fromEntries(
            Object.entries(nextFilters).filter(
                ([, value]) => value !== '' && value !== null && value !== undefined,
            ),
        );

        router.get(route('projects.index'), queryParams, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const submitFilters = (event) => {
        event.preventDefault();
        visitWithFilters({
            q: query,
            stack: stack.join(','),
            sort,
        });
    };

    const resetFilters = () => {
        setQuery(defaultFilters.q);
        setStack([]);
        setSort(defaultFilters.sort);
        visitWithFilters(defaultFilters);
    };

    const metaDescription =
        'Published software projects showcasing delivery quality, architecture, and measurable outcomes.';
    const canonicalUrl = route('projects.index');
    const stackFilterOptions = stackOptions.map((stackItem) => ({
        value: stackItem,
        label: stackItem,
    }));
    const sortFilterOptions = [
        { value: 'editorial', label: 'Editorial' },
        { value: 'newest', label: 'Newest' },
        { value: 'oldest', label: 'Oldest' },
    ];

    const structuredData = {
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
    };

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

                    <form
                        onSubmit={submitFilters}
                        className="projects-filter-form card-surface mt-6"
                    >
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

                        <FilterSelect
                            label="Sort"
                            value={sort}
                            onChange={setSort}
                            options={sortFilterOptions}
                        />

                        <button
                            type="submit"
                            className="button-primary projects-filter-action"
                        >
                            Apply
                        </button>
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="button-secondary projects-filter-action"
                        >
                            Reset
                        </button>
                    </form>

                    {projects.data.length === 0 ? (
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
                                <Link
                                    href={projects.prev_page_url}
                                    className="button-secondary"
                                >
                                    Previous
                                </Link>
                            )}
                            {projects.next_page_url && (
                                <Link
                                    href={projects.next_page_url}
                                    className="button-secondary"
                                >
                                    Next
                                </Link>
                            )}
                        </div>
                    </nav>
                </section>
            </PublicLayout>
        </>
    );
}
