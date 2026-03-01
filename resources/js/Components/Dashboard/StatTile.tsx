import type { LucideIcon } from 'lucide-react';

interface StatTileProps {
    label: string;
    value: string | number;
    icon?: LucideIcon;
    hint?: string;
}

export default function StatTile({ label, value, icon: Icon, hint }: StatTileProps) {
    return (
        <article className="dashboard-stat-tile">
            <div className="dashboard-stat-header">
                <p className="dashboard-stat-label">{label}</p>
                {Icon ? <Icon size={16} aria-hidden="true" /> : null}
            </div>
            <p className="dashboard-stat-value">{value}</p>
            {hint ? <p className="dashboard-stat-hint">{hint}</p> : null}
        </article>
    );
}
