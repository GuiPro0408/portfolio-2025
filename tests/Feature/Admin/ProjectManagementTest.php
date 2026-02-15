<?php

namespace Tests\Feature\Admin;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_from_project_management_pages(): void
    {
        $project = Project::factory()->create();

        $this->get(route('dashboard.projects.index'))->assertRedirect(route('login'));
        $this->get(route('dashboard.projects.create'))->assertRedirect(route('login'));
        $this->get(route('dashboard.projects.edit', $project))->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_open_management_pages(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->create();

        $this->actingAs($user)->get(route('dashboard.projects.index'))->assertOk();
        $this->actingAs($user)->get(route('dashboard.projects.create'))->assertOk();
        $this->actingAs($user)->get(route('dashboard.projects.edit', $project))->assertOk();
    }

    public function test_authenticated_user_can_create_a_project(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('dashboard.projects.store'), [
            'title' => 'My Portfolio App',
            'summary' => 'Summary text',
            'body' => 'Body text',
            'stack' => 'Laravel, React',
            'cover_image_url' => 'https://example.com/cover.png',
            'repo_url' => 'https://github.com/example/repo',
            'live_url' => 'https://example.com',
            'is_featured' => true,
            'is_published' => true,
            'sort_order' => 2,
        ]);

        $response->assertRedirect(route('dashboard.projects.index'));

        $this->assertDatabaseHas('projects', [
            'title' => 'My Portfolio App',
            'slug' => 'my-portfolio-app',
            'is_featured' => true,
            'is_published' => true,
            'sort_order' => 2,
        ]);

        $project = Project::first();
        $this->assertNotNull($project?->published_at);
    }

    public function test_validation_errors_are_returned_for_invalid_payload(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('dashboard.projects.store'), [
            'title' => '',
            'summary' => '',
            'body' => '',
            'cover_image_url' => 'not-a-url',
            'repo_url' => 'not-a-url',
            'live_url' => 'not-a-url',
        ]);

        $response->assertSessionHasErrors([
            'title',
            'summary',
            'body',
            'cover_image_url',
            'repo_url',
            'live_url',
        ]);
    }

    public function test_authenticated_user_can_update_a_project(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->create([
            'title' => 'Old Title',
            'slug' => 'old-title',
            'is_published' => false,
            'published_at' => null,
        ]);

        $response = $this->actingAs($user)->put(route('dashboard.projects.update', $project), [
            'title' => 'New Title',
            'slug' => 'new-title',
            'summary' => 'Updated summary',
            'body' => 'Updated body',
            'stack' => 'Laravel',
            'cover_image_url' => 'https://example.com/new-cover.png',
            'repo_url' => 'https://github.com/example/new-repo',
            'live_url' => 'https://example.com/new',
            'is_featured' => false,
            'is_published' => true,
            'sort_order' => 5,
        ]);

        $response->assertRedirect(route('dashboard.projects.index'));

        $project->refresh();

        $this->assertSame('New Title', $project->title);
        $this->assertSame('new-title', $project->slug);
        $this->assertTrue($project->is_published);
        $this->assertNotNull($project->published_at);
    }

    public function test_authenticated_user_can_delete_a_project(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->create();

        $response = $this->actingAs($user)->delete(route('dashboard.projects.destroy', $project));

        $response->assertRedirect(route('dashboard.projects.index'));
        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
    }

    public function test_slug_must_be_unique(): void
    {
        $user = User::factory()->create();
        Project::factory()->create(['slug' => 'existing-slug']);

        $response = $this->actingAs($user)->post(route('dashboard.projects.store'), [
            'title' => 'Another title',
            'slug' => 'existing-slug',
            'summary' => 'Summary text',
            'body' => 'Body text',
        ]);

        $response->assertSessionHasErrors(['slug']);
    }

    public function test_unpublishing_clears_published_at_timestamp(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->published()->create([
            'slug' => 'published-project',
        ]);

        $response = $this->actingAs($user)->put(route('dashboard.projects.update', $project), [
            'title' => $project->title,
            'slug' => $project->slug,
            'summary' => $project->summary,
            'body' => $project->body,
            'stack' => $project->stack,
            'cover_image_url' => $project->cover_image_url,
            'repo_url' => $project->repo_url,
            'live_url' => $project->live_url,
            'is_featured' => $project->is_featured,
            'is_published' => false,
            'sort_order' => $project->sort_order,
        ]);

        $response->assertRedirect(route('dashboard.projects.index'));

        $project->refresh();
        $this->assertFalse($project->is_published);
        $this->assertNull($project->published_at);
    }
}
