import DashboardPageHeader from '@/Components/Dashboard/DashboardPageHeader';
import ProjectForm from '@/Components/ProjectForm';
import type { ProjectFormData } from '@/Components/ProjectForm';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

type ProjectFormPageData = Omit<ProjectFormData, 'cover_image'>;
type EditProjectFormData = ProjectFormData & { _method: 'put' };

interface EditProjectPageProps {
    project: ProjectFormPageData & { id: number };
}

export default function Edit({ project }: EditProjectPageProps) {
    const { data, setData, post, processing, errors } = useForm<EditProjectFormData>(
        {
            ...project,
            cover_image: null,
            _method: 'put',
        },
    );

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post(route('dashboard.projects.update', project.id), {
            forceFormData: true,
            preserveScroll: true,
        });
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
