<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->unique()->sentence(3);

        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'summary' => fake()->text(180),
            'body' => fake()->paragraphs(4, true),
            'stack' => 'Laravel, React, PostgreSQL',
            'cover_image_url' => fake()->imageUrl(1200, 675, 'technology'),
            'repo_url' => fake()->url(),
            'live_url' => fake()->url(),
            'is_featured' => false,
            'is_published' => false,
            'published_at' => null,
            'sort_order' => fake()->numberBetween(0, 50),
        ];
    }

    public function published(): static
    {
        return $this->state(fn () => [
            'is_published' => true,
            'published_at' => fake()->dateTimeBetween('-1 year', 'now'),
        ]);
    }

    public function featured(): static
    {
        return $this->state(fn () => [
            'is_featured' => true,
        ]);
    }
}
