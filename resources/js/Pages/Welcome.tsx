import CredibilityStrip from '@/Components/Home/CredibilityStrip';
import FeaturedProjectsGrid from '@/Components/Home/FeaturedProjectsGrid';
import HeroSection from '@/Components/Home/HeroSection';
import HomeCtaSection from '@/Components/Home/HomeCtaSection';
import ProcessSection from '@/Components/Home/ProcessSection';
import SkillsServicesSection from '@/Components/Home/SkillsServicesSection';
import PublicLayout from '@/Layouts/PublicLayout';
import { homeContent } from '@/data/homeContent';
import type { ContactPayload, SharedPageProps } from '@/types/contracts';
import type {
    FeaturedProjectSummary,
    HomepageSettingsPayload,
} from '@/types/home';
import { Head, usePage } from '@inertiajs/react';
import { resolveSocialImage } from '@/utils/seo';

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
    const { seo = {} } = usePage<SharedPageProps>().props;
    const metaDescription =
        homepageSettings?.hero_subheadline ??
        'Full-stack portfolio focused on clean architecture and practical product delivery.';
    const canonicalUrl = route('home');
    const socialImage = resolveSocialImage(
        [
            homepageSettings?.hero_image_url,
            featuredProjects[0]?.cover_image_url,
        ],
        seo.social_default_image,
        canonicalUrl,
    );

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
                <meta property="og:type" content="website" />
                <meta property="og:url" content={canonicalUrl} />
                {seo.site_name ? (
                    <meta property="og:site_name" content={seo.site_name} />
                ) : null}
                <meta property="og:title" content="Portfolio | Guillaume Juste" />
                <meta property="og:description" content={metaDescription} />
                {socialImage ? <meta property="og:image" content={socialImage} /> : null}
                {socialImage ? (
                    <meta
                        property="og:image:alt"
                        content="Guillaume Juste portfolio cover image"
                    />
                ) : null}
                <meta
                    name="twitter:card"
                    content={socialImage ? 'summary_large_image' : 'summary'}
                />
                <meta name="twitter:title" content="Portfolio | Guillaume Juste" />
                <meta name="twitter:description" content={metaDescription} />
                {socialImage ? (
                    <meta name="twitter:image" content={socialImage} />
                ) : null}
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
