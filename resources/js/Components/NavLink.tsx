import { Link } from '@inertiajs/react';
import type { ComponentProps, ReactNode } from 'react';

interface NavLinkProps extends ComponentProps<typeof Link> {
    active?: boolean;
    className?: string;
    children: ReactNode;
}

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}: NavLinkProps) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-indigo-400 text-gray-100 focus:border-indigo-300'
                    : 'border-transparent text-gray-400 hover:border-gray-600 hover:text-gray-200 focus:border-gray-600 focus:text-gray-200') +
                className
            }
        >
            {children}
        </Link>
    );
}
