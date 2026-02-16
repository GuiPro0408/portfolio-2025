import ActiveFilterChips from '@/Components/Filters/ActiveFilterChips';
import DashboardPageHeader from '@/Components/Dashboard/DashboardPageHeader';
import EmptyState from '@/Components/Dashboard/EmptyState';
import FilterToolbar from '@/Components/Dashboard/FilterToolbar';
import StatusBadge from '@/Components/Dashboard/StatusBadge';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Copy, LoaderCircle, PenSquare, Trash2 } from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

const defaultFilters = {
    q: '',
    status: 'all',
    featured: 'all',
    sort: 'sort_order_asc',
};

function formatUpdatedAt(dateString) {
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
}) {
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

export default function Index({ projects, filters }) {
    const initialFilters = { ...defaultFilters, ...(filters ?? {}) };
    const [query, setQuery] = useState(initialFilters.q);
    const [status, setStatus] = useState(initialFilters.status);
    const [featured, setFeatured] = useState(initialFilters.featured);
    const [sort, setSort] = useState(initialFilters.sort);
    const [isListLoading, setIsListLoading] = useState(false);
    const [showListSkeleton, setShowListSkeleton] = useState(false);

    const [pendingRows, setPendingRows] = useState({});
    const [pendingSortRows, setPendingSortRows] = useState({});
    const [sortValues, setSortValues] = useState({});
    const [projectPendingDelete, setProjectPendingDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [pendingDuplicateId, setPendingDuplicateId] = useState(null);
    const [isFilterAccordionOpen, setIsFilterAccordionOpen] = useState(true);

    const projectsData = projects.data;
    const scrollParentRef = useRef(null);

    const rowVirtualizer = useVirtualizer({
        count: projectsData.length,
        getScrollElement: () => scrollParentRef.current,
        estimateSize: () => 144,
        overscan: 5,
    });

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
        rowVirtualizer.measure();
    }, [rowVirtualizer, projectsData]);

    const statusOptions = useMemo(
        () => [
            { value: 'all', label: 'All statuses' },
            { value: 'published', label: 'Published' },
            { value: 'draft', label: 'Draft' },
        ],
        [],
    );

    const featuredOptions = useMemo(
        () => [
            { value: 'all', label: 'All featured states' },
            { value: 'featured', label: 'Featured only' },
            { value: 'not_featured', label: 'Not featured' },
        ],
        [],
    );

    const sortOptions = useMemo(
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

    const visitWithFilters = useCallback((nextFilters) => {
        setIsListLoading(true);

        router.get(route('dashboard.projects.index'), nextFilters, {
            only: ['projects', 'filters', 'flash'],
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onFinish: () => setIsListLoading(false),
        });
    }, []);

    const visitWithUrl = useCallback((url) => {
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
        const nextSortValues = {};

        projectsData.forEach((project) => {
            nextSortValues[project.id] = String(project.sort_order);
        });

        setSortValues(nextSortValues);
    }, [projectsData]);

    const updateFilter = useCallback((key, value) => {
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

    const activeFilterChips = useMemo(() => {
        const chips = [];

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

    const removeChip = useCallback((chip) => {
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

    const toggleFlags = useCallback((project, updates) => {
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
        (project) => {
            toggleFlags(project, {
                is_published: !project.is_published,
            });
        },
        [toggleFlags],
    );

    const onToggleFeatured = useCallback(
        (project) => {
            toggleFlags(project, {
                is_featured: !project.is_featured,
            });
        },
        [toggleFlags],
    );

    const updateSortValue = useCallback((projectId, value) => {
        setSortValues((currentValues) => ({
            ...currentValues,
            [projectId]: value,
        }));
    }, []);

    const saveSortOrder = useCallback(
        (project) => {
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

    const duplicateProject = useCallback((project) => {
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
                    <section className="dashboard-filter-accordion dashboard-panel">
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
                    </section>

                    <section className="dashboard-panel overflow-hidden">
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
                    </section>

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
