<?php

namespace App\Http\Controllers;

use App\Models\HomepageSettings;
use App\Models\Project;
use App\Support\PublicCacheKeys;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $payload = Cache::remember(
            PublicCacheKeys::HOME_PAYLOAD,
            now()->addMinutes(10),
            function (): array {
                $homepageSettings = HomepageSettings::current();
                $technologyTablesReady = $this->technologyTablesReady();

                $featuredQuery = Project::query()
                    ->published()
                    ->where('is_featured', true)
                    ->orderedPublic()
                    ->limit(3);

                if ($technologyTablesReady) {
                    $featuredQuery->with('technologies');
                }

                $featuredProjects = $featuredQuery
                    ->get()
                    ->map(fn (Project $project) => [
                        'id' => $project->id,
                        'title' => $project->title,
                        'slug' => $project->slug,
                        'summary' => $project->summary,
                        'stack' => $technologyTablesReady && $project->technologies->isNotEmpty()
                            ? $project->technologies->pluck('name')->implode(', ')
                            : $project->stack,
                        'cover_image_url' => $project->cover_image_url,
                        'published_at' => $project->published_at?->toDateString(),
                    ])
                    ->values()
                    ->all();

                return [
                    'featuredProjects' => $featuredProjects,
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
                ];
            }
        );

        return Inertia::render('Welcome', [
            ...$payload,
            'contact' => [
                'email' => config('portfolio.email'),
                'linkedin' => config('portfolio.linkedin'),
                'github' => config('portfolio.github'),
            ],
        ]);
    }

    private function technologyTablesReady(): bool
    {
        return Schema::hasTable('technologies') && Schema::hasTable('project_technology');
    }
}
