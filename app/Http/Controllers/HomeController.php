<?php

namespace App\Http\Controllers;

use App\Actions\Home\ResolveHomePayload;
use App\Actions\Public\ResolveContactPayload;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __construct(
        private readonly ResolveContactPayload $resolveContactPayload,
        private readonly ResolveHomePayload $resolveHomePayload,
    ) {}

    public function index(): Response
    {
        $payload = $this->resolveHomePayload->resolve();

        return Inertia::render('Welcome', [
            ...$payload,
            'contact' => $this->resolveContactPayload->resolve(),
        ])->withViewData([
            'heroImageUrl' => data_get($payload, 'homepageSettings.hero_image_url'),
        ]);
    }
}
