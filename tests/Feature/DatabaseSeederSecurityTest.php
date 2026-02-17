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
        config()->set('portfolio.owner_password', '');

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Missing required PORTFOLIO_OWNER_PASSWORD');

        $this->seed(DatabaseSeeder::class);
    }

    public function test_database_seeder_creates_owner_when_owner_password_is_provided(): void
    {
        config()->set('portfolio.owner_password', 'StrongPass!123');

        $this->seed(DatabaseSeeder::class);

        $owner = User::query()->where('email', 'owner@example.com')->first();

        $this->assertNotNull($owner);
        $this->assertTrue(Hash::check('StrongPass!123', $owner->password));
    }
}
