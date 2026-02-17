<?php

namespace App\Actions\Projects;

use App\Models\Project;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder as BaseBuilder;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class ResolveAdminProjectsIndex
{
    /**
     * @return array{q: string, status: string, featured: string, sort: string}
     */
    public function normalizedFilters(Request $request): array
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
     * @param  array{q: string, status: string, featured: string, sort: string}  $filters
     */
    public function resolveProjectsPayload(array $filters): LengthAwarePaginator
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
}
