import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
    label: string;
    value: string | number;
    icon?: LucideIcon;
}

export default function StatCard({ label, value, icon: Icon }: StatCardProps) {
    return (
        <article className="dashboard-stat-card">
            <div className="dashboard-stat-header">
                <p className="dashboard-stat-label">{label}</p>
                {Icon ? <Icon size={16} aria-hidden="true" /> : null}
            </div>
            <p className="dashboard-stat-value">{value}</p>
        </article>
    );
}
