<?php

namespace App\Actions\Projects;

use App\Models\Project;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DuplicateProject
{
    public function __construct(
        private readonly SyncProjectTechnologies $syncProjectTechnologies,
    ) {}

    public function duplicate(Project $project): Project
    {
        $project->loadMissing('technologies');

        $originalTechnologyIds = $project->technologies->pluck('id')->all();

        $stackMirror = $project->technologies->isNotEmpty()
            ? $project->technologies->pluck('name')->implode(', ')
            : $project->stack;

        return DB::transaction(function () use (
            $originalTechnologyIds,
            $project,
            $stackMirror,
        ): Project {
            $copy = $project->replicate();
            $copy->title = $project->title.' (Copy)';
            $copy->slug = $this->generateUniqueCopySlug($project->slug);
            $copy->is_featured = false;
            $copy->is_published = false;
            $copy->published_at = null;
            $copy->stack = $stackMirror;
            $copy->save();

            if ($originalTechnologyIds !== []) {
                $copy->technologies()->sync($originalTechnologyIds);
            } else {
                $this->syncProjectTechnologies->sync($copy, $copy->stack);
            }

            return $copy;
        });
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
}
