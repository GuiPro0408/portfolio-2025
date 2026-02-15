import { Search, X } from 'lucide-react';

export default function FilterToolbar({
    filters,
    onQueryChange,
    onFilterChange,
    onReset,
}) {
    return (
        <section className="dashboard-filter-toolbar" aria-label="Project filters">
            <label className="dashboard-search-input-wrap">
                <Search size={16} aria-hidden="true" />
                <input
                    type="text"
                    value={filters.q}
                    onChange={(event) => onQueryChange(event.target.value)}
                    placeholder="Search by title or slug"
                    className="dashboard-search-input"
                />
            </label>

            <select
                value={filters.status}
                onChange={(event) => onFilterChange('status', event.target.value)}
                className="dashboard-select"
                aria-label="Filter by publication status"
            >
                <option value="all">All statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
            </select>

            <select
                value={filters.featured}
                onChange={(event) => onFilterChange('featured', event.target.value)}
                className="dashboard-select"
                aria-label="Filter by featured status"
            >
                <option value="all">All featured states</option>
                <option value="featured">Featured only</option>
                <option value="not_featured">Not featured</option>
            </select>

            <select
                value={filters.sort}
                onChange={(event) => onFilterChange('sort', event.target.value)}
                className="dashboard-select"
                aria-label="Sort projects"
            >
                <option value="sort_order_asc">Sort order</option>
                <option value="updated_desc">Updated (newest)</option>
                <option value="updated_asc">Updated (oldest)</option>
                <option value="title_asc">Title (A-Z)</option>
                <option value="title_desc">Title (Z-A)</option>
            </select>

            <button type="button" onClick={onReset} className="dashboard-filter-reset">
                <X size={16} aria-hidden="true" />
                Reset
            </button>
        </section>
    );
}
