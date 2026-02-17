<?php

namespace App\Http\Controllers;

use App\Actions\Public\ResolveContactPayload;
use App\Http\Requests\ContactRequest;
use App\Jobs\SendContactSubmissionNotification;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class ContactController extends Controller
{
    public function __construct(
        private readonly ResolveContactPayload $resolveContactPayload,
    ) {}

    public function index(): Response
    {
        return Inertia::render('Contact', [
            'contact' => $this->resolveContactPayload->resolve(),
            'formStartedAt' => now()->timestamp,
        ]);
    }

    public function store(ContactRequest $request)
    {
        $validated = $request->validated();

        try {
            SendContactSubmissionNotification::dispatch([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'message' => $validated['message'],
            ]);
        } catch (Throwable) {
            return redirect()
                ->route('contact.index')
                ->with('error', 'Message could not be queued right now. Please try again in a moment.');
        }

        return redirect()
            ->route('contact.index')
            ->with('success', 'Message sent successfully. I will get back to you soon.');
    }
}
