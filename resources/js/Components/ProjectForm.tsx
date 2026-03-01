import InputError from '@/Components/InputError';
import ListboxSelect from '@/Components/Filters/ListboxSelect';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import StickyActionBar from '@/Components/Dashboard/StickyActionBar';
import TextInput from '@/Components/TextInput';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { CalendarDays } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import type { FormEvent, ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';

export interface ProjectFormData {
    title: string;
    slug: string;
    summary: string;
    body: string;
    stack: string;
    cover_image_url: string;
    repo_url: string;
    live_url: string;
    is_featured: boolean;
    is_published: boolean;
    published_at: string;
    sort_order: string | number;
}

type ProjectFormErrors = Record<string, string | undefined>;
type SetProjectFormData = <K extends keyof ProjectFormData>(
    key: K,
    value: ProjectFormData[K],
) => void;

interface ProjectFormProps {
    data: ProjectFormData;
    setData: SetProjectFormData;
    errors: ProjectFormErrors;
    processing: boolean;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    submitLabel: string;
}

function parseDateValue(value: unknown): Date | null {
    if (!value || typeof value !== 'string') {
        return null;
    }

    const [year, month, day] = value.split('-').map((token) => Number.parseInt(token, 10));

    if (!year || !month || !day) {
        return null;
    }

    const parsed = new Date(year, month - 1, day);

    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDateValue(value: unknown): string {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
        return '';
    }

    const year = String(value.getFullYear());
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function formatHumanDate(value: unknown): string {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
        return 'Select publication date';
    }

    return new Intl.DateTimeFormat('en', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
    }).format(value);
}

