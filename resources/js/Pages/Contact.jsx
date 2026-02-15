import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import PublicLayout from '@/Layouts/PublicLayout';
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
                    <article className="card-surface mx-auto max-w-3xl">
                        <header className="space-y-3">
                            <p className="section-eyebrow">Contact</p>
                            <h1 className="hero-title !text-[clamp(2rem,4vw,3rem)]">
                                Start a conversation
                            </h1>
                            <p className="hero-description !max-w-none">
                                Share what you are building, what you need, and
                                your timeline. I will reply as soon as possible.
                            </p>
                        </header>

                        {flash?.success ? (
                            <p className="mt-6 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                                {flash.success}
                            </p>
                        ) : null}

                        <form onSubmit={submit} className="mt-8 space-y-5">
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

                            <div>
                                <InputLabel
                                    value="Name"
                                    htmlFor="name"
                                    className="!text-slate-200"
                                />
                                <TextInput
                                    id="name"
                                    className="mt-1 block w-full"
                                    value={data.name}
                                    onChange={(event) =>
                                        setData('name', event.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.name}
                                />
                            </div>

                            <div>
                                <InputLabel
                                    value="Email"
                                    htmlFor="email"
                                    className="!text-slate-200"
                                />
                                <TextInput
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    value={data.email}
                                    onChange={(event) =>
                                        setData('email', event.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.email}
                                />
                            </div>

                            <div>
                                <InputLabel
                                    value="Message"
                                    htmlFor="message"
                                    className="!text-slate-200"
                                />
                                <textarea
                                    id="message"
                                    rows={7}
                                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white/90 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.message}
                                    onChange={(event) =>
                                        setData('message', event.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.message}
                                />
                            </div>

                            <InputError
                                className="mt-2"
                                message={errors.form_started_at}
                            />

                            <PrimaryButton disabled={processing}>
                                {processing ? 'Sending...' : 'Send message'}
                            </PrimaryButton>
                        </form>
                    </article>
                </section>
            </PublicLayout>
        </>
    );
}
