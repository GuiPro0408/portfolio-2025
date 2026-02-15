<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $recentProjects = Project::query()
            ->latest('updated_at')
            ->limit(5)
            ->get()
            ->map(fn (Project $project) => [
                'id' => $project->id,
                'title' => $project->title,
                'slug' => $project->slug,
                'is_published' => $project->is_published,
                'is_featured' => $project->is_featured,
                'updated_at' => $project->updated_at->toDateTimeString(),
            ]);

        return Inertia::render('Dashboard', [
            'metrics' => [
                'total' => Project::count(),
                'published' => Project::where('is_published', true)->count(),
                'featured' => Project::where('is_featured', true)->count(),
            ],
            'recentProjects' => $recentProjects,
        ]);
    }
}
