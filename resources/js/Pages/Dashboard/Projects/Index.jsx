import DashboardPageHeader from '@/Components/Dashboard/DashboardPageHeader';
import EmptyState from '@/Components/Dashboard/EmptyState';
import FilterToolbar from '@/Components/Dashboard/FilterToolbar';
import StatusBadge from '@/Components/Dashboard/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { LoaderCircle, PenSquare, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const defaultFilters = {
    q: '',
    status: 'all',
    featured: 'all',
    sort: 'sort_order_asc',
};

function formatUpdatedAt(dateString) {
    return new Intl.DateTimeFormat('en', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(dateString));
}

export default function Index({ projects, filters }) {
    const initialFilters = { ...defaultFilters, ...(filters ?? {}) };
    const [query, setQuery] = useState(initialFilters.q);
    const [pendingRows, setPendingRows] = useState({});

    const visitWithFilters = (nextFilters) => {
        router.get(route('dashboard.projects.index'), nextFilters, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const updateFilter = (key, value) => {
        visitWithFilters({
            ...initialFilters,
            [key]: value,
            q: query,
        });
    };

    const resetFilters = () => {
        setQuery(defaultFilters.q);
        visitWithFilters(defaultFilters);
    };

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            if (query === initialFilters.q) {
                return;
            }

            visitWithFilters({
                ...initialFilters,
                q: query,
            });
        }, 320);

        return () => window.clearTimeout(timeoutId);
    }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

    const deleteProject = (id) => {
        if (!window.confirm('Delete this project?')) {
            return;
        }

        router.delete(route('dashboard.projects.destroy', id), {
            preserveScroll: true,
        });
    };

    const toggleFlags = (project, updates) => {
        setPendingRows((currentRows) => ({ ...currentRows, [project.id]: true }));

        router.patch(
            route('dashboard.projects.flags.update', project.id),
            {
                is_published: updates.is_published ?? project.is_published,
                is_featured: updates.is_featured ?? project.is_featured,
            },
            {
                preserveScroll: true,
                onFinish: () => {
                    setPendingRows((currentRows) => {
                        const { [project.id]: removed, ...remainingRows } =
                            currentRows;
                        return remainingRows;
                    });
                },
            },
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <DashboardPageHeader
                    title="Projects"
                    description="Search, filter, and update publication flags without leaving the table."
                    actions={
                        <Link href={route('dashboard.projects.create')} className="dashboard-button-primary">
                            New Project
                        </Link>
                    }
                />
            }
        >
            <Head title="Manage Projects" />

            <div className="py-10">
                <div className="mx-auto max-w-7xl space-y-5 px-4 sm:px-6 lg:px-8">
                    <FilterToolbar
                        filters={{
                            ...initialFilters,
                            q: query,
                        }}
                        onQueryChange={setQuery}
                        onFilterChange={updateFilter}
                        onReset={resetFilters}
                    />

                    <section className="dashboard-panel overflow-hidden">
                        {projects.data.length === 0 ? (
                            <EmptyState
                                title="No matching projects"
                                description="Try adjusting your filters or create a new project."
                                action={
                                    <Link href={route('dashboard.projects.create')} className="dashboard-button-primary">
                                        Create Project
                                    </Link>
                                }
                            />
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="dashboard-table min-w-full text-sm">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Status</th>
                                            <th>Updated</th>
                                            <th>Sort</th>
                                            <th className="text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {projects.data.map((project) => {
                                            const isPending = pendingRows[project.id] === true;

                                            return (
                                                <tr key={project.id}>
                                                    <td>
                                                        <p className="dashboard-row-title">{project.title}</p>
                                                        <p className="dashboard-meta-text">/{project.slug}</p>
                                                    </td>
                                                    <td>
                                                        <div className="dashboard-badge-row">
                                                            <StatusBadge tone={project.is_published ? 'success' : 'warning'}>
                                                                {project.is_published ? 'Published' : 'Draft'}
                                                            </StatusBadge>
                                                            <StatusBadge tone={project.is_featured ? 'featured' : 'default'}>
                                                                {project.is_featured ? 'Featured' : 'Standard'}
                                                            </StatusBadge>
                                                        </div>

                                                        <div className="dashboard-toggle-row">
                                                            <button
                                                                type="button"
                                                                className="dashboard-toggle-btn"
                                                                onClick={() =>
                                                                    toggleFlags(project, {
                                                                        is_published: !project.is_published,
                                                                    })
                                                                }
                                                                disabled={isPending}
                                                            >
                                                                Toggle publish
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="dashboard-toggle-btn"
                                                                onClick={() =>
                                                                    toggleFlags(project, {
                                                                        is_featured: !project.is_featured,
                                                                    })
                                                                }
                                                                disabled={isPending}
                                                            >
                                                                Toggle featured
                                                            </button>
                                                            {isPending ? (
                                                                <span className="dashboard-toggle-loading">
                                                                    <LoaderCircle size={13} className="animate-spin" />
                                                                    Saving
                                                                </span>
                                                            ) : null}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <p className="dashboard-meta-text">
                                                            {formatUpdatedAt(project.updated_at)}
                                                        </p>
                                                    </td>
                                                    <td>{project.sort_order}</td>
                                                    <td className="text-right">
                                                        <div className="dashboard-row-actions">
                                                            <Link
                                                                href={route('dashboard.projects.edit', project.id)}
                                                                className="dashboard-inline-action"
                                                            >
                                                                <PenSquare size={14} aria-hidden="true" />
                                                                Edit
                                                            </Link>
                                                            <button
                                                                type="button"
                                                                onClick={() => deleteProject(project.id)}
                                                                className="dashboard-inline-action dashboard-inline-action-danger"
                                                            >
                                                                <Trash2 size={14} aria-hidden="true" />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>

                    <nav
                        className="dashboard-pagination"
                        aria-label="Projects pagination"
                    >
                        <p className="dashboard-meta-text">
                            Page {projects.current_page} of {projects.last_page}
                        </p>
                        <div className="flex gap-3">
                            {projects.prev_page_url ? (
                                <Link href={projects.prev_page_url} className="dashboard-button-secondary">
                                    Previous
                                </Link>
                            ) : null}
                            {projects.next_page_url ? (
                                <Link href={projects.next_page_url} className="dashboard-button-secondary">
                                    Next
                                </Link>
                            ) : null}
                        </div>
                    </nav>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
