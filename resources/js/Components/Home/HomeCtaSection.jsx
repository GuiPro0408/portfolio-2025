export default function HomeCtaSection({ settings, contact }) {
    return (
        <section className="public-shell section-block reveal" aria-label="Final call to action">
            <div className="card-surface cta-panel">
                <div>
                    <p className="section-eyebrow">Let us build something useful</p>
                    <h2 className="section-title">{settings.final_cta_title}</h2>
                    <p className="section-description">{settings.final_cta_subtitle}</p>
                </div>

                <div className="cta-actions">
                    <a href={`mailto:${contact.email}`} className="button-primary">
                        {settings.final_cta_button_label}
                    </a>
                    <a href={contact.linkedin} target="_blank" rel="noreferrer" className="button-secondary">
                        LinkedIn
                    </a>
                </div>
            </div>
        </section>
    );
}
