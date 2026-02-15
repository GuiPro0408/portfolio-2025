<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $featuredProjects = Project::query()
            ->published()
            ->where('is_featured', true)
            ->orderedPublic()
            ->limit(3)
            ->get()
            ->map(fn (Project $project) => [
                'id' => $project->id,
                'title' => $project->title,
                'slug' => $project->slug,
                'summary' => $project->summary,
                'stack' => $project->stack,
                'cover_image_url' => $project->cover_image_url,
                'published_at' => $project->published_at?->toDateString(),
            ]);

        return Inertia::render('Welcome', [
            'featuredProjects' => $featuredProjects,
            'contact' => [
                'email' => config('portfolio.email'),
                'linkedin' => config('portfolio.linkedin'),
                'github' => config('portfolio.github'),
            ],
        ]);
    }
}
