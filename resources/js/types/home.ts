export interface HomepageSettingsPayload {
    hero_eyebrow?: string | null;
    hero_headline?: string | null;
    hero_subheadline?: string | null;
    hero_primary_cta_label?: string | null;
    hero_secondary_cta_label?: string | null;
    hero_side_title?: string | null;
    hero_image_url?: string | null;
    featured_section_title?: string | null;
    featured_section_subtitle?: string | null;
    featured_image_1_url?: string | null;
    featured_image_2_url?: string | null;
    featured_image_3_url?: string | null;
    capabilities_title?: string | null;
    capabilities_subtitle?: string | null;
    capabilities_image_url?: string | null;
    process_title?: string | null;
    process_subtitle?: string | null;
    process_image_url?: string | null;
    final_cta_title?: string | null;
    final_cta_subtitle?: string | null;
    final_cta_button_label?: string | null;
}

export interface FeaturedProjectSummary {
    id: number;
    title: string;
    slug: string;
    summary: string;
    stack: string | null;
    cover_image_url: string | null;
    published_at?: string | null;
}

export interface HomeServiceOffer {
    title: string;
    promise: string;
    bullets: string[];
}

export interface HomeStackGroups {
    frontend: string[];
    backend: string[];
    dataDevops: string[];
}

export interface HomeProcessStep {
    title: string;
    description: string;
}

export interface HomeContent {
    heroBullets: string[];
    credibility: string[];
    serviceOffers: HomeServiceOffer[];
    deliverables: string[];
    stackGroups: HomeStackGroups;
    capabilityKpis: string[];
    process: HomeProcessStep[];
}
