import SectionHeading from '@/Components/SectionHeading';

export default function SkillsServicesSection({ services, stack }) {
    return (
        <section className="public-shell section-block reveal" aria-label="Capabilities">
            <SectionHeading
                eyebrow="Capabilities"
                title="What I Build"
                description="Practical product development from business idea to reliable release."
            />

            <div className="capabilities-grid">
                <article className="card-surface capability-card">
                    <h3 className="capability-title">Services</h3>
                    <ul className="bullet-list">
                        {services.map((service) => (
                            <li key={service}>{service}</li>
                        ))}
                    </ul>
                </article>

                <article className="card-surface capability-card">
                    <h3 className="capability-title">Core Stack</h3>
                    <ul className="tag-list" aria-label="Core technologies">
                        {stack.map((tool) => (
                            <li key={tool} className="tag-item">
                                {tool}
                            </li>
                        ))}
                    </ul>
                </article>
            </div>
        </section>
    );
}
