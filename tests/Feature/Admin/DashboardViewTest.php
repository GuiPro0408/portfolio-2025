<?php

namespace Tests\Feature\Admin;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardViewTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_view_dashboard_metrics_and_recent_projects(): void
    {
        $user = User::factory()->create();

        Project::factory()->count(3)->create();

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard')
                ->where('metrics.total', 3)
                ->has('metrics.published')
                ->has('metrics.featured')
                ->has('recentProjects'));
    }
}
