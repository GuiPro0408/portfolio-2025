<?php

namespace App\Http\Controllers;

use App\Models\HomepageSettings;
use App\Models\Project;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $homepageSettings = HomepageSettings::current();

        $featuredProjects = Project::query()
            ->published()
            ->where('is_featured', true)
            ->orderedPublic()
            ->limit(3)
            ->get()
            ->map(fn (Project $project) => [
                'id' => $project->id,
                'title' => $project->title,
                'slug' => $project->slug,
                'summary' => $project->summary,
                'stack' => $project->stack,
                'cover_image_url' => $project->cover_image_url,
                'published_at' => $project->published_at?->toDateString(),
            ]);

        return Inertia::render('Welcome', [
            'featuredProjects' => $featuredProjects,
            'contact' => [
                'email' => config('portfolio.email'),
                'linkedin' => config('portfolio.linkedin'),
                'github' => config('portfolio.github'),
            ],
            'homepageSettings' => $homepageSettings->only([
                'hero_eyebrow',
                'hero_headline',
                'hero_subheadline',
                'hero_primary_cta_label',
                'hero_secondary_cta_label',
                'hero_side_title',
                'featured_section_title',
                'featured_section_subtitle',
                'capabilities_title',
                'capabilities_subtitle',
                'process_title',
                'process_subtitle',
                'final_cta_title',
                'final_cta_subtitle',
                'final_cta_button_label',
                'hero_image_url',
                'featured_image_1_url',
                'featured_image_2_url',
                'featured_image_3_url',
                'capabilities_image_url',
                'process_image_url',
            ]),
        ]);
    }
}
