<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Remove all existing projects before seeding new ones
        Project::truncate();

        // Create new projects with specific attributes
        Project::factory()->create([
            'title' => 'Frontend Mentor - Age calculator app solution',
            'slug' => 'frontend-mentor-age-calculator-app-solution',
            'summary' => 'Age Calculator App: A sleek and user-friendly tool to calculate age from a given date, with built-in validation checks and responsive design. Practice your skills and enjoy an animated age display on submission!',
            'body' => 'Age Calculator App: A sleek and user-friendly tool to calculate age from a given date, with built-in validation checks and responsive design. Practice your skills and enjoy an animated age display on submission!',
            'stack' => 'HTML5, JS ES6, SCSS',
            'repo_url' => 'https://github.com/GuiPro0408/Age-Calculator',
            'live_url' => null,
            'cover_image_url' => null,
            'is_featured' => true,
            'is_published' => true,
            'published_at' => now(),
            'sort_order' => 1,
        ]);

        Project::factory()->create([
            'title' => 'Innovative Landscape Concept',
            'slug' => 'innovative-landscape-concept',
            'summary' => 'Innovative Landscape Concept is a landscaping company that provides high quality landscaping services.',
            'body' => 'Innovative Landscape Concept is a landscaping company that provides high quality landscaping services.',
            'stack' => 'HTML5, CSS, JS ES6',
            'repo_url' => null,
            'live_url' => 'https://www.innovativelandscapeconcept.mu/',
            'cover_image_url' => null,
            'is_featured' => true,
            'is_published' => true,
            'published_at' => now(),
            'sort_order' => 2,
        ]);

        Project::factory()->create([
            'title' => 'FiberWave Boatworks LTD',
            'slug' => 'fiberwave-boatworks-ltd',
            'summary' => 'Developed a full-stack web application for FiberWave Boatworks, a marine vessel restoration company, featuring a complete migration from a static PWA to a modern Next.js 15 architecture with dynamic content management capabilities.',
            'body' => "Developed a full-stack web application for FiberWave Boatworks, a marine vessel restoration company, featuring a complete migration from a static PWA to a modern Next.js 15 architecture with dynamic content management capabilities.\n\nKey Technical Achievements:\n• Architected a modern TypeScript-based application using Next.js 15 App Router with server-side rendering and API routes\n• Implemented a secure admin dashboard with session-based authentication for project and image management\n• Integrated Cloudinary for scalable media storage and Neon PostgreSQL for metadata persistence\n• Developed a dynamic before/after project gallery system with phase-based image organization and responsive carousels\n• Built a custom neumorphic design system with mobile-first responsive design and accessibility features (ARIA attributes, keyboard navigation)\n• Optimized performance through lazy loading, Next.js Image optimization, and server-side validation\n• Created a graceful fallback system allowing the marketing site to build and deploy independently of database availability\n• Established CI/CD pipeline with automated testing (Vitest), linting, and type-checking via GitHub Actions",
            'stack' => 'Next.js 15, TypeScript, React, PostgreSQL, Cloudinary, Formspree, Tailwind CSS, Vitest',
            'repo_url' => null,
            'live_url' => 'https://www.fiberwave-boatworks.mu/',
            'cover_image_url' => null,
            'is_featured' => true,
            'is_published' => true,
            'published_at' => now(),
            'sort_order' => 3,
        ]);
    }
}
