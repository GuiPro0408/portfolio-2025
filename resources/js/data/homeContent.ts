import type { HomeContent } from '@/types/home';

export const homeContent: HomeContent = {
    heroBullets: [
        'Clear architecture with delivery discipline',
        'Product mindset from planning to release',
        'Strong backend and frontend execution',
    ],
    credibility: [
        'Based in Mauritius, collaborating globally',
        'Laravel + React with production-first thinking',
        'Fast iteration cycles with clear communication',
        'From idea to shipped feature with measurable outcomes',
    ],
    serviceOffers: [
        {
            title: 'Build new product',
            promise: 'From idea to first production release with clear scope.',
            bullets: ['MVP architecture', 'Ship-ready foundations'],
        },
        {
            title: 'Modernize existing app',
            promise: 'Improve UX and maintainability without risky rewrites.',
            bullets: ['Incremental refactor', 'Interface refresh'],
        },
        {
            title: 'Stabilize and scale backend',
            promise: 'Harden data flows and performance for growth.',
            bullets: ['API reliability', 'Operational guardrails'],
        },
        {
            title: 'Fractional delivery support',
            promise: 'Plug into your roadmap with practical weekly execution.',
            bullets: ['Transparent progress', 'Outcome-focused iterations'],
        },
    ],
    deliverables: [
        'Architecture blueprint',
        'MVP delivery plan',
        'Admin workflow setup',
        'Production release checklist',
    ],
    stackGroups: {
        frontend: ['React', 'JavaScript ES6', 'SASS / CSS', 'Tailwind CSS', 'Figma', 'StimulusJS'],
        backend: ['Laravel / PHP', 'Ruby on Rails', 'Python / Django', 'Next.js', 'WordPress'],
        dataDevops: ['PostgreSQL', 'MySQL', 'SQLite', 'Docker', 'Vercel', 'Heroku', 'GitHub / GitLab'],
    },
    capabilityKpis: [
        'Fast onboarding',
        'Clear weekly delivery',
        'Production-first quality',
    ],
    process: [
        {
            title: 'Discover',
            description:
                'Define goals, constraints, and scope with clear acceptance criteria.',
        },
        {
            title: 'Build',
            description:
                'Ship in focused slices with robust validation, testing, and clean boundaries.',
        },
        {
            title: 'Iterate',
            description:
                'Use feedback and metrics to improve performance, UX, and product impact.',
        },
    ],
};
