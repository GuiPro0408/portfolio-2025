<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateHomepageSettingsRequest;
use App\Models\HomepageSettings;
use Inertia\Inertia;
use Inertia\Response;

class HomepageSettingsController extends Controller
{
    public function edit(): Response
    {
        $settings = HomepageSettings::current();

        return Inertia::render('Dashboard/Homepage/Edit', [
            'settings' => $settings->only([
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
            ]),
        ]);
    }

    public function update(UpdateHomepageSettingsRequest $request)
    {
        $settings = HomepageSettings::current();
        $settings->update($request->validated());

        return redirect()
            ->route('dashboard.homepage.edit')
            ->with('success', 'Homepage settings updated successfully.');
    }
}
