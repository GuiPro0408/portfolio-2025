<?php

namespace Tests\Feature;

use App\Jobs\SendContactSubmissionNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Bus;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ContactFormTest extends TestCase
{
    use RefreshDatabase;

    public function test_contact_page_is_rendered(): void
    {
        $response = $this->get(route('contact.index'));

        $response
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Contact')
                ->where('formStartedAt', fn ($value) => is_int($value) && $value > 0)
                ->has('contact'));
    }

    public function test_valid_contact_submission_sends_email_notification(): void
    {
        Bus::fake();
        config()->set('portfolio.email', 'portfolio@example.com');

        $response = $this->post(route('contact.store'), [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'message' => 'I want to discuss a product build.',
            'website' => '',
            'form_started_at' => now()->subSeconds(5)->timestamp,
        ]);

        $response
            ->assertRedirect(route('contact.index'))
            ->assertSessionHas('success');

        Bus::assertDispatched(SendContactSubmissionNotification::class);
    }

    public function test_contact_submission_rejects_honeypot_and_fast_submission(): void
    {
        Bus::fake();

        $response = $this->from(route('contact.index'))->post(route('contact.store'), [
            'name' => 'Spam Bot',
            'email' => 'bot@example.com',
            'message' => 'Spam',
            'website' => 'https://spam.example.com',
            'form_started_at' => now()->timestamp,
        ]);

        $response
            ->assertRedirect(route('contact.index'))
            ->assertSessionHasErrors(['website', 'form_started_at']);

        Bus::assertNotDispatched(SendContactSubmissionNotification::class);
    }

    public function test_contact_submission_is_rate_limited(): void
    {
        Bus::fake();

        $payload = [
            'name' => 'Rate Test',
            'email' => 'rate@example.com',
            'message' => 'Checking throttle',
            'website' => '',
            'form_started_at' => now()->subSeconds(10)->timestamp,
        ];

        for ($attempt = 1; $attempt <= 5; $attempt++) {
            $this->post(route('contact.store'), $payload)->assertRedirect(route('contact.index'));
        }

        $this->post(route('contact.store'), $payload)->assertStatus(429);
    }

    public function test_contact_submission_returns_controlled_error_when_queue_dispatch_fails(): void
    {
        Bus::shouldReceive('dispatch')->once()->andThrow(new \RuntimeException('Queue unavailable'));

        $response = $this->post(route('contact.store'), [
            'name' => 'Queue Test',
            'email' => 'queue@example.com',
            'message' => 'Queue dispatch should fail gracefully.',
            'website' => '',
            'form_started_at' => now()->subSeconds(5)->timestamp,
        ]);

        $response
            ->assertRedirect(route('contact.index'))
            ->assertSessionHas('error');
    }
}
