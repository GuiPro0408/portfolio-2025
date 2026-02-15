<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Response;

class SeoController extends Controller
{
    public function sitemap(): Response
    {
        $urls = collect([
            route('home'),
            route('projects.index'),
            route('contact.index'),
        ])->merge(
            Project::query()
                ->published()
                ->orderedPublic()
                ->pluck('slug')
                ->map(fn (string $slug) => route('projects.show', $slug))
        )->values();

        $xmlEntries = $urls
            ->map(fn (string $url) => '    <url><loc>'.htmlspecialchars($url, ENT_QUOTES, 'UTF-8').'</loc></url>')
            ->implode("\n");

        $xml = implode("\n", [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
            $xmlEntries,
            '</urlset>',
        ]);

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
