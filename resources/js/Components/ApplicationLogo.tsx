import type { SVGProps } from 'react';

export default function ApplicationLogo(props: SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <title>Guillaume Juste logo</title>
            <rect
                x="6"
                y="6"
                width="52"
                height="52"
                rx="12"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
            />
            <path
                d="M30 20h-8a6 6 0 0 0-6 6v12a6 6 0 0 0 6 6h8v-8h-7"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4"
            />
            <path
                d="M46 20v18a6 6 0 0 1-6 6h-8"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4"
            />
            <circle cx="46" cy="20" r="2" fill="currentColor" />
        </svg>
    );
}
