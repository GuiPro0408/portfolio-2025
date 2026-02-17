import type { ReactNode } from 'react';

interface StickyActionBarProps {
    children: ReactNode;
}

export default function StickyActionBar({ children }: StickyActionBarProps) {
    return <div className="dashboard-sticky-actions">{children}</div>;
}
