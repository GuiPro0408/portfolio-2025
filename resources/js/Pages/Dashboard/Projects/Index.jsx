import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ projects }) {
    const deleteProject = (id) => {
        if (!window.confirm('Delete this project?')) {
            return;
        }

        router.delete(route('dashboard.projects.destroy', id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Projects
                    </h2>
                    <Link
                        href={route('dashboard.projects.create')}
                        className="rounded bg-gray-900 px-4 py-2 text-sm font-semibold text-white"
                    >
                        New Project
                    </Link>
                </div>
            }
        >
            <Head title="Manage Projects" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {projects.data.length === 0 ? (
                                <p className="text-gray-600">No projects found.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                                        <thead>
                                            <tr>
                                                <th className="px-3 py-2 text-left font-semibold text-gray-700">
                                                    Title
                                                </th>
                                                <th className="px-3 py-2 text-left font-semibold text-gray-700">
                                                    Status
                                                </th>
                                                <th className="px-3 py-2 text-left font-semibold text-gray-700">
                                                    Sort
                                                </th>
                                                <th className="px-3 py-2 text-right font-semibold text-gray-700">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {projects.data.map((project) => (
                                                <tr key={project.id}>
                                                    <td className="px-3 py-3">
                                                        <p className="font-medium text-gray-900">
                                                            {project.title}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            /{project.slug}
                                                        </p>
                                                    </td>
                                                    <td className="px-3 py-3 text-gray-700">
                                                        {project.is_published
                                                            ? 'Published'
                                                            : 'Draft'}
                                                        {project.is_featured
                                                            ? ' • Featured'
                                                            : ''}
                                                    </td>
                                                    <td className="px-3 py-3 text-gray-700">
                                                        {project.sort_order}
                                                    </td>
                                                    <td className="px-3 py-3 text-right">
                                                        <div className="flex justify-end gap-3">
                                                            <Link
                                                                href={route(
                                                                    'dashboard.projects.edit',
                                                                    project.id,
                                                                )}
                                                                className="text-indigo-600 hover:underline"
                                                            >
                                                                Edit
                                                            </Link>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    deleteProject(
                                                                        project.id,
                                                                    )
                                                                }
                                                                className="text-red-600 hover:underline"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
