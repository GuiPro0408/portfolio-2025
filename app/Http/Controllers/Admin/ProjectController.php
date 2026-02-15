<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectFlagsRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Project;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $this->normalizedFilters($request);

        $projects = Project::query()
            ->when($filters['q'] !== '', function ($query) use ($filters) {
                $query->where(function ($searchQuery) use ($filters) {
                    $searchQuery
                        ->where('title', 'like', '%'.$filters['q'].'%')
                        ->orWhere('slug', 'like', '%'.$filters['q'].'%');
                });
            })
            ->when($filters['status'] !== 'all', function ($query) use ($filters) {
                $query->where('is_published', $filters['status'] === 'published');
            })
            ->when($filters['featured'] !== 'all', function ($query) use ($filters) {
                $query->where('is_featured', $filters['featured'] === 'featured');
            })
            ->tap(fn ($query) => $this->applySort($query, $filters['sort']))
            ->paginate(15)
            ->withQueryString()
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
            'filters' => $filters,
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

    public function updateFlags(UpdateProjectFlagsRequest $request, Project $project)
    {
        $validated = $request->validated();

        $project->is_featured = $validated['is_featured'];
        $project->is_published = $validated['is_published'];

        if ($project->is_published && $project->published_at === null) {
            $project->published_at = now();
        }

        if (! $project->is_published) {
            $project->published_at = null;
        }

        $project->save();

        return back()->with('success', 'Project status updated.');
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

    /**
     * @return array{q: string, status: string, featured: string, sort: string}
     */
    private function normalizedFilters(Request $request): array
    {
        $status = (string) $request->query('status', 'all');
        $featured = (string) $request->query('featured', 'all');
        $sort = (string) $request->query('sort', 'sort_order_asc');

        return [
            'q' => trim((string) $request->query('q', '')),
            'status' => in_array($status, ['all', 'published', 'draft'], true) ? $status : 'all',
            'featured' => in_array($featured, ['all', 'featured', 'not_featured'], true) ? $featured : 'all',
            'sort' => in_array($sort, ['updated_desc', 'updated_asc', 'title_asc', 'title_desc', 'sort_order_asc'], true)
                ? $sort
                : 'sort_order_asc',
        ];
    }

    private function applySort(Builder $query, string $sort): void
    {
        match ($sort) {
            'updated_desc' => $query->orderByDesc('updated_at'),
            'updated_asc' => $query->orderBy('updated_at'),
            'title_asc' => $query->orderBy('title'),
            'title_desc' => $query->orderByDesc('title'),
            default => $query->orderBy('sort_order')->orderByDesc('updated_at'),
        };
    }
}
