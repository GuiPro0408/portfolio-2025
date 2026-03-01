import ImagePlaceholder from '@/Components/Home/ImagePlaceholder';
import type { ContactPayload } from '@/types/contracts';
import type { HomeContent, HomepageSettingsPayload } from '@/types/home';
import { buildSrcset } from '@/utils/images';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

interface HeroSectionProps {
    settings: HomepageSettingsPayload;
    content: HomeContent;
    contact: ContactPayload;
}

export default function HeroSection({
    settings,
    content,
    contact,
}: HeroSectionProps) {
    const [imageFailed, setImageFailed] = useState(false);
    const hasLinkedIn = Boolean(contact.linkedin);
    const hasGithub = Boolean(contact.github);
    const heroImageAlt = settings.hero_headline
        ? `${settings.hero_headline} hero visual`
        : 'Portfolio hero visual';
    const heroSrcSet = buildSrcset(settings.hero_image_url);

    return (
        <section className="public-shell section-block reveal">
            <div className="hero-grid card-surface">
                <div>
                    <p className="section-eyebrow">{settings.hero_eyebrow ?? ''}</p>
                    <h1 className="hero-title">{settings.hero_headline ?? ''}</h1>
                    <p className="hero-description">
                        {settings.hero_subheadline ?? ''}
                    </p>

                    <div className="hero-actions">
                        <Link href={route('contact.index')} className="button-primary">
                            {settings.hero_primary_cta_label ?? 'Contact'}
                        </Link>
                        <Link href={route('projects.index')} className="button-secondary">
                            {settings.hero_secondary_cta_label ?? 'Projects'}
                        </Link>
                    </div>

                    <div className="hero-support-links">
                        {hasLinkedIn ? (
                            <a href={contact.linkedin!} target="_blank" rel="noreferrer">
                                LinkedIn
                            </a>
                        ) : null}
                        {hasLinkedIn && hasGithub ? (
                            <span aria-hidden="true">/</span>
                        ) : null}
                        {hasGithub ? (
                            <a href={contact.github!} target="_blank" rel="noreferrer">
                                GitHub
                            </a>
                        ) : null}
                    </div>
                </div>

                <aside className="hero-aside" aria-label="Hero side panel">
                    <p className="hero-aside-title">{settings.hero_side_title ?? ''}</p>

                    {!settings.hero_image_url || imageFailed ? (
                        <ImagePlaceholder variant="hero" label="Studio Preview" />
                    ) : (
                        <img
                            src={settings.hero_image_url}
                            srcSet={heroSrcSet}
                            sizes="(min-width: 900px) 576px, calc(100vw - 2rem)"
                            alt={heroImageAlt}
                            className="hero-media"
                            loading="eager"
                            fetchpriority="high"
                            decoding="async"
                            width="16"
                            height="10"
                            onError={() => setImageFailed(true)}
                        />
                    )}

                    <ul className="hero-aside-list">
                        {content.heroBullets.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </aside>
            </div>
        </section>
    );
}
