<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            return;
        }

        DB::statement('ALTER TABLE projects ALTER COLUMN cover_image_url TYPE VARCHAR(2048)');
        DB::statement('ALTER TABLE projects ALTER COLUMN repo_url TYPE VARCHAR(2048)');
        DB::statement('ALTER TABLE projects ALTER COLUMN live_url TYPE VARCHAR(2048)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            return;
        }

        DB::statement('ALTER TABLE projects ALTER COLUMN cover_image_url TYPE VARCHAR(255)');
        DB::statement('ALTER TABLE projects ALTER COLUMN repo_url TYPE VARCHAR(255)');
        DB::statement('ALTER TABLE projects ALTER COLUMN live_url TYPE VARCHAR(255)');
    }
};
