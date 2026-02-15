import ImagePlaceholder from '@/Components/Home/ImagePlaceholder';
import SectionHeading from '@/Components/SectionHeading';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

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

export default function FeaturedProjectsGrid({ projects, settings }) {
    const [failedImages, setFailedImages] = useState({});
    const imageOverrides = [
        settings.featured_image_1_url,
        settings.featured_image_2_url,
        settings.featured_image_3_url,
    ];

    const handleImageError = (id) => {
        setFailedImages((prev) => ({ ...prev, [id]: true }));
    };

    return (
        <section className="public-shell section-block reveal" aria-label="Featured projects">
            <div className="section-header-row">
                <SectionHeading
                    eyebrow="Selected Work"
                    title={settings.featured_section_title}
                    description={settings.featured_section_subtitle}
                />
                <Link
                    href={route('projects.index')}
                    className="section-inline-link section-inline-link-button"
                >
                    View all projects
                </Link>
            </div>

            {projects.length === 0 ? (
                <p className="card-surface empty-note">No featured projects published yet.</p>
            ) : (
                <div className="project-grid">
                    {projects.map((project, index) => {
                        const tags = toTags(project.stack);
                        const imageUrl = imageOverrides[index] || project.cover_image_url;
                        const imageIsBroken = failedImages[project.id] === true;

                        return (
                            <article key={project.id} className="project-card card-surface">
                                {imageUrl && !imageIsBroken ? (
                                    <img
                                        src={imageUrl}
                                        alt={`${project.title} cover`}
                                        className="project-cover"
                                        onError={() => handleImageError(project.id)}
                                    />
                                ) : (
                                    <ImagePlaceholder
                                        variant="featured"
                                        label={project.title}
                                    />
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
