function Chip({ chip, onRemove }) {
    return (
        <li className="active-filter-chip">
            <span className="active-filter-chip-label">{chip.label}: </span>
            <span>{chip.value}</span>
            <button
                type="button"
                className="active-filter-chip-remove"
                aria-label={`Remove filter ${chip.label}: ${chip.value}`}
                onClick={() => onRemove(chip)}
            >
                ×
            </button>
        </li>
    );
}

export default function ActiveFilterChips({ chips, onRemove, onClearAll }) {
    if (!chips.length) {
        return null;
    }

    return (
        <section className="active-filter-criteria" aria-label="Active filters">
            <ul className="active-filter-chips">
                {chips.map((chip) => (
                    <Chip key={chip.key} chip={chip} onRemove={onRemove} />
                ))}
            </ul>
            <button
                type="button"
                className="active-filter-clear"
                onClick={onClearAll}
            >
                Clear all
            </button>
        </section>
    );
}
