<?php

namespace App\Actions\Seo;

use App\Models\Project;

class BuildSitemapXml
{
    public function build(): string
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

        return implode("\n", [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
            $xmlEntries,
            '</urlset>',
        ]);
    }
}
