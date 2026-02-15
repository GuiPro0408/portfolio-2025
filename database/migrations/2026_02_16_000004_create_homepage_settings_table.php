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
        Schema::create('homepage_settings', function (Blueprint $table) {
            $table->id();

            $table->string('hero_eyebrow');
            $table->string('hero_headline');
            $table->text('hero_subheadline');
            $table->string('hero_primary_cta_label');
            $table->string('hero_secondary_cta_label');
            $table->string('hero_side_title');

            $table->string('featured_section_title');
            $table->text('featured_section_subtitle');
            $table->string('capabilities_title');
            $table->text('capabilities_subtitle');
            $table->string('process_title');
            $table->text('process_subtitle');
            $table->string('final_cta_title');
            $table->text('final_cta_subtitle');
            $table->string('final_cta_button_label');

            $table->string('hero_image_url')->nullable();
            $table->string('featured_image_1_url')->nullable();
            $table->string('featured_image_2_url')->nullable();
            $table->string('featured_image_3_url')->nullable();
            $table->string('capabilities_image_url')->nullable();
            $table->string('process_image_url')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('homepage_settings');
    }
};
