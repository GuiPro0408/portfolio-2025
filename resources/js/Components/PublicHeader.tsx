import { Disclosure } from '@headlessui/react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import type { SharedPageProps } from '@/types/contracts';

export default function PublicHeader() {
    const { auth } = usePage<SharedPageProps>().props;

    return (
        <Disclosure as="header" className="public-header">
            {({ open, close }) => (
                <div className="public-shell public-header-inner">
                    <div className="public-header-bar">
                        <Link href={route('home')} className="brand-link">
                            Guillaume Juste
                        </Link>

                        <nav aria-label="Primary" className="public-nav desktop-nav">
                            <Link href={route('home')} className="nav-link">
                                Home
                            </Link>
                            <Link href={route('projects.index')} className="nav-link">
                                Projects
                            </Link>
                            <Link href={route('contact.index')} className="nav-cta">
                                Contact
                            </Link>
                            {auth?.user && (
                                <Link href={route('dashboard')} className="nav-link">
                                    Dashboard
                                </Link>
                            )}
                        </nav>

                        <Disclosure.Button
                            className="mobile-menu-toggle"
                            aria-label={open ? 'Close menu' : 'Open menu'}
                        >
                            {open ? (
                                <X size={18} aria-hidden="true" />
                            ) : (
                                <Menu size={18} aria-hidden="true" />
                            )}
                        </Disclosure.Button>
                    </div>

                    <Disclosure.Panel
                        as="nav"
                        aria-label="Mobile primary"
                        className="mobile-nav-panel"
                    >
                        <Link
                            href={route('home')}
                            className="mobile-nav-link"
                            onClick={() => close()}
                        >
                            Home
                        </Link>
                        <Link
                            href={route('projects.index')}
                            className="mobile-nav-link"
                            onClick={() => close()}
                        >
                            Projects
                        </Link>
                        <Link
                            href={route('contact.index')}
                            className="mobile-nav-cta"
                            onClick={() => close()}
                        >
                            Contact
                        </Link>
                        {auth?.user && (
                            <Link
                                href={route('dashboard')}
                                className="mobile-nav-link"
                                onClick={() => close()}
                            >
                                Dashboard
                            </Link>
                        )}
                    </Disclosure.Panel>
                </div>
            )}
        </Disclosure>
    );
}
