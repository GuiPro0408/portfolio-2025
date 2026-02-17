import type { ReactNode } from 'react';

interface EmptyStateProps {
    title: string;
    description: string;
    action?: ReactNode;
}

export default function EmptyState({
    title,
    description,
    action,
}: EmptyStateProps) {
    return (
        <div className="dashboard-empty-state">
            <h3>{title}</h3>
            <p>{description}</p>
            {action ? <div>{action}</div> : null}
        </div>
    );
}
