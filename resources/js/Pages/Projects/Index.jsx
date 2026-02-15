import PublicLayout from '@/Layouts/PublicLayout';
import SectionHeading from '@/Components/SectionHeading';
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

export default function Index({ projects, contact, filters, availableStacks }) {
    const initialFilters = { ...defaultFilters, ...(filters ?? {}) };
    const stackOptions = availableStacks ?? [];
    const [query, setQuery] = useState(initialFilters.q);
    const [stack, setStack] = useState(initialFilters.stack);
    const [sort, setSort] = useState(initialFilters.sort);

    useEffect(() => {
        setQuery(initialFilters.q);
        setStack(initialFilters.stack);
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
            stack,
            sort,
        });
    };

    const resetFilters = () => {
        setQuery(defaultFilters.q);
        setStack(defaultFilters.stack);
        setSort(defaultFilters.sort);
        visitWithFilters(defaultFilters);
    };

    const metaDescription =
        'Published software projects showcasing delivery quality, architecture, and measurable outcomes.';
    const canonicalUrl = route('projects.index');

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
                        className="card-surface mt-6 flex flex-wrap items-end gap-4 p-4"
                    >
                        <label className="min-w-64 flex-1 text-sm text-[var(--muted)]">
                            Search
                            <input
                                type="search"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Title, summary, stack..."
                                className="mt-1 w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm text-[var(--text)]"
                            />
                        </label>

                        <label className="text-sm text-[var(--muted)]">
                            Stack
                            <select
                                value={stack}
                                onChange={(event) => setStack(event.target.value)}
                                className="mt-1 min-w-44 rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm text-[var(--text)]"
                            >
                                <option value="">All stacks</option>
                                {stackOptions.map((stackItem) => (
                                    <option key={stackItem} value={stackItem}>
                                        {stackItem}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="text-sm text-[var(--muted)]">
                            Sort
                            <select
                                value={sort}
                                onChange={(event) => setSort(event.target.value)}
                                className="mt-1 min-w-44 rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm text-[var(--text)]"
                            >
                                <option value="editorial">Editorial</option>
                                <option value="newest">Newest</option>
                                <option value="oldest">Oldest</option>
                            </select>
                        </label>

                        <button type="submit" className="button-primary">
                            Apply
                        </button>
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="button-secondary"
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
