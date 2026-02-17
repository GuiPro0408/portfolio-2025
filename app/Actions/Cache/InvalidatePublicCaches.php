<?php

namespace App\Actions\Cache;

use App\Support\PublicCacheKeys;
use Illuminate\Support\Facades\Cache;

class InvalidatePublicCaches
{
    public function handle(): void
    {
        foreach (PublicCacheKeys::homePayloadVariants() as $homePayloadKey) {
            Cache::forget($homePayloadKey);
        }

        Cache::forget(PublicCacheKeys::SITEMAP_XML);
    }
}
