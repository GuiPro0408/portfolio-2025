<?php

namespace App\Jobs;

use App\Notifications\ContactFormSubmissionNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Throwable;

class SendContactSubmissionNotification implements ShouldQueue
{
    use Queueable;

    public int $tries = 5;

    /**
     * @param  array{name: string, email: string, message: string}  $payload
     */
    public function __construct(
        private readonly array $payload,
    ) {}

    /**
     * @return list<int>
     */
    public function backoff(): array
    {
        return [60, 180, 600, 1800, 3600];
    }

    public function handle(): void
    {
        Notification::route('mail', (string) config('portfolio.email'))
            ->notify(new ContactFormSubmissionNotification($this->payload));
    }

    public function failed(Throwable $exception): void
    {
        Log::error('Contact notification job failed.', [
            'name' => $this->payload['name'],
            'email' => $this->payload['email'],
            'exception_class' => $exception::class,
            'exception_message' => $exception->getMessage(),
        ]);
    }
}
