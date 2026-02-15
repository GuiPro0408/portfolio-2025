import SectionHeading from '@/Components/SectionHeading';

export default function ProcessSection({ steps }) {
    return (
        <section className="public-shell section-block reveal" aria-label="Work process">
            <SectionHeading
                eyebrow="Process"
                title="How I Work"
                description="A lightweight, transparent process built for speed and quality."
            />

            <ol className="process-grid">
                {steps.map((step, index) => (
                    <li key={step.title} className="card-surface process-card">
                        <p className="process-step">0{index + 1}</p>
                        <h3 className="process-title">{step.title}</h3>
                        <p className="process-description">{step.description}</p>
                    </li>
                ))}
            </ol>
        </section>
    );
}
