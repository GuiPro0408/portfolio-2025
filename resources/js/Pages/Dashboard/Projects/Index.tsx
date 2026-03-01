import ActiveFilterChips, {
    type ActiveFilterChip,
} from '@/Components/Filters/ActiveFilterChips';
import type { ListboxOptionItem } from '@/Components/Filters/ListboxSelect';
import DashboardPageHeader from '@/Components/Dashboard/DashboardPageHeader';
import DashboardSurfaceCard from '@/Components/Dashboard/DashboardSurfaceCard';
import EmptyState from '@/Components/Dashboard/EmptyState';
import FilterToolbar from '@/Components/Dashboard/FilterToolbar';
import InlineMeta from '@/Components/Dashboard/InlineMeta';
import PageSectionHeader from '@/Components/Dashboard/PageSectionHeader';
import StatusBadge from '@/Components/Dashboard/StatusBadge';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Copy, LoaderCircle, MoreVertical, PenSquare, Trash2 } from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface AdminProject {
    id: number;
    title: string;
    slug: string;
    is_published: boolean;
    is_featured: boolean;
    sort_order: number;
    updated_at: string;
}

interface AdminProjectsFilters {
    q: string;
    status: string;
    featured: string;
    sort: string;
}

interface PaginatedProjects {
    data: AdminProject[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}

interface DashboardProjectsIndexProps {
    projects: PaginatedProjects;
    filters?: Partial<AdminProjectsFilters>;
}

const defaultFilters: AdminProjectsFilters = {
    q: '',
    status: 'all',
    featured: 'all',
    sort: 'sort_order_asc',
};

type PendingMap = Record<number, boolean>;
type SortValueMap = Record<number, string>;

function formatUpdatedAt(dateString: string): string {
    return new Intl.DateTimeFormat('en', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(dateString));
}

function DashboardSkeletonRows() {
    return (
        <div className="dashboard-skeleton-rows" aria-busy="true">
            {Array.from({ length: 8 }).map((_, index) => (
                <div
                    key={`dashboard-skeleton-${index}`}
                    className="dashboard-skeleton-row"
                >
                    <div className="skeleton-line skeleton-title" />
                    <div className="skeleton-line" />
                    <div className="skeleton-line skeleton-short" />
                </div>
            ))}
        </div>
    );
}

interface ProjectRowProps {
    project: AdminProject;
    sortValue: string;
    isPending: boolean;
    isSortPending: boolean;
    isDuplicatePending: boolean;
    onTogglePublish: (project: AdminProject) => void;
    onToggleFeatured: (project: AdminProject) => void;
    onSortChange: (projectId: number, value: string) => void;
    onSaveSort: (project: AdminProject) => void;
    onDuplicate: (project: AdminProject) => void;
    onDelete: (project: AdminProject) => void;
}

interface MobileProjectCardProps {
    project: AdminProject;
    isPending: boolean;
    isSortPending: boolean;
    isDuplicatePending: boolean;
    onTogglePublish: (project: AdminProject) => void;
    onToggleFeatured: (project: AdminProject) => void;
    onDuplicate: (project: AdminProject) => void;
    onDelete: (project: AdminProject) => void;
}

const ProjectRow = memo(function ProjectRow({
    project,
    sortValue,
    isPending,
    isSortPending,
    isDuplicatePending,
    onTogglePublish,
    onToggleFeatured,
    onSortChange,
    onSaveSort,
    onDuplicate,
    onDelete,
}: ProjectRowProps) {
    return (
        <div className="dashboard-virtual-row" role="row">
            <div className="dashboard-cell" role="cell">
                <p className="dashboard-row-title">{project.title}</p>
                <p className="dashboard-meta-text">/{project.slug}</p>
            </div>

            <div className="dashboard-cell" role="cell">
                <div className="dashboard-badge-row">
                    <StatusBadge tone={project.is_published ? 'success' : 'warning'}>
                        {project.is_published ? 'Published' : 'Draft'}
                    </StatusBadge>
                    <StatusBadge tone={project.is_featured ? 'featured' : 'default'}>
                        {project.is_featured ? 'Featured' : 'Standard'}
                    </StatusBadge>
                </div>

                <div className="dashboard-toggle-row">
                    <button
                        type="button"
                        className="dashboard-toggle-btn"
                        onClick={() => onTogglePublish(project)}
                        disabled={isPending}
                    >
                        Toggle publish
                    </button>
                    <button
                        type="button"
                        className="dashboard-toggle-btn"
                        onClick={() => onToggleFeatured(project)}
                        disabled={isPending}
                    >
                        Toggle featured
                    </button>
                    {isPending ? (
                        <span className="dashboard-toggle-loading">
                            <LoaderCircle size={13} className="animate-spin" />
                            Saving
                        </span>
                    ) : null}
                </div>
            </div>

            <div className="dashboard-cell" role="cell">
                <p className="dashboard-meta-text">
                    {formatUpdatedAt(project.updated_at)}
                </p>
            </div>

            <div className="dashboard-cell" role="cell">
                <div className="dashboard-sort-controls">
                    <input
                        type="number"
                        min={0}
                        value={sortValue}
                            onChange={(event) =>
                                onSortChange(project.id, event.target.value)
                            }
                        className="dashboard-sort-input"
                        disabled={isSortPending}
                    />
                    <button
                        type="button"
                        className="dashboard-toggle-btn"
                        onClick={() => onSaveSort(project)}
                        disabled={isSortPending}
                    >
                        Save
                    </button>
                    {isSortPending ? (
                        <LoaderCircle
                            size={13}
                            className="animate-spin text-slate-300"
                        />
                    ) : null}
                </div>
            </div>

            <div className="dashboard-cell dashboard-cell-actions" role="cell">
                <div className="dashboard-row-actions">
                    <Link
                        href={route('dashboard.projects.edit', project.id)}
                        className="dashboard-inline-action"
                    >
                        <PenSquare size={14} aria-hidden="true" />
                        Edit
                    </Link>
                    <button
                        type="button"
                        onClick={() => onDuplicate(project)}
                        className="dashboard-inline-action"
                        disabled={isDuplicatePending}
                    >
                        {isDuplicatePending ? (
                            <LoaderCircle size={14} className="animate-spin" aria-hidden="true" />
                        ) : (
                            <Copy size={14} aria-hidden="true" />
                        )}
                        Duplicate
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(project)}
                        className="dashboard-inline-action dashboard-inline-action-danger"
                        disabled={isPending}
                    >
                        <Trash2 size={14} aria-hidden="true" />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
});

const MobileProjectCard = memo(function MobileProjectCard({
    project,
    isPending,
    isSortPending,
    isDuplicatePending,
    onTogglePublish,
    onToggleFeatured,
    onDuplicate,
    onDelete,
}: MobileProjectCardProps) {
    return (
        <article className="dashboard-project-card">
            <div className="dashboard-project-card-head">
                <div>
                    <p className="dashboard-row-title">{project.title}</p>
                    <InlineMeta>/{project.slug}</InlineMeta>
                </div>
                <Menu as="div" className="relative">
                    <MenuButton
                        className="dashboard-inline-action"
                        disabled={isPending || isSortPending}
                        aria-label={`Open actions for ${project.title}`}
                    >
                        <MoreVertical size={16} aria-hidden="true" />
                        Actions
                    </MenuButton>
                    <MenuItems
                        anchor="bottom end"
                        className="z-[130] mt-2 w-64 rounded-lg border border-slate-700 bg-slate-950 p-2 shadow-2xl focus:outline-none"
                    >
                        <div className="mb-2 border-b border-slate-800 px-2 pb-2">
                            <p className="line-clamp-2 text-sm font-semibold text-slate-100">
                                {project.title}
                            </p>
                            <p className="line-clamp-1 text-xs text-slate-400">
                                /{project.slug}
                            </p>
                        </div>

                        <div className="grid gap-1.5">
                            <MenuItem>
                                <Link
                                    href={route('dashboard.projects.edit', project.id)}
                                    className="inline-flex min-h-11 items-center gap-2 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 font-semibold text-slate-100"
                                >
                                    <PenSquare size={15} aria-hidden="true" />
                                    Edit
                                </Link>
                            </MenuItem>
                            <MenuItem>
                                <button
                                    type="button"
                                    className="inline-flex min-h-11 items-center gap-2 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-left font-semibold text-slate-100"
                                    onClick={() => onDuplicate(project)}
                                >
                                    <Copy size={15} aria-hidden="true" />
                                    {isDuplicatePending ? 'Duplicating...' : 'Duplicate'}
                                </button>
                            </MenuItem>
                            <MenuItem>
                                <button
                                    type="button"
                                    className="inline-flex min-h-11 items-center gap-2 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-left font-semibold text-slate-100"
                                    onClick={() => onTogglePublish(project)}
                                >
                                    <LoaderCircle size={15} aria-hidden="true" />
                                    Toggle publish
                                </button>
                            </MenuItem>
                            <MenuItem>
                                <button
                                    type="button"
                                    className="inline-flex min-h-11 items-center gap-2 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-left font-semibold text-slate-100"
                                    onClick={() => onToggleFeatured(project)}
                                >
                                    <LoaderCircle size={15} aria-hidden="true" />
                                    Toggle featured
                                </button>
                            </MenuItem>
                            <MenuItem>
                                <button
                                    type="button"
                                    className="inline-flex min-h-11 items-center gap-2 rounded-md border border-rose-800 bg-rose-950/50 px-3 py-2 text-left font-semibold text-rose-200"
                                    onClick={() => onDelete(project)}
                                >
                                    <Trash2 size={15} aria-hidden="true" />
                                    Delete
                                </button>
                            </MenuItem>
                        </div>
                    </MenuItems>
                </Menu>
            </div>

            <div className="dashboard-badge-row">
                <StatusBadge tone={project.is_published ? 'success' : 'warning'}>
                    {project.is_published ? 'Published' : 'Draft'}
                </StatusBadge>
                <StatusBadge tone={project.is_featured ? 'featured' : 'default'}>
                    {project.is_featured ? 'Featured' : 'Standard'}
                </StatusBadge>
                {isDuplicatePending ? (
                    <StatusBadge tone="default">Duplicating...</StatusBadge>
                ) : null}
            </div>

            <InlineMeta>Updated {formatUpdatedAt(project.updated_at)}</InlineMeta>
        </article>
    );
});

export default function Index({ projects, filters }: DashboardProjectsIndexProps) {
    const initialFilters = { ...defaultFilters, ...(filters ?? {}) };
    const [query, setQuery] = useState(initialFilters.q);
    const [status, setStatus] = useState(initialFilters.status);
    const [featured, setFeatured] = useState(initialFilters.featured);
    const [sort, setSort] = useState(initialFilters.sort);
    const [isListLoading, setIsListLoading] = useState(false);
    const [showListSkeleton, setShowListSkeleton] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);

