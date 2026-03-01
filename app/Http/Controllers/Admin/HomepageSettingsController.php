<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Cache\InvalidatePublicCaches;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateHomepageSettingsRequest;
use App\Models\HomepageSettings;
use App\Support\HomepageSettingsContract;
use Inertia\Inertia;
use Inertia\Response;

class HomepageSettingsController extends Controller
{
    public function __construct(
        private readonly InvalidatePublicCaches $invalidatePublicCaches,
    ) {}

    public function edit(): Response
    {
        $settings = HomepageSettings::current();

        return Inertia::render('Dashboard/Homepage/Edit', [
            'settings' => HomepageSettingsContract::publicPayload($settings),
        ]);
    }

    public function update(UpdateHomepageSettingsRequest $request)
    {
        $settings = HomepageSettings::current();
        $settings->update($request->validated());
        $this->invalidatePublicCaches->handle();

        return redirect()
            ->route('dashboard.homepage.edit')
            ->with('success', 'Homepage settings updated successfully.');
    }
}
