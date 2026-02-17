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
                ->values();

            foreach ($technologyIds as $technologyId) {
                $exists = DB::table('project_technology')
                    ->where('project_id', $project->id)
                    ->where('technology_id', $technologyId)
                    ->exists();

                if (! $exists) {
                    DB::table('project_technology')->insert([
                        'project_id' => $project->id,
                        'technology_id' => $technologyId,
                    ]);
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // This data backfill is intentionally non-reversible to avoid destructive rollbacks.
        // Existing technology and pivot rows may include records created after the migration ran.
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
