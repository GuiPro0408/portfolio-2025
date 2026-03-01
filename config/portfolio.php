<?php

return [
    'email' => env('PORTFOLIO_EMAIL', 'guillaume.juste0408@gmail.com'),
    'owner_email' => env('PORTFOLIO_OWNER_EMAIL', ''),
    'owner_password' => env('PORTFOLIO_OWNER_PASSWORD', ''),
    'seed_projects' => env('PORTFOLIO_SEED_PROJECTS'),
    'replay_guard_ttl' => env('PORTFOLIO_REPLAY_GUARD_TTL', 10),
    'linkedin' => env('PORTFOLIO_LINKEDIN', 'https://www.linkedin.com/in/guillaume-juste-developer'),
    'github' => env('PORTFOLIO_GITHUB', 'https://github.com/GuiPro0408'),
    'social_default_image' => env('PORTFOLIO_SOCIAL_DEFAULT_IMAGE', '/images/homepage/hero/hero-studio-16x10.webp'),
    'social_site_name' => env('PORTFOLIO_SOCIAL_SITE_NAME', 'Guillaume Juste Portfolio'),
    'person_name' => env('PORTFOLIO_PERSON_NAME', 'Guillaume Juste'),
    'job_title' => env('PORTFOLIO_JOB_TITLE', 'Software Engineer'),
];
