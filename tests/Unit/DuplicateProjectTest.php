<?php

namespace Tests\Unit;

use App\Actions\Projects\DuplicateProject;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DuplicateProjectTest extends TestCase
{
    use RefreshDatabase;

    public function test_duplicate_creates_draft_copy_with_same_technologies(): void
    {
        $project = Project::factory()->published()->featured()->create([
            'title' => 'Core Platform',
            'slug' => 'core-platform',
            'stack' => 'Laravel, React',
        ]);

        $action = app(DuplicateProject::class);

        $copy = $action->duplicate($project);

        $this->assertNotSame($project->id, $copy->id);
        $this->assertSame('Core Platform (Copy)', $copy->title);
        $this->assertSame('core-platform-copy', $copy->slug);
        $this->assertFalse($copy->is_published);
        $this->assertFalse($copy->is_featured);
        $this->assertNull($copy->published_at);
        $this->assertSame(
            $project->technologies()->pluck('name_normalized')->all(),
            $copy->technologies()->pluck('name_normalized')->all(),
        );
    }

    public function test_duplicate_increments_copy_slug_suffix_when_needed(): void
    {
        $project = Project::factory()->create([
            'slug' => 'alpha',
        ]);
        Project::factory()->create([
            'slug' => 'alpha-copy',
        ]);

        $action = app(DuplicateProject::class);

        $copy = $action->duplicate($project);

        $this->assertSame('alpha-copy-2', $copy->slug);
    }
}
