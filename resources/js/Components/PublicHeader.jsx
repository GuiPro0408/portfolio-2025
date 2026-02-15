import { Link, usePage } from '@inertiajs/react';

export default function PublicHeader({ contact }) {
    const { auth } = usePage().props;

    return (
        <header className="public-header">
            <div className="public-shell public-header-inner">
                <Link href={route('home')} className="brand-link">
                    Guillaume Juste
                </Link>

                <nav aria-label="Primary" className="public-nav">
                    <Link href={route('home')} className="nav-link">
                        Home
                    </Link>
                    <Link href={route('projects.index')} className="nav-link">
                        Projects
                    </Link>
                    <Link href={route('contact.index')} className="nav-cta">
                        Contact
                    </Link>
                    {auth?.user ? (
                        <Link href={route('dashboard')} className="nav-link">
                            Dashboard
                        </Link>
                    ) : (
                        <Link href={route('login')} className="nav-link">
                            Log in
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}
