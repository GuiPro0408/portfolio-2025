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
        $technologyTablesReady = $this->technologyTablesReady();

        $payload = $this->resolveHomePayload->resolve($technologyTablesReady);

        return Inertia::render('Welcome', [
            ...$payload,
            'contact' => $this->resolveContactPayload->resolve(),
        ]);
    }
}
