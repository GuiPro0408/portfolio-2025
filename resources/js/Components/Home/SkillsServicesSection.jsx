import ImagePlaceholder from '@/Components/Home/ImagePlaceholder';
import SectionHeading from '@/Components/SectionHeading';
import { useState } from 'react';

export default function SkillsServicesSection({ services, stack, settings }) {
    const [imageFailed, setImageFailed] = useState(false);

    return (
        <section className="public-shell section-block reveal" aria-label="Capabilities">
            <SectionHeading
                eyebrow="Capabilities"
                title={settings.capabilities_title}
                description={settings.capabilities_subtitle}
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

            <div className="capabilities-media-wrap">
                {settings.capabilities_image_url && !imageFailed ? (
                    <img
                        src={settings.capabilities_image_url}
                        alt="Capabilities section visual"
                        className="section-media"
                        onError={() => setImageFailed(true)}
                    />
                ) : (
                    <ImagePlaceholder variant="section" label="Capabilities Visual" />
                )}
            </div>
        </section>
    );
}
