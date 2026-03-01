<?php

namespace App\Actions\Public;

class ResolveContactPayload
{
    /**
     * @return array{email: mixed, linkedin: mixed, github: mixed}
     */
    public function resolve(): array
    {
        return [
            'email' => config('portfolio.email'),
            'linkedin' => config('portfolio.linkedin'),
            'github' => config('portfolio.github'),
        ];
    }
}