    const [pendingRows, setPendingRows] = useState<PendingMap>({});
    const [pendingSortRows, setPendingSortRows] = useState<PendingMap>({});
    const [sortValues, setSortValues] = useState<SortValueMap>({});
    const [projectPendingDelete, setProjectPendingDelete] =
        useState<AdminProject | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [pendingDuplicateId, setPendingDuplicateId] = useState<number | null>(
        null,
    );
    const [isFilterAccordionOpen, setIsFilterAccordionOpen] = useState(true);

    const projectsData = projects.data;
    const scrollParentRef = useRef<HTMLDivElement | null>(null);

    const rowVirtualizer = useVirtualizer({
        count: projectsData.length,
        getScrollElement: () => scrollParentRef.current,
        estimateSize: () => 144,
        overscan: 5,
    });

    useEffect(() => {
        const query = window.matchMedia('(max-width: 1100px)');
        const apply = () => setIsMobileView(query.matches);

        apply();
        query.addEventListener('change', apply);
        return () => query.removeEventListener('change', apply);
    }, []);

    useEffect(() => {
        setQuery(initialFilters.q);
        setStatus(initialFilters.status);
        setFeatured(initialFilters.featured);
        setSort(initialFilters.sort);
        setIsListLoading(false);
        setShowListSkeleton(false);
    }, [
        initialFilters.q,
        initialFilters.status,
        initialFilters.featured,
        initialFilters.sort,
    ]);

