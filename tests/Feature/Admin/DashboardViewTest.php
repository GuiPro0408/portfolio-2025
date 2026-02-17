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
        $user = $this->ownerUser();

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

    public function test_non_owner_cannot_view_dashboard(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->get(route('dashboard'))->assertForbidden();
    }

    public function test_unverified_owner_is_redirected_to_verification_notice(): void
    {
        $user = $this->ownerUser([
            'email_verified_at' => null,
        ]);

        $this->actingAs($user)->get(route('dashboard'))->assertRedirect(route('verification.notice'));
    }
}
