<?php

namespace Tests;

use App\Models\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // CI runs tests before frontend build, so avoid requiring Vite manifest.
        $this->withoutVite();

        config()->set('portfolio.owner_email', 'owner@example.com');
    }

    protected function ownerUser(array $attributes = []): User
    {
        $user = User::factory()->create($attributes);
        config()->set('portfolio.owner_email', $user->email);

        return $user;
    }
}
