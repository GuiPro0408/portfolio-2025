<?php

namespace App\Support;

use App\Models\HomepageSettings;

class HomepageSettingsContract
{
    /**
     * @var list<string>
     */
    public const PUBLIC_FIELDS = [
        'hero_eyebrow',
        'hero_headline',
        'hero_subheadline',
        'hero_primary_cta_label',
        'hero_secondary_cta_label',
        'hero_side_title',
        'featured_section_title',
        'featured_section_subtitle',
        'capabilities_title',
        'capabilities_subtitle',
        'process_title',
        'process_subtitle',
        'final_cta_title',
        'final_cta_subtitle',
        'final_cta_button_label',
        'hero_image_url',
        'featured_image_1_url',
        'featured_image_2_url',
        'featured_image_3_url',
        'capabilities_image_url',
        'process_image_url',
    ];

    /**
     * @var array<string, string>
     */
    public const IMAGE_FIELDS = [
        'hero_image_url' => 'hero',
        'featured_image_1_url' => 'featured',
        'featured_image_2_url' => 'featured',
        'featured_image_3_url' => 'featured',
        'capabilities_image_url' => 'sections',
        'process_image_url' => 'sections',
    ];

    /**
     * @return array<string, mixed>
     */
    public static function publicPayload(HomepageSettings $settings): array
    {
        return $settings->only(self::PUBLIC_FIELDS);
    }
}
