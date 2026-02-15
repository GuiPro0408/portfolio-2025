<?php

namespace Tests\Feature;

use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SeoEndpointsTest extends TestCase
{
    use RefreshDatabase;

    public function test_sitemap_contains_public_routes_and_published_projects_only(): void
    {
        $published = Project::factory()->published()->create([
            'slug' => 'published-item',
        ]);

        $draft = Project::factory()->create([
            'slug' => 'draft-item',
        ]);

        $response = $this->get(route('seo.sitemap'));

        $response
            ->assertOk()
            ->assertHeader('Content-Type', 'application/xml; charset=UTF-8')
            ->assertSee(route('home'), false)
            ->assertSee(route('projects.index'), false)
            ->assertSee(route('contact.index'), false)
            ->assertSee(route('projects.show', $published->slug), false)
            ->assertDontSee(route('projects.show', $draft->slug), false);
    }

    public function test_robots_file_exposes_sitemap_location(): void
    {
        $response = $this->get(route('seo.robots'));

        $response
            ->assertOk()
            ->assertHeader('Content-Type', 'text/plain; charset=UTF-8')
            ->assertSee('User-agent: *', false)
            ->assertSee('Allow: /', false)
            ->assertSee('Sitemap: '.route('seo.sitemap'), false);
    }
}
