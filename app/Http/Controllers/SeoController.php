<?php

namespace App\Http\Controllers;

use App\Actions\Seo\BuildSitemapXml;
use App\Support\PublicCacheKeys;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;

class SeoController extends Controller
{
    public function __construct(
        private readonly BuildSitemapXml $buildSitemapXml,
    ) {}

    public function sitemap(): Response
    {
        $xml = Cache::remember(
            PublicCacheKeys::SITEMAP_XML,
            now()->addMinutes(30),
            fn (): string => $this->buildSitemapXml->build()
        );

        return response($xml, 200, [
            'Content-Type' => 'application/xml; charset=UTF-8',
        ]);
    }

    public function robots(): Response
    {
        $robots = implode("\n", [
            'User-agent: *',
            'Allow: /',
            '',
            'Sitemap: '.route('seo.sitemap'),
        ]);

        return response($robots, 200, [
            'Content-Type' => 'text/plain; charset=UTF-8',
        ]);
    }
}
