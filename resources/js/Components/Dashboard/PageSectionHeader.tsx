import type { ReactNode } from 'react';

interface PageSectionHeaderProps {
    title: string;
    description?: string;
    actions?: ReactNode;
}

export default function PageSectionHeader({
    title,
    description,
    actions,
}: PageSectionHeaderProps) {
    return (
        <header className="dashboard-section-header">
            <div>
                <h3 className="dashboard-section-title">{title}</h3>
                {description ? (
                    <p className="dashboard-section-description">{description}</p>
                ) : null}
            </div>
            {actions ? (
                <div className="dashboard-section-actions">{actions}</div>
            ) : null}
        </header>
    );
}
