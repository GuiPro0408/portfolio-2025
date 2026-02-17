import CredibilityStrip from '@/Components/Home/CredibilityStrip';
import FeaturedProjectsGrid from '@/Components/Home/FeaturedProjectsGrid';
import HeroSection from '@/Components/Home/HeroSection';
import HomeCtaSection from '@/Components/Home/HomeCtaSection';
import ProcessSection from '@/Components/Home/ProcessSection';
import SkillsServicesSection from '@/Components/Home/SkillsServicesSection';
import PublicLayout from '@/Layouts/PublicLayout';
import { homeContent } from '@/data/homeContent';
import type { ContactPayload } from '@/types/contracts';
import type {
    FeaturedProjectSummary,
    HomepageSettingsPayload,
} from '@/types/home';
import { Head } from '@inertiajs/react';

interface WelcomePageProps {
    featuredProjects: FeaturedProjectSummary[];
    contact: ContactPayload;
    homepageSettings: HomepageSettingsPayload;
}

export default function Welcome({
    featuredProjects,
    contact,
    homepageSettings,
}: WelcomePageProps) {
    const metaDescription =
        homepageSettings?.hero_subheadline ??
        'Full-stack portfolio focused on clean architecture and practical product delivery.';
    const canonicalUrl = route('home');

    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Guillaume Juste',
        url: canonicalUrl,
        jobTitle: homepageSettings?.hero_eyebrow,
        description: metaDescription,
        sameAs: [contact?.linkedin, contact?.github].filter(Boolean),
    };

    return (
        <>
            <Head title="Portfolio">
                <meta name="description" content={metaDescription} />
                <meta property="og:title" content="Portfolio | Guillaume Juste" />
                <meta property="og:description" content={metaDescription} />
                <meta name="twitter:card" content="summary_large_image" />
                <link rel="canonical" href={canonicalUrl} />
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            </Head>

            <PublicLayout contact={contact}>
                <HeroSection
                    settings={homepageSettings}
                    content={homeContent}
                    contact={contact}
                />
                <CredibilityStrip items={homeContent.credibility} />
                <FeaturedProjectsGrid
                    projects={featuredProjects}
                    settings={homepageSettings}
                />
                <SkillsServicesSection
                    serviceOffers={homeContent.serviceOffers}
                    deliverables={homeContent.deliverables}
                    stackGroups={homeContent.stackGroups}
                    capabilityKpis={homeContent.capabilityKpis}
                    settings={homepageSettings}
                />
                <ProcessSection
                    steps={homeContent.process}
                    settings={homepageSettings}
                />
                <HomeCtaSection settings={homepageSettings} contact={contact} />
            </PublicLayout>
        </>
    );
}
