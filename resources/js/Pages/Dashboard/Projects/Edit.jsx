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
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit Project
                </h2>
            }
        >
            <Head title="Edit Project" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg">
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
