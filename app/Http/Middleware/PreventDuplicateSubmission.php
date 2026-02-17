<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class PreventDuplicateSubmission
{
    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE'], true)) {
            return $next($request);
        }

        $ttlSeconds = max((int) config('portfolio.replay_guard_ttl', 10), 1);
        $cacheKey = $this->cacheKey($request);

        if (! Cache::add($cacheKey, true, now()->addSeconds($ttlSeconds))) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Duplicate submission detected. Please wait before retrying.',
                ], 409);
            }

            return redirect()
                ->back(303)
                ->with('error', 'Duplicate submission detected. Please wait before retrying.');
        }

        return $next($request);
    }

    private function cacheKey(Request $request): string
    {
        $userId = $request->user()?->getAuthIdentifier() ?? 'guest';
        $payload = $this->normalizedPayload($request->except(['_token', '_method']));

        return implode(':', [
            'request-replay',
            (string) $userId,
            strtolower($request->method()),
            trim($request->path(), '/'),
            hash('sha256', json_encode($payload) ?: ''),
        ]);
    }

    private function normalizedPayload(mixed $value): mixed
    {
        if (! is_array($value)) {
            return $value;
        }

        if (array_is_list($value)) {
            return array_map(fn ($item) => $this->normalizedPayload($item), $value);
        }

        ksort($value);

        foreach ($value as $key => $item) {
            $value[$key] = $this->normalizedPayload($item);
        }

        return $value;
    }
}
