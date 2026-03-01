<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class DatabaseSeederSecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_database_seeder_fails_fast_when_owner_password_is_missing(): void
    {
        config()->set('portfolio.owner_email', 'owner@example.com');
        config()->set('portfolio.owner_password', '');

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Missing required PORTFOLIO_OWNER_PASSWORD');

        $this->seed(DatabaseSeeder::class);
    }

    public function test_database_seeder_fails_fast_when_owner_email_is_missing(): void
    {
        config()->set('portfolio.owner_email', '');
        config()->set('portfolio.owner_password', 'StrongPass!123');

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Missing or invalid PORTFOLIO_OWNER_EMAIL');

        $this->seed(DatabaseSeeder::class);
    }

    public function test_database_seeder_fails_fast_when_owner_email_is_invalid(): void
    {
        config()->set('portfolio.owner_email', 'not-an-email');
        config()->set('portfolio.owner_password', 'StrongPass!123');

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Missing or invalid PORTFOLIO_OWNER_EMAIL');

        $this->seed(DatabaseSeeder::class);
    }

    public function test_database_seeder_creates_owner_when_owner_password_is_provided(): void
    {
        config()->set('portfolio.owner_email', 'owner@example.com');
        config()->set('portfolio.owner_password', 'StrongPass!123');

        $this->seed(DatabaseSeeder::class);

        $owner = User::query()->where('email', 'owner@example.com')->first();

        $this->assertNotNull($owner);
        $this->assertTrue(Hash::check('StrongPass!123', $owner->password));
    }

    public function test_database_seeder_skips_project_seed_when_environment_is_production(): void
    {
        config()->set('portfolio.owner_password', 'StrongPass!123');
        $this->app->instance('env', 'production');

        $this->artisan('db:seed', [
            '--class' => DatabaseSeeder::class,
            '--force' => true,
        ])->assertExitCode(0);

        $this->assertDatabaseCount('projects', 0);
        $this->assertDatabaseCount('homepage_settings', 1);
        $this->assertDatabaseCount('users', 1);
    }

    public function test_database_seeder_skips_project_seed_when_project_seeding_is_disabled(): void
    {
        config()->set('portfolio.owner_password', 'StrongPass!123');
        config()->set('portfolio.seed_projects', false);

        $this->artisan('db:seed', [
            '--class' => DatabaseSeeder::class,
            '--force' => true,
        ])->assertExitCode(0);

        $this->assertDatabaseCount('projects', 0);
        $this->assertDatabaseCount('homepage_settings', 1);
        $this->assertDatabaseCount('users', 1);
    }
}
