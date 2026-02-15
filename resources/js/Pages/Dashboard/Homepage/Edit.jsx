import DashboardPageHeader from '@/Components/Dashboard/DashboardPageHeader';
import StickyActionBar from '@/Components/Dashboard/StickyActionBar';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

function ValidationSummary({ errors }) {
    const keys = Object.keys(errors);

    if (keys.length === 0) {
        return null;
    }

    return (
        <div className="dashboard-validation-summary" role="alert">
            <p>Please correct the invalid fields before saving.</p>
            <ul>
                {keys.map((key) => (
                    <li key={key}>
                        <a href={`#${key}`}>{key.replaceAll('_', ' ')}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function Edit({ settings }) {
    const { data, setData, put, processing, errors } = useForm(settings);

    const submit = (event) => {
        event.preventDefault();
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
                <DashboardPageHeader
                    title="Homepage Settings"
                    description="Edit hero content, section headings, call-to-actions, and media URLs."
                />
            }
        >
            <Head title="Homepage Settings" />

            <div className="py-10">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="dashboard-panel p-6 sm:rounded-xl">
                        <form onSubmit={submit} className="space-y-8">
                            <ValidationSummary errors={errors} />

                            <section className="dashboard-form-section">
                                <header className="dashboard-form-section-header">
                                    <h3>Headlines and CTA Copy</h3>
                                    <p>Control the textual narrative users see on the homepage.</p>
                                </header>

                                <div className="grid gap-4">
                                    {textFields.map(([key, label, type]) => (
                                        <div key={key}>
                                            <InputLabel htmlFor={key} value={label} />
                                            {type === 'textarea' ? (
                                                <textarea
                                                    id={key}
                                                    rows={3}
                                                    className="dashboard-textarea"
                                                    value={data[key] ?? ''}
                                                    onChange={(event) => setData(key, event.target.value)}
                                                />
                                            ) : (
                                                <TextInput
                                                    id={key}
                                                    className="mt-1 block w-full"
                                                    value={data[key] ?? ''}
                                                    onChange={(event) => setData(key, event.target.value)}
                                                />
                                            )}
                                            <InputError className="mt-2" message={errors[key]} />
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="dashboard-form-section">
                                <header className="dashboard-form-section-header">
                                    <h3>Homepage Image URLs</h3>
                                    <p>Leave any field empty to display the built-in placeholder visual.</p>
                                </header>

                                <div className="grid gap-4">
                                    {imageFields.map(([key, label]) => (
                                        <div key={key}>
                                            <InputLabel htmlFor={key} value={label} />
                                            <TextInput
                                                id={key}
                                                className="mt-1 block w-full"
                                                value={data[key] ?? ''}
                                                onChange={(event) => setData(key, event.target.value)}
                                            />
                                            <InputError className="mt-2" message={errors[key]} />
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <StickyActionBar>
                                <div className="dashboard-sticky-actions-inner">
                                    <p>Updates are visible on the homepage immediately after save.</p>
                                    <PrimaryButton disabled={processing}>Save Settings</PrimaryButton>
                                </div>
                            </StickyActionBar>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
