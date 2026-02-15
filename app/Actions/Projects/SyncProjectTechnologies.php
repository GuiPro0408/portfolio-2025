<?php

namespace App\Actions\Projects;

use App\Models\Project;
use App\Models\Technology;
use Illuminate\Support\Str;

class SyncProjectTechnologies
{
    public function sync(Project $project, ?string $stack): void
    {
        $tokens = self::extractTokens($stack);

        if ($tokens === []) {
            $project->technologies()->sync([]);

            return;
        }

        $technologyIds = collect($tokens)
            ->map(function (string $token): int {
                $normalized = self::normalizeToken($token);
                $displayName = self::displayName($token);

                $technology = Technology::query()->firstOrCreate(
                    ['name_normalized' => $normalized],
                    ['name' => $displayName],
                );

                if ($technology->name !== $displayName) {
                    $technology->forceFill(['name' => $displayName])->save();
                }

                return $technology->id;
            })
            ->unique()
            ->values()
            ->all();

        $project->technologies()->sync($technologyIds);
    }

    /**
     * @return array<int, string>
     */
    public static function extractTokens(?string $stack): array
    {
        if (! is_string($stack) || trim($stack) === '') {
            return [];
        }

        return collect(explode(',', $stack))
            ->map(fn (string $token) => trim(preg_replace('/\s+/', ' ', $token) ?? ''))
            ->filter(fn (string $token) => $token !== '')
            ->values()
            ->all();
    }

    public static function normalizeToken(string $token): string
    {
        return Str::lower(trim(preg_replace('/\s+/', ' ', $token) ?? ''));
    }

    public static function displayName(string $token): string
    {
        return trim(preg_replace('/\s+/', ' ', $token) ?? '');
    }
}
