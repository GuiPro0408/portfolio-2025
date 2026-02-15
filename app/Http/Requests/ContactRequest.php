<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
            'website' => ['nullable', 'string'],
            'form_started_at' => ['required', 'integer', 'min:1'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator): void {
            $honeypot = trim((string) $this->input('website', ''));

            if ($honeypot !== '') {
                $validator->errors()->add('website', 'Invalid submission detected.');
            }

            $startedAt = (int) $this->input('form_started_at', 0);
            $ageInSeconds = now()->timestamp - $startedAt;

            if ($ageInSeconds < 3) {
                $validator->errors()->add('form_started_at', 'Please wait a few seconds before submitting.');
            }

            if ($ageInSeconds > 86400) {
                $validator->errors()->add('form_started_at', 'Form expired. Please reload and try again.');
            }
        });
    }
}
