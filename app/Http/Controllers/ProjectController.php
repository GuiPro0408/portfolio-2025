<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $this->normalizedFilters($request);
        $publishedProjects = Project::query()->published()->get();
        $availableStacks = $this->availableStacks($publishedProjects);

        $filteredProjects = $publishedProjects
            ->filter(function (Project $project) use ($filters): bool {
                if ($filters['q'] !== '') {
                    $haystack = Str::lower(
                        implode(' ', [
                            $project->title,
                            $project->summary,
                            $project->stack ?? '',
                        ])
                    );

                    if (! Str::contains($haystack, Str::lower($filters['q']))) {
                        return false;
                    }
                }

                $selectedStacks = $this->parseStack($filters['stack']);

                if ($selectedStacks !== []) {
                    $stackTokens = collect($this->parseStack($project->stack))
                        ->map(fn (string $token) => Str::lower($token))
                        ->all();
                    $selectedStackTokens = collect($selectedStacks)
                        ->map(fn (string $token) => Str::lower($token))
                        ->all();

                    if (! collect($selectedStackTokens)->intersect($stackTokens)->isNotEmpty()) {
                        return false;
                    }
                }

                return true;
            });

        $sortedProjects = $this->sortProjects($filteredProjects, $filters['sort']);
        $projects = $this->paginateProjects($sortedProjects, $request, $filters, 9);

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
     * @return array{q: string, stack: string, sort: string, page: int}
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
            'page' => max(1, (int) $request->integer('page', 1)),
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
     * @return array<int, string>
     */
    private function availableStacks(Collection $projects): array
    {
        return $projects
            ->flatMap(fn (Project $project) => $this->parseStack($project->stack))
            ->unique()
            ->sort(SORT_NATURAL | SORT_FLAG_CASE)
            ->values()
            ->all();
    }

    private function sortProjects(Collection $projects, string $sort): Collection
    {
        $values = $projects->values()->all();

        usort($values, fn (Project $left, Project $right) => $this->compareProjects($left, $right, $sort));

        return collect($values);
    }

    private function compareProjects(Project $left, Project $right, string $sort): int
    {
        $leftPublished = $left->published_at?->getTimestamp() ?? 0;
        $rightPublished = $right->published_at?->getTimestamp() ?? 0;

        if ($sort === 'newest') {
            return [$rightPublished, $right->id] <=> [$leftPublished, $left->id];
        }

        if ($sort === 'oldest') {
            return [$leftPublished, $left->id] <=> [$rightPublished, $right->id];
        }

        return [
            $left->sort_order,
            -1 * $leftPublished,
            -1 * $left->id,
        ] <=> [
            $right->sort_order,
            -1 * $rightPublished,
            -1 * $right->id,
        ];
    }

    /**
     * @param  array{q: string, stack: string, sort: string, page: int}  $filters
     */
    private function paginateProjects(
        Collection $projects,
        Request $request,
        array $filters,
        int $perPage,
    ): LengthAwarePaginator {
        $page = $filters['page'];
        $items = $projects
            ->forPage($page, $perPage)
            ->values()
            ->map(fn (Project $project) => $this->transformProjectCard($project));

        return new LengthAwarePaginator(
            $items,
            $projects->count(),
            $perPage,
            $page,
            [
                'path' => $request->url(),
                'query' => array_filter([
                    'q' => $filters['q'],
                    'stack' => $filters['stack'],
                    'sort' => $filters['sort'],
                ], fn (string $value) => $value !== ''),
            ],
        );
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
