<?php

namespace Database\Seeders;

use App\Models\HomepageSettings;
use Illuminate\Database\Seeder;

class HomepageSettingsSeeder extends Seeder
{
    /**
     * @var array<string, list<string>>
     */
    private const DEFAULT_IMAGE_CANDIDATES = [
        'hero_image_url' => [
            'images/homepage/hero/hero-studio-16x10.webp',
            'images/homepage/hero/*.webp',
            'images/homepage/hero/*.png',
            'images/homepage/hero/*.jpg',
            'images/homepage/hero/*.jpeg',
        ],
        'featured_image_1_url' => [
            'images/homepage/featured/featured-01-16x10.webp',
            'images/homepage/featured/*.webp',
            'images/homepage/featured/*.png',
            'images/homepage/featured/*.jpg',
            'images/homepage/featured/*.jpeg',
        ],
        'featured_image_2_url' => [
            'images/homepage/featured/featured-02-16x10.webp',
            'images/homepage/featured/*.webp',
            'images/homepage/featured/*.png',
            'images/homepage/featured/*.jpg',
            'images/homepage/featured/*.jpeg',
        ],
        'featured_image_3_url' => [
            'images/homepage/featured/featured-03-16x10.webp',
            'images/homepage/featured/*.webp',
            'images/homepage/featured/*.png',
            'images/homepage/featured/*.jpg',
            'images/homepage/featured/*.jpeg',
        ],
        'capabilities_image_url' => [
            'images/homepage/sections/capabilities-architecture-21x9.webp',
            'images/homepage/sections/*.webp',
            'images/homepage/sections/*.png',
            'images/homepage/sections/*.jpg',
            'images/homepage/sections/*.jpeg',
        ],
        'process_image_url' => [
            'images/homepage/sections/process-flow-21x9.webp',
            'images/homepage/sections/*.webp',
            'images/homepage/sections/*.png',
            'images/homepage/sections/*.jpg',
            'images/homepage/sections/*.jpeg',
        ],
    ];

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        HomepageSettings::query()->updateOrCreate(
            ['singleton_key' => 1],
            [
                'singleton_key' => 1,
                ...HomepageSettings::defaults(),
                ...$this->resolveDefaultImageUrls(),
            ],
        );
    }

    /**
     * @return array<string, string|null>
     */
    private function resolveDefaultImageUrls(): array
    {
        $resolved = [];

        foreach (self::DEFAULT_IMAGE_CANDIDATES as $field => $candidates) {
            $resolved[$field] = $this->resolveDefaultImageUrl($candidates);
        }

        return $resolved;
    }

    /**
     * @param  list<string>  $candidates
     */
    private function resolveDefaultImageUrl(array $candidates): ?string
    {
        foreach ($candidates as $candidate) {
            if (str_contains($candidate, '*')) {
                $matches = glob(public_path($candidate)) ?: [];

                if ($matches === []) {
                    continue;
                }

                sort($matches);
                $first = reset($matches);

                if (is_string($first) && $first !== '') {
                    return '/'.ltrim(str_replace(public_path(), '', $first), '/');
                }

                continue;
            }

            $absolutePath = public_path($candidate);
            if (is_file($absolutePath)) {
                return '/'.ltrim($candidate, '/');
            }
        }

        return null;
    }
}