function ValidationSummary({ errors }: { errors: ProjectFormErrors }) {
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

function FieldHelp({ children }: { children: ReactNode }) {
    return <p className="dashboard-field-help">{children}</p>;
}

interface ToggleFieldProps {
    id: string;
    label: string;
    checked: boolean;
    onChange: (value: boolean) => void;
}

function ToggleField({ id, label, checked, onChange }: ToggleFieldProps) {
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
}: ProjectFormProps) {
    const today = useMemo(() => new Date(), []);
    const selectedPublishedAt = useMemo(
        () => parseDateValue(data.published_at),
        [data.published_at],
    );
    const [displayMonth, setDisplayMonth] = useState<Date>(
        () => selectedPublishedAt ?? today,
    );

    const monthOptions = useMemo(
        () =>
            Array.from({ length: 12 }, (_, month) => ({
                value: month,
                label: new Intl.DateTimeFormat('en', {
                    month: 'long',
                }).format(new Date(2026, month, 1)),
            })),
        [],
    );

    const yearOptions = useMemo(() => {
        const currentYear = today.getFullYear();

        return Array.from({ length: 31 }, (_, index) => {
            const year = currentYear - 20 + index;

            return {
                value: year,
                label: String(year),
            };
        });
    }, [today]);

    useEffect(() => {
        const nextSelectedDate = parseDateValue(data.published_at);

        if (!nextSelectedDate) {
            return;
        }

        setDisplayMonth(
            new Date(
                nextSelectedDate.getFullYear(),
                nextSelectedDate.getMonth(),
                1,
            ),
        );
    }, [data.published_at]);

    const updateDisplayMonth = (nextMonth: number, nextYear: number) => {
        setDisplayMonth(new Date(nextYear, nextMonth, 1));
    };

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
                        <Popover className="dashboard-modern-datefield mt-1">
                            {({ close }: { close: () => void }) => (
                                <>
                                    <PopoverButton
                                        id="published_at"
                                        className="dashboard-modern-date-trigger"
                                    >
                                        <span className="dashboard-modern-date-value">
                                            {formatHumanDate(selectedPublishedAt)}
                                        </span>
                                        <CalendarDays size={16} aria-hidden="true" />
                                    </PopoverButton>

                                    <PopoverPanel
                                        transition
                                        className="dashboard-modern-date-panel"
                                    >
                                        <div className="dashboard-modern-date-controls">
                                            <ListboxSelect
                                                label="Month"
                                                value={displayMonth.getMonth()}
                                                onChange={(nextMonth) =>
                                                    updateDisplayMonth(
                                                        Number(nextMonth),
                                                        displayMonth.getFullYear(),
                                                    )
                                                }
                                                options={monthOptions}
                                                labelClassName="dashboard-modern-date-listbox-label"
                                                containerClassName="dashboard-modern-date-listbox"
                                                buttonClassName="dashboard-modern-date-listbox-button"
                                                iconClassName="dashboard-modern-date-listbox-icon"
                                                optionsClassName="dashboard-modern-date-listbox-options"
                                                optionClassName="dashboard-modern-date-listbox-option"
                                                ariaLabel="Select month"
                                            />
                                            <ListboxSelect
                                                label="Year"
                                                value={displayMonth.getFullYear()}
                                                onChange={(nextYear) =>
                                                    updateDisplayMonth(
                                                        displayMonth.getMonth(),
                                                        Number(nextYear),
                                                    )
                                                }
                                                options={yearOptions}
                                                labelClassName="dashboard-modern-date-listbox-label"
                                                containerClassName="dashboard-modern-date-listbox"
                                                buttonClassName="dashboard-modern-date-listbox-button"
                                                iconClassName="dashboard-modern-date-listbox-icon"
                                                optionsClassName="dashboard-modern-date-listbox-options"
                                                optionClassName="dashboard-modern-date-listbox-option"
                                                ariaLabel="Select year"
                                            />
                                        </div>

                                        <DayPicker
                                            mode="single"
                                            selected={selectedPublishedAt ?? undefined}
                                            onSelect={(nextDate) => {
                                                setData('published_at', formatDateValue(nextDate));
                                                if (nextDate) {
                                                    close();
                                                }
                                            }}
                                            showOutsideDays
                                            weekStartsOn={1}
                                            month={displayMonth}
                                            startMonth={new Date(2000, 0)}
                                            endMonth={new Date(today.getFullYear() + 10, 11)}
                                            onMonthChange={setDisplayMonth}
                                            className="dashboard-daypicker"
                                            classNames={{
                                                root: 'dashboard-daypicker',
                                                months: 'dashboard-daypicker-months',
                                                month: 'dashboard-daypicker-month',
                                                nav: 'dashboard-daypicker-nav',
                                                button_previous: 'dashboard-daypicker-nav-button',
                                                button_next: 'dashboard-daypicker-nav-button',
                                                month_caption: 'dashboard-daypicker-month-caption',
                                                caption_label: 'dashboard-daypicker-caption-label',
                                                month_grid: 'dashboard-daypicker-grid',
                                                weekdays: 'dashboard-daypicker-weekdays',
                                                weekday: 'dashboard-daypicker-weekday',
                                                weeks: 'dashboard-daypicker-weeks',
                                                week: 'dashboard-daypicker-week',
                                                day: 'dashboard-daypicker-day-cell',
                                                day_button: 'dashboard-daypicker-day',
                                            }}
                                            modifiersClassNames={{
                                                today: 'is-today',
                                                selected: 'is-selected',
                                                outside: 'is-outside',
                                            }}
                                            hideNavigation
                                        />

                                        <div className="dashboard-modern-date-actions">
                                            <button
                                                type="button"
                                                className="dashboard-modern-date-action"
                                                onClick={() => {
                                                    setData('published_at', formatDateValue(new Date()));
                                                    close();
                                                }}
                                            >
                                                Today
                                            </button>
                                            <button
                                                type="button"
                                                className="dashboard-modern-date-action"
                                                onClick={() => setData('published_at', '')}
                                                disabled={!selectedPublishedAt}
                                            >
                                                Clear
                                            </button>
                                        </div>
                                    </PopoverPanel>
                                </>
                            )}
                        </Popover>
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
