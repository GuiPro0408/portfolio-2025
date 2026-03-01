<?php

namespace App\Http\Requests;

use App\Support\OwnerAuthorization;
use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectSortRequest extends FormRequest
{
    public function authorize(): bool
    {
        return OwnerAuthorization::isOwner($this->user());
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'sort_order' => ['required', 'integer', 'min:0'],
        ];
    }
}
