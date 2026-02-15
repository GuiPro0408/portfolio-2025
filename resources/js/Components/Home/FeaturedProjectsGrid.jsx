import SectionHeading from '@/Components/SectionHeading';
import { Link } from '@inertiajs/react';

function toTags(stack) {
    if (!stack) {
        return [];
    }

    return stack
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 3);
}

export default function FeaturedProjectsGrid({ projects }) {
    return (
        <section className="public-shell section-block reveal" aria-label="Featured projects">
            <div className="section-header-row">
                <SectionHeading
                    eyebrow="Selected Work"
                    title="Featured Projects"
                    description="A focused sample of recent work with product impact and clean implementation."
                />
                <Link href={route('projects.index')} className="section-inline-link">
                    View all projects
                </Link>
            </div>

            {projects.length === 0 ? (
                <p className="card-surface empty-note">No featured projects published yet.</p>
            ) : (
                <div className="project-grid">
                    {projects.map((project) => {
                        const tags = toTags(project.stack);

                        return (
                            <article key={project.id} className="project-card card-surface">
                                {project.cover_image_url ? (
                                    <img
                                        src={project.cover_image_url}
                                        alt={`${project.title} cover`}
                                        className="project-cover"
                                    />
                                ) : (
                                    <div className="project-cover project-cover-fallback" aria-hidden="true">
                                        <span>{project.title}</span>
                                    </div>
                                )}

                                <div className="project-card-body">
                                    <h3 className="project-card-title">
                                        <Link href={route('projects.show', project.slug)}>
                                            {project.title}
                                        </Link>
                                    </h3>
                                    <p className="project-card-summary">{project.summary}</p>

                                    {tags.length > 0 && (
                                        <ul className="tag-list" aria-label="Project stack">
                                            {tags.map((tag) => (
                                                <li key={`${project.id}-${tag}`} className="tag-item">
                                                    {tag}
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    <Link
                                        href={route('projects.show', project.slug)}
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
        </section>
    );
}
