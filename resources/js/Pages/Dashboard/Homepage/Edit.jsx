import DashboardPageHeader from '@/Components/Dashboard/DashboardPageHeader';
import SectionNav from '@/Components/Dashboard/SectionNav';
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

function RenderField({ field, data, setData, errors }) {
    const [key, label, type] = field;

    return (
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
    );
}

export default function Edit({ settings }) {
    const { data, setData, put, processing, errors, isDirty } = useForm(settings);

    const submit = (event) => {
        event.preventDefault();
        put(route('dashboard.homepage.update'));
    };

    const sections = [
        { id: 'hero', label: 'Hero' },
        { id: 'featured', label: 'Featured' },
        { id: 'capabilities', label: 'Capabilities' },
        { id: 'process', label: 'Process' },
        { id: 'final-cta', label: 'Final CTA' },
        { id: 'images', label: 'Images' },
    ];

    return (
        <AuthenticatedLayout
            header={
                <DashboardPageHeader
                    title="Homepage Settings"
                    description="Edit homepage copy and image URLs with section-based navigation."
                />
            }
        >
            <Head title="Homepage Settings" />

            <div className="py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="dashboard-settings-layout">
                        <aside className="dashboard-settings-aside">
                            <SectionNav sections={sections} />
                        </aside>

                        <section className="space-y-6">
                            <ValidationSummary errors={errors} />

                            <article id="hero" className="dashboard-form-section">
                                <header className="dashboard-form-section-header">
                                    <h3>Hero</h3>
                                    <p>Primary homepage message and opening actions.</p>
                                </header>

                                <div className="dashboard-form-grid-2">
                                    <RenderField
                                        field={['hero_eyebrow', 'Hero Eyebrow']}
                                        data={data}
                                        setData={setData}
                                        errors={errors}
                                    />
                                    <RenderField
                                        field={['hero_side_title', 'Hero Side Title']}
                                        data={data}
                                        setData={setData}
                                        errors={errors}
                                    />
                                    <div className="dashboard-form-grid-full">
                                        <RenderField
                                            field={['hero_headline', 'Hero Headline']}
                                            data={data}
                                            setData={setData}
                                            errors={errors}
                                        />
                                    </div>
                                    <div className="dashboard-form-grid-full">
                                        <RenderField
                                            field={[
                                                'hero_subheadline',
                                                'Hero Subheadline',
                                                'textarea',
                                            ]}
                                            data={data}
                                            setData={setData}
                                            errors={errors}
                                        />
                                    </div>
                                    <RenderField
                                        field={[
                                            'hero_primary_cta_label',
                                            'Hero Primary CTA Label',
                                        ]}
                                        data={data}
                                        setData={setData}
                                        errors={errors}
                                    />
                                    <RenderField
                                        field={[
                                            'hero_secondary_cta_label',
                                            'Hero Secondary CTA Label',
                                        ]}
                                        data={data}
                                        setData={setData}
                                        errors={errors}
                                    />
                                </div>

                                <div className="dashboard-mini-preview">
                                    <p className="dashboard-mini-preview-label">Preview</p>
                                    <h4>{data.hero_headline}</h4>
                                    <p>{data.hero_subheadline}</p>
                                </div>
                            </article>

                            <article id="featured" className="dashboard-form-section">
                                <header className="dashboard-form-section-header">
                                    <h3>Featured Section</h3>
                                    <p>Heading and supporting text for selected work.</p>
                                </header>
                                <div className="dashboard-form-grid-2">
                                    <div className="dashboard-form-grid-full">
                                        <RenderField
                                            field={[
                                                'featured_section_title',
                                                'Featured Section Title',
                                            ]}
                                            data={data}
                                            setData={setData}
                                            errors={errors}
                                        />
                                    </div>
                                    <div className="dashboard-form-grid-full">
                                        <RenderField
                                            field={[
                                                'featured_section_subtitle',
                                                'Featured Section Subtitle',
                                                'textarea',
                                            ]}
                                            data={data}
                                            setData={setData}
                                            errors={errors}
                                        />
                                    </div>
                                </div>
                            </article>

                            <article id="capabilities" className="dashboard-form-section">
                                <header className="dashboard-form-section-header">
                                    <h3>Capabilities Section</h3>
                                    <p>Position your service and technical value clearly.</p>
                                </header>
                                <div className="dashboard-form-grid-2">
                                    <div className="dashboard-form-grid-full">
                                        <RenderField
                                            field={[
                                                'capabilities_title',
                                                'Capabilities Title',
                                            ]}
                                            data={data}
                                            setData={setData}
                                            errors={errors}
                                        />
                                    </div>
                                    <div className="dashboard-form-grid-full">
                                        <RenderField
                                            field={[
                                                'capabilities_subtitle',
                                                'Capabilities Subtitle',
                                                'textarea',
                                            ]}
                                            data={data}
                                            setData={setData}
                                            errors={errors}
                                        />
                                    </div>
                                </div>
                            </article>

                            <article id="process" className="dashboard-form-section">
                                <header className="dashboard-form-section-header">
                                    <h3>Process Section</h3>
                                    <p>Explain your working style in short, practical language.</p>
                                </header>
                                <div className="dashboard-form-grid-2">
                                    <div className="dashboard-form-grid-full">
                                        <RenderField
                                            field={['process_title', 'Process Title']}
                                            data={data}
                                            setData={setData}
                                            errors={errors}
                                        />
                                    </div>
                                    <div className="dashboard-form-grid-full">
                                        <RenderField
                                            field={[
                                                'process_subtitle',
                                                'Process Subtitle',
                                                'textarea',
                                            ]}
                                            data={data}
                                            setData={setData}
                                            errors={errors}
                                        />
                                    </div>
                                </div>
                            </article>

                            <article id="final-cta" className="dashboard-form-section">
                                <header className="dashboard-form-section-header">
                                    <h3>Final CTA</h3>
                                    <p>Control the closing conversion message on the homepage.</p>
                                </header>
                                <div className="dashboard-form-grid-2">
                                    <div className="dashboard-form-grid-full">
                                        <RenderField
                                            field={['final_cta_title', 'Final CTA Title']}
                                            data={data}
                                            setData={setData}
                                            errors={errors}
                                        />
                                    </div>
                                    <div className="dashboard-form-grid-full">
                                        <RenderField
                                            field={[
                                                'final_cta_subtitle',
                                                'Final CTA Subtitle',
                                                'textarea',
                                            ]}
                                            data={data}
                                            setData={setData}
                                            errors={errors}
                                        />
                                    </div>
                                    <RenderField
                                        field={[
                                            'final_cta_button_label',
                                            'Final CTA Button Label',
                                        ]}
                                        data={data}
                                        setData={setData}
                                        errors={errors}
                                    />
                                </div>
                            </article>

                            <article id="images" className="dashboard-form-section">
                                <header className="dashboard-form-section-header">
                                    <h3>Image URLs</h3>
                                    <p>
                                        Use hosted image URLs. Leave blank to fall back to
                                        placeholders.
                                    </p>
                                </header>
                                <div className="dashboard-form-grid-2">
                                    {[
                                        ['hero_image_url', 'Hero Image URL'],
                                        [
                                            'featured_image_1_url',
                                            'Featured Image 1 URL',
                                        ],
                                        [
                                            'featured_image_2_url',
                                            'Featured Image 2 URL',
                                        ],
                                        [
                                            'featured_image_3_url',
                                            'Featured Image 3 URL',
                                        ],
                                        [
                                            'capabilities_image_url',
                                            'Capabilities Image URL',
                                        ],
                                        ['process_image_url', 'Process Image URL'],
                                    ].map((field) => (
                                        <RenderField
                                            key={field[0]}
                                            field={field}
                                            data={data}
                                            setData={setData}
                                            errors={errors}
                                        />
                                    ))}
                                </div>
                            </article>

                            <StickyActionBar>
                                <div className="dashboard-sticky-actions-inner">
                                    <p>
                                        {isDirty
                                            ? 'You have unsaved changes.'
                                            : 'No pending changes.'}
                                    </p>
                                    <PrimaryButton disabled={processing}>
                                        Save Settings
                                    </PrimaryButton>
                                </div>
                            </StickyActionBar>
                        </section>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
