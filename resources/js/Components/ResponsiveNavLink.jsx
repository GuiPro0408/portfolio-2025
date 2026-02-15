import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${
                active
                    ? 'border-indigo-400 bg-indigo-950/60 text-indigo-200 focus:border-indigo-300 focus:bg-indigo-900/80 focus:text-indigo-100'
                    : 'border-transparent text-gray-300 hover:border-gray-700 hover:bg-gray-900 hover:text-gray-100 focus:border-gray-700 focus:bg-gray-900 focus:text-gray-100'
            } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
