<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ContactFormSubmissionNotification extends Notification
{
    use Queueable;

    /**
     * @param  array{name: string, email: string, message: string}  $payload
     */
    public function __construct(
        private readonly array $payload,
    ) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New portfolio contact message from '.$this->payload['name'])
            ->replyTo($this->payload['email'], $this->payload['name'])
            ->line('You received a new contact request from the portfolio website.')
            ->line('Name: '.$this->payload['name'])
            ->line('Email: '.$this->payload['email'])
            ->line('Message:')
            ->line($this->payload['message']);
    }
}
