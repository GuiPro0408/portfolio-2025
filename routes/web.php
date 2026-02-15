<?php

use App\Http\Controllers\Admin\ProjectController as AdminProjectController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
Route::get('/projects/{project:slug}', [ProjectController::class, 'show'])->name('projects.show');

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard/projects', [AdminProjectController::class, 'index'])->name('dashboard.projects.index');
    Route::get('/dashboard/projects/create', [AdminProjectController::class, 'create'])->name('dashboard.projects.create');
    Route::post('/dashboard/projects', [AdminProjectController::class, 'store'])->name('dashboard.projects.store');
    Route::get('/dashboard/projects/{project}/edit', [AdminProjectController::class, 'edit'])->name('dashboard.projects.edit');
    Route::put('/dashboard/projects/{project}', [AdminProjectController::class, 'update'])->name('dashboard.projects.update');
    Route::delete('/dashboard/projects/{project}', [AdminProjectController::class, 'destroy'])->name('dashboard.projects.destroy');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
