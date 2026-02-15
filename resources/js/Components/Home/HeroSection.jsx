import ImagePlaceholder from '@/Components/Home/ImagePlaceholder';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function HeroSection({ settings, content, contact }) {
    const [imageFailed, setImageFailed] = useState(false);

    return (
        <section className="public-shell section-block reveal">
            <div className="hero-grid card-surface">
                <div>
                    <p className="section-eyebrow">{settings.hero_eyebrow}</p>
                    <h1 className="hero-title">{settings.hero_headline}</h1>
                    <p className="hero-description">{settings.hero_subheadline}</p>

                    <div className="hero-actions">
                        <Link href={route('contact.index')} className="button-primary">
                            {settings.hero_primary_cta_label}
                        </Link>
                        <Link href={route('projects.index')} className="button-secondary">
                            {settings.hero_secondary_cta_label}
                        </Link>
                    </div>

                    <div className="hero-support-links">
                        <a href={contact.linkedin} target="_blank" rel="noreferrer">
                            LinkedIn
                        </a>
                        <span aria-hidden="true">/</span>
                        <a href={contact.github} target="_blank" rel="noreferrer">
                            GitHub
                        </a>
                    </div>
                </div>

                <aside className="hero-aside" aria-label="Hero side panel">
                    <p className="hero-aside-title">{settings.hero_side_title}</p>

                    {!settings.hero_image_url || imageFailed ? (
                        <ImagePlaceholder variant="hero" label="Studio Preview" />
                    ) : (
                        <img
                            src={settings.hero_image_url}
                            alt="Homepage hero visual"
                            className="hero-media"
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
