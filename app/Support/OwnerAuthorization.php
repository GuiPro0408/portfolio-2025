<?php

namespace App\Support;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Str;

class OwnerAuthorization
{
    public static function isOwner(?Authenticatable $user): bool
    {
        if ($user === null) {
            return false;
        }

        $ownerEmail = self::ownerEmail();

        if ($ownerEmail === '') {
            return false;
        }

        $email = data_get($user, 'email');

        return is_string($email)
            && hash_equals($ownerEmail, Str::lower(trim($email)));
    }

    public static function ownerEmail(): string
    {
        return Str::lower(trim((string) config('portfolio.owner_email', '')));
    }
}
