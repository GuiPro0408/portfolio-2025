import DashboardPageHeader from '@/Components/Dashboard/DashboardPageHeader';
import ProjectForm from '@/Components/ProjectForm';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ project }) {
    const { data, setData, put, processing, errors } = useForm(project);

    const submit = (e) => {
        e.preventDefault();
        put(route('dashboard.projects.update', project.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <DashboardPageHeader
                    title="Edit Project"
                    description="Update content, publication settings, and ordering metadata."
                />
            }
        >
            <Head title="Edit Project" />

            <div className="py-10">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="dashboard-panel p-6 sm:rounded-xl">
                        <ProjectForm
                            data={data}
                            setData={setData}
                            errors={errors}
                            processing={processing}
                            onSubmit={submit}
                            submitLabel="Update Project"
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
