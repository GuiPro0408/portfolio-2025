<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'owner' => \App\Http\Middleware\EnsureOwner::class,
            'prevent.duplicate' => \App\Http\Middleware\PreventDuplicateSubmission::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->respond(function (Response $response, \Throwable $exception, Request $request): Response {
            $status = $response->getStatusCode();

            if ($status === 419) {
                return redirect()
                    ->back()
                    ->with('error', 'The page expired. Please try again.')
                    ->toResponse($request);
            }

            if (
                ! app()->environment('local')
                && ! $request->expectsJson()
                && in_array($status, [403, 404, 500, 503], true)
            ) {
                return Inertia::render('Error', [
                    'status' => $status,
                    'contact' => [
                        'email' => config('portfolio.email'),
                        'linkedin' => config('portfolio.linkedin'),
                        'github' => config('portfolio.github'),
                    ],
                ])->toResponse($request)->setStatusCode($status);
            }

            return $response;
        });
    })->create();
