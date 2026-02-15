import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import StickyActionBar from '@/Components/Dashboard/StickyActionBar';
import TextInput from '@/Components/TextInput';

function ValidationSummary({ errors }) {
    const keys = Object.keys(errors);

    if (keys.length === 0) {
        return null;
    }

    return (
        <div className="dashboard-validation-summary" role="alert">
            <p>Please fix the following fields before saving:</p>
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

function FieldHelp({ children }) {
    return <p className="dashboard-field-help">{children}</p>;
}

function ToggleField({ id, label, checked, onChange }) {
    return (
        <button
            id={id}
            type="button"
            role="switch"
            aria-checked={checked}
            className="dashboard-switch-field"
            onClick={() => onChange(!checked)}
        >
            <span className={`dashboard-switch-track ${checked ? 'is-on' : ''}`}>
                <span className="dashboard-switch-thumb" />
            </span>
            <span>{label}</span>
        </button>
    );
}

export default function ProjectForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    submitLabel,
}) {
    return (
        <form onSubmit={onSubmit} className="space-y-8">
            <ValidationSummary errors={errors} />

            <section className="dashboard-form-section">
                <header className="dashboard-form-section-header">
                    <h3>Core Content</h3>
                    <p>Define the project identity and public story.</p>
                </header>

                <div className="grid gap-5">
                    <div>
                        <InputLabel htmlFor="title" value="Title" />
                        <TextInput
                            id="title"
                            className="mt-1 block w-full"
                            value={data.title}
                            onChange={(event) => setData('title', event.target.value)}
                            required
                        />
                        <InputError className="mt-2" message={errors.title} />
                    </div>

                    <div>
                        <InputLabel htmlFor="slug" value="Slug" />
                        <TextInput
                            id="slug"
                            className="mt-1 block w-full"
                            value={data.slug}
                            onChange={(event) => setData('slug', event.target.value)}
                        />
                        <FieldHelp>Leave empty to auto-generate from title.</FieldHelp>
                        <InputError className="mt-2" message={errors.slug} />
                    </div>

                    <div>
                        <InputLabel htmlFor="summary" value="Summary" />
                        <textarea
                            id="summary"
                            className="dashboard-textarea"
                            rows={3}
                            value={data.summary}
                            onChange={(event) => setData('summary', event.target.value)}
                            required
                        />
                        <FieldHelp>Shown on cards and list pages. Keep it concise and outcome-focused.</FieldHelp>
                        <InputError className="mt-2" message={errors.summary} />
                    </div>

                    <div>
                        <InputLabel htmlFor="body" value="Body" />
                        <textarea
                            id="body"
                            className="dashboard-textarea"
                            rows={10}
                            value={data.body}
                            onChange={(event) => setData('body', event.target.value)}
                            required
                        />
                        <InputError className="mt-2" message={errors.body} />
                    </div>
                </div>
            </section>

            <section className="dashboard-form-section">
                <header className="dashboard-form-section-header">
                    <h3>Metadata and Links</h3>
                    <p>Set stack tags, display priority, and external references.</p>
                </header>

                <div className="grid gap-5 md:grid-cols-2">
                    <div>
                        <InputLabel htmlFor="stack" value="Stack (comma-separated)" />
                        <TextInput
                            id="stack"
                            className="mt-1 block w-full"
                            value={data.stack}
                            onChange={(event) => setData('stack', event.target.value)}
                        />
                        <InputError className="mt-2" message={errors.stack} />
                    </div>

                    <div>
                        <InputLabel htmlFor="sort_order" value="Sort Order" />
                        <TextInput
                            id="sort_order"
                            type="number"
                            min="0"
                            className="mt-1 block w-full"
                            value={data.sort_order}
                            onChange={(event) => setData('sort_order', event.target.value)}
                        />
                        <InputError className="mt-2" message={errors.sort_order} />
                    </div>

                    <div>
                        <InputLabel htmlFor="cover_image_url" value="Cover Image URL" />
                        <TextInput
                            id="cover_image_url"
                            className="mt-1 block w-full"
                            value={data.cover_image_url}
                            onChange={(event) => setData('cover_image_url', event.target.value)}
                        />
                        <InputError className="mt-2" message={errors.cover_image_url} />
                    </div>

                    <div>
                        <InputLabel htmlFor="repo_url" value="Repository URL" />
                        <TextInput
                            id="repo_url"
                            className="mt-1 block w-full"
                            value={data.repo_url}
                            onChange={(event) => setData('repo_url', event.target.value)}
                        />
                        <InputError className="mt-2" message={errors.repo_url} />
                    </div>

                    <div className="md:col-span-2">
                        <InputLabel htmlFor="live_url" value="Live URL" />
                        <TextInput
                            id="live_url"
                            className="mt-1 block w-full"
                            value={data.live_url}
                            onChange={(event) => setData('live_url', event.target.value)}
                        />
                        <InputError className="mt-2" message={errors.live_url} />
                    </div>
                </div>
            </section>

            <section className="dashboard-form-section">
                <header className="dashboard-form-section-header">
                    <h3>Publication</h3>
                    <p>Control visibility and homepage emphasis.</p>
                </header>

                <div className="grid gap-5 md:grid-cols-2">
                    <div>
                        <InputLabel htmlFor="published_at" value="Published At" />
                        <input
                            id="published_at"
                            type="date"
                            className="dashboard-date-input mt-1 block w-full"
                            value={data.published_at}
                            onChange={(event) => setData('published_at', event.target.value)}
                        />
                        <FieldHelp>Pick a publication date. Leave empty to auto-use today when publishing.</FieldHelp>
                        <InputError className="mt-2" message={errors.published_at} />
                    </div>

                    <div className="dashboard-flag-grid">
                        <ToggleField
                            id="is_featured"
                            label="Featured project"
                            checked={data.is_featured}
                            onChange={(nextValue) => setData('is_featured', nextValue)}
                        />

                        <ToggleField
                            id="is_published"
                            label="Published project"
                            checked={data.is_published}
                            onChange={(nextValue) => setData('is_published', nextValue)}
                        />
                    </div>
                </div>
            </section>

            <StickyActionBar>
                <div className="dashboard-sticky-actions-inner">
                    <p>Changes are saved immediately after validation.</p>
                    <PrimaryButton disabled={processing}>{submitLabel}</PrimaryButton>
                </div>
            </StickyActionBar>
        </form>
    );
}
