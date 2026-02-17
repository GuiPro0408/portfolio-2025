<?php

namespace App\Actions\Home;

use App\Models\HomepageSettings;
use App\Models\Project;
use App\Support\HomepageSettingsContract;
use App\Support\PublicCacheKeys;
use Illuminate\Support\Facades\Cache;

class ResolveHomePayload
{
    /**
     * @return array{featuredProjects: array<int, array<string, mixed>>, homepageSettings: array<string, mixed>}
     */
    public function resolve(): array
    {
        return Cache::remember(
            PublicCacheKeys::homePayload(),
            now()->addMinutes(10),
            function (): array {
                $homepageSettings = HomepageSettings::current();

                $featuredQuery = Project::query()
                    ->published()
                    ->where('is_featured', true)
                    ->orderedPublic()
                    ->with('technologies')
                    ->limit(3);

                $featuredProjects = $featuredQuery
                    ->get()
                    ->map(fn (Project $project) => [
                        'id' => $project->id,
                        'title' => $project->title,
                        'slug' => $project->slug,
                        'summary' => $project->summary,
                        'stack' => $project->technologies->isNotEmpty()
                            ? $project->technologies->pluck('name')->implode(', ')
                            : $project->stack,
                        'cover_image_url' => $project->cover_image_url,
                        'published_at' => $project->published_at?->toDateString(),
                    ])
                    ->values()
                    ->all();

                return [
                    'featuredProjects' => $featuredProjects,
                    'homepageSettings' => HomepageSettingsContract::publicPayload($homepageSettings),
                ];
            }
        );
    }
}
