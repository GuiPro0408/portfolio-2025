export default function HomeCtaSection({ content, contact }) {
    return (
        <section className="public-shell section-block reveal" aria-label="Final call to action">
            <div className="card-surface cta-panel">
                <div>
                    <p className="section-eyebrow">Let us build something useful</p>
                    <h2 className="section-title">{content.title}</h2>
                    <p className="section-description">{content.description}</p>
                </div>

                <div className="cta-actions">
                    <a href={`mailto:${contact.email}`} className="button-primary">
                        {content.button}
                    </a>
                    <a href={contact.linkedin} target="_blank" rel="noreferrer" className="button-secondary">
                        LinkedIn
                    </a>
                </div>
            </div>
        </section>
    );
}
