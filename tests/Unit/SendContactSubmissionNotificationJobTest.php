<?php

namespace Tests\Unit;

use App\Jobs\SendContactSubmissionNotification;
use App\Notifications\ContactFormSubmissionNotification;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class SendContactSubmissionNotificationJobTest extends TestCase
{
    public function test_job_sends_on_demand_contact_notification(): void
    {
        Notification::fake();
        config()->set('portfolio.email', 'portfolio@example.com');

        $job = new SendContactSubmissionNotification([
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'message' => 'Hello there',
        ]);

        $job->handle();

        Notification::assertSentOnDemand(ContactFormSubmissionNotification::class);
    }

    public function test_job_backoff_schedule_matches_retry_policy(): void
    {
        $job = new SendContactSubmissionNotification([
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'message' => 'Hello there',
        ]);

        $this->assertSame([60, 180, 600, 1800, 3600], $job->backoff());
    }
}
