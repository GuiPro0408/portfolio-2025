import PublicLayout from '@/Layouts/PublicLayout';
import type { ContactPayload, SharedPageProps } from '@/types/contracts';
import { resolveSocialImage } from '@/utils/seo';
import { Head, Link, usePage } from '@inertiajs/react';

interface ProjectShowData {
    id: number;
    title: string;
    slug: string;
    summary: string;
    body: string;
    stack: string | null;
    cover_image_url: string | null;
    repo_url: string | null;
    live_url: string | null;
    published_at: string | null;
}

interface ProjectShowPageProps {
    project: ProjectShowData;
    contact: ContactPayload;
}

function formatStack(stack: string | null): string[] {
    if (!stack) {
        return [];
    }

    return stack
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
}

interface CaseStudySection {
    title: string;
    paragraphs: string[];
}

function formatPublishedAt(publishedAt: string | null): string | null {
    if (!publishedAt) {
        return null;
    }

    const date = new Date(publishedAt);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return new Intl.DateTimeFormat('en', {
        month: 'long',
        year: 'numeric',
    }).format(date);
}

function formatBodySections(body: string): CaseStudySection[] {
    const blocks = body
        .split(/\n{2,}/)
        .map((block) => block.trim())
        .filter(Boolean);

    if (blocks.length === 0) {
        return [];
    }

    const sections: CaseStudySection[] = [];
    let currentSection: CaseStudySection = {
        title: 'Overview',
        paragraphs: [],
    };

    for (const block of blocks) {
        const markdownHeading = block.match(/^#{1,6}\s+(.+)$/);
        const labelledHeading = block.match(
            /^([A-Za-z][A-Za-z0-9/&'(), -]{2,48}):\s*([\s\S]+)$/,
        );

        if (markdownHeading) {
            if (currentSection.paragraphs.length > 0) {
                sections.push(currentSection);
            }

            currentSection = {
                title: markdownHeading[1].trim(),
                paragraphs: [],
            };
            continue;
        }

        if (labelledHeading) {
            if (currentSection.paragraphs.length > 0) {
                sections.push(currentSection);
            }

            currentSection = {
                title: labelledHeading[1].trim(),
                paragraphs: [labelledHeading[2].trim()],
            };
            continue;
        }

        currentSection.paragraphs.push(block);
    }

    if (currentSection.paragraphs.length > 0) {
        sections.push(currentSection);
    }

    return sections;
}

export default function Show({ project, contact }: ProjectShowPageProps) {
    const { seo = {} } = usePage<SharedPageProps>().props;
    const personName = seo.person_name ?? 'Guillaume Juste';
    const tags = formatStack(project.stack);
    const publishedLabel = formatPublishedAt(project.published_at);
    const bodySections = formatBodySections(project.body);
    const metaDescription =
        project.summary ??
        'Detailed case study of a delivered software project.';
    const canonicalUrl = route('projects.show', project.slug);
    const socialImage = resolveSocialImage(
        [project.cover_image_url],
        seo.social_default_image,
        canonicalUrl,
    );
    const ogTitle = `${project.title} | ${personName}`;

    const projectStructuredData = {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.title,
        description: metaDescription,
        url: canonicalUrl,
        image: project.cover_image_url ?? undefined,
        keywords: tags.length > 0 ? tags.join(', ') : undefined,
        datePublished: project.published_at ?? undefined,
        author: {
            '@type': 'Person',
            name: personName,
            url: route('home'),
        },
    };

    const breadcrumbStructuredData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: route('home') },
            { '@type': 'ListItem', position: 2, name: 'Projects', item: route('projects.index') },
            { '@type': 'ListItem', position: 3, name: project.title, item: canonicalUrl },
        ],
    };

    return (
        <>
            <Head title={project.title}>
                <meta name="description" content={metaDescription} />
                <meta name="author" content={personName} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={canonicalUrl} />
                {seo.site_name ? (
                    <meta property="og:site_name" content={seo.site_name} />
                ) : null}
                <meta property="og:title" content={ogTitle} />
                <meta property="og:description" content={metaDescription} />
                {socialImage ? <meta property="og:image" content={socialImage} /> : null}
                {socialImage ? <meta property="og:image:width" content="1200" /> : null}
                {socialImage ? <meta property="og:image:height" content="630" /> : null}
                {socialImage ? (
                    <meta
                        property="og:image:alt"
                        content={`${project.title} cover image`}
                    />
                ) : null}
                <meta
                    name="twitter:card"
                    content={socialImage ? 'summary_large_image' : 'summary'}
                />
                <meta name="twitter:title" content={ogTitle} />
                <meta name="twitter:description" content={metaDescription} />
                {socialImage ? (
                    <meta name="twitter:image" content={socialImage} />
                ) : null}
                <link rel="canonical" href={canonicalUrl} />
                <script type="application/ld+json">
                    {JSON.stringify(projectStructuredData)}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify(breadcrumbStructuredData)}
                </script>
            </Head>

            <PublicLayout contact={contact}>
                <section className="public-shell section-block reveal">
                    <div className="project-detail-shell">
                        <article className="card-surface project-detail-main">
                            <Link href={route('projects.index')} className="section-inline-link">
                                Back to projects
                            </Link>

                            <header className="project-detail-header">
                                <p className="project-detail-kicker">Case study</p>
                                <h1 className="project-detail-title">{project.title}</h1>
                                <p className="project-detail-summary">{project.summary}</p>
                            </header>

                            {project.cover_image_url && (
                                <img
                                    src={project.cover_image_url}
                                    alt={`${project.title} cover`}
                                    className="project-cover project-detail-cover"
                                />
                            )}

                            <div className="project-detail-content">
                                {bodySections.length > 0 ? (
                                    bodySections.map((section, index) => (
                                        <section
                                            key={`${section.title}-${index}`}
                                            className="project-body-section"
                                        >
                                            <div className="project-body-section-label">
                                                <span>{String(index + 1).padStart(2, '0')}</span>
                                                <h2>{section.title}</h2>
                                            </div>
                                            <div className="project-body-section-copy">
                                                {section.paragraphs.map((paragraph, paragraphIndex) => (
                                                    <p key={`${section.title}-${paragraphIndex}`}>
                                                        {paragraph}
                                                    </p>
                                                ))}
                                            </div>
                                        </section>
                                    ))
                                ) : (
                                    <section className="project-body-section">
                                        <div className="project-body-section-label">
                                            <span>01</span>
                                            <h2>Overview</h2>
                                        </div>
                                        <div className="project-body-section-copy">
                                            <p>{project.body}</p>
                                        </div>
                                    </section>
                                )}
                            </div>
                        </article>

                        <aside className="card-surface project-detail-sidebar">
                            <div className="project-detail-sidebar-block">
                                <p className="project-detail-sidebar-label">Snapshot</p>
                                <ul className="project-fact-list">
                                    {publishedLabel ? (
                                        <li>
                                            <span>Published</span>
                                            <strong>{publishedLabel}</strong>
                                        </li>
                                    ) : null}
                                    <li>
                                        <span>Format</span>
                                        <strong>Build case study</strong>
                                    </li>
                                    <li>
                                        <span>Stack tags</span>
                                        <strong>{tags.length > 0 ? tags.length : 0}</strong>
                                    </li>
                                </ul>
                            </div>

                            {tags.length > 0 && (
                                <div className="project-detail-sidebar-block">
                                    <p className="project-detail-sidebar-label">Core stack</p>
                                    <ul className="tag-list project-detail-tag-list" aria-label="Project stack">
                                        {tags.map((tag) => (
                                            <li key={tag} className="tag-item">
                                                {tag}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="project-detail-sidebar-block">
                                <p className="project-detail-sidebar-label">Links</p>
                                <div className="project-detail-actions">
                                    {project.repo_url && (
                                        <a
                                            href={project.repo_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="button-secondary"
                                        >
                                            Repository
                                        </a>
                                    )}
                                    {project.live_url && (
                                        <a
                                            href={project.live_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="button-primary"
                                        >
                                            Live demo
                                        </a>
                                    )}
                                </div>
                            </div>
                        </aside>
                    </div>
                </section>
            </PublicLayout>
        </>
    );
}
