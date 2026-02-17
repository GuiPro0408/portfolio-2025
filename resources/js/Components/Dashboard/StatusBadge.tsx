import type { ReactNode } from 'react';

type StatusTone = 'default' | 'success' | 'warning' | 'featured';

function classesForTone(tone: StatusTone): string {
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

interface StatusBadgeProps {
    tone?: StatusTone;
    children: ReactNode;
}

export default function StatusBadge({
    tone = 'default',
    children,
}: StatusBadgeProps) {
    return <span className={classesForTone(tone)}>{children}</span>;
}
