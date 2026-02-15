<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->index(['is_published', 'updated_at']);
            $table->index(['is_featured', 'updated_at']);
            $table->index(['sort_order', 'updated_at']);
            $table->index('title');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropIndex(['is_published', 'updated_at']);
            $table->dropIndex(['is_featured', 'updated_at']);
            $table->dropIndex(['sort_order', 'updated_at']);
            $table->dropIndex(['title']);
        });
    }
};
