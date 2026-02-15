import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ metrics, recentProjects }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Content Admin
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <p className="text-sm text-gray-500">Total projects</p>
                            <p className="mt-2 text-2xl font-semibold">{metrics.total}</p>
                        </div>
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <p className="text-sm text-gray-500">Published</p>
                            <p className="mt-2 text-2xl font-semibold">{metrics.published}</p>
                        </div>
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <p className="text-sm text-gray-500">Featured</p>
                            <p className="mt-2 text-2xl font-semibold">{metrics.featured}</p>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Recent updates
                            </h3>
                            <Link
                                href={route('dashboard.projects.index')}
                                className="text-sm font-medium text-indigo-600 hover:underline"
                            >
                                Manage projects
                            </Link>
                        </div>

                        {recentProjects.length === 0 ? (
                            <p className="mt-4 text-sm text-gray-600">
                                No projects yet.
                            </p>
                        ) : (
                            <ul className="mt-4 divide-y divide-gray-200">
                                {recentProjects.map((project) => (
                                    <li
                                        key={project.id}
                                        className="flex items-center justify-between py-3"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {project.title}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {project.is_published
                                                    ? 'Published'
                                                    : 'Draft'}{' '}
                                                {project.is_featured ? '• Featured' : ''}
                                            </p>
                                        </div>
                                        <Link
                                            href={route(
                                                'dashboard.projects.edit',
                                                project.id,
                                            )}
                                            className="text-sm font-medium text-indigo-600 hover:underline"
                                        >
                                            Edit
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
