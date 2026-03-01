import DashboardPageHeader from '@/Components/Dashboard/DashboardPageHeader';
import SectionNav from '@/Components/Dashboard/SectionNav';
import StickyActionBar from '@/Components/Dashboard/StickyActionBar';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';

type HomepageSettingsFormData = Record<string, string>;
type FieldType = 'textarea';
type FieldDefinition = [string, string, FieldType?];
type ValidationErrors = Record<string, string | undefined>;
type SetHomepageSettingsData = (key: string, value: string) => void;

interface EditProps {
    settings: Record<string, string | null | undefined>;
}

interface ValidationSummaryProps {
    errors: ValidationErrors;
}

interface RenderFieldProps {
    field: FieldDefinition;
    data: HomepageSettingsFormData;
    setData: SetHomepageSettingsData;
    errors: ValidationErrors;
}

const imageFieldSuggestions: Record<string, string[]> = {
    hero_image_url: ['hero-studio-16x10.webp'],
    featured_image_1_url: ['featured-01-16x10.webp'],
    featured_image_2_url: ['featured-02-16x10.webp'],
    featured_image_3_url: ['featured-03-16x10.webp'],
    capabilities_image_url: ['capabilities-architecture-21x9.webp'],
    process_image_url: ['process-flow-21x9.webp'],
};

const imageFields: FieldDefinition[] = [
    ['hero_image_url', 'Hero Image URL'],
    ['featured_image_1_url', 'Featured Image 1 URL'],
    ['featured_image_2_url', 'Featured Image 2 URL'],
    ['featured_image_3_url', 'Featured Image 3 URL'],
    ['capabilities_image_url', 'Capabilities Image URL'],
    ['process_image_url', 'Process Image URL'],
];

