import PublicLayout from '@/Layouts/PublicLayout';
import type { ContactPayload } from '@/types/contracts';
import { Head, Link } from '@inertiajs/react';

interface ErrorPageProps {
    status: number;
    contact: ContactPayload;
}

const statusContent: Record<number, { title: string; message: string }> = {
    403: {
        title: 'Access denied',
        message: 'You do not have permission to view this page.',
    },
    404: {
        title: 'Page not found',
        message: 'The page you requested does not exist or has moved.',
    },
    500: {
        title: 'Server error',
        message: 'An unexpected error occurred. Please try again shortly.',
    },
    503: {
        title: 'Service unavailable',
        message: 'The service is temporarily unavailable. Please try again soon.',
    },
};

export default function Error({ status, contact }: ErrorPageProps) {
    const content = statusContent[status] ?? statusContent[500];

    return (
        <>
            <Head title={`Error ${status}`}>
                <meta name="robots" content="noindex,nofollow" />
            </Head>

            <PublicLayout contact={contact}>
                <section className="public-shell section-block reveal">
                    <article className="card-surface py-16 text-center">
                        <p className="section-eyebrow">Error {status}</p>
                        <h1 className="hero-title mt-3">{content.title}</h1>
                        <p className="hero-description mx-auto mt-4 max-w-2xl">
                            {content.message}
                        </p>
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                            <Link href={route('home')} className="button-primary">
                                Go to homepage
                            </Link>
                            <Link
                                href={route('projects.index')}
                                className="button-secondary"
                            >
                                Browse projects
                            </Link>
                        </div>
                    </article>
                </section>
            </PublicLayout>
        </>
    );
}