    useEffect(() => {
        if (!isListLoading) {
            setShowListSkeleton(false);
            return;
        }

        const timeoutId = window.setTimeout(() => {
            setShowListSkeleton(true);
        }, 180);

        return () => window.clearTimeout(timeoutId);
    }, [isListLoading]);

    useEffect(() => {
        if (isMobileView) {
            return;
        }

        rowVirtualizer.measure();
    }, [
        rowVirtualizer,
        projectsData,
        pendingRows,
        pendingSortRows,
        pendingDuplicateId,
        isMobileView,
    ]);

    const statusOptions = useMemo<ListboxOptionItem[]>(
        () => [
            { value: 'all', label: 'All statuses' },
            { value: 'published', label: 'Published' },
            { value: 'draft', label: 'Draft' },
        ],
        [],
    );

    const featuredOptions = useMemo<ListboxOptionItem[]>(
        () => [
            { value: 'all', label: 'All featured states' },
            { value: 'featured', label: 'Featured only' },
            { value: 'not_featured', label: 'Not featured' },
        ],
        [],
    );

    const sortOptions = useMemo<ListboxOptionItem[]>(
        () => [
            { value: 'sort_order_asc', label: 'Sort order' },
            { value: 'updated_desc', label: 'Updated (newest)' },
            { value: 'updated_asc', label: 'Updated (oldest)' },
            { value: 'title_asc', label: 'Title (A-Z)' },
            { value: 'title_desc', label: 'Title (Z-A)' },
        ],
        [],
    );