function ValidationSummary({ errors }: ValidationSummaryProps) {
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

function RenderField({ field, data, setData, errors }: RenderFieldProps) {
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

export default function Edit({ settings }: EditProps) {
    const normalizedSettings = useMemo<HomepageSettingsFormData>(
        () =>
            Object.fromEntries(
                Object.entries(settings).map(([key, value]) => [key, value ?? '']),
            ),
        [settings],
    );

    const { data, setData, put, processing, errors, isDirty } =
        useForm<HomepageSettingsFormData>(normalizedSettings);
    const [activeSectionId, setActiveSectionId] = useState('hero');
    const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
        hero: false,
        featured: true,
        capabilities: true,
        process: true,
        'final-cta': true,
        images: true,
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        put(route('dashboard.homepage.update'));
    };

    const toggleSection = (id: string) => {
        setCollapsedSections((current) => ({
            ...current,
            [id]: !current[id],
        }));
    };

    const sections = useMemo(
        () => [
            { id: 'hero', label: 'Hero' },
            { id: 'featured', label: 'Featured' },
            { id: 'capabilities', label: 'Capabilities' },
            { id: 'process', label: 'Process' },
            { id: 'final-cta', label: 'Final CTA' },
            { id: 'images', label: 'Images' },
        ],
        [],
    );

    useEffect(() => {
        const sectionElements = sections
            .map((section) => document.getElementById(section.id))
            .filter((element): element is HTMLElement => element !== null);

        if (sectionElements.length === 0) {
            return undefined;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const visibleEntries = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort(
                        (entryA, entryB) =>
                            entryA.boundingClientRect.top -
                            entryB.boundingClientRect.top,
                    );

                if (visibleEntries[0]) {
                    setActiveSectionId(visibleEntries[0].target.id);
                }
            },
            {
                rootMargin: '-30% 0px -55% 0px',
                threshold: [0.1, 0.35, 0.7],
            },
        );

        sectionElements.forEach((element) => observer.observe(element));

        return () => {
            sectionElements.forEach((element) => observer.unobserve(element));
            observer.disconnect();
        };
    }, [sections]);

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
                            <SectionNav
                                sections={sections}
                                activeSectionId={activeSectionId}
                            />
                        </aside>

                        <section className="space-y-6">
                            <ValidationSummary errors={errors} />

                            <article id="hero" className="dashboard-form-section">
                                <header className="dashboard-form-section-header dashboard-form-section-header-action">
                                    <div>
                                        <h3>Hero</h3>
                                        <p>Primary homepage message and opening actions.</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="dashboard-inline-action"
                                        onClick={() => toggleSection('hero')}
                                        aria-expanded={!collapsedSections.hero}
                                        aria-controls="hero-section-content"
                                    >
                                        <ChevronDown
                                            size={14}
                                            aria-hidden="true"
                                            className={collapsedSections.hero ? '' : 'rotate-180'}
                                        />
                                        {collapsedSections.hero ? 'Expand' : 'Collapse'}
                                    </button>
                                </header>

                                {!collapsedSections.hero ? (
                                    <div id="hero-section-content" className="dashboard-settings-section-body">
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
                                    </div>
                                ) : null}
                            </article>

                            <article id="featured" className="dashboard-form-section">
                                <header className="dashboard-form-section-header dashboard-form-section-header-action">
                                    <div>
                                        <h3>Featured Section</h3>
                                        <p>Heading and supporting text for selected work.</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="dashboard-inline-action"
                                        onClick={() => toggleSection('featured')}
                                        aria-expanded={!collapsedSections.featured}
                                    >
                                        <ChevronDown
                                            size={14}
                                            aria-hidden="true"
                                            className={collapsedSections.featured ? '' : 'rotate-180'}
                                        />
                                        {collapsedSections.featured ? 'Expand' : 'Collapse'}
                                    </button>
                                </header>
                                {!collapsedSections.featured ? (
                                    <div className="dashboard-settings-section-body dashboard-form-grid-2">
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
                                ) : null}
                            </article>

                            <article id="capabilities" className="dashboard-form-section">
                                <header className="dashboard-form-section-header dashboard-form-section-header-action">
                                    <div>
                                        <h3>Capabilities Section</h3>
                                        <p>Position your service and technical value clearly.</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="dashboard-inline-action"
                                        onClick={() => toggleSection('capabilities')}
                                        aria-expanded={!collapsedSections.capabilities}
                                    >
                                        <ChevronDown
                                            size={14}
                                            aria-hidden="true"
                                            className={collapsedSections.capabilities ? '' : 'rotate-180'}
                                        />
                                        {collapsedSections.capabilities ? 'Expand' : 'Collapse'}
                                    </button>
                                </header>
                                {!collapsedSections.capabilities ? (
                                    <div className="dashboard-settings-section-body dashboard-form-grid-2">
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
                                ) : null}
                            </article>

                            <article id="process" className="dashboard-form-section">
                                <header className="dashboard-form-section-header dashboard-form-section-header-action">
                                    <div>
                                        <h3>Process Section</h3>
                                        <p>Explain your working style in short, practical language.</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="dashboard-inline-action"
                                        onClick={() => toggleSection('process')}
                                        aria-expanded={!collapsedSections.process}
                                    >
                                        <ChevronDown
                                            size={14}
                                            aria-hidden="true"
                                            className={collapsedSections.process ? '' : 'rotate-180'}
                                        />
                                        {collapsedSections.process ? 'Expand' : 'Collapse'}
                                    </button>
                                </header>
                                {!collapsedSections.process ? (
                                    <div className="dashboard-settings-section-body dashboard-form-grid-2">
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
                                ) : null}
                            </article>

                            <article id="final-cta" className="dashboard-form-section">
                                <header className="dashboard-form-section-header dashboard-form-section-header-action">
                                    <div>
                                        <h3>Final CTA</h3>
                                        <p>Control the closing conversion message on the homepage.</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="dashboard-inline-action"
                                        onClick={() => toggleSection('final-cta')}
                                        aria-expanded={!collapsedSections['final-cta']}
                                    >
                                        <ChevronDown
                                            size={14}
                                            aria-hidden="true"
                                            className={collapsedSections['final-cta'] ? '' : 'rotate-180'}
                                        />
                                        {collapsedSections['final-cta'] ? 'Expand' : 'Collapse'}
                                    </button>
                                </header>
                                {!collapsedSections['final-cta'] ? (
                                    <div className="dashboard-settings-section-body dashboard-form-grid-2">
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
                                ) : null}
                            </article>

                            <article id="images" className="dashboard-form-section">
                                <header className="dashboard-form-section-header dashboard-form-section-header-action">
                                    <div>
                                        <h3>Image URLs</h3>
                                        <p>
                                            Use full URLs, absolute local paths, or filename-only
                                            values (auto-mapped to <code>/images/homepage</code>).
                                            Leave blank to use placeholders.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        className="dashboard-inline-action"
                                        onClick={() => toggleSection('images')}
                                        aria-expanded={!collapsedSections.images}
                                    >
                                        <ChevronDown
                                            size={14}
                                            aria-hidden="true"
                                            className={collapsedSections.images ? '' : 'rotate-180'}
                                        />
                                        {collapsedSections.images ? 'Expand' : 'Collapse'}
                                    </button>
                                </header>
                                {!collapsedSections.images ? (
                                    <div className="dashboard-settings-section-body dashboard-form-grid-2">
                                    {imageFields.map((field) => (
                                        <div key={field[0]}>
                                            <RenderField
                                                field={field}
                                                data={data}
                                                setData={setData}
                                                errors={errors}
                                            />
                                            <div className="dashboard-image-suggestions">
                                                {imageFieldSuggestions[
                                                    field[0]
                                                ]?.map((value) => (
                                                    <button
                                                        key={`${field[0]}-${value}`}
                                                        type="button"
                                                        className="dashboard-suggestion-chip"
                                                        onClick={() =>
                                                            setData(
                                                                field[0],
                                                                value,
                                                            )
                                                        }
                                                    >
                                                        Use {value}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    </div>
                                ) : null}
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
