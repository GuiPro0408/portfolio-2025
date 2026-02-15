import InputError from '@/Components/InputError';
import PublicLayout from '@/Layouts/PublicLayout';
import { Link } from '@inertiajs/react';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function Contact({ contact, formStartedAt }) {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        message: '',
        website: '',
        form_started_at: formStartedAt,
    });

    const submit = (event) => {
        event.preventDefault();

        post(route('contact.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('name', 'email', 'message', 'website');
                setData('form_started_at', Math.floor(Date.now() / 1000));
            },
        });
    };

    const metaDescription =
        'Send a project or collaboration inquiry through the portfolio contact form.';
    const canonicalUrl = route('contact.index');

    const contactSchema = {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Contact Guillaume Juste',
        url: canonicalUrl,
    };

    return (
        <>
            <Head title="Contact">
                <meta name="description" content={metaDescription} />
                <meta property="og:title" content="Contact | Guillaume Juste" />
                <meta property="og:description" content={metaDescription} />
                <meta name="twitter:card" content="summary" />
                <link rel="canonical" href={canonicalUrl} />
                <script type="application/ld+json">
                    {JSON.stringify(contactSchema)}
                </script>
            </Head>

            <PublicLayout contact={contact}>
                <section className="public-shell section-block reveal">
                    <article className="contact-shell card-surface">
                        <div className="contact-intro">
                            <p className="section-eyebrow">Contact</p>
                            <h1 className="contact-title">
                                Start a conversation
                            </h1>
                            <p className="contact-description">
                                Share what you are building, what you need, and
                                your timeline. I will reply as soon as possible.
                            </p>
                            <ul className="contact-points">
                                <li>Clear scope and practical next steps.</li>
                                <li>Fast response and transparent communication.</li>
                                <li>Built for product delivery, not buzzwords.</li>
                            </ul>
                            <div className="contact-alt-links">
                                {contact?.email ? (
                                    <a href={`mailto:${contact.email}`}>
                                        {contact.email}
                                    </a>
                                ) : null}
                                {contact?.linkedin ? (
                                    <a
                                        href={contact.linkedin}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        LinkedIn
                                    </a>
                                ) : null}
                                {contact?.github ? (
                                    <a
                                        href={contact.github}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        GitHub
                                    </a>
                                ) : null}
                            </div>
                            <Link
                                href={route('projects.index')}
                                className="contact-side-link"
                            >
                                Browse project work
                            </Link>
                        </div>

                        <div className="contact-form-wrap">
                            <header className="contact-form-head">
                                <h2>Project brief</h2>
                                <p>
                                    Name, email, and one concise message are
                                    enough to get started.
                                </p>
                            </header>

                            {flash?.success ? (
                                <p className="contact-success-note">
                                    {flash.success}
                                </p>
                            ) : null}

                            <form onSubmit={submit} className="contact-form">
                                <input
                                    type="text"
                                    name="website"
                                    value={data.website}
                                    onChange={(event) =>
                                        setData('website', event.target.value)
                                    }
                                    tabIndex={-1}
                                    autoComplete="off"
                                    className="hidden"
                                    aria-hidden="true"
                                />
                                <input
                                    type="hidden"
                                    name="form_started_at"
                                    value={data.form_started_at}
                                />

                                <label htmlFor="name" className="contact-field">
                                    <span>Name</span>
                                    <input
                                        id="name"
                                        className="contact-input"
                                        value={data.name}
                                        onChange={(event) =>
                                            setData('name', event.target.value)
                                        }
                                        required
                                    />
                                    <InputError
                                        className="contact-error"
                                        message={errors.name}
                                    />
                                </label>

                                <label
                                    htmlFor="email"
                                    className="contact-field"
                                >
                                    <span>Email</span>
                                    <input
                                        id="email"
                                        type="email"
                                        className="contact-input"
                                        value={data.email}
                                        onChange={(event) =>
                                            setData('email', event.target.value)
                                        }
                                        required
                                    />
                                    <InputError
                                        className="contact-error"
                                        message={errors.email}
                                    />
                                </label>

                                <label
                                    htmlFor="message"
                                    className="contact-field"
                                >
                                    <span>Message</span>
                                    <textarea
                                        id="message"
                                        rows={7}
                                        className="contact-input contact-textarea"
                                        value={data.message}
                                        onChange={(event) =>
                                            setData('message', event.target.value)
                                        }
                                        required
                                    />
                                    <InputError
                                        className="contact-error"
                                        message={errors.message}
                                    />
                                </label>

                                <InputError
                                    className="contact-error"
                                    message={errors.form_started_at}
                                />

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="contact-submit"
                                >
                                    {processing ? 'Sending...' : 'Send message'}
                                </button>
                            </form>
                        </div>
                    </article>
                </section>
            </PublicLayout>
        </>
    );
}
