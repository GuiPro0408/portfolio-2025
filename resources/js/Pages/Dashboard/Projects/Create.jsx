import DashboardPageHeader from '@/Components/Dashboard/DashboardPageHeader';
import ProjectForm from '@/Components/ProjectForm';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ project }) {
    const { data, setData, post, processing, errors } = useForm(project);

    const submit = (e) => {
        e.preventDefault();
        post(route('dashboard.projects.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <DashboardPageHeader
                    title="New Project"
                    description="Create a draft or publish immediately. Slug auto-generates when left empty."
                />
            }
        >
            <Head title="Create Project" />

            <div className="py-10">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="dashboard-panel p-6 sm:rounded-xl">
                        <ProjectForm
                            data={data}
                            setData={setData}
                            errors={errors}
                            processing={processing}
                            onSubmit={submit}
                            submitLabel="Create Project"
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
