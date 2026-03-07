import { Disclosure } from '@headlessui/react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import type { SharedPageProps } from '@/types/contracts';

export default function PublicHeader() {
    const { auth } = usePage<SharedPageProps>().props;
    const isCurrentRoute = (name: string) => route().current(name) === true;

    return (
        <Disclosure as="header" className="public-header">
            {({ open, close }: { open: boolean; close: () => void }) => (
                <div className="public-shell public-header-inner">
                    <div className="public-header-bar">
                        <Link href={route('home')} className="brand-link">
                            Guillaume Juste
                        </Link>

                        <nav aria-label="Primary" className="public-nav desktop-nav">
                            <Link
                                href={route('home')}
                                className={`nav-link ${isCurrentRoute('home') ? 'nav-link-active' : ''}`}
                                aria-current={isCurrentRoute('home') ? 'page' : undefined}
                            >
                                Home
                            </Link>
                            <Link
                                href={route('projects.index')}
                                className={`nav-link ${isCurrentRoute('projects.index') || isCurrentRoute('projects.show') ? 'nav-link-active' : ''}`}
                                aria-current={
                                    isCurrentRoute('projects.index') || isCurrentRoute('projects.show')
                                        ? 'page'
                                        : undefined
                                }
                            >
                                Projects
                            </Link>
                            <Link
                                href={route('contact.index')}
                                className={`nav-cta ${isCurrentRoute('contact.index') ? 'nav-cta-active' : ''}`}
                                aria-current={isCurrentRoute('contact.index') ? 'page' : undefined}
                            >
                                Contact
                            </Link>
                            {auth?.user && (
                                <Link
                                    href={route('dashboard')}
                                    className={`nav-link ${isCurrentRoute('dashboard') ? 'nav-link-active' : ''}`}
                                    aria-current={isCurrentRoute('dashboard') ? 'page' : undefined}
                                >
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
                            className={`mobile-nav-link ${isCurrentRoute('home') ? 'mobile-nav-link-active' : ''}`}
                            aria-current={isCurrentRoute('home') ? 'page' : undefined}
                            onClick={() => close()}
                        >
                            Home
                        </Link>
                        <Link
                            href={route('projects.index')}
                            className={`mobile-nav-link ${
                                isCurrentRoute('projects.index') || isCurrentRoute('projects.show')
                                    ? 'mobile-nav-link-active'
                                    : ''
                            }`}
                            aria-current={
                                isCurrentRoute('projects.index') || isCurrentRoute('projects.show')
                                    ? 'page'
                                    : undefined
                            }
                            onClick={() => close()}
                        >
                            Projects
                        </Link>
                        <Link
                            href={route('contact.index')}
                            className={`mobile-nav-cta ${isCurrentRoute('contact.index') ? 'mobile-nav-link-active' : ''}`}
                            aria-current={isCurrentRoute('contact.index') ? 'page' : undefined}
                            onClick={() => close()}
                        >
                            Contact
                        </Link>
                        {auth?.user && (
                            <Link
                                href={route('dashboard')}
                                className={`mobile-nav-link ${isCurrentRoute('dashboard') ? 'mobile-nav-link-active' : ''}`}
                                aria-current={isCurrentRoute('dashboard') ? 'page' : undefined}
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
