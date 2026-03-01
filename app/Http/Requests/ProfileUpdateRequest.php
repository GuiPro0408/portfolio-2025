<?php

namespace App\Http\Requests;

use App\Models\User;
use App\Support\OwnerAuthorization;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return OwnerAuthorization::isOwner($this->user());
    }

    /**
     * Lock the owner email to the configured value to prevent accidental lockout.
     * The owner's identity is tied to PORTFOLIO_OWNER_EMAIL; changing it would
     * immediately revoke owner access.
     */
    protected function prepareForValidation(): void
    {
        if (OwnerAuthorization::isOwner($this->user())) {
            $this->merge(['email' => $this->user()->email]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
        ];
    }
}