    const sortLabelByValue = useMemo(
        () => Object.fromEntries(sortOptions.map((option) => [option.value, option.label])),
        [sortOptions],
    );

    const statusLabelByValue = useMemo(
        () =>
            Object.fromEntries(statusOptions.map((option) => [option.value, option.label])),
        [statusOptions],
    );

    const featuredLabelByValue = useMemo(
        () =>
            Object.fromEntries(
                featuredOptions.map((option) => [option.value, option.label]),
            ),
        [featuredOptions],
    );

    const visitWithFilters = useCallback((nextFilters: AdminProjectsFilters) => {
        setIsListLoading(true);

        router.get(route('dashboard.projects.index'), { ...nextFilters }, {
            only: ['projects', 'filters', 'flash'],
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onFinish: () => setIsListLoading(false),
        });
    }, []);

    const visitWithUrl = useCallback((url: string | null) => {
        if (!url) {
            return;
        }

        setIsListLoading(true);

        router.visit(url, {
            method: 'get',
            only: ['projects', 'filters', 'flash'],
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onFinish: () => setIsListLoading(false),
        });
    }, []);

    useEffect(() => {
        const nextFilters = {
            q: query.trim(),
            status,
            featured,
            sort,
        };

        const currentFilters = {
            q: initialFilters.q,
            status: initialFilters.status,
            featured: initialFilters.featured,
            sort: initialFilters.sort,
        };

        if (JSON.stringify(nextFilters) === JSON.stringify(currentFilters)) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            visitWithFilters(nextFilters);
        }, 300);

