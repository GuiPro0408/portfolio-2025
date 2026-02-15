<?php

namespace Tests\Feature;

use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProjectsPublicTest extends TestCase
{
    use RefreshDatabase;

    public function test_homepage_shows_only_featured_published_projects(): void
    {
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
            ->where('contact.github', 'https://github.com/example'));
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
            ->where('projects.data', fn ($projects) => collect($projects)
                ->pluck('title')
                ->contains($published->title))
            ->where('projects.data', fn ($projects) => collect($projects)
                ->pluck('title')
                ->contains('Draft Project') === false));
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
