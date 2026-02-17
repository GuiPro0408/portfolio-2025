<?php

namespace Tests\Feature\Admin;

use App\Models\Project;
use App\Models\Technology;
use App\Models\User;
use App\Support\PublicCacheKeys;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Inertia\Testing\AssertableInertia as Assert;
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
        $this->post(route('dashboard.projects.duplicate', $project))->assertRedirect(route('login'));
        $this->patch(route('dashboard.projects.sort.update', $project), ['sort_order' => 1])->assertRedirect(route('login'));
    }

    public function test_non_owner_users_are_forbidden_from_project_management_pages(): void
    {
        $owner = $this->ownerUser();
        $project = Project::factory()->create();
        $user = User::factory()->create();
        config()->set('portfolio.owner_email', $owner->email);

        $this->actingAs($user)->get(route('dashboard.projects.index'))->assertForbidden();
        $this->actingAs($user)->get(route('dashboard.projects.create'))->assertForbidden();
        $this->actingAs($user)->get(route('dashboard.projects.edit', $project))->assertForbidden();
        $this->actingAs($user)->post(route('dashboard.projects.duplicate', $project))->assertForbidden();
        $this->actingAs($user)->patch(route('dashboard.projects.sort.update', $project), ['sort_order' => 1])->assertForbidden();
    }

    public function test_authenticated_users_can_open_management_pages(): void
    {
        $user = $this->ownerUser();
        $project = Project::factory()->create();

        $this->actingAs($user)->get(route('dashboard.projects.index'))->assertOk();
        $this->actingAs($user)->get(route('dashboard.projects.create'))->assertOk();
        $this->actingAs($user)->get(route('dashboard.projects.edit', $project))->assertOk();
    }

    public function test_authenticated_user_can_create_a_project(): void
    {
        $user = $this->ownerUser();

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
        $this->assertDatabaseHas('technologies', ['name_normalized' => 'laravel', 'name' => 'Laravel']);
        $this->assertDatabaseHas('technologies', ['name_normalized' => 'react', 'name' => 'React']);
        $this->assertDatabaseHas('project_technology', [
            'project_id' => $project?->id,
            'technology_id' => Technology::query()->where('name_normalized', 'laravel')->value('id'),
        ]);
        $this->assertDatabaseHas('project_technology', [
            'project_id' => $project?->id,
            'technology_id' => Technology::query()->where('name_normalized', 'react')->value('id'),
        ]);
    }

    public function test_validation_errors_are_returned_for_invalid_payload(): void
    {
        $user = $this->ownerUser();

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
        $user = $this->ownerUser();
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
        $this->assertSame(['laravel'], $project->technologies()->pluck('name_normalized')->all());
    }

    public function test_authenticated_user_can_delete_a_project(): void
    {
        $user = $this->ownerUser();
        $project = Project::factory()->create();

        $response = $this->actingAs($user)->delete(route('dashboard.projects.destroy', $project));

        $response->assertRedirect(route('dashboard.projects.index'));
        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
    }

    public function test_slug_must_be_unique(): void
    {
        $user = $this->ownerUser();
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
        $user = $this->ownerUser();
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

    public function test_projects_index_supports_search_filter_and_sort(): void
    {
        $user = $this->ownerUser();

        Project::factory()->create([
            'title' => 'Alpha Project',
            'slug' => 'alpha-project',
            'is_published' => true,
            'is_featured' => true,
        ]);

        Project::factory()->create([
            'title' => 'Beta Draft',
            'slug' => 'beta-draft',
            'is_published' => false,
            'is_featured' => false,
        ]);

        Project::factory()->create([
            'title' => 'Gamma Project',
            'slug' => 'gamma-project',
            'is_published' => true,
            'is_featured' => false,
        ]);

        $response = $this->actingAs($user)->get(route('dashboard.projects.index', [
            'q' => 'project',
            'status' => 'published',
            'featured' => 'all',
            'sort' => 'title_desc',
        ]));

        $response
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard/Projects/Index')
                ->where('filters.q', 'project')
                ->where('filters.status', 'published')
                ->where('filters.featured', 'all')
                ->where('filters.sort', 'title_desc')
                ->has('projects.data', 2)
                ->where('projects.data.0.title', 'Gamma Project')
                ->where('projects.data.1.title', 'Alpha Project'));
    }

    public function test_projects_index_preserves_query_through_pagination_links(): void
    {
        $user = $this->ownerUser();

        Project::factory()->count(20)->create([
            'title' => 'Query Match',
            'is_published' => true,
        ]);

        $response = $this->actingAs($user)->get(route('dashboard.projects.index', [
            'q' => 'Query Match',
            'status' => 'published',
        ]));

        $response
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('projects.next_page_url', function ($url) {
                    return is_string($url)
                        && str_contains(urldecode($url), 'q=Query Match')
                        && str_contains($url, 'status=published');
                }));
    }

    public function test_guests_are_redirected_from_project_flags_update(): void
    {
        $project = Project::factory()->create();

        $this
            ->patch(route('dashboard.projects.flags.update', $project), [
                'is_published' => true,
                'is_featured' => true,
            ])
            ->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_update_project_flags_and_publish_timestamp(): void
    {
        $user = $this->ownerUser();
        $project = Project::factory()->create([
            'is_published' => false,
            'is_featured' => false,
            'published_at' => null,
        ]);

        $this
            ->actingAs($user)
            ->patch(route('dashboard.projects.flags.update', $project), [
                'is_published' => true,
                'is_featured' => true,
            ])
            ->assertRedirect();

        $project->refresh();
        $this->assertTrue($project->is_published);
        $this->assertTrue($project->is_featured);
        $this->assertNotNull($project->published_at);

        $this
            ->actingAs($user)
            ->patch(route('dashboard.projects.flags.update', $project), [
                'is_published' => false,
                'is_featured' => false,
            ])
            ->assertRedirect();

        $project->refresh();
        $this->assertFalse($project->is_published);
        $this->assertFalse($project->is_featured);
        $this->assertNull($project->published_at);
    }

    public function test_project_flags_validation_rejects_invalid_values(): void
    {
        $user = $this->ownerUser();
        $project = Project::factory()->create();

        $response = $this
            ->actingAs($user)
            ->from(route('dashboard.projects.index'))
            ->patch(route('dashboard.projects.flags.update', $project), [
                'is_published' => 'invalid',
                'is_featured' => 'invalid',
            ]);

        $response->assertRedirect(route('dashboard.projects.index'));
        $response->assertSessionHasErrors(['is_published', 'is_featured']);
    }

    public function test_authenticated_user_can_duplicate_a_project_as_draft_copy(): void
    {
        $user = $this->ownerUser();
        $project = Project::factory()->published()->featured()->create([
            'slug' => 'core-platform',
            'title' => 'Core Platform',
        ]);

        $response = $this
            ->actingAs($user)
            ->post(route('dashboard.projects.duplicate', $project));

        $response->assertRedirect();

        $copy = Project::query()
            ->where('id', '!=', $project->id)
            ->latest('id')
            ->first();

        $this->assertNotNull($copy);
        $this->assertSame('Core Platform (Copy)', $copy->title);
        $this->assertSame('core-platform-copy', $copy->slug);
        $this->assertFalse($copy->is_published);
        $this->assertFalse($copy->is_featured);
        $this->assertNull($copy->published_at);
        $this->assertSame(
            $project->technologies()->pluck('name_normalized')->all(),
            $copy->technologies()->pluck('name_normalized')->all()
        );
    }

    public function test_duplicate_project_slug_suffix_is_incremented_when_needed(): void
    {
        $user = $this->ownerUser();
        $project = Project::factory()->create(['slug' => 'alpha']);
        Project::factory()->create(['slug' => 'alpha-copy']);

        $this
            ->actingAs($user)
            ->post(route('dashboard.projects.duplicate', $project))
            ->assertRedirect();

        $this->assertDatabaseHas('projects', [
            'slug' => 'alpha-copy-2',
            'title' => $project->title.' (Copy)',
        ]);
    }

    public function test_authenticated_user_can_update_project_sort_order_inline(): void
    {
        $user = $this->ownerUser();
        $project = Project::factory()->create(['sort_order' => 2]);

        $this
            ->actingAs($user)
            ->patch(route('dashboard.projects.sort.update', $project), [
                'sort_order' => 17,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'sort_order' => 17,
        ]);
    }

    public function test_project_sort_update_validation_rejects_invalid_values(): void
    {
        $user = $this->ownerUser();
        $project = Project::factory()->create();

        $response = $this
            ->actingAs($user)
            ->from(route('dashboard.projects.index'))
            ->patch(route('dashboard.projects.sort.update', $project), [
                'sort_order' => -5,
            ]);

        $response->assertRedirect(route('dashboard.projects.index'));
        $response->assertSessionHasErrors(['sort_order']);
    }

    public function test_project_mutations_clear_public_cache_entries(): void
    {
        $user = $this->ownerUser();

        Cache::put(PublicCacheKeys::HOME_PAYLOAD, ['cached' => true], 600);
        Cache::put(PublicCacheKeys::SITEMAP_XML, '<xml/>', 600);

        $this->actingAs($user)->post(route('dashboard.projects.store'), [
            'title' => 'Cache Flush Project',
            'summary' => 'Summary text',
            'body' => 'Body text',
            'stack' => 'Laravel, React',
            'is_featured' => false,
            'is_published' => false,
            'sort_order' => 1,
        ])->assertRedirect(route('dashboard.projects.index'));

        $this->assertFalse(Cache::has(PublicCacheKeys::HOME_PAYLOAD));
        $this->assertFalse(Cache::has(PublicCacheKeys::SITEMAP_XML));
    }
}
