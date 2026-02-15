import CredibilityStrip from '@/Components/Home/CredibilityStrip';
import FeaturedProjectsGrid from '@/Components/Home/FeaturedProjectsGrid';
import HeroSection from '@/Components/Home/HeroSection';
import HomeCtaSection from '@/Components/Home/HomeCtaSection';
import ProcessSection from '@/Components/Home/ProcessSection';
import SkillsServicesSection from '@/Components/Home/SkillsServicesSection';
import PublicLayout from '@/Layouts/PublicLayout';
import { homeContent } from '@/data/homeContent';
import { Head } from '@inertiajs/react';

export default function Welcome({ featuredProjects, contact }) {
    return (
        <>
            <Head title="Portfolio" />

            <PublicLayout contact={contact}>
                <HeroSection content={homeContent.hero} contact={contact} />
                <CredibilityStrip items={homeContent.credibility} />
                <FeaturedProjectsGrid projects={featuredProjects} />
                <SkillsServicesSection
                    services={homeContent.services}
                    stack={homeContent.stack}
                />
                <ProcessSection steps={homeContent.process} />
                <HomeCtaSection content={homeContent.finalCta} contact={contact} />
            </PublicLayout>
        </>
    );
}
