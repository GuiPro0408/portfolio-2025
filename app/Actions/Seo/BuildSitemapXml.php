<?php

namespace App\Actions\Seo;

use App\Models\HomepageSettings;
use App\Models\Project;
use Carbon\CarbonInterface;
use Illuminate\Support\Carbon;

class BuildSitemapXml
{
    public function build(): string
    {
        $homepageUpdatedAt = HomepageSettings::query()->value('updated_at');
        $projectsUpdatedAt = Project::query()->published()->max('updated_at');

        $homeLastmod = $this->toIsoLastmod($this->maxTimestamp(
            $this->toTimestamp($homepageUpdatedAt),
            $this->toTimestamp($projectsUpdatedAt),
        ));

        $urls = collect([
            ['loc' => route('home'), 'lastmod' => $homeLastmod],
            ['loc' => route('projects.index'), 'lastmod' => $this->toIsoLastmod($this->toTimestamp($projectsUpdatedAt))],
            ['loc' => route('contact.index'), 'lastmod' => $this->toIsoLastmod($this->toTimestamp($homepageUpdatedAt))],
        ])->merge(
            Project::query()
                ->published()
                ->orderedPublic()
                ->get(['slug', 'updated_at', 'published_at'])
                ->map(fn (Project $project) => [
                    'loc' => route('projects.show', $project->slug),
                    'lastmod' => $this->toIsoLastmod($project->updated_at ?? $project->published_at),
                ])
        )->values();

        $xmlEntries = $urls
            ->map(function (array $entry): string {
                $lastmodXml = is_string($entry['lastmod']) && $entry['lastmod'] !== ''
                    ? '<lastmod>'.$entry['lastmod'].'</lastmod>'
                    : '';

                return '    <url><loc>'
                    .htmlspecialchars((string) $entry['loc'], ENT_QUOTES, 'UTF-8')
                    .'</loc>'
                    .$lastmodXml
                    .'</url>';
            })
            ->implode("\n");

        return implode("\n", [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
            $xmlEntries,
            '</urlset>',
        ]);
    }

    private function maxTimestamp(?CarbonInterface $a, ?CarbonInterface $b): ?CarbonInterface
    {
        if ($a === null) {
            return $b;
        }

        if ($b === null) {
            return $a;
        }

        return $a->greaterThan($b) ? $a : $b;
    }

    private function toTimestamp(mixed $value): ?CarbonInterface
    {
        if ($value instanceof CarbonInterface) {
            return $value;
        }

        if (! is_string($value) || trim($value) === '') {
            return null;
        }

        return Carbon::parse($value);
    }

    private function toIsoLastmod(?CarbonInterface $timestamp): ?string
    {
        return $timestamp?->copy()->utc()->toAtomString();
    }
}