        return () => window.clearTimeout(timeoutId);
    }, [
        query,
        status,
        featured,
        sort,
        initialFilters.q,
        initialFilters.status,
        initialFilters.featured,
        initialFilters.sort,
        visitWithFilters,
    ]);

    useEffect(() => {
        const nextSortValues: SortValueMap = {};

        projectsData.forEach((project: AdminProject) => {
            nextSortValues[project.id] = String(project.sort_order);
        });

        setSortValues(nextSortValues);
    }, [projectsData]);

    const updateFilter = useCallback((key: string, value: string) => {
        if (key === 'status') {
            setStatus(value);
            return;
        }

        if (key === 'featured') {
            setFeatured(value);
            return;
        }

        if (key === 'sort') {
            setSort(value);
        }
    }, []);

    const resetFilters = useCallback(() => {
        setQuery(defaultFilters.q);
        setStatus(defaultFilters.status);
        setFeatured(defaultFilters.featured);
        setSort(defaultFilters.sort);
        visitWithFilters(defaultFilters);
    }, [visitWithFilters]);

    const activeFilterChips = useMemo<ActiveFilterChip[]>(() => {
        const chips: ActiveFilterChip[] = [];

        if (query.trim() !== '') {
            chips.push({ key: 'q', label: 'Search', value: query.trim() });
        }

        if (status !== defaultFilters.status) {
            chips.push({
                key: 'status',
                label: 'Status',
                value: statusLabelByValue[status] ?? status,
            });
        }

        if (featured !== defaultFilters.featured) {
            chips.push({
                key: 'featured',
                label: 'Featured',
                value: featuredLabelByValue[featured] ?? featured,
            });
        }

        if (sort !== defaultFilters.sort) {
            chips.push({
                key: 'sort',
                label: 'Sort',
                value: sortLabelByValue[sort] ?? sort,
            });
        }

        return chips;
    }, [
        query,
        status,
        featured,
        sort,
        statusLabelByValue,
        featuredLabelByValue,
        sortLabelByValue,
    ]);

    const removeChip = useCallback((chip: ActiveFilterChip) => {
        if (chip.key === 'q') {
            setQuery('');
            return;
        }

        if (chip.key === 'status') {
            setStatus(defaultFilters.status);
            return;
        }

        if (chip.key === 'featured') {
            setFeatured(defaultFilters.featured);
            return;
        }

        if (chip.key === 'sort') {
            setSort(defaultFilters.sort);
        }
    }, []);

    const deleteProject = useCallback(() => {
        if (!projectPendingDelete) {
            return;
        }

        setIsDeleting(true);
        router.delete(route('dashboard.projects.destroy', projectPendingDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setProjectPendingDelete(null);
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    }, [projectPendingDelete]);

    const toggleFlags = useCallback((
        project: AdminProject,
        updates: Partial<Pick<AdminProject, 'is_published' | 'is_featured'>>,
    ) => {
        setPendingRows((currentRows) => ({ ...currentRows, [project.id]: true }));

        router.patch(
            route('dashboard.projects.flags.update', project.id),
            {
                is_published: updates.is_published ?? project.is_published,
                is_featured: updates.is_featured ?? project.is_featured,
            },
            {
                preserveScroll: true,
                onFinish: () => {
                    setPendingRows((currentRows) => {
                        const { [project.id]: removed, ...remainingRows } = currentRows;
                        void removed;
                        return remainingRows;
                    });
                },
            },
        );
    }, []);

    const onTogglePublish = useCallback(
        (project: AdminProject) => {
            toggleFlags(project, {
                is_published: !project.is_published,
            });
        },
        [toggleFlags],
    );

    const onToggleFeatured = useCallback(
        (project: AdminProject) => {
            toggleFlags(project, {
                is_featured: !project.is_featured,
            });
        },
        [toggleFlags],
    );

    const updateSortValue = useCallback((projectId: number, value: string) => {
        setSortValues((currentValues) => ({
            ...currentValues,
            [projectId]: value,
        }));
    }, []);

    const saveSortOrder = useCallback(
        (project: AdminProject) => {
            const nextSortOrder = Number.parseInt(
                sortValues[project.id] ?? String(project.sort_order),
                10,
            );

            if (Number.isNaN(nextSortOrder) || nextSortOrder < 0) {
                return;
            }

            setPendingSortRows((currentRows) => ({
                ...currentRows,
                [project.id]: true,
            }));

            router.patch(
                route('dashboard.projects.sort.update', project.id),
                {
                    sort_order: nextSortOrder,
                },
                {
                    preserveScroll: true,
                    onFinish: () => {
                        setPendingSortRows((currentRows) => {
                            const { [project.id]: removed, ...remainingRows } = currentRows;
                            void removed;
                            return remainingRows;
                        });
                    },
                },
            );
        },
        [sortValues],
    );

    const duplicateProject = useCallback((project: AdminProject) => {
        setPendingDuplicateId(project.id);

        router.post(
            route('dashboard.projects.duplicate', project.id),
            {},
            {
                preserveScroll: true,
                onFinish: () => {
                    setPendingDuplicateId(null);
                },
            },
        );
    }, []);

    const virtualRows = rowVirtualizer.getVirtualItems();

    return (
        <AuthenticatedLayout
            header={
                <DashboardPageHeader
                    title="Projects"
                    description="Search, filter, and update publication flags without leaving the table."
                    actions={
                        <Link
                            href={route('dashboard.projects.create')}
                            className="dashboard-button-primary"
                        >
                            New Project
                        </Link>
                    }
                />
            }
        >
            <Head title="Manage Projects" />

            <div className="py-10">
                <div className="mx-auto max-w-7xl space-y-5 px-4 sm:px-6 lg:px-8">
                    <DashboardSurfaceCard className="dashboard-filter-accordion">
                        <button
                            type="button"
                            className="dashboard-filter-accordion-trigger"
                            onClick={() =>
                                setIsFilterAccordionOpen((currentValue) => !currentValue)
                            }
                            aria-expanded={isFilterAccordionOpen}
                            aria-controls="dashboard-project-filters"
                        >
                            <span>Filters</span>
                            <span className="dashboard-filter-accordion-meta">
                                {activeFilterChips.length} active
                            </span>
                            <span
                                className={`dashboard-filter-accordion-icon ${isFilterAccordionOpen ? 'is-open' : ''}`}
                                aria-hidden="true"
                            >
                                ▾
                            </span>
                        </button>

                        {isFilterAccordionOpen ? (
                            <div
                                id="dashboard-project-filters"
                                className="dashboard-filter-accordion-content"
                            >
                                <FilterToolbar
                                    filters={{
                                        q: query,
                                        status,
                                        featured,
                                        sort,
                                    }}
                                    statusOptions={statusOptions}
                                    featuredOptions={featuredOptions}
                                    sortOptions={sortOptions}
                                    onQueryChange={setQuery}
                                    onFilterChange={updateFilter}
                                    onReset={resetFilters}
                                />

                                <ActiveFilterChips
                                    chips={activeFilterChips}
                                    onRemove={removeChip}
                                    onClearAll={resetFilters}
                                />
                            </div>
                        ) : null}
                    </DashboardSurfaceCard>

                    <DashboardSurfaceCard className="overflow-hidden">
                        <PageSectionHeader
                            title="Projects"
                            description="Review status, manage sort order, and open quick actions."
                        />
                        {showListSkeleton ? (
                            <div className="p-4">
                                <DashboardSkeletonRows />
                            </div>
                        ) : projectsData.length === 0 ? (
                            <EmptyState
                                title="No matching projects"
                                description="Try adjusting your filters or create a new project."
                                action={
                                    <Link href={route('dashboard.projects.create')} className="dashboard-button-primary">
                                        Create Project
                                    </Link>
                                }
                            />
                        ) : isMobileView ? (
                            <div className="dashboard-project-cards">
                                {projectsData.map((project) => (
                                    <MobileProjectCard
                                        key={project.id}
                                        project={project}
                                        isPending={pendingRows[project.id] === true}
                                        isSortPending={pendingSortRows[project.id] === true}
                                        isDuplicatePending={pendingDuplicateId === project.id}
                                        onTogglePublish={onTogglePublish}
                                        onToggleFeatured={onToggleFeatured}
                                        onDuplicate={duplicateProject}
                                        onDelete={setProjectPendingDelete}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="dashboard-virtual-table" role="table" aria-label="Projects">
                                <div className="dashboard-virtual-row dashboard-virtual-row-head" role="row">
                                    <div className="dashboard-cell" role="columnheader">Title</div>
                                    <div className="dashboard-cell" role="columnheader">Status</div>
                                    <div className="dashboard-cell" role="columnheader">Updated</div>
                                    <div className="dashboard-cell" role="columnheader">Sort</div>
                                    <div className="dashboard-cell dashboard-cell-actions" role="columnheader">Actions</div>
                                </div>

                                <div
                                    ref={scrollParentRef}
                                    className="dashboard-virtual-scroll"
                                    role="rowgroup"
                                >
                                    <div
                                        style={{
                                            height: `${rowVirtualizer.getTotalSize()}px`,
                                            position: 'relative',
                                            width: '100%',
                                        }}
                                    >
                                        {virtualRows.map((virtualRow) => {
                                            const project = projectsData[virtualRow.index];

                                            if (!project) {
                                                return null;
                                            }

                                            return (
                                                <div
                                                    key={project.id}
                                                    data-index={virtualRow.index}
                                                    ref={rowVirtualizer.measureElement}
                                                    style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        width: '100%',
                                                        transform: `translateY(${virtualRow.start}px)`,
                                                    }}
                                                >
                                                    <ProjectRow
                                                        project={project}
                                                        sortValue={
                                                            sortValues[project.id] ?? String(project.sort_order)
                                                        }
                                                        isPending={pendingRows[project.id] === true}
                                                        isSortPending={pendingSortRows[project.id] === true}
                                                        isDuplicatePending={pendingDuplicateId === project.id}
                                                        onTogglePublish={onTogglePublish}
                                                        onToggleFeatured={onToggleFeatured}
                                                        onSortChange={updateSortValue}
                                                        onSaveSort={saveSortOrder}
                                                        onDuplicate={duplicateProject}
                                                        onDelete={setProjectPendingDelete}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </DashboardSurfaceCard>

                    <nav className="dashboard-pagination" aria-label="Projects pagination">
                        <p className="dashboard-meta-text">
                            Page {projects.current_page} of {projects.last_page}
                        </p>
                        <div className="flex gap-3">
                            {projects.prev_page_url ? (
                                <button
                                    type="button"
                                    onClick={() => visitWithUrl(projects.prev_page_url)}
                                    className="dashboard-button-secondary"
                                    disabled={isListLoading}
                                >
                                    Previous
                                </button>
                            ) : null}
                            {projects.next_page_url ? (
                                <button
                                    type="button"
                                    onClick={() => visitWithUrl(projects.next_page_url)}
                                    className="dashboard-button-secondary"
                                    disabled={isListLoading}
                                >
                                    Next
                                </button>
                            ) : null}
                        </div>
                    </nav>
                </div>
            </div>

            <Modal
                show={projectPendingDelete !== null}
                onClose={() => (!isDeleting ? setProjectPendingDelete(null) : undefined)}
                maxWidth="md"
            >
                <div className="space-y-4 bg-slate-950 p-6 text-slate-100">
                    <h2 className="text-lg font-semibold">Delete project?</h2>
                    <p className="text-sm text-slate-300">
                        This will permanently remove <strong>{projectPendingDelete?.title}</strong>.
                    </p>
                    <div className="flex justify-end gap-3">
                        <SecondaryButton
                            onClick={() => setProjectPendingDelete(null)}
                            disabled={isDeleting}
                            className="!border-slate-600 !bg-slate-900 !text-slate-100 hover:!bg-slate-800"
                        >
                            Cancel
                        </SecondaryButton>
                        <DangerButton onClick={deleteProject} disabled={isDeleting}>
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
