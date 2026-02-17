<?php

namespace App\Http\Requests;

use App\Support\OwnerAuthorization;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class UpdateHomepageSettingsRequest extends FormRequest
{
    /**
     * @var array<string, string>
     */
    private const IMAGE_FIELDS = [
        'hero_image_url' => 'hero',
        'featured_image_1_url' => 'featured',
        'featured_image_2_url' => 'featured',
        'featured_image_3_url' => 'featured',
        'capabilities_image_url' => 'sections',
        'process_image_url' => 'sections',
    ];

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return OwnerAuthorization::isOwner($this->user());
    }

    protected function prepareForValidation(): void
    {
        $normalized = [];

        foreach (self::IMAGE_FIELDS as $field => $folder) {
            $rawValue = trim((string) $this->input($field, ''));

            if ($rawValue === '') {
                $normalized[$field] = null;

                continue;
            }

            if ($this->isAbsoluteReference($rawValue)) {
                $normalized[$field] = $rawValue;

                continue;
            }

            if ($this->isImageFilename($rawValue)) {
                $normalized[$field] = '/images/homepage/'.$folder.'/'.$rawValue;

                continue;
            }

            $normalized[$field] = $rawValue;
        }

        $this->merge($normalized);
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
            'hero_image_url' => ['nullable', 'string', 'max:2048', $this->validateImageReference(...)],
            'featured_image_1_url' => ['nullable', 'string', 'max:2048', $this->validateImageReference(...)],
            'featured_image_2_url' => ['nullable', 'string', 'max:2048', $this->validateImageReference(...)],
            'featured_image_3_url' => ['nullable', 'string', 'max:2048', $this->validateImageReference(...)],
            'capabilities_image_url' => ['nullable', 'string', 'max:2048', $this->validateImageReference(...)],
            'process_image_url' => ['nullable', 'string', 'max:2048', $this->validateImageReference(...)],
        ];
    }

    /**
     * @param  \Closure(string): void  $fail
     */
    private function validateImageReference(string $attribute, mixed $value, \Closure $fail): void
    {
        if (! is_string($value) || trim($value) === '') {
            return;
        }

        if ($this->isAbsoluteReference($value) || $this->isAppPathReference($value)) {
            return;
        }

        $fail("The {$attribute} must be a valid image URL or a local image path.");
    }

    private function isAbsoluteReference(string $value): bool
    {
        return Str::startsWith($value, ['http://', 'https://']);
    }

    private function isAppPathReference(string $value): bool
    {
        return Str::startsWith($value, ['/images/', 'images/']) && $this->isImageFilename($value);
    }

    private function isImageFilename(string $value): bool
    {
        return (bool) preg_match('/^[A-Za-z0-9._\\/-]+\.(webp|png|jpe?g|avif|svg)$/i', $value);
    }
}
