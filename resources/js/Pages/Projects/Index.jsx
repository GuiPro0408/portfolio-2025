import PublicLayout from '@/Layouts/PublicLayout';
import SectionHeading from '@/Components/SectionHeading';
import { Head, Link } from '@inertiajs/react';

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

export default function Index({ projects, contact }) {
    return (
        <>
            <Head title="Projects" />

            <PublicLayout contact={contact}>
                <section className="public-shell section-block reveal">
                    <SectionHeading
                        eyebrow="Portfolio"
                        title="Published Projects"
                        description="A curated list of shipped work, ordered by editorial priority."
                    />

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
