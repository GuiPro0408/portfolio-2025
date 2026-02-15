<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Project::factory()->count(3)->published()->featured()->create();
        Project::factory()->count(6)->published()->create();
        Project::factory()->count(4)->create();
    }
}
