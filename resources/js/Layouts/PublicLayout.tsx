import '../../css/styles/public-layout.css';
import '../../css/styles/home-sections.css';
import PublicFooter from '@/Components/PublicFooter';
import PublicHeader from '@/Components/PublicHeader';
import type { ContactPayload } from '@/types/contracts';
import type { ReactNode } from 'react';

interface PublicLayoutProps {
    children: ReactNode;
    contact: ContactPayload;
}

export default function PublicLayout({ children, contact }: PublicLayoutProps) {
    return (
        <div className="public-page">
            <div className="background-aura" aria-hidden="true" />
            <PublicHeader contact={contact} />
            <main>{children}</main>
            <PublicFooter contact={contact} />
        </div>
    );
}
