import CredibilityStrip from '@/Components/Home/CredibilityStrip';
import FeaturedProjectsGrid from '@/Components/Home/FeaturedProjectsGrid';
import HeroSection from '@/Components/Home/HeroSection';
import HomeCtaSection from '@/Components/Home/HomeCtaSection';
import ProcessSection from '@/Components/Home/ProcessSection';
import SkillsServicesSection from '@/Components/Home/SkillsServicesSection';
import PublicLayout from '@/Layouts/PublicLayout';
import { homeContent } from '@/data/homeContent';
import { Head } from '@inertiajs/react';

export default function Welcome({ featuredProjects, contact, homepageSettings }) {
    return (
        <>
            <Head title="Portfolio" />

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
                    services={homeContent.services}
                    stack={homeContent.stack}
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
