<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        $ownerEmail = trim((string) config('portfolio.owner_email', ''));
        $ownerPassword = trim((string) config('portfolio.owner_password', ''));

        if ($ownerEmail === '' || ! filter_var($ownerEmail, FILTER_VALIDATE_EMAIL)) {
            throw new \RuntimeException('Missing or invalid PORTFOLIO_OWNER_EMAIL for owner seeding.');
        }

        if ($ownerPassword === '') {
            throw new \RuntimeException('Missing required PORTFOLIO_OWNER_PASSWORD for owner seeding.');
        }

        User::query()->updateOrCreate(
            ['email' => $ownerEmail],
            [
                'name' => 'Portfolio Owner',
                'email_verified_at' => now(),
                'password' => Hash::make($ownerPassword),
            ],
        );

        $seedProjectsConfig = config('portfolio.seed_projects');
        $shouldSeedProjects = match (true) {
            is_bool($seedProjectsConfig) => $seedProjectsConfig,
            is_string($seedProjectsConfig) && trim($seedProjectsConfig) !== '' => (bool) filter_var(
                $seedProjectsConfig,
                FILTER_VALIDATE_BOOL,
            ),
            default => ! app()->environment('production'),
        };

        if ($shouldSeedProjects) {
            $this->call(ProjectSeeder::class);
        }

        $this->call(HomepageSettingsSeeder::class);
    }
}
