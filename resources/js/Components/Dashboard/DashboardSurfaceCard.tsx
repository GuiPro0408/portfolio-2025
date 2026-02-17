import type { ReactNode } from 'react';

interface DashboardSurfaceCardProps {
    children: ReactNode;
    className?: string;
    inset?: boolean;
}

export default function DashboardSurfaceCard({
    children,
    className = '',
    inset = false,
}: DashboardSurfaceCardProps) {
    return (
        <section
            className={`dashboard-surface-card ${inset ? 'dashboard-surface-card-inset' : ''} ${className}`.trim()}
        >
            {children}
        </section>
    );
}
