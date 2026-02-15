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

export default function Show({ project }) {
    const tags = formatStack(project.stack);

    return (
        <>
            <Head title={project.title} />

            <div className="min-h-screen bg-slate-50 text-slate-900">
                <header className="border-b border-slate-200 bg-white">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                        <Link href={route('home')} className="text-lg font-semibold">
                            Guillaume Juste
                        </Link>
                        <Link
                            href={route('projects.index')}
                            className="text-sm hover:underline"
                        >
                            Back to projects
                        </Link>
                    </div>
                </header>

                <main className="mx-auto max-w-3xl px-6 py-10">
                    <h1 className="text-3xl font-bold">{project.title}</h1>
                    <p className="mt-3 text-base text-slate-700">{project.summary}</p>

                    {project.cover_image_url && (
                        <img
                            src={project.cover_image_url}
                            alt={`${project.title} cover`}
                            className="mt-6 w-full rounded-xl border border-slate-200 object-cover"
                        />
                    )}

                    <article className="prose prose-slate mt-6 max-w-none whitespace-pre-line">
                        {project.body}
                    </article>

                    {tags.length > 0 && (
                        <div className="mt-6 flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="mt-8 flex gap-3">
                        {project.repo_url && (
                            <a
                                href={project.repo_url}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold"
                            >
                                Repository
                            </a>
                        )}
                        {project.live_url && (
                            <a
                                href={project.live_url}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                            >
                                Live demo
                            </a>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}
