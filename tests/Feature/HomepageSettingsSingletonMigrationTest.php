<?php

namespace Tests\Feature;

use App\Models\HomepageSettings;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class HomepageSettingsSingletonMigrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_singleton_migration_consolidates_rows_using_latest_updated_at_then_id(): void
    {
        Schema::table('homepage_settings', function (Blueprint $table): void {
            $table->dropUnique(['singleton_key']);
            $table->dropColumn('singleton_key');
        });

        $olderId = DB::table('homepage_settings')->insertGetId([
            ...HomepageSettings::defaults(),
            'hero_headline' => 'Older row',
            'created_at' => now()->subDay(),
            'updated_at' => now()->subDay(),
        ]);

        $newerId = DB::table('homepage_settings')->insertGetId([
            ...HomepageSettings::defaults(),
            'hero_headline' => 'Newest row',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $sameTimestampHighId = DB::table('homepage_settings')->insertGetId([
            ...HomepageSettings::defaults(),
            'hero_headline' => 'Newest row tie-break',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->assertNotSame($olderId, $newerId);
        $this->assertNotSame($newerId, $sameTimestampHighId);

        $migration = require database_path('migrations/2026_02_17_000009_add_singleton_key_to_homepage_settings_table.php');
        $this->assertTrue(method_exists($migration, 'up'));
        call_user_func([$migration, 'up']);

        $this->assertDatabaseCount('homepage_settings', 1);
        $this->assertDatabaseHas('homepage_settings', [
            'id' => $sameTimestampHighId,
            'hero_headline' => 'Newest row tie-break',
            'singleton_key' => 1,
        ]);
    }

    public function test_singleton_migration_down_drops_singleton_key_column(): void
    {
        $migration = require database_path('migrations/2026_02_17_000009_add_singleton_key_to_homepage_settings_table.php');
        $this->assertTrue(method_exists($migration, 'down'));

        call_user_func([$migration, 'down']);

        $this->assertFalse(Schema::hasColumn('homepage_settings', 'singleton_key'));
    }
}
