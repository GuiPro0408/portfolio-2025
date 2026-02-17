<?php

namespace Tests\Unit;

use App\Actions\Cache\InvalidatePublicCaches;
use App\Support\PublicCacheKeys;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class InvalidatePublicCachesTest extends TestCase
{
    public function test_action_clears_home_payload_variants_and_sitemap_cache(): void
    {
        foreach (PublicCacheKeys::homePayloadVariants() as $homePayloadKey) {
            Cache::put($homePayloadKey, ['cached' => true], 600);
        }
        Cache::put(PublicCacheKeys::SITEMAP_XML, '<xml/>', 600);

        $action = app(InvalidatePublicCaches::class);
        $action->handle();

        foreach (PublicCacheKeys::homePayloadVariants() as $homePayloadKey) {
            $this->assertFalse(Cache::has($homePayloadKey));
        }
        $this->assertFalse(Cache::has(PublicCacheKeys::SITEMAP_XML));
    }
}
