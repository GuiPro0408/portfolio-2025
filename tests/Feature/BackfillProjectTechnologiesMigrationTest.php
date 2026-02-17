<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Technology;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BackfillProjectTechnologiesMigrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_backfill_migration_down_is_non_destructive(): void
    {
        $project = Project::factory()->create([
            'stack' => '',
        ]);
        $technology = Technology::query()->create([
            'name' => 'AcmeStack',
            'name_normalized' => 'acmestack',
        ]);
        $project->technologies()->sync([$technology->id]);

        $migration = require database_path('migrations/2026_02_16_000007_backfill_project_technologies_table.php');
        $this->assertTrue(method_exists($migration, 'down'));
        call_user_func([$migration, 'down']);

        $this->assertDatabaseHas('technologies', [
            'id' => $technology->id,
            'name_normalized' => 'acmestack',
        ]);
        $this->assertDatabaseHas('project_technology', [
            'project_id' => $project->id,
            'technology_id' => $technology->id,
        ]);
    }
}
