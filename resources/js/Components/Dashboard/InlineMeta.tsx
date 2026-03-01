import type { ReactNode } from 'react';

interface InlineMetaProps {
    children: ReactNode;
    className?: string;
}

export default function InlineMeta({ children, className = '' }: InlineMetaProps) {
    return <p className={`dashboard-inline-meta ${className}`.trim()}>{children}</p>;
}
