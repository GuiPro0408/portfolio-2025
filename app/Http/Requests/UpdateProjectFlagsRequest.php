<?php

namespace App\Http\Requests;

use App\Support\OwnerAuthorization;
use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectFlagsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return OwnerAuthorization::isOwner($this->user());
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'is_featured' => ['required', 'boolean'],
            'is_published' => ['required', 'boolean'],
        ];
    }
}
