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
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    New Project
                </h2>
            }
        >
            <Head title="Create Project" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg">
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
