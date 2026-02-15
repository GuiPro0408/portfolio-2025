<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HomepageSettings extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
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

    public static function current(): self
    {
        return static::query()->firstOrCreate([], static::defaults());
    }

    /**
     * @return array<string, string|null>
     */
    public static function defaults(): array
    {
        return [
            'hero_eyebrow' => 'Full-Stack Web Developer',
            'hero_headline' => 'I design and build web products that move real business goals.',
            'hero_subheadline' => 'Mauritius-based engineer focused on clean architecture, practical delivery, and interfaces people actually enjoy using.',
            'hero_primary_cta_label' => 'Start a conversation',
            'hero_secondary_cta_label' => 'Explore projects',
            'hero_side_title' => 'Why teams work with me',
            'featured_section_title' => 'Featured Projects',
            'featured_section_subtitle' => 'A focused sample of recent work with product impact and clean implementation.',
            'capabilities_title' => 'What I Build',
            'capabilities_subtitle' => 'Practical product development from business idea to reliable release.',
            'process_title' => 'How I Work',
            'process_subtitle' => 'A lightweight, transparent process built for speed and quality.',
            'final_cta_title' => 'Looking for a full-stack developer who ships with discipline?',
            'final_cta_subtitle' => 'I am open to impactful product roles and freelance collaborations.',
            'final_cta_button_label' => 'Get in touch',
            'hero_image_url' => null,
            'featured_image_1_url' => null,
            'featured_image_2_url' => null,
            'featured_image_3_url' => null,
            'capabilities_image_url' => null,
            'process_image_url' => null,
        ];
    }
}
