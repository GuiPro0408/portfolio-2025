import ListboxSelect from '@/Components/Filters/ListboxSelect';
import type {
    ListboxOptionItem,
    SelectValue,
} from '@/Components/Filters/ListboxSelect';
import { Search, X } from 'lucide-react';
import type { ChangeEvent } from 'react';

interface FilterToolbarFilters {
    q: string;
    status: string;
    featured: string;
    sort: string;
}

type FilterKey = 'status' | 'featured' | 'sort';

interface FilterToolbarProps {
    filters: FilterToolbarFilters;
    statusOptions: ListboxOptionItem[];
    featuredOptions: ListboxOptionItem[];
    sortOptions: ListboxOptionItem[];
    onQueryChange: (value: string) => void;
    onFilterChange: (key: FilterKey, value: string) => void;
    onReset: () => void;
}

export default function FilterToolbar({
    filters,
    statusOptions,
    featuredOptions,
    sortOptions,
    onQueryChange,
    onFilterChange,
    onReset,
}: FilterToolbarProps) {
    const handleFilterChange = (key: FilterKey, value: SelectValue) => {
        onFilterChange(key, String(value));
    };

    return (
        <section className="dashboard-filter-toolbar" aria-label="Project filters">
            <label className="dashboard-filter-label dashboard-filter-search">
                Search
                <span className="dashboard-search-input-wrap">
                    <Search size={16} aria-hidden="true" />
                    <input
                        type="text"
                        value={filters.q}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            onQueryChange(event.target.value)
                        }
                        placeholder="Search by title or slug"
                        className="dashboard-search-input"
                    />
                </span>
            </label>

            <ListboxSelect
                label="Status"
                value={filters.status}
                onChange={(value) => handleFilterChange('status', value)}
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
                onChange={(value) => handleFilterChange('featured', value)}
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
                onChange={(value) => handleFilterChange('sort', value)}
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
