import ImagePlaceholder from '@/Components/Home/ImagePlaceholder';
import SectionHeading from '@/Components/SectionHeading';
import type { HomeProcessStep, HomepageSettingsPayload } from '@/types/home';
import { useState } from 'react';

interface ProcessSectionProps {
    steps: HomeProcessStep[];
    settings: HomepageSettingsPayload;
}

export default function ProcessSection({ steps, settings }: ProcessSectionProps) {
    const [imageFailed, setImageFailed] = useState(false);

    return (
        <section className="public-shell section-block reveal" aria-label="Work process">
            <SectionHeading
                eyebrow="Process"
                title={settings.process_title ?? 'Process'}
                description={settings.process_subtitle ?? undefined}
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

            <div className="process-media-wrap">
                {settings.process_image_url && !imageFailed ? (
                    <img
                        src={settings.process_image_url}
                        alt="Process section visual"
                        className="section-media"
                        onError={() => setImageFailed(true)}
                    />
                ) : (
                    <ImagePlaceholder variant="section" label="Process Visual" />
                )}
            </div>
        </section>
    );
}
