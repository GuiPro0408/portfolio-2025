<?php

namespace Tests\Unit;

use App\Actions\Projects\SyncProjectTechnologies;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SyncProjectTechnologiesTest extends TestCase
{
    use RefreshDatabase;

    public function test_extract_tokens_normalizes_spacing_and_ignores_empty_values(): void
    {
        $tokens = SyncProjectTechnologies::extractTokens('  Laravel , React  , , PostgreSQL   ');

        $this->assertSame(['Laravel', 'React', 'PostgreSQL'], $tokens);
    }

    public function test_sync_reuses_existing_technologies_and_is_idempotent(): void
    {
        $project = Project::factory()->create([
            'stack' => 'Laravel, React',
        ]);

        $action = app(SyncProjectTechnologies::class);

        $action->sync($project, $project->stack);
        $action->sync($project, $project->stack);

        $this->assertDatabaseCount('technologies', 2);
        $this->assertDatabaseCount('project_technology', 2);
        $this->assertSame(
            ['laravel', 'react'],
            $project->fresh()->technologies()->pluck('name_normalized')->all()
        );
    }
}
