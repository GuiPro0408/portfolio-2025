import ImagePlaceholder from '@/Components/Home/ImagePlaceholder';
import SectionHeading from '@/Components/SectionHeading';
import type { HomeProcessStep, HomepageSettingsPayload } from '@/types/home';
import React, { useState } from 'react';

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
                    <React.Fragment key={step.title}>
                        <li className="card-surface process-card">
                            <p className="process-step">0{index + 1}</p>
                            <h3 className="process-title">{step.title}</h3>
                            <p className="process-description">{step.description}</p>
                        </li>
                        {index < steps.length - 1 && (
                            <span className="process-connector" aria-hidden="true" />
                        )}
                    </React.Fragment>
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
