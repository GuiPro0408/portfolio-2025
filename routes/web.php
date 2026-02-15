<?php

use App\Http\Controllers\Admin\HomepageSettingsController;
use App\Http\Controllers\Admin\ProjectController as AdminProjectController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SeoController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/contact', [ContactController::class, 'index'])->name('contact.index');
Route::post('/contact', [ContactController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('contact.store');

Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
Route::get('/projects/{project:slug}', [ProjectController::class, 'show'])->name('projects.show');
Route::get('/sitemap.xml', [SeoController::class, 'sitemap'])->name('seo.sitemap');
Route::get('/robots.txt', [SeoController::class, 'robots'])->name('seo.robots');

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard/projects', [AdminProjectController::class, 'index'])->name('dashboard.projects.index');
    Route::get('/dashboard/projects/create', [AdminProjectController::class, 'create'])->name('dashboard.projects.create');
    Route::post('/dashboard/projects', [AdminProjectController::class, 'store'])->name('dashboard.projects.store');
    Route::get('/dashboard/projects/{project}/edit', [AdminProjectController::class, 'edit'])->name('dashboard.projects.edit');
    Route::put('/dashboard/projects/{project}', [AdminProjectController::class, 'update'])->name('dashboard.projects.update');
    Route::patch('/dashboard/projects/{project}/flags', [AdminProjectController::class, 'updateFlags'])->name('dashboard.projects.flags.update');
    Route::post('/dashboard/projects/{project}/duplicate', [AdminProjectController::class, 'duplicate'])->name('dashboard.projects.duplicate');
    Route::patch('/dashboard/projects/{project}/sort', [AdminProjectController::class, 'updateSort'])->name('dashboard.projects.sort.update');
    Route::delete('/dashboard/projects/{project}', [AdminProjectController::class, 'destroy'])->name('dashboard.projects.destroy');
    Route::get('/dashboard/homepage', [HomepageSettingsController::class, 'edit'])->name('dashboard.homepage.edit');
    Route::put('/dashboard/homepage', [HomepageSettingsController::class, 'update'])->name('dashboard.homepage.update');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
