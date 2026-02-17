<?php

namespace App\Actions\Projects;

use App\Models\Project;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class DuplicateProject
{
    public function __construct(
        private readonly SyncProjectTechnologies $syncProjectTechnologies,
    ) {}

    public function duplicate(Project $project): Project
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

        return DB::transaction(function () use (
            $originalTechnologyIds,
            $project,
            $stackMirror,
            $technologyTablesReady
        ): Project {
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

    private function technologyTablesReady(): bool
    {
        return Schema::hasTable('technologies') && Schema::hasTable('project_technology');
    }
}
