import ImagePlaceholder from '@/Components/Home/ImagePlaceholder';
import SectionHeading from '@/Components/SectionHeading';
import type {
    FeaturedProjectSummary,
    HomepageSettingsPayload,
} from '@/types/home';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

function toTags(stack: string | null): string[] {
    if (!stack) {
        return [];
    }

    return stack
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 3);
}

interface FeaturedProjectsGridProps {
    projects: FeaturedProjectSummary[];
    settings: HomepageSettingsPayload;
}

export default function FeaturedProjectsGrid({
    projects,
    settings,
}: FeaturedProjectsGridProps) {
    const [failedImages, setFailedImages] = useState<Record<number, boolean>>(
        {},
    );
    const imageOverrides = [
        settings.featured_image_1_url,
        settings.featured_image_2_url,
        settings.featured_image_3_url,
    ];

    const handleImageError = (id: number) => {
        setFailedImages((prev) => ({ ...prev, [id]: true }));
    };

    return (
        <section className="public-shell section-block reveal" aria-label="Featured projects">
            <div className="section-header-row">
                <SectionHeading
                    eyebrow="Selected Work"
                    title={settings.featured_section_title ?? 'Featured Projects'}
                    description={settings.featured_section_subtitle ?? undefined}
                />
                <Link
                    href={route('projects.index')}
                    className="section-inline-link section-inline-link-button"
                    prefetch="hover"
                    cacheFor="30s"
                >
                    View all projects
                    <ArrowRight size={14} aria-hidden="true" className="link-arrow-icon" />
                </Link>
            </div>

            {projects.length === 0 ? (
                <p className="card-surface empty-note">No featured projects published yet.</p>
            ) : (
                <div className="project-grid">
                    {projects.map((project, index) => {
                        const tags = toTags(project.stack);
                        const imageUrl =
                            imageOverrides[index] ?? project.cover_image_url;
                        const imageIsBroken = failedImages[project.id] === true;

                        return (
                            <article key={project.id} className="project-card card-surface">
                                {imageUrl && !imageIsBroken ? (
                                    <img
                                        src={imageUrl}
                                        alt={`${project.title} cover`}
                                        className="project-cover"
                                        loading="lazy"
                                        decoding="async"
                                        width="16"
                                        height="10"
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
                                        <Link
                                            href={route('projects.show', project.slug)}
                                            prefetch="hover"
                                            cacheFor="30s"
                                        >
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
                                        prefetch="hover"
                                        cacheFor="30s"
                                    >
                                        View project
                                        <ArrowRight
                                            size={14}
                                            aria-hidden="true"
                                            className="link-arrow-icon"
                                        />
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
