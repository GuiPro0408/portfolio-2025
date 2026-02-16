<?php

namespace App\Http\Controllers;

use App\Actions\Projects\SyncProjectTechnologies;
use App\Models\Project;
use App\Models\Technology;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder as BaseBuilder;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $this->normalizedFilters($request);
        $technologyTablesReady = $this->technologyTablesReady();

        return Inertia::render('Projects/Index', [
            'projects' => fn (): LengthAwarePaginator => $this->resolveProjectsPayload($filters, $technologyTablesReady),
            'filters' => $filters,
            'availableStacks' => fn (): array => $this->resolveAvailableStacks($technologyTablesReady),
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

    /**
     * @param  EloquentBuilder<Project>|BaseBuilder  $query
     */
    private function applySort(EloquentBuilder|BaseBuilder $query, string $sort): void
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

    /**
     * @return array<int, string>
     */
    private function normalizeSelectedStacks(string $stack): array
    {
        return collect($this->parseStack($stack))
            ->map(fn (string $token) => SyncProjectTechnologies::normalizeToken($token))
            ->unique()
            ->values()
            ->all();
    }

    private function applySearchFilter(EloquentBuilder $query, string $search, bool $technologyTablesReady): void
    {
        if ($search === '') {
            return;
        }

        $normalizedSearch = SyncProjectTechnologies::normalizeToken($search);

        $query->where(function (EloquentBuilder $searchQuery) use ($search, $normalizedSearch, $technologyTablesReady): void {
            $searchQuery
                ->where('title', 'like', '%'.$search.'%')
                ->orWhere('summary', 'like', '%'.$search.'%');

            if ($technologyTablesReady) {
                $searchQuery->orWhereHas('technologies', function (EloquentBuilder $technologyQuery) use ($normalizedSearch): void {
                    $technologyQuery->where('name_normalized', 'like', '%'.$normalizedSearch.'%');
                });

                return;
            }

            $searchQuery->orWhere('stack', 'like', '%'.$search.'%');
        });
    }

    /**
     * @param  array<int, string>  $selectedStacks
     */
    private function applyStackFilter(EloquentBuilder $query, array $selectedStacks, bool $technologyTablesReady): void
    {
        if ($selectedStacks === []) {
            return;
        }

        if ($technologyTablesReady) {
            $query->whereHas('technologies', function (EloquentBuilder $technologyQuery) use ($selectedStacks): void {
                $technologyQuery->whereIn('name_normalized', $selectedStacks);
            });

            return;
        }

        $query->where(function (EloquentBuilder $stackQuery) use ($selectedStacks): void {
            foreach ($selectedStacks as $token) {
                $stackQuery->orWhere('stack', 'like', '%'.$token.'%');
            }
        });
    }

    /**
     * @return array<int, string>
     */
    private function resolveAvailableStacks(bool $technologyTablesReady): array
    {
        if ($technologyTablesReady) {
            return Technology::query()
                ->whereHas('projects', fn (EloquentBuilder $builder) => $builder->where('is_published', true))
                ->orderBy('name')
                ->pluck('name')
                ->all();
        }

        return Project::query()
            ->published()
            ->whereNotNull('stack')
            ->pluck('stack')
            ->flatMap(fn (?string $stack) => $this->parseStack($stack))
            ->unique()
            ->sort(SORT_NATURAL | SORT_FLAG_CASE)
            ->values()
            ->all();
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

    /**
     * @param  array{q: string, stack: string, sort: string}  $filters
     */
    private function resolveProjectsPayload(array $filters, bool $technologyTablesReady): LengthAwarePaginator
    {
        $selectedStacks = $this->normalizeSelectedStacks($filters['stack']);
        $query = Project::query()->published();

        if ($technologyTablesReady) {
            $query->with('technologies');
        }

        $this->applySearchFilter($query, $filters['q'], $technologyTablesReady);
        $this->applyStackFilter($query, $selectedStacks, $technologyTablesReady);
        $this->applySort($query, $filters['sort']);

        return $query
            ->paginate(9)
            ->withQueryString()
            ->through(fn (Project $project) => $this->transformProjectCard($project));
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
