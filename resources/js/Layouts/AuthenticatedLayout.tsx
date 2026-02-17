import '../../css/styles/dashboard-theme.css';
import ApplicationLogo from '@/Components/ApplicationLogo';
import ToastStack from '@/Components/Dashboard/ToastStack';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import type { AuthenticatedPageProps } from '@/types/contracts';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface AuthenticatedLayoutProps {
    header?: ReactNode;
    children: ReactNode;
}

export default function AuthenticatedLayout({
    header,
    children,
}: AuthenticatedLayoutProps) {
    const page = usePage<AuthenticatedPageProps>();
    const user = page.props.auth.user;
    const flash = page.props.flash ?? {};

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    useEffect(() => {
        setShowingNavigationDropdown(false);
    }, [page.url]);

    return (
        <div className="authenticated-theme-dark min-h-screen bg-gray-100">
            <nav className="auth-nav border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="auth-nav-inner flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-200" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    Dashboard
                                </NavLink>
                                <NavLink
                                    href={route('dashboard.projects.index')}
                                    active={route().current('dashboard.projects.*')}
                                >
                                    Projects
                                </NavLink>
                                <NavLink
                                    href={route('dashboard.homepage.edit')}
                                    active={route().current('dashboard.homepage.*')}
                                >
                                    Homepage
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="dashboard-mobile-menu-toggle inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                                aria-label={
                                    showingNavigationDropdown
                                        ? 'Close admin menu'
                                        : 'Open admin menu'
                                }
                            >
                                {showingNavigationDropdown ? (
                                    <X size={18} aria-hidden="true" />
                                ) : (
                                    <Menu size={18} aria-hidden="true" />
                                )}
                            </button>
                        </div>
                    </div>

                    {showingNavigationDropdown && (
                        <>
                            <button
                                type="button"
                                className="dashboard-mobile-drawer-backdrop sm:hidden"
                                onClick={() => setShowingNavigationDropdown(false)}
                                aria-label="Close admin menu"
                            />
                            <nav
                                className="dashboard-mobile-drawer sm:hidden"
                                aria-label="Admin mobile navigation"
                            >
                                <Link
                                    href={route('dashboard')}
                                    className="dashboard-mobile-link"
                                    onClick={() => setShowingNavigationDropdown(false)}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href={route('dashboard.projects.index')}
                                    className="dashboard-mobile-link"
                                    onClick={() => setShowingNavigationDropdown(false)}
                                >
                                    Projects
                                </Link>
                                <Link
                                    href={route('dashboard.homepage.edit')}
                                    className="dashboard-mobile-link"
                                    onClick={() => setShowingNavigationDropdown(false)}
                                >
                                    Homepage
                                </Link>

                                <div className="dashboard-mobile-user">
                                    <p className="dashboard-mobile-user-name">
                                        {user.name}
                                    </p>
                                    <p className="dashboard-mobile-user-email">
                                        {user.email}
                                    </p>
                                </div>

                                <Link
                                    href={route('profile.edit')}
                                    className="dashboard-mobile-link"
                                    onClick={() => setShowingNavigationDropdown(false)}
                                >
                                    Profile
                                </Link>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="dashboard-mobile-link"
                                    onClick={() => setShowingNavigationDropdown(false)}
                                >
                                    Log Out
                                </Link>
                            </nav>
                        </>
                    )}
                </div>
            </nav>

            <ToastStack flash={flash} />

            {header && (
                <header className="bg-white shadow auth-page-header">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
