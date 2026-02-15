import { Link } from '@inertiajs/react';

export default function HeroSection({ content, contact }) {
    return (
        <section className="public-shell section-block reveal">
            <div className="hero-grid card-surface">
                <div>
                    <p className="section-eyebrow">{content.eyebrow}</p>
                    <h1 className="hero-title">{content.title}</h1>
                    <p className="hero-description">{content.description}</p>

                    <div className="hero-actions">
                        <a href={`mailto:${contact.email}`} className="button-primary">
                            {content.primaryCta}
                        </a>
                        <Link href={route('projects.index')} className="button-secondary">
                            {content.secondaryCta}
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

                <aside className="hero-aside" aria-label="Value points">
                    <p className="hero-aside-title">Why teams work with me</p>
                    <ul className="hero-aside-list">
                        <li>Clear architecture with delivery discipline</li>
                        <li>Product mindset from planning to release</li>
                        <li>Strong backend and frontend execution</li>
                    </ul>
                </aside>
            </div>
        </section>
    );
}
