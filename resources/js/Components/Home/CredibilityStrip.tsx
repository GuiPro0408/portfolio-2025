interface CredibilityStripProps {
    items: string[];
}

export default function CredibilityStrip({ items }: CredibilityStripProps) {
    return (
        <section className="public-shell section-block reveal" aria-label="Credibility">
            <ul className="credibility-grid">
                {items.map((item) => (
                    <li key={item} className="credibility-item">
                        <span aria-hidden="true" className="credibility-dot" />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
}
