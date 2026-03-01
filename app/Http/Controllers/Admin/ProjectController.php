<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Cache\InvalidatePublicCaches;
use App\Actions\Projects\DuplicateProject;
use App\Actions\Projects\ResolveAdminProjectsIndex;
use App\Actions\Projects\SyncProjectTechnologies;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectFlagsRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Requests\UpdateProjectSortRequest;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class ProjectController extends Controller
{
    public function __construct(
        private readonly DuplicateProject $duplicateProject,
        private readonly InvalidatePublicCaches $invalidatePublicCaches,
        private readonly ResolveAdminProjectsIndex $resolveAdminProjectsIndex,
        private readonly SyncProjectTechnologies $syncProjectTechnologies,
    ) {}

    public function index(Request $request): Response
    {
        $filters = $this->resolveAdminProjectsIndex->normalizedFilters($request);

        return Inertia::render('Dashboard/Projects/Index', [
            'projects' => fn (): LengthAwarePaginator => $this->resolveAdminProjectsIndex->resolveProjectsPayload($filters),
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
        $validated = $request->validated();
        $uploadedCoverImage = $request->file('cover_image');
        if (! $uploadedCoverImage instanceof UploadedFile) {
            $uploadedCoverImage = null;
        }
        unset($validated['cover_image']);

        $storedCoverImageUrl = $this->storeCoverImage($uploadedCoverImage);

        if ($storedCoverImageUrl !== null) {
            $validated['cover_image_url'] = $storedCoverImageUrl;
        }

        try {
            DB::transaction(function () use ($validated): void {
                $project = Project::create($validated);
                $this->syncProjectTechnologies->sync($project, $project->stack);

                DB::afterCommit(fn () => $this->invalidatePublicCaches->handle());
            });
        } catch (Throwable $exception) {
            $this->deleteCoverImage($storedCoverImageUrl);

            throw $exception;
        }

        return redirect()
            ->route('dashboard.projects.index')
            ->with('success', 'Project created successfully.');
    }

    public function edit(Project $project): Response
    {
        $project->loadMissing('technologies');

        return Inertia::render('Dashboard/Projects/Edit', [
            'project' => [
                'id' => $project->id,
                'title' => $project->title,
                'slug' => $project->slug,
                'summary' => $project->summary,
                'body' => $project->body,
                'stack' => $project->technologies->isNotEmpty()
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
        $validated = $request->validated();
        $uploadedCoverImage = $request->file('cover_image');
        if (! $uploadedCoverImage instanceof UploadedFile) {
            $uploadedCoverImage = null;
        }
        unset($validated['cover_image']);

        $oldCoverImageUrl = $project->cover_image_url;
        $storedCoverImageUrl = $this->storeCoverImage($uploadedCoverImage);

        if ($storedCoverImageUrl !== null) {
            $validated['cover_image_url'] = $storedCoverImageUrl;
        }

        try {
            DB::transaction(function () use ($project, $validated): void {
                $project->update($validated);
                $this->syncProjectTechnologies->sync($project, $project->stack);

                DB::afterCommit(fn () => $this->invalidatePublicCaches->handle());
            });
        } catch (Throwable $exception) {
            $this->deleteCoverImage($storedCoverImageUrl);

            throw $exception;
        }

        $project->refresh();

        if ($oldCoverImageUrl !== $project->cover_image_url) {
            $this->deleteCoverImage($oldCoverImageUrl);
        }

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
        $this->invalidatePublicCaches->handle();

        return back()->with('success', 'Project status updated.');
    }

    public function destroy(Project $project)
    {
        $project->delete();
        $this->invalidatePublicCaches->handle();

        return redirect()
            ->route('dashboard.projects.index')
            ->with('success', 'Project deleted successfully.');
    }

    public function duplicate(Project $project)
    {
        $copy = $this->duplicateProject->duplicate($project);
        $this->invalidatePublicCaches->handle();

        return redirect()
            ->route('dashboard.projects.edit', $copy)
            ->with('success', 'Project duplicated successfully.');
    }

    public function updateSort(UpdateProjectSortRequest $request, Project $project)
    {
        $project->update([
            'sort_order' => $request->validated('sort_order'),
        ]);
        $this->invalidatePublicCaches->handle();

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

    private function storeCoverImage(?UploadedFile $coverImage): ?string
    {
        if (! $coverImage instanceof UploadedFile) {
            return null;
        }

        $storedPath = $coverImage->store('projects/covers', 'public');

        return '/storage/'.$storedPath;
    }

    private function deleteCoverImage(?string $coverImageUrl): void
    {
        if (! is_string($coverImageUrl) || ! str_starts_with($coverImageUrl, '/storage/')) {
            return;
        }

        $diskPath = ltrim(substr($coverImageUrl, strlen('/storage/')), '/');

        if ($diskPath === '') {
            return;
        }

        Storage::disk('public')->delete($diskPath);
    }
}
