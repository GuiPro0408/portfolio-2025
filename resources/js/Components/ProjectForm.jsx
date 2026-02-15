import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function ProjectForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    submitLabel,
}) {
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div>
                <InputLabel htmlFor="title" value="Title" />
                <TextInput
                    id="title"
                    className="mt-1 block w-full"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
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
                    onChange={(e) => setData('slug', e.target.value)}
                />
                <p className="mt-1 text-xs text-gray-500">
                    Leave empty to auto-generate from title.
                </p>
                <InputError className="mt-2" message={errors.slug} />
            </div>

            <div>
                <InputLabel htmlFor="summary" value="Summary" />
                <textarea
                    id="summary"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    rows={3}
                    value={data.summary}
                    onChange={(e) => setData('summary', e.target.value)}
                    required
                />
                <InputError className="mt-2" message={errors.summary} />
            </div>

            <div>
                <InputLabel htmlFor="body" value="Body" />
                <textarea
                    id="body"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    rows={10}
                    value={data.body}
                    onChange={(e) => setData('body', e.target.value)}
                    required
                />
                <InputError className="mt-2" message={errors.body} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <InputLabel htmlFor="stack" value="Stack (comma-separated)" />
                    <TextInput
                        id="stack"
                        className="mt-1 block w-full"
                        value={data.stack}
                        onChange={(e) => setData('stack', e.target.value)}
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
                        onChange={(e) => setData('sort_order', e.target.value)}
                    />
                    <InputError className="mt-2" message={errors.sort_order} />
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <InputLabel htmlFor="cover_image_url" value="Cover Image URL" />
                    <TextInput
                        id="cover_image_url"
                        className="mt-1 block w-full"
                        value={data.cover_image_url}
                        onChange={(e) =>
                            setData('cover_image_url', e.target.value)
                        }
                    />
                    <InputError
                        className="mt-2"
                        message={errors.cover_image_url}
                    />
                </div>

                <div>
                    <InputLabel htmlFor="repo_url" value="Repository URL" />
                    <TextInput
                        id="repo_url"
                        className="mt-1 block w-full"
                        value={data.repo_url}
                        onChange={(e) => setData('repo_url', e.target.value)}
                    />
                    <InputError className="mt-2" message={errors.repo_url} />
                </div>
            </div>

            <div>
                <InputLabel htmlFor="live_url" value="Live URL" />
                <TextInput
                    id="live_url"
                    className="mt-1 block w-full"
                    value={data.live_url}
                    onChange={(e) => setData('live_url', e.target.value)}
                />
                <InputError className="mt-2" message={errors.live_url} />
            </div>

            <div>
                <InputLabel htmlFor="published_at" value="Published At" />
                <TextInput
                    id="published_at"
                    type="datetime-local"
                    className="mt-1 block w-full"
                    value={data.published_at}
                    onChange={(e) => setData('published_at', e.target.value)}
                />
                <InputError className="mt-2" message={errors.published_at} />
            </div>

            <div className="flex flex-wrap gap-6">
                <label className="inline-flex items-center gap-2">
                    <input
                        type="checkbox"
                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                        checked={data.is_featured}
                        onChange={(e) =>
                            setData('is_featured', e.target.checked)
                        }
                    />
                    <span className="text-sm text-gray-700">Featured</span>
                </label>

                <label className="inline-flex items-center gap-2">
                    <input
                        type="checkbox"
                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                        checked={data.is_published}
                        onChange={(e) =>
                            setData('is_published', e.target.checked)
                        }
                    />
                    <span className="text-sm text-gray-700">Published</span>
                </label>
            </div>

            <div>
                <PrimaryButton disabled={processing}>{submitLabel}</PrimaryButton>
            </div>
        </form>
    );
}
