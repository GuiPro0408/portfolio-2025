import type { ReactNode } from 'react';

interface GuestLayoutProps {
    children: ReactNode;
    constrained?: boolean;
}

export default function GuestLayout({
    children,
    constrained = true,
}: GuestLayoutProps) {
    return (
        <div className="guest-shell">
            <div className={constrained ? 'guest-card-shell' : ''}>
                {children}
            </div>
        </div>
    );
}
