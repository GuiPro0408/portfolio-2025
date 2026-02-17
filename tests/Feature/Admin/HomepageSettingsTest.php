<?php

namespace Tests\Feature\Admin;

use App\Models\HomepageSettings;
use App\Models\User;
use App\Support\PublicCacheKeys;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class HomepageSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_from_homepage_settings(): void
    {
        $this->get(route('dashboard.homepage.edit'))->assertRedirect(route('login'));
        $this->put(route('dashboard.homepage.update'), [])->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_open_homepage_settings_page(): void
    {
        $user = $this->ownerUser();

        $response = $this->actingAs($user)->get(route('dashboard.homepage.edit'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('Dashboard/Homepage/Edit'));
    }

    public function test_authenticated_users_can_update_homepage_settings(): void
    {
        $user = $this->ownerUser();
        HomepageSettings::query()->create(HomepageSettings::defaults());

        $payload = HomepageSettings::defaults();
        $payload['hero_headline'] = 'Custom headline from admin';
        $payload['hero_image_url'] = 'https://example.com/hero.jpg';

        $response = $this->actingAs($user)->put(route('dashboard.homepage.update'), $payload);

        $response->assertRedirect(route('dashboard.homepage.edit'));

        $this->assertDatabaseHas('homepage_settings', [
            'hero_headline' => 'Custom headline from admin',
            'hero_image_url' => 'https://example.com/hero.jpg',
        ]);
    }

    public function test_homepage_settings_update_validates_image_urls(): void
    {
        $user = $this->ownerUser();

        $payload = HomepageSettings::defaults();
        $payload['hero_image_url'] = 'not-a-url';

        $response = $this->actingAs($user)->put(route('dashboard.homepage.update'), $payload);

        $response->assertSessionHasErrors(['hero_image_url']);
    }

    public function test_homepage_settings_accepts_filename_only_image_inputs(): void
    {
        $user = $this->ownerUser();
        HomepageSettings::query()->create(HomepageSettings::defaults());

        $payload = HomepageSettings::defaults();
        $payload['hero_image_url'] = 'hero-studio-16x10.webp';
        $payload['featured_image_1_url'] = 'featured-01-16x10.webp';
        $payload['capabilities_image_url'] = 'capabilities-architecture-21x9.webp';

        $response = $this->actingAs($user)->put(route('dashboard.homepage.update'), $payload);

        $response->assertRedirect(route('dashboard.homepage.edit'));

        $this->assertDatabaseHas('homepage_settings', [
            'hero_image_url' => '/images/homepage/hero/hero-studio-16x10.webp',
            'featured_image_1_url' => '/images/homepage/featured/featured-01-16x10.webp',
            'capabilities_image_url' => '/images/homepage/sections/capabilities-architecture-21x9.webp',
        ]);
    }

    public function test_homepage_settings_update_clears_public_home_cache(): void
    {
        $user = $this->ownerUser();
        HomepageSettings::query()->create(HomepageSettings::defaults());
        Cache::put(PublicCacheKeys::HOME_PAYLOAD, ['cached' => true], 600);

        $this
            ->actingAs($user)
            ->put(route('dashboard.homepage.update'), HomepageSettings::defaults())
            ->assertRedirect(route('dashboard.homepage.edit'));

        $this->assertFalse(Cache::has(PublicCacheKeys::HOME_PAYLOAD));
    }

    public function test_non_owner_cannot_access_homepage_settings(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->get(route('dashboard.homepage.edit'))->assertForbidden();
        $this->actingAs($user)->put(route('dashboard.homepage.update'), HomepageSettings::defaults())->assertForbidden();
    }
}
