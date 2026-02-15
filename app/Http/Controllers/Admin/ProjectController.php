<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Project;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(): Response
    {
        $projects = Project::query()
            ->orderBy('sort_order')
            ->orderByDesc('updated_at')
            ->paginate(15)
            ->through(fn (Project $project) => [
                'id' => $project->id,
                'title' => $project->title,
                'slug' => $project->slug,
                'is_published' => $project->is_published,
                'is_featured' => $project->is_featured,
                'sort_order' => $project->sort_order,
                'updated_at' => $project->updated_at->toDateTimeString(),
            ]);

        return Inertia::render('Dashboard/Projects/Index', [
            'projects' => $projects,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Dashboard/Projects/Create', [
            'project' => $this->emptyProject(),
        ]);
    }

    public function store(StoreProjectRequest $request)
    {
        Project::create($request->validated());

        return redirect()
            ->route('dashboard.projects.index')
            ->with('success', 'Project created successfully.');
    }

    public function edit(Project $project): Response
    {
        return Inertia::render('Dashboard/Projects/Edit', [
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
                'is_featured' => $project->is_featured,
                'is_published' => $project->is_published,
                'published_at' => $project->published_at?->format('Y-m-d\TH:i'),
                'sort_order' => $project->sort_order,
            ],
        ]);
    }

    public function update(UpdateProjectRequest $request, Project $project)
    {
        $project->update($request->validated());

        return redirect()
            ->route('dashboard.projects.index')
            ->with('success', 'Project updated successfully.');
    }

    public function destroy(Project $project)
    {
        $project->delete();

        return redirect()
            ->route('dashboard.projects.index')
            ->with('success', 'Project deleted successfully.');
    }

    /**
     * @return array<string, mixed>
     */
    private function emptyProject(): array
    {
        return [
            'title' => '',
            'slug' => '',
            'summary' => '',
            'body' => '',
            'stack' => '',
            'cover_image_url' => '',
            'repo_url' => '',
            'live_url' => '',
            'is_featured' => false,
            'is_published' => false,
            'published_at' => '',
            'sort_order' => 0,
        ];
    }
}
