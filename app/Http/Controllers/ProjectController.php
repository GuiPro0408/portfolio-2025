<?php

namespace App\Http\Controllers;

use App\Actions\Projects\ResolvePublicProjectsIndex;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function __construct(
        private readonly ResolvePublicProjectsIndex $resolvePublicProjectsIndex,
    ) {}

    public function index(Request $request): Response
    {
        $filters = $this->resolvePublicProjectsIndex->normalizedFilters($request);
        $technologyTablesReady = $this->technologyTablesReady();

        return Inertia::render('Projects/Index', [
            'projects' => fn (): LengthAwarePaginator => $this->resolvePublicProjectsIndex->resolveProjectsPayload($filters, $technologyTablesReady),
            'filters' => $filters,
            'availableStacks' => fn (): array => $this->resolvePublicProjectsIndex->resolveAvailableStacks($technologyTablesReady),
            'contact' => $this->contactPayload(),
        ]);
    }

    public function show(Project $project): Response
    {
        abort_unless($project->is_published, 404);

        $technologyTablesReady = $this->technologyTablesReady();

        if ($technologyTablesReady) {
            $project->loadMissing('technologies');
        }

        return Inertia::render('Projects/Show', [
            'project' => [
                'id' => $project->id,
                'title' => $project->title,
                'slug' => $project->slug,
                'summary' => $project->summary,
                'body' => $project->body,
                'stack' => $this->resolvePublicProjectsIndex->projectStack($project, $technologyTablesReady),
                'cover_image_url' => $project->cover_image_url,
                'repo_url' => $project->repo_url,
                'live_url' => $project->live_url,
                'published_at' => $project->published_at?->toDateString(),
            ],
            'contact' => $this->contactPayload(),
        ]);
    }

    /**
     * @return array{email: mixed, linkedin: mixed, github: mixed}
     */
    private function contactPayload(): array
    {
        return [
            'email' => config('portfolio.email'),
            'linkedin' => config('portfolio.linkedin'),
            'github' => config('portfolio.github'),
        ];
    }
}
