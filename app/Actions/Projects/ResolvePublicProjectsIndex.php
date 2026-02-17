<?php

namespace App\Actions\Projects;

use App\Models\Project;
use App\Models\Technology;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class ResolvePublicProjectsIndex
{
    /**
     * @return array{q: string, stack: string, sort: string}
     */
    public function normalizedFilters(Request $request): array
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
    public function resolveAvailableStacks(): array
    {
        return Technology::query()
            ->whereHas('projects', fn (EloquentBuilder $builder) => $builder->where('is_published', true))
            ->orderBy('name')
            ->pluck('name')
            ->all();
    }

    /**
     * @param  array{q: string, stack: string, sort: string}  $filters
     */
    public function resolveProjectsPayload(array $filters): LengthAwarePaginator
    {
        $selectedStacks = $this->normalizeSelectedStacks($filters['stack']);
        $query = Project::query()->published()->with('technologies');

        $this->applySearchFilter($query, $filters['q']);
        $this->applyStackFilter($query, $selectedStacks);
        $this->applySort($query, $filters['sort']);

        return $query
            ->paginate(9)
            ->withQueryString()
            ->through(fn (Project $project) => $this->transformProjectCard($project));
    }

    public function projectStack(Project $project): ?string
    {
        if ($project->relationLoaded('technologies') && $project->technologies->isNotEmpty()) {
            return $project->technologies->pluck('name')->implode(', ');
        }

        return $project->stack;
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

    private function applySort(EloquentBuilder $query, string $sort): void
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

    private function applySearchFilter(EloquentBuilder $query, string $search): void
    {
        if ($search === '') {
            return;
        }

        $normalizedSearch = SyncProjectTechnologies::normalizeToken($search);

        $query->where(function (EloquentBuilder $searchQuery) use ($search, $normalizedSearch): void {
            $searchQuery
                ->whereLike('title', '%'.$search.'%', caseSensitive: false)
                ->orWhereLike('summary', '%'.$search.'%', caseSensitive: false)
                ->orWhereHas('technologies', function (EloquentBuilder $technologyQuery) use ($normalizedSearch): void {
                    $technologyQuery->whereLike('name_normalized', '%'.$normalizedSearch.'%', caseSensitive: false);
                });
        });
    }

    /**
     * @param  array<int, string>  $selectedStacks
     */
    private function applyStackFilter(EloquentBuilder $query, array $selectedStacks): void
    {
        if ($selectedStacks === []) {
            return;
        }

        $query->whereHas('technologies', function (EloquentBuilder $technologyQuery) use ($selectedStacks): void {
            $technologyQuery->whereIn('name_normalized', $selectedStacks);
        });
    }
}
