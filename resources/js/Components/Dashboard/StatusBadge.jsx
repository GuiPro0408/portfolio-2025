function classesForTone(tone) {
    if (tone === 'success') {
        return 'dashboard-badge dashboard-badge-success';
    }

    if (tone === 'warning') {
        return 'dashboard-badge dashboard-badge-warning';
    }

    if (tone === 'featured') {
        return 'dashboard-badge dashboard-badge-featured';
    }

    return 'dashboard-badge';
}

export default function StatusBadge({ tone = 'default', children }) {
    return <span className={classesForTone(tone)}>{children}</span>;
}
