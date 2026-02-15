<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(Request $request): Response
    {
        $projects = Project::query()
            ->published()
            ->orderedPublic()
            ->paginate(9)
            ->through(fn (Project $project) => $this->transformProjectCard($project))
            ->withQueryString();

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
            'filters' => [
                'page' => (int) $request->integer('page', 1),
            ],
            'contact' => $this->contactPayload(),
        ]);
    }

    public function show(Project $project): Response
    {
        abort_unless($project->is_published, 404);

        return Inertia::render('Projects/Show', [
            'project' => [
                'id' => $project->id,
                'title' => $project->title,
                'slug' => $project->slug,
                'summary' => $project->summary,
                'body' => $project->body,
                'stack' => $project->stack,
                'cover_image_url' => $project->cover_image_url,
                'repo_url' => $project->repo_url,
                'live_url' => $project->live_url,
                'published_at' => $project->published_at?->toDateString(),
            ],
            'contact' => $this->contactPayload(),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function transformProjectCard(Project $project): array
    {
        return [
            'id' => $project->id,
            'title' => $project->title,
            'slug' => $project->slug,
            'summary' => $project->summary,
            'stack' => $project->stack,
            'cover_image_url' => $project->cover_image_url,
            'published_at' => $project->published_at?->toDateString(),
        ];
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
