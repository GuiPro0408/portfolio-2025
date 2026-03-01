import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import StickyActionBar from '@/Components/Dashboard/StickyActionBar';
import TextInput from '@/Components/TextInput';
import type { AuthenticatedPageProps } from '@/types/contracts';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';

interface UpdateProfileInformationFormProps {
    mustVerifyEmail: boolean;
    status?: string;
    canChangeEmail?: boolean;
    className?: string;
}

interface UpdateProfileFormData {
    name: string;
    email: string;
}

export default function UpdateProfileInformationForm({
    mustVerifyEmail,
    status,
    canChangeEmail = true,
    className = '',
}: UpdateProfileInformationFormProps) {
    const user = usePage<AuthenticatedPageProps>().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm<UpdateProfileFormData>({
            name: user.name,
            email: user.email,
        });

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={canChangeEmail ? (e) => setData('email', e.target.value) : undefined}
                        readOnly={!canChangeEmail}
                        required
                        autoComplete="username"
                    />

                    {!canChangeEmail && (
                        <p className="mt-1 text-xs text-gray-500">
                            Email is fixed to the configured owner address and cannot be changed here.
                        </p>
                    )}

                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <StickyActionBar>
                    <div className="dashboard-sticky-actions-inner">
                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p>Saved.</p>
                        </Transition>
                        <PrimaryButton disabled={processing}>Save</PrimaryButton>
                    </div>
                </StickyActionBar>
            </form>
        </section>
    );
}
