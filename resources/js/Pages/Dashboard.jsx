import DashboardPageHeader from '@/Components/Dashboard/DashboardPageHeader';
import EmptyState from '@/Components/Dashboard/EmptyState';
import StatCard from '@/Components/Dashboard/StatCard';
import StatusBadge from '@/Components/Dashboard/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { FileText, LayoutDashboard, PenSquare, Sparkles } from 'lucide-react';

function formatUpdatedAt(dateString) {
    return new Intl.DateTimeFormat('en', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(dateString));
}

export default function Dashboard({ metrics, recentProjects }) {
    return (
        <AuthenticatedLayout
            header={
                <DashboardPageHeader
                    title="Content Admin"
                    description="Manage projects and homepage content from one place."
                    actions={
                        <>
                            <Link href={route('dashboard.projects.create')} className="dashboard-button-primary">
                                New Project
                            </Link>
                            <Link href={route('dashboard.homepage.edit')} className="dashboard-button-secondary">
                                Homepage Settings
                            </Link>
                        </>
                    }
                />
            }
        >
            <Head title="Dashboard" />

            <div className="py-10">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <section className="dashboard-stats-grid">
                        <StatCard
                            label="Total projects"
                            value={metrics.total}
                            icon={LayoutDashboard}
                        />
                        <StatCard
                            label="Published"
                            value={metrics.published}
                            icon={FileText}
                        />
                        <StatCard
                            label="Featured"
                            value={metrics.featured}
                            icon={Sparkles}
                        />
                    </section>

                    <section className="dashboard-panel dashboard-panel-inset">
                        <div className="dashboard-panel-header">
                            <h3 className="dashboard-panel-title">Recent updates</h3>
                            <div className="dashboard-panel-actions">
                                <Link href={route('dashboard.projects.index')} className="dashboard-link">
                                    Manage projects
                                </Link>
                                <Link href={route('dashboard.homepage.edit')} className="dashboard-link">
                                    Edit homepage
                                </Link>
                            </div>
                        </div>

                        {recentProjects.length === 0 ? (
                            <EmptyState
                                title="No projects yet"
                                description="Create your first project to start populating the public portfolio."
                                action={
                                    <Link href={route('dashboard.projects.create')} className="dashboard-button-primary">
                                        Create Project
                                    </Link>
                                }
                            />
                        ) : (
                            <ul className="dashboard-recent-list">
                                {recentProjects.map((project) => (
                                    <li key={project.id} className="dashboard-recent-item">
                                        <div>
                                            <p className="dashboard-recent-title">{project.title}</p>
                                            <div className="dashboard-badge-row">
                                                <StatusBadge tone={project.is_published ? 'success' : 'warning'}>
                                                    {project.is_published ? 'Published' : 'Draft'}
                                                </StatusBadge>
                                                {project.is_featured ? (
                                                    <StatusBadge tone="featured">Featured</StatusBadge>
                                                ) : null}
                                            </div>
                                            <p className="dashboard-meta-text">
                                                Updated {formatUpdatedAt(project.updated_at)}
                                            </p>
                                        </div>

                                        <Link
                                            href={route('dashboard.projects.edit', project.id)}
                                            className="dashboard-inline-action"
                                        >
                                            <PenSquare size={14} aria-hidden="true" />
                                            Edit
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
