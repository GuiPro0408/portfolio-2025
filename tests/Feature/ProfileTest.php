<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_profile_page_is_displayed(): void
    {
        $user = $this->ownerUser();

        $response = $this
            ->actingAs($user)
            ->get('/profile');

        $response->assertOk();
    }

    public function test_non_owner_cannot_access_profile_page(): void
    {
        $this->ownerUser();
        $user = User::factory()->create();

        $this->actingAs($user)->get('/profile')->assertForbidden();
    }

    public function test_profile_information_can_be_updated(): void
    {
        $user = $this->ownerUser();

        $response = $this
            ->actingAs($user)
            ->patch('/profile', [
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/profile');

        $user->refresh();

        $this->assertSame('Test User', $user->name);
        $this->assertSame('test@example.com', $user->email);
        $this->assertNull($user->email_verified_at);
    }

    public function test_email_verification_status_is_unchanged_when_the_email_address_is_unchanged(): void
    {
        $user = $this->ownerUser();

        $response = $this
            ->actingAs($user)
            ->patch('/profile', [
                'name' => 'Test User',
                'email' => $user->email,
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/profile');

        $this->assertNotNull($user->refresh()->email_verified_at);
    }

    public function test_owner_cannot_delete_their_account(): void
    {
        $user = $this->ownerUser();

        $response = $this
            ->actingAs($user)
            ->delete('/profile', [
                'password' => 'password',
            ]);

        $response->assertRedirect('/profile');
        $response->assertSessionHas('error', 'Owner account deletion is disabled.');
        $this->assertAuthenticatedAs($user);
        $this->assertNotNull($user->fresh());
    }

    public function test_owner_account_deletion_is_blocked_even_with_wrong_password(): void
    {
        $user = $this->ownerUser();

        $response = $this
            ->actingAs($user)
            ->from('/profile')
            ->delete('/profile', [
                'password' => 'wrong-password',
            ]);

        $response->assertRedirect('/profile');
        $response->assertSessionHas('error', 'Owner account deletion is disabled.');
        $response->assertSessionDoesntHaveErrors('password');

        $this->assertNotNull($user->fresh());
    }
}
