import ImagePlaceholder from '@/Components/Home/ImagePlaceholder';
import SectionHeading from '@/Components/SectionHeading';
import type {
    HomeServiceOffer,
    HomeStackGroups,
    HomepageSettingsPayload,
} from '@/types/home';
import { useState } from 'react';

interface StackClusterProps {
    title: string;
    items: string[];
}

function StackCluster({ title, items }: StackClusterProps) {
    return (
        <section>
            <h4 className="capability-cluster-title">{title}</h4>
            <ul className="tag-list" aria-label={`${title} technologies`}>
                {items.map((item) => (
                    <li key={`${title}-${item}`} className="tag-item">
                        {item}
                    </li>
                ))}
            </ul>
        </section>
    );
}

interface SkillsServicesSectionProps {
    serviceOffers: HomeServiceOffer[];
    deliverables: string[];
    stackGroups: HomeStackGroups;
    capabilityKpis: string[];
    settings: HomepageSettingsPayload;
}

export default function SkillsServicesSection({
    serviceOffers,
    deliverables,
    stackGroups,
    capabilityKpis,
    settings,
}: SkillsServicesSectionProps) {
    const [imageFailed, setImageFailed] = useState(false);

    return (
        <section className="public-shell section-block reveal" aria-label="Capabilities">
            <SectionHeading
                eyebrow="Capabilities"
                title={settings.capabilities_title ?? 'Capabilities'}
                description={settings.capabilities_subtitle ?? undefined}
            />

            <div className="services-offer-grid">
                {serviceOffers.map((offer) => (
                    <article key={offer.title} className="card-surface service-offer-card">
                        <h3 className="service-offer-title">{offer.title}</h3>
                        <p className="service-offer-promise">{offer.promise}</p>
                        <ul className="service-offer-bullets">
                            {offer.bullets.map((bullet) => (
                                <li key={`${offer.title}-${bullet}`}>{bullet}</li>
                            ))}
                        </ul>
                    </article>
                ))}
            </div>

            <div className="capabilities-grid mt-4">
                <article className="card-surface capability-card">
                    <h3 className="capability-title">Typical Deliverables</h3>
                    <ul className="deliverables-grid">
                        {deliverables.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </article>

                <article className="card-surface capability-card">
                    <h3 className="capability-title">Core Stack</h3>
                    <div className="stack-clusters">
                        <StackCluster title="Frontend" items={stackGroups.frontend} />
                        <StackCluster title="Backend" items={stackGroups.backend} />
                        <StackCluster title="Data / DevOps" items={stackGroups.dataDevops} />
                    </div>
                </article>
            </div>

            <ul className="capability-kpi-strip" aria-label="Delivery strengths">
                {capabilityKpis.map((kpi) => (
                    <li key={kpi}>{kpi}</li>
                ))}
            </ul>

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
                <p className="capabilities-media-caption">
                    From product intent to reliable release.
                </p>
            </div>
        </section>
    );
}
