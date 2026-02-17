<?php

namespace Tests\Feature;

use App\Models\HomepageSettings;
use App\Models\Project;
use App\Support\PublicCacheKeys;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SeoEndpointsTest extends TestCase
{
    use RefreshDatabase;

    public function test_sitemap_contains_public_routes_and_published_projects_only(): void
    {
        HomepageSettings::current();
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
            ->assertDontSee(route('projects.show', $draft->slug), false)
            ->assertSee('<lastmod>', false);

        $this->assertMatchesRegularExpression(
            '/<url><loc>'.preg_quote(route('projects.show', $published->slug), '/').'<\/loc><lastmod>[^<]+<\/lastmod><\/url>/',
            $response->getContent(),
        );
    }

    public function test_robots_file_exposes_sitemap_location(): void
    {
        $this->assertFileDoesNotExist(public_path('robots.txt'));

        $response = $this->get(route('seo.robots'));

        $response
            ->assertOk()
            ->assertHeader('Content-Type', 'text/plain; charset=UTF-8')
            ->assertSee('User-agent: *', false)
            ->assertSee('Allow: /', false)
            ->assertSee('Sitemap: '.route('seo.sitemap'), false);
    }

    public function test_sitemap_cache_is_invalidated_when_project_publication_changes(): void
    {
        $user = $this->ownerUser();
        $project = Project::factory()->create([
            'slug' => 'newly-published-project',
            'is_published' => false,
            'published_at' => null,
        ]);

        Cache::forget(PublicCacheKeys::SITEMAP_XML);

        $this->get(route('seo.sitemap'))
            ->assertOk()
            ->assertDontSee(route('projects.show', $project->slug), false);

        $this->actingAs($user)
            ->patch(route('dashboard.projects.flags.update', $project), [
                'is_published' => true,
                'is_featured' => false,
            ])
            ->assertRedirect();

        $this->get(route('seo.sitemap'))
            ->assertOk()
            ->assertSee(route('projects.show', $project->slug), false);
    }

    public function test_sitemap_lastmod_changes_after_homepage_settings_update(): void
    {
        $user = $this->ownerUser();
        HomepageSettings::current();

        Carbon::setTestNow('2026-01-01 10:00:00');
        Cache::forget(PublicCacheKeys::SITEMAP_XML);
        $initialXml = $this->get(route('seo.sitemap'))->getContent();

        $this->assertMatchesRegularExpression(
            '/<url><loc>'.preg_quote(route('home'), '/').'<\/loc><lastmod>[^<]+<\/lastmod><\/url>/',
            $initialXml,
        );

        Carbon::setTestNow('2026-01-02 10:00:00');
        $payload = HomepageSettings::defaults();
        $payload['hero_headline'] = 'Updated Headline For Sitemap';

        $this->actingAs($user)
            ->put(route('dashboard.homepage.update'), $payload)
            ->assertRedirect(route('dashboard.homepage.edit'));

        $updatedXml = $this->get(route('seo.sitemap'))->getContent();
        Carbon::setTestNow();

        preg_match(
            '/<url><loc>'.preg_quote(route('home'), '/').'<\/loc><lastmod>([^<]+)<\/lastmod><\/url>/',
            $initialXml,
            $initialMatches,
        );
        preg_match(
            '/<url><loc>'.preg_quote(route('home'), '/').'<\/loc><lastmod>([^<]+)<\/lastmod><\/url>/',
            $updatedXml,
            $updatedMatches,
        );

        $this->assertNotSame($initialMatches[1] ?? null, $updatedMatches[1] ?? null);
    }

    public function test_missing_route_renders_inertia_error_page(): void
    {
        $this->get('/this-page-does-not-exist')
            ->assertStatus(404)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Error')
                ->where('status', 404));
    }

    public function test_internal_server_error_renders_inertia_error_page(): void
    {
        \Illuminate\Support\Facades\Route::get('/_test-internal-error', function (): void {
            throw new \RuntimeException('Simulated error');
        });

        $this->get('/_test-internal-error')
            ->assertStatus(500)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Error')
                ->where('status', 500));
    }
}
