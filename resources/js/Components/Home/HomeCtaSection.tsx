import { Link } from '@inertiajs/react';
import type { ContactPayload } from '@/types/contracts';
import type { HomepageSettingsPayload } from '@/types/home';

interface HomeCtaSectionProps {
    settings: HomepageSettingsPayload;
    contact: ContactPayload;
}

export default function HomeCtaSection({ settings, contact }: HomeCtaSectionProps) {
    return (
        <section className="public-shell section-block reveal" aria-label="Final call to action">
            <div className="card-surface cta-panel">
                <div>
                    <p className="section-eyebrow">Let us build something useful</p>
                    <h2 className="section-title">{settings.final_cta_title ?? ''}</h2>
                    <p className="section-description">
                        {settings.final_cta_subtitle ?? ''}
                    </p>
                </div>

                <div className="cta-actions">
                    <Link href={route('contact.index')} className="button-primary">
                        {settings.final_cta_button_label ?? 'Contact'}
                    </Link>
                    {contact.linkedin ? (
                        <a
                            href={contact.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="button-secondary"
                        >
                            LinkedIn
                        </a>
                    ) : null}
                </div>
            </div>
        </section>
    );
}
