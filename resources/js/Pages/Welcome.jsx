import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, featuredProjects, contact }) {
    return (
        <>
            <Head title="Portfolio" />

            <div className="min-h-screen bg-slate-50 text-slate-900">
                <header className="border-b border-slate-200 bg-white">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                        <Link href={route('home')} className="text-lg font-semibold">
                            Guillaume Juste
                        </Link>
                        <nav className="flex items-center gap-4 text-sm">
                            <Link href={route('projects.index')} className="hover:underline">
                                Projects
                            </Link>
                            {auth.user ? (
                                <Link href={route('dashboard')} className="hover:underline">
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')} className="hover:underline">
                                        Log in
                                    </Link>
                                    <Link href={route('register')} className="hover:underline">
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                <main className="mx-auto max-w-6xl px-6 py-12">
                    <section className="rounded-2xl bg-white p-8 shadow-sm">
                        <p className="text-sm font-medium uppercase tracking-wider text-slate-500">
                            Full-Stack Web Developer
                        </p>
                        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
                            I build practical web products with Laravel and React.
                        </h1>
                        <p className="mt-4 max-w-2xl text-base text-slate-600">
                            Portfolio MVP v1: selected work, clear outcomes, and a
                            fast path to contact.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <a
                                href={`mailto:${contact.email}`}
                                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                            >
                                Contact me
                            </a>
                            <Link
                                href={route('projects.index')}
                                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800"
                            >
                                Browse projects
                            </Link>
                            <a
                                href={contact.linkedin}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800"
                            >
                                LinkedIn
                            </a>
                            <a
                                href={contact.github}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800"
                            >
                                GitHub
                            </a>
                        </div>
                    </section>

                    <section className="mt-10">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-2xl font-semibold">Featured Projects</h2>
                            <Link
                                href={route('projects.index')}
                                className="text-sm font-medium text-slate-700 hover:underline"
                            >
                                View all
                            </Link>
                        </div>

                        {featuredProjects.length === 0 ? (
                            <p className="rounded-xl bg-white p-6 text-slate-600 shadow-sm">
                                No featured projects yet.
                            </p>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-3">
                                {featuredProjects.map((project) => (
                                    <article
                                        key={project.id}
                                        className="rounded-xl bg-white p-5 shadow-sm"
                                    >
                                        <h3 className="text-lg font-semibold">
                                            <Link
                                                href={route('projects.show', project.slug)}
                                                className="hover:underline"
                                            >
                                                {project.title}
                                            </Link>
                                        </h3>
                                        <p className="mt-2 text-sm text-slate-600">
                                            {project.summary}
                                        </p>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </>
    );
}
