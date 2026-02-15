import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';

function formatStack(stack) {
    if (!stack) {
        return [];
    }

    return stack
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
}

export default function Show({ project, contact }) {
    const tags = formatStack(project.stack);
    const metaDescription =
        project.summary ??
        'Detailed case study of a delivered software project.';
    const canonicalUrl = route('projects.show', project.slug);

    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.title,
        description: metaDescription,
        url: canonicalUrl,
        image: project.cover_image_url ?? undefined,
        keywords: tags.length > 0 ? tags.join(', ') : undefined,
    };

    return (
        <>
            <Head title={project.title}>
                <meta name="description" content={metaDescription} />
                <meta
                    property="og:title"
                    content={`${project.title} | Guillaume Juste`}
                />
                <meta property="og:description" content={metaDescription} />
                <meta name="twitter:card" content="summary" />
                <link rel="canonical" href={canonicalUrl} />
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            </Head>

            <PublicLayout contact={contact}>
                <section className="public-shell section-block reveal">
                    <Link href={route('projects.index')} className="section-inline-link">
                        Back to projects
                    </Link>

                    <article className="card-surface project-detail mt-6">
                        <header className="space-y-4">
                            <h1 className="hero-title !text-[clamp(2rem,4vw,3rem)]">
                                {project.title}
                            </h1>
                            <p className="hero-description !max-w-3xl">
                                {project.summary}
                            </p>
                        </header>

                        {project.cover_image_url && (
                            <img
                                src={project.cover_image_url}
                                alt={`${project.title} cover`}
                                className="project-cover mt-8"
                            />
                        )}

                        <article className="prose prose-invert mt-8 max-w-none whitespace-pre-line leading-8">
                            {project.body}
                        </article>

                        {tags.length > 0 && (
                            <ul className="tag-list mt-8" aria-label="Project stack">
                                {tags.map((tag) => (
                                    <li key={tag} className="tag-item">
                                        {tag}
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div className="mt-10 flex flex-wrap gap-3">
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
                    </article>
                </section>
            </PublicLayout>
        </>
    );
}
