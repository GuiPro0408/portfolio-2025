<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Technology;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BackfillProjectTechnologiesMigrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_backfill_migration_up_populates_normalized_technologies_and_is_idempotent(): void
    {
        $projectA = Project::query()->create([
            'title' => 'Backfill Project A',
            'slug' => 'backfill-project-a',
            'summary' => 'Summary A',
            'body' => 'Body A',
            'stack' => 'Laravel, React',
        ]);
        $projectB = Project::query()->create([
            'title' => 'Backfill Project B',
            'slug' => 'backfill-project-b',
            'summary' => 'Summary B',
            'body' => 'Body B',
            'stack' => 'React, Vue',
        ]);
        Project::query()->create([
            'title' => 'Backfill Project C',
            'slug' => 'backfill-project-c',
            'summary' => 'Summary C',
            'body' => 'Body C',
            'stack' => '',
        ]);

        $this->assertDatabaseCount('technologies', 0);
        $this->assertDatabaseCount('project_technology', 0);

        $migration = require database_path('migrations/2026_02_16_000007_backfill_project_technologies_table.php');
        $this->assertTrue(method_exists($migration, 'up'));

        call_user_func([$migration, 'up']);
        call_user_func([$migration, 'up']);

        $this->assertDatabaseHas('technologies', [
            'name_normalized' => 'laravel',
            'name' => 'Laravel',
        ]);
        $this->assertDatabaseHas('technologies', [
            'name_normalized' => 'react',
            'name' => 'React',
        ]);
        $this->assertDatabaseHas('technologies', [
            'name_normalized' => 'vue',
            'name' => 'Vue',
        ]);

        $this->assertDatabaseCount('technologies', 3);
        $this->assertDatabaseCount('project_technology', 4);

        $this->assertDatabaseHas('project_technology', [
            'project_id' => $projectA->id,
            'technology_id' => Technology::query()->where('name_normalized', 'laravel')->value('id'),
        ]);
        $this->assertDatabaseHas('project_technology', [
            'project_id' => $projectA->id,
            'technology_id' => Technology::query()->where('name_normalized', 'react')->value('id'),
        ]);
        $this->assertDatabaseHas('project_technology', [
            'project_id' => $projectB->id,
            'technology_id' => Technology::query()->where('name_normalized', 'react')->value('id'),
        ]);
        $this->assertDatabaseHas('project_technology', [
            'project_id' => $projectB->id,
            'technology_id' => Technology::query()->where('name_normalized', 'vue')->value('id'),
        ]);
    }

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
