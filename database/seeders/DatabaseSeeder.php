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
        $ownerEmail = (string) config('portfolio.owner_email', 'owner@example.com');
        $ownerPassword = trim((string) config('portfolio.owner_password', ''));

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

        $this->call(ProjectSeeder::class);
        $this->call(HomepageSettingsSeeder::class);
    }
}
