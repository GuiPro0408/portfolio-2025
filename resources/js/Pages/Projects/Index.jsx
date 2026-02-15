import { Head, Link } from '@inertiajs/react';

export default function Index({ projects }) {
    return (
        <>
            <Head title="Projects" />

            <div className="min-h-screen bg-slate-50 text-slate-900">
                <header className="border-b border-slate-200 bg-white">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                        <Link href={route('home')} className="text-lg font-semibold">
                            Guillaume Juste
                        </Link>
                        <nav className="flex items-center gap-4 text-sm">
                            <Link href={route('home')} className="hover:underline">
                                Home
                            </Link>
                            <Link href={route('login')} className="hover:underline">
                                Login
                            </Link>
                        </nav>
                    </div>
                </header>

                <main className="mx-auto max-w-6xl px-6 py-10">
                    <h1 className="text-3xl font-bold">Projects</h1>
                    <p className="mt-2 text-slate-600">
                        Published portfolio work ordered by curation priority.
                    </p>

                    {projects.data.length === 0 ? (
                        <p className="mt-6 rounded-lg bg-white p-6 text-slate-600 shadow-sm">
                            No published projects yet.
                        </p>
                    ) : (
                        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {projects.data.map((project) => (
                                <article
                                    key={project.id}
                                    className="rounded-xl bg-white p-5 shadow-sm"
                                >
                                    <h2 className="text-lg font-semibold">
                                        <Link
                                            href={route('projects.show', project.slug)}
                                            className="hover:underline"
                                        >
                                            {project.title}
                                        </Link>
                                    </h2>
                                    <p className="mt-2 text-sm text-slate-600">
                                        {project.summary}
                                    </p>
                                    <p className="mt-3 text-xs text-slate-500">
                                        {project.stack || 'Stack not provided'}
                                    </p>
                                </article>
                            ))}
                        </div>
                    )}

                    <div className="mt-8 flex items-center justify-between text-sm">
                        <div>
                            Page {projects.current_page} of {projects.last_page}
                        </div>
                        <div className="flex gap-3">
                            {projects.prev_page_url && (
                                <Link
                                    href={projects.prev_page_url}
                                    className="rounded border border-slate-300 px-3 py-1"
                                >
                                    Previous
                                </Link>
                            )}
                            {projects.next_page_url && (
                                <Link
                                    href={projects.next_page_url}
                                    className="rounded border border-slate-300 px-3 py-1"
                                >
                                    Next
                                </Link>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
