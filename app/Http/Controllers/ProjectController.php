<?php

namespace App\Http\Controllers;

use App\Actions\Projects\SyncProjectTechnologies;
use App\Models\Project;
use App\Models\Technology;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $this->normalizedFilters($request);
        $technologyTablesReady = $this->technologyTablesReady();
        $normalizedSearch = SyncProjectTechnologies::normalizeToken($filters['q']);
        $selectedStacks = collect($this->parseStack($filters['stack']))
            ->map(fn (string $stack) => SyncProjectTechnologies::normalizeToken($stack))
            ->unique()
            ->values()
            ->all();

        $query = Project::query()
            ->published()
            ->when($technologyTablesReady, fn (Builder $builder) => $builder->with('technologies'))
            ->when($filters['q'] !== '', function (Builder $builder) use ($filters, $normalizedSearch): void {
                $builder->where(function (Builder $searchQuery) use ($filters, $normalizedSearch): void {
                    $searchQuery
                        ->where('title', 'like', '%'.$filters['q'].'%')
                        ->orWhere('summary', 'like', '%'.$filters['q'].'%');

                    if ($this->technologyTablesReady()) {
                        $searchQuery->orWhereHas('technologies', function (Builder $technologyQuery) use ($normalizedSearch): void {
                            $technologyQuery->where('name_normalized', 'like', '%'.$normalizedSearch.'%');
                        });
                    } else {
                        $searchQuery->orWhere('stack', 'like', '%'.$filters['q'].'%');
                    }
                });
            })
            ->when($selectedStacks !== [], function (Builder $builder) use ($selectedStacks, $technologyTablesReady): void {
                if ($technologyTablesReady) {
                    $builder->whereHas('technologies', function (Builder $technologyQuery) use ($selectedStacks): void {
                        $technologyQuery->whereIn('name_normalized', $selectedStacks);
                    });

                    return;
                }

                $builder->where(function (Builder $stackQuery) use ($selectedStacks): void {
                    foreach ($selectedStacks as $token) {
                        $stackQuery->orWhere('stack', 'like', '%'.$token.'%');
                    }
                });
            });

        $this->applySort($query, $filters['sort']);

        $projects = $query
            ->paginate(9)
            ->withQueryString()
            ->through(fn (Project $project) => $this->transformProjectCard($project));

        $availableStacks = $technologyTablesReady
            ? Technology::query()
                ->whereHas('projects', fn (Builder $builder) => $builder->where('is_published', true))
                ->orderBy('name')
                ->pluck('name')
                ->all()
            : Project::query()
                ->published()
                ->whereNotNull('stack')
                ->pluck('stack')
                ->flatMap(fn (?string $stack) => $this->parseStack($stack))
                ->unique()
                ->sort(SORT_NATURAL | SORT_FLAG_CASE)
                ->values()
                ->all();

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
            'filters' => $filters,
            'availableStacks' => $availableStacks,
            'contact' => $this->contactPayload(),
        ]);
    }

    public function show(Project $project): Response
    {
        abort_unless($project->is_published, 404);
        if ($this->technologyTablesReady()) {
            $project->loadMissing('technologies');
        }

        return Inertia::render('Projects/Show', [
            'project' => [
                'id' => $project->id,
                'title' => $project->title,
                'slug' => $project->slug,
                'summary' => $project->summary,
                'body' => $project->body,
                'stack' => $this->projectStack($project),
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
            'stack' => $this->projectStack($project),
            'cover_image_url' => $project->cover_image_url,
            'published_at' => $project->published_at?->toDateString(),
        ];
    }

    /**
     * @return array{q: string, stack: string, sort: string}
     */
    private function normalizedFilters(Request $request): array
    {
        $sort = (string) $request->query('sort', 'editorial');

        return [
            'q' => trim((string) $request->query('q', '')),
            'stack' => trim((string) $request->query('stack', '')),
            'sort' => in_array($sort, ['editorial', 'newest', 'oldest'], true)
                ? $sort
                : 'editorial',
        ];
    }

    /**
     * @return array<int, string>
     */
    private function parseStack(?string $stack): array
    {
        if (! is_string($stack) || trim($stack) === '') {
            return [];
        }

        return collect(explode(',', $stack))
            ->map(fn (string $token) => trim($token))
            ->filter(fn (string $token) => $token !== '')
            ->values()
            ->all();
    }

    private function applySort(Builder $query, string $sort): void
    {
        if ($sort === 'newest') {
            $query->orderByDesc('published_at')->orderByDesc('id');

            return;
        }

        if ($sort === 'oldest') {
            $query->orderBy('published_at')->orderBy('id');

            return;
        }

        $query->orderBy('sort_order')->orderByDesc('published_at')->orderByDesc('id');
    }

    private function projectStack(Project $project): ?string
    {
        if (
            $this->technologyTablesReady()
            && $project->relationLoaded('technologies')
            && $project->technologies->isNotEmpty()
        ) {
            return $project->technologies->pluck('name')->implode(', ');
        }

        return $project->stack;
    }

    private function technologyTablesReady(): bool
    {
        return Schema::hasTable('technologies') && Schema::hasTable('project_technology');
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
