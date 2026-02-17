<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('homepage_settings', function (Blueprint $table): void {
            $table->unsignedTinyInteger('singleton_key')->default(1)->after('id');
        });

        $canonicalId = DB::table('homepage_settings')
            ->orderByDesc('updated_at')
            ->orderByDesc('id')
            ->value('id');

        if (is_int($canonicalId) || is_string($canonicalId)) {
            DB::table('homepage_settings')
                ->where('id', '!=', (int) $canonicalId)
                ->delete();

            DB::table('homepage_settings')
                ->where('id', (int) $canonicalId)
                ->update(['singleton_key' => 1]);
        }

        Schema::table('homepage_settings', function (Blueprint $table): void {
            $table->unique('singleton_key');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('homepage_settings', function (Blueprint $table): void {
            $table->dropUnique(['singleton_key']);
            $table->dropColumn('singleton_key');
        });
    }
};
