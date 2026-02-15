<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactRequest;
use App\Notifications\ContactFormSubmissionNotification;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Contact', [
            'contact' => $this->contactPayload(),
            'formStartedAt' => now()->timestamp,
        ]);
    }

    public function store(ContactRequest $request)
    {
        $validated = $request->validated();

        Notification::route('mail', (string) config('portfolio.email'))
            ->notify(new ContactFormSubmissionNotification([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'message' => $validated['message'],
            ]));

        return redirect()
            ->route('contact.index')
            ->with('success', 'Message sent successfully. I will get back to you soon.');
    }

    /**
     * @return array{email: mixed, linkedin: mixed, github: mixed}
     */
    private function contactPayload(): array
    {
        return [
            'email' => config('portfolio.email'),
            'linkedin' => config('portfolio.linkedin'),
            'github' => config('portfolio.github'),
        ];
    }
}
