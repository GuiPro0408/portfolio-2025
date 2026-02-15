import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ settings }) {
    const { data, setData, put, processing, errors } = useForm(settings);

    const submit = (e) => {
        e.preventDefault();
        put(route('dashboard.homepage.update'));
    };

    const textFields = [
        ['hero_eyebrow', 'Hero Eyebrow'],
        ['hero_headline', 'Hero Headline'],
        ['hero_subheadline', 'Hero Subheadline', 'textarea'],
        ['hero_primary_cta_label', 'Hero Primary CTA Label'],
        ['hero_secondary_cta_label', 'Hero Secondary CTA Label'],
        ['hero_side_title', 'Hero Side Title'],
        ['featured_section_title', 'Featured Section Title'],
        ['featured_section_subtitle', 'Featured Section Subtitle', 'textarea'],
        ['capabilities_title', 'Capabilities Title'],
        ['capabilities_subtitle', 'Capabilities Subtitle', 'textarea'],
        ['process_title', 'Process Title'],
        ['process_subtitle', 'Process Subtitle', 'textarea'],
        ['final_cta_title', 'Final CTA Title'],
        ['final_cta_subtitle', 'Final CTA Subtitle', 'textarea'],
        ['final_cta_button_label', 'Final CTA Button Label'],
    ];

    const imageFields = [
        ['hero_image_url', 'Hero Image URL'],
        ['featured_image_1_url', 'Featured Image 1 URL'],
        ['featured_image_2_url', 'Featured Image 2 URL'],
        ['featured_image_3_url', 'Featured Image 3 URL'],
        ['capabilities_image_url', 'Capabilities Image URL'],
        ['process_image_url', 'Process Image URL'],
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Homepage Settings
                </h2>
            }
        >
            <Head title="Homepage Settings" />

            <div className="py-12">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="space-y-8 p-6">
                            <section className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Headlines and CTA Copy
                                </h3>
                                <div className="grid gap-4">
                                    {textFields.map(([key, label, type]) => (
                                        <div key={key}>
                                            <InputLabel htmlFor={key} value={label} />
                                            {type === 'textarea' ? (
                                                <textarea
                                                    id={key}
                                                    rows={3}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    value={data[key] ?? ''}
                                                    onChange={(e) => setData(key, e.target.value)}
                                                />
                                            ) : (
                                                <TextInput
                                                    id={key}
                                                    className="mt-1 block w-full"
                                                    value={data[key] ?? ''}
                                                    onChange={(e) => setData(key, e.target.value)}
                                                />
                                            )}
                                            <InputError className="mt-2" message={errors[key]} />
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Homepage Image URLs
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Leave fields empty to use editorial placeholders.
                                </p>
                                <div className="grid gap-4">
                                    {imageFields.map(([key, label]) => (
                                        <div key={key}>
                                            <InputLabel htmlFor={key} value={label} />
                                            <TextInput
                                                id={key}
                                                className="mt-1 block w-full"
                                                value={data[key] ?? ''}
                                                onChange={(e) => setData(key, e.target.value)}
                                            />
                                            <InputError className="mt-2" message={errors[key]} />
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <PrimaryButton disabled={processing}>Save Settings</PrimaryButton>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
