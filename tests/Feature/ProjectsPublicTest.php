<?php

namespace Tests\Feature;

use App\Models\HomepageSettings;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProjectsPublicTest extends TestCase
{
    use RefreshDatabase;

    public function test_homepage_shows_only_featured_published_projects(): void
    {
        HomepageSettings::query()->create(HomepageSettings::defaults());

        config()->set('portfolio.email', 'contact@example.com');
        config()->set('portfolio.linkedin', 'https://linkedin.com/in/example');
        config()->set('portfolio.github', 'https://github.com/example');

        $featuredPublished = Project::factory()->published()->featured()->create([
            'title' => 'Featured Published',
        ]);

        Project::factory()->published()->create([
            'title' => 'Published But Not Featured',
        ]);

        Project::factory()->featured()->create([
            'title' => 'Featured Draft',
        ]);

        $response = $this->get('/');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Welcome')
            ->has('featuredProjects', 1)
            ->where('featuredProjects.0.title', $featuredPublished->title)
            ->where('featuredProjects', fn ($projects) => collect($projects)
                ->pluck('title')
                ->contains('Published But Not Featured') === false)
            ->where('featuredProjects', fn ($projects) => collect($projects)
                ->pluck('title')
                ->contains('Featured Draft') === false)
            ->where('contact.email', 'contact@example.com')
            ->where('contact.linkedin', 'https://linkedin.com/in/example')
            ->where('contact.github', 'https://github.com/example')
            ->has('homepageSettings')
            ->where('homepageSettings.hero_headline', HomepageSettings::defaults()['hero_headline']));
    }

    public function test_projects_index_lists_only_published_projects(): void
    {
        $published = Project::factory()->published()->create([
            'title' => 'Public Project',
        ]);

        Project::factory()->create([
            'title' => 'Draft Project',
        ]);

        $response = $this->get(route('projects.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Projects/Index')
            ->where('filters.q', '')
            ->where('filters.stack', '')
            ->where('filters.sort', 'editorial')
            ->where('projects.data', fn ($projects) => collect($projects)
                ->pluck('title')
                ->contains($published->title))
            ->where('projects.data', fn ($projects) => collect($projects)
                ->pluck('title')
                ->contains('Draft Project') === false)
            ->where('availableStacks', fn ($stacks) => is_iterable($stacks)));
    }

    public function test_homepage_featured_projects_are_limited_and_ordered_for_public_display(): void
    {
        HomepageSettings::query()->create(HomepageSettings::defaults());

        Project::factory()->published()->featured()->create([
            'title' => 'Order A',
            'sort_order' => 0,
            'published_at' => '2025-06-01 10:00:00',
        ]);

        Project::factory()->published()->featured()->create([
            'title' => 'Order B',
            'sort_order' => 0,
            'published_at' => '2024-06-01 10:00:00',
        ]);

        Project::factory()->published()->featured()->create([
            'title' => 'Order C',
            'sort_order' => 1,
            'published_at' => '2025-01-01 10:00:00',
        ]);

        Project::factory()->published()->featured()->create([
            'title' => 'Order D (Not Visible Due To Limit)',
            'sort_order' => 2,
            'published_at' => '2026-01-01 10:00:00',
        ]);

        Project::factory()->published()->create([
            'title' => 'Published But Not Featured',
            'sort_order' => 0,
            'published_at' => '2026-02-01 10:00:00',
        ]);

        Project::factory()->featured()->create([
            'title' => 'Featured Draft',
            'sort_order' => 0,
            'published_at' => null,
        ]);

        $response = $this->get(route('home'));

        $response
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Welcome')
                ->has('featuredProjects', 3)
                ->where('featuredProjects', fn ($projects) => collect($projects)
                    ->pluck('title')
                    ->values()
                    ->all() === ['Order A', 'Order B', 'Order C']));
    }

    public function test_projects_index_orders_items_by_sort_order_then_published_at_desc(): void
    {
        Project::factory()->published()->create([
            'title' => 'Project A',
            'sort_order' => 0,
            'published_at' => '2025-06-01 10:00:00',
        ]);

        Project::factory()->published()->create([
            'title' => 'Project B',
            'sort_order' => 0,
            'published_at' => '2024-06-01 10:00:00',
        ]);

        Project::factory()->published()->create([
            'title' => 'Project C',
            'sort_order' => 1,
            'published_at' => '2026-01-01 10:00:00',
        ]);

        Project::factory()->create([
            'title' => 'Draft Project',
            'sort_order' => 0,
            'published_at' => null,
        ]);

        $response = $this->get(route('projects.index'));

        $response
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Projects/Index')
                ->where('projects.data', fn ($projects) => collect($projects)
                    ->pluck('title')
                    ->values()
                    ->all() === ['Project A', 'Project B', 'Project C']));
    }

    public function test_projects_index_supports_public_query_filters_and_sort_modes(): void
    {
        Project::factory()->published()->create([
            'title' => 'CRM Dashboard',
            'summary' => 'Operations platform',
            'stack' => 'Laravel, React',
            'published_at' => '2026-01-01 10:00:00',
            'sort_order' => 8,
        ]);

        Project::factory()->published()->create([
            'title' => 'CRM Toolkit',
            'summary' => 'Legacy migration toolkit',
            'stack' => 'Laravel, React',
            'published_at' => '2025-01-01 10:00:00',
            'sort_order' => 1,
        ]);

        Project::factory()->published()->create([
            'title' => 'Inventory Backoffice',
            'summary' => 'Admin operations',
            'stack' => 'Laravel, Vue',
            'published_at' => '2026-02-01 10:00:00',
            'sort_order' => 0,
        ]);

        $response = $this->get(route('projects.index', [
            'q' => 'crm',
            'stack' => 'React',
            'sort' => 'newest',
        ]));

        $response
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Projects/Index')
                ->where('filters.q', 'crm')
                ->where('filters.stack', 'React')
                ->where('filters.sort', 'newest')
                ->where('projects.data', fn ($projects) => collect($projects)
                    ->pluck('title')
                    ->values()
                    ->all() === ['CRM Dashboard', 'CRM Toolkit'])
                ->where('availableStacks', fn ($stacks) => collect($stacks)
                    ->values()
                    ->all() === ['Laravel', 'React', 'Vue']));
    }

    public function test_projects_index_preserves_public_filters_through_pagination_links(): void
    {
        Project::factory()->count(12)->published()->create([
            'title' => 'CRM Listing',
            'summary' => 'Project summary',
            'stack' => 'Laravel, React',
        ]);

        $response = $this->get(route('projects.index', [
            'q' => 'crm',
            'stack' => 'React',
            'sort' => 'oldest',
        ]));

        $response
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('projects.next_page_url', function ($url) {
                    return is_string($url)
                        && str_contains(urldecode($url), 'q=crm')
                        && str_contains(urldecode($url), 'stack=React')
                        && str_contains(urldecode($url), 'sort=oldest');
                }));
    }

    public function test_projects_index_supports_multi_stack_filter(): void
    {
        Project::factory()->published()->create([
            'title' => 'React System',
            'stack' => 'Laravel, React',
            'published_at' => '2026-02-01 10:00:00',
            'sort_order' => 1,
        ]);

        Project::factory()->published()->create([
            'title' => 'Vue System',
            'stack' => 'Laravel, Vue',
            'published_at' => '2026-01-01 10:00:00',
            'sort_order' => 2,
        ]);

        Project::factory()->published()->create([
            'title' => 'Svelte System',
            'stack' => 'Laravel, Svelte',
            'published_at' => '2025-01-01 10:00:00',
            'sort_order' => 3,
        ]);

        $response = $this->get(route('projects.index', [
            'stack' => 'React,Vue',
            'sort' => 'newest',
        ]));

        $response
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Projects/Index')
                ->where('filters.stack', 'React,Vue')
                ->where('projects.data', fn ($projects) => collect($projects)
                    ->pluck('title')
                    ->values()
                    ->all() === ['React System', 'Vue System']));
    }

    public function test_published_project_detail_is_visible(): void
    {
        $project = Project::factory()->published()->create();

        $response = $this->get(route('projects.show', $project->slug));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Projects/Show')
            ->where('project.title', $project->title));
    }

    public function test_unpublished_project_detail_returns_404(): void
    {
        $project = Project::factory()->create();

        $response = $this->get(route('projects.show', $project->slug));

        $response->assertNotFound();
    }
}
