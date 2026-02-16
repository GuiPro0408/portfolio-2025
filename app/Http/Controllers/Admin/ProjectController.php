<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Projects\SyncProjectTechnologies;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectFlagsRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Requests\UpdateProjectSortRequest;
use App\Models\Project;
use App\Support\PublicCacheKeys;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder as BaseBuilder;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function __construct(
        private readonly SyncProjectTechnologies $syncProjectTechnologies,
    ) {}

    public function index(Request $request): Response
    {
        $filters = $this->normalizedFilters($request);

        return Inertia::render('Dashboard/Projects/Index', [
            'projects' => fn (): LengthAwarePaginator => $this->resolveProjectsPayload($filters),
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
        $project = Project::create($request->validated());
        if ($this->technologyTablesReady()) {
            $this->syncProjectTechnologies->sync($project, $project->stack);
        }
        $this->clearPublicCaches();

        return redirect()
            ->route('dashboard.projects.index')
            ->with('success', 'Project created successfully.');
    }

    public function edit(Project $project): Response
    {
        $technologyTablesReady = $this->technologyTablesReady();

        if ($technologyTablesReady) {
            $project->loadMissing('technologies');
        }

        return Inertia::render('Dashboard/Projects/Edit', [
            'project' => [
                'id' => $project->id,
                'title' => $project->title,
                'slug' => $project->slug,
                'summary' => $project->summary,
                'body' => $project->body,
                'stack' => $technologyTablesReady && $project->technologies->isNotEmpty()
                    ? $project->technologies->pluck('name')->implode(', ')
                    : $project->stack,
                'cover_image_url' => $project->cover_image_url,
                'repo_url' => $project->repo_url,
                'live_url' => $project->live_url,
                'is_featured' => $project->is_featured,
                'is_published' => $project->is_published,
                'published_at' => $project->published_at?->format('Y-m-d'),
                'sort_order' => $project->sort_order,
            ],
        ]);
    }

    public function update(UpdateProjectRequest $request, Project $project)
    {
        $project->update($request->validated());
        if ($this->technologyTablesReady()) {
            $this->syncProjectTechnologies->sync($project, $project->stack);
        }
        $this->clearPublicCaches();

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
        $this->clearPublicCaches();

        return back()->with('success', 'Project status updated.');
    }

    public function destroy(Project $project)
    {
        $project->delete();
        $this->clearPublicCaches();

        return redirect()
            ->route('dashboard.projects.index')
            ->with('success', 'Project deleted successfully.');
    }

    public function duplicate(Project $project)
    {
        $technologyTablesReady = $this->technologyTablesReady();

        if ($technologyTablesReady) {
            $project->loadMissing('technologies');
        }

        $originalTechnologyIds = $technologyTablesReady
            ? $project->technologies->pluck('id')->all()
            : [];

        $stackMirror = $technologyTablesReady && $project->technologies->isNotEmpty()
            ? $project->technologies->pluck('name')->implode(', ')
            : $project->stack;

        $copy = $project->replicate();
        $copy->title = $project->title.' (Copy)';
        $copy->slug = $this->generateUniqueCopySlug($project->slug);
        $copy->is_featured = false;
        $copy->is_published = false;
        $copy->published_at = null;
        $copy->stack = $stackMirror;
        $copy->save();

        if ($technologyTablesReady) {
            if ($originalTechnologyIds !== []) {
                $copy->technologies()->sync($originalTechnologyIds);
            } else {
                $this->syncProjectTechnologies->sync($copy, $copy->stack);
            }
        }
        $this->clearPublicCaches();

        return redirect()
            ->route('dashboard.projects.edit', $copy)
            ->with('success', 'Project duplicated successfully.');
    }

    public function updateSort(UpdateProjectSortRequest $request, Project $project)
    {
        $project->update([
            'sort_order' => $request->validated('sort_order'),
        ]);
        $this->clearPublicCaches();

        return back()->with('success', 'Project sort order updated.');
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

    /**
     * @param  EloquentBuilder<Project>|BaseBuilder  $query
     */
    private function applySort(EloquentBuilder|BaseBuilder $query, string $sort): void
    {
        match ($sort) {
            'updated_desc' => $query->orderByDesc('updated_at'),
            'updated_asc' => $query->orderBy('updated_at'),
            'title_asc' => $query->orderBy('title'),
            'title_desc' => $query->orderByDesc('title'),
            default => $query->orderBy('sort_order')->orderByDesc('updated_at'),
        };
    }

    private function generateUniqueCopySlug(string $originalSlug): string
    {
        $baseSlug = Str::slug($originalSlug).'-copy';
        $slug = $baseSlug;
        $counter = 2;

        while (Project::query()->where('slug', $slug)->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }

    private function clearPublicCaches(): void
    {
        foreach (PublicCacheKeys::homePayloadVariants() as $homePayloadKey) {
            Cache::forget($homePayloadKey);
        }

        Cache::forget(PublicCacheKeys::SITEMAP_XML);
    }

    /**
     * @param  array{q: string, status: string, featured: string, sort: string}  $filters
     */
    private function resolveProjectsPayload(array $filters): LengthAwarePaginator
    {
        return Project::query()
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
    }
}
