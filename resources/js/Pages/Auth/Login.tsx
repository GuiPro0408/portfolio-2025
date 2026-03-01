import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    heroImageUrl?: string | null;
}

interface LoginFormData {
    email: string;
    password: string;
    remember: boolean;
}

export default function Login({
    status,
    canResetPassword,
    heroImageUrl,
}: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } =
        useForm<LoginFormData>({
        email: '',
        password: '',
        remember: false,
        });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout constrained={false}>
            <Head title="Owner Login" />

            <section className="owner-login-page">
                <div className="owner-login-grid">
                    <aside className="owner-login-hero reveal">
                        <div>
                            <p className="owner-login-meta reveal owner-login-stagger-1">Private Access</p>
                            <h1 className="owner-login-title reveal owner-login-stagger-2">Owner Access</h1>
                            <p className="owner-login-subtitle reveal owner-login-stagger-3">
                                Access is reserved for the portfolio owner to
                                manage projects, homepage content, and incoming
                                contact leads.
                            </p>
                            {heroImageUrl && (
                                <figure className="owner-login-hero-media reveal owner-login-stagger-4">
                                    <img
                                        src={heroImageUrl}
                                        alt="Portfolio studio workspace"
                                        loading="lazy"
                                    />
                                </figure>
                            )}
                            <ul className="owner-login-highlights reveal owner-login-stagger-5">
                                <li>Project publishing and ordering controls</li>
                                <li>Homepage content and featured cards</li>
                                <li>Owner-only moderation workflow</li>
                            </ul>
                        </div>
                        <p className="owner-login-brand reveal owner-login-stagger-6">Guillaume Juste</p>
                    </aside>

                    <section className="owner-login-panel reveal owner-login-stagger-2" aria-label="Login">
                        <p className="owner-login-panel-eyebrow reveal owner-login-stagger-3">Welcome back</p>
                        <h2 className="owner-login-panel-title reveal owner-login-stagger-4">Sign in</h2>
                        <p className="owner-login-panel-copy reveal owner-login-stagger-5">
                            Use your owner credentials to access the dashboard.
                        </p>

                        {status && (
                            <div className="owner-login-status">
                                {status}
                            </div>
                        )}

                        <form className="owner-login-form reveal owner-login-stagger-6" onSubmit={submit}>
                            <div className="owner-login-row">
                                <InputLabel htmlFor="email" value="Email" />

                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(event) =>
                                        setData('email', event.target.value)
                                    }
                                />

                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>

                            <div className="owner-login-row">
                                <InputLabel
                                    htmlFor="password"
                                    value="Password"
                                />

                                <div className="relative mt-1">
                                    <TextInput
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        className="block w-full pe-12"
                                        autoComplete="current-password"
                                        onChange={(event) =>
                                            setData('password', event.target.value)
                                        }
                                    />
                                    <button
                                        type="button"
                                        className="owner-login-password-toggle absolute inset-y-0 right-0 me-2 my-1 inline-flex items-center rounded px-2"
                                        onClick={() => setShowPassword((value) => !value)}
                                        aria-label={
                                            showPassword ? 'Hide password' : 'Show password'
                                        }
                                        aria-pressed={showPassword}
                                    >
                                        {showPassword ? (
                                            <EyeOff size={16} aria-hidden="true" />
                                        ) : (
                                            <Eye size={16} aria-hidden="true" />
                                        )}
                                        <span className="sr-only">
                                            {showPassword ? 'Hide password' : 'Show password'}
                                        </span>
                                    </button>
                                </div>

                                <InputError
                                    message={errors.password}
                                    className="mt-2"
                                />
                            </div>

                            <div className="owner-login-row">
                                <label className="flex items-center">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(
                                            event: ChangeEvent<HTMLInputElement>,
                                        ) =>
                                            setData(
                                                'remember',
                                                event.target.checked,
                                            )
                                        }
                                    />
                                    <span className="owner-login-remember-label">
                                        Remember me
                                    </span>
                                </label>
                            </div>

                            <div className="owner-login-actions">
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="owner-login-link"
                                    >
                                        Forgot your password?
                                    </Link>
                                )}

                                <PrimaryButton
                                    className={`owner-login-submit ${canResetPassword ? '' : 'ms-auto'}`}
                                    disabled={processing}
                                >
                                    Log in
                                </PrimaryButton>
                            </div>
                        </form>
                    </section>
                </div>
            </section>
        </GuestLayout>
    );
}
