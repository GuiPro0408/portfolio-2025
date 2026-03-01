import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DashboardPageHeader from '@/Components/Dashboard/DashboardPageHeader';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

interface EditProfilePageProps {
    mustVerifyEmail: boolean;
    status?: string;
    canDeleteAccount: boolean;
    canChangeEmail: boolean;
}

export default function Edit({ mustVerifyEmail, status, canDeleteAccount, canChangeEmail }: EditProfilePageProps) {
    return (
        <AuthenticatedLayout
            header={
                <DashboardPageHeader
                    title="Profile"
                    description="Manage your account identity, security settings, and account lifecycle."
                />
            }
        >
            <Head title="Profile" />

            <div className="py-10">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <div className="dashboard-panel p-4 shadow sm:rounded-xl sm:p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            canChangeEmail={canChangeEmail}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="dashboard-panel p-4 shadow sm:rounded-xl sm:p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="dashboard-panel p-4 shadow sm:rounded-xl sm:p-8">
                        {canDeleteAccount ? (
                            <DeleteUserForm className="max-w-xl" />
                        ) : (
                            <section className="max-w-xl space-y-3">
                                <h2 className="text-lg font-medium text-gray-900">
                                    Delete Account
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Account deletion is disabled for the configured owner account.
                                </p>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
