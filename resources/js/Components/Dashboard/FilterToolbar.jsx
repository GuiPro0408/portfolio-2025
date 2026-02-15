import ListboxSelect from '@/Components/Filters/ListboxSelect';
import { Search, X } from 'lucide-react';

export default function FilterToolbar({
    filters,
    statusOptions,
    featuredOptions,
    sortOptions,
    onQueryChange,
    onFilterChange,
    onReset,
}) {
    return (
        <section className="dashboard-filter-toolbar" aria-label="Project filters">
            <label className="dashboard-filter-label dashboard-filter-search">
                Search
                <span className="dashboard-search-input-wrap">
                    <Search size={16} aria-hidden="true" />
                    <input
                        type="text"
                        value={filters.q}
                        onChange={(event) => onQueryChange(event.target.value)}
                        placeholder="Search by title or slug"
                        className="dashboard-search-input"
                    />
                </span>
            </label>

            <ListboxSelect
                label="Status"
                value={filters.status}
                onChange={(value) => onFilterChange('status', value)}
                options={statusOptions}
                labelClassName="dashboard-filter-label"
                containerClassName="dashboard-filter-select"
                buttonClassName="dashboard-filter-select-button"
                iconClassName="dashboard-filter-select-icon"
                optionsClassName="dashboard-filter-options"
                optionClassName="dashboard-filter-option"
                ariaLabel="Filter by publication status"
            />

            <ListboxSelect
                label="Featured"
                value={filters.featured}
                onChange={(value) => onFilterChange('featured', value)}
                options={featuredOptions}
                labelClassName="dashboard-filter-label"
                containerClassName="dashboard-filter-select"
                buttonClassName="dashboard-filter-select-button"
                iconClassName="dashboard-filter-select-icon"
                optionsClassName="dashboard-filter-options"
                optionClassName="dashboard-filter-option"
                ariaLabel="Filter by featured status"
            />

            <ListboxSelect
                label="Sort"
                value={filters.sort}
                onChange={(value) => onFilterChange('sort', value)}
                options={sortOptions}
                labelClassName="dashboard-filter-label"
                containerClassName="dashboard-filter-select"
                buttonClassName="dashboard-filter-select-button"
                iconClassName="dashboard-filter-select-icon"
                optionsClassName="dashboard-filter-options"
                optionClassName="dashboard-filter-option"
                ariaLabel="Sort projects"
            />

            <button
                type="button"
                onClick={onReset}
                className="dashboard-filter-reset"
            >
                <X size={16} aria-hidden="true" />
                Reset
            </button>
        </section>
    );
}
