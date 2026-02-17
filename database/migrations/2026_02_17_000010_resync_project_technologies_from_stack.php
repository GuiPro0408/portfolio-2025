<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $projects = DB::table('projects')
            ->select(['id', 'stack'])
            ->orderBy('id')
            ->get();

        foreach ($projects as $project) {
            $technologyIds = collect(self::extractTokens($project->stack))
                ->map(function (string $token): int {
                    $normalized = self::normalizeToken($token);
                    $displayName = self::displayName($token);

                    $existing = DB::table('technologies')
                        ->where('name_normalized', $normalized)
                        ->first();

                    if ($existing !== null) {
                        if ((string) $existing->name !== $displayName) {
                            DB::table('technologies')
                                ->where('id', $existing->id)
                                ->update([
                                    'name' => $displayName,
                                    'updated_at' => now(),
                                ]);
                        }

                        return (int) $existing->id;
                    }

                    return (int) DB::table('technologies')->insertGetId([
                        'name' => $displayName,
                        'name_normalized' => $normalized,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                })
                ->unique()
                ->values()
                ->all();

            $currentIds = DB::table('project_technology')
                ->where('project_id', $project->id)
                ->pluck('technology_id')
                ->map(fn ($technologyId) => (int) $technologyId)
                ->values()
                ->all();

            $toAttach = array_values(array_diff($technologyIds, $currentIds));
            $toDetach = array_values(array_diff($currentIds, $technologyIds));

            if ($toDetach !== []) {
                DB::table('project_technology')
                    ->where('project_id', $project->id)
                    ->whereIn('technology_id', $toDetach)
                    ->delete();
            }

            foreach ($toAttach as $technologyId) {
                DB::table('project_technology')->insert([
                    'project_id' => $project->id,
                    'technology_id' => $technologyId,
                ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Intentionally non-destructive.
    }

    /**
     * @return array<int, string>
     */
    private static function extractTokens(?string $stack): array
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

    private static function normalizeToken(string $token): string
    {
        return Str::lower(trim(preg_replace('/\s+/', ' ', $token) ?? ''));
    }

    private static function displayName(string $token): string
    {
        return trim(preg_replace('/\s+/', ' ', $token) ?? '');
    }
};
