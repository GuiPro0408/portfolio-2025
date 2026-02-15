<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHomepageSettingsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'hero_eyebrow' => ['required', 'string', 'max:255'],
            'hero_headline' => ['required', 'string', 'max:255'],
            'hero_subheadline' => ['required', 'string', 'max:2000'],
            'hero_primary_cta_label' => ['required', 'string', 'max:255'],
            'hero_secondary_cta_label' => ['required', 'string', 'max:255'],
            'hero_side_title' => ['required', 'string', 'max:255'],
            'featured_section_title' => ['required', 'string', 'max:255'],
            'featured_section_subtitle' => ['required', 'string', 'max:2000'],
            'capabilities_title' => ['required', 'string', 'max:255'],
            'capabilities_subtitle' => ['required', 'string', 'max:2000'],
            'process_title' => ['required', 'string', 'max:255'],
            'process_subtitle' => ['required', 'string', 'max:2000'],
            'final_cta_title' => ['required', 'string', 'max:255'],
            'final_cta_subtitle' => ['required', 'string', 'max:2000'],
            'final_cta_button_label' => ['required', 'string', 'max:255'],
            'hero_image_url' => ['nullable', 'url', 'max:2048'],
            'featured_image_1_url' => ['nullable', 'url', 'max:2048'],
            'featured_image_2_url' => ['nullable', 'url', 'max:2048'],
            'featured_image_3_url' => ['nullable', 'url', 'max:2048'],
            'capabilities_image_url' => ['nullable', 'url', 'max:2048'],
            'process_image_url' => ['nullable', 'url', 'max:2048'],
        ];
    }
}
