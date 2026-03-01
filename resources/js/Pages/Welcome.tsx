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
    const personName = seo.person_name ?? 'Guillaume Juste';
    const jobTitle = seo.job_title ?? 'Software Engineer';
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

    const pageTitle = `${personName} — ${jobTitle}`;
    const ogTitle = `${personName} — ${jobTitle}`;

    const personStructuredData = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: personName,
        url: canonicalUrl,
        jobTitle: jobTitle,
        description: metaDescription,
        sameAs: [contact?.linkedin, contact?.github].filter(Boolean),
    };

    const websiteStructuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: seo.site_name ?? personName,
        url: canonicalUrl,
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: route('projects.index') + '?q={search_term_string}',
            },
            'query-input': 'required name=search_term_string',
        },
    };

    return (
        <>
            <Head title={pageTitle}>
                <meta name="description" content={metaDescription} />
                <meta name="author" content={personName} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={canonicalUrl} />
                {seo.site_name ? (
                    <meta property="og:site_name" content={seo.site_name} />
                ) : null}
                <meta property="og:title" content={ogTitle} />
                <meta property="og:description" content={metaDescription} />
                {socialImage ? <meta property="og:image" content={socialImage} /> : null}
                {socialImage ? <meta property="og:image:width" content="1200" /> : null}
                {socialImage ? <meta property="og:image:height" content="630" /> : null}
                {socialImage ? (
                    <meta
                        property="og:image:alt"
                        content={`${personName} portfolio cover image`}
                    />
                ) : null}
                <meta
                    name="twitter:card"
                    content={socialImage ? 'summary_large_image' : 'summary'}
                />
                <meta name="twitter:title" content={ogTitle} />
                <meta name="twitter:description" content={metaDescription} />
                {socialImage ? (
                    <meta name="twitter:image" content={socialImage} />
                ) : null}
                <link rel="canonical" href={canonicalUrl} />
                <script type="application/ld+json">
                    {JSON.stringify(personStructuredData)}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify(websiteStructuredData)}
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
