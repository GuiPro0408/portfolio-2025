<?php

namespace Database\Seeders;

use App\Models\HomepageSettings;
use Illuminate\Database\Seeder;

class HomepageSettingsSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        HomepageSettings::query()->firstOrCreate([], HomepageSettings::defaults());
    }
}
