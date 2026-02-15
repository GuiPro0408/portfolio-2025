# Architecture

This project is Laravel 12 + Breeze (React/Inertia) with Vite.
Current development mode is SQLite-first. Koyeb/PostgreSQL remains the deferred deployment target.

## Request/Response Boundaries
- Routing lives in `routes/web.php` and `routes/auth.php`.
- Controllers in `app/Http/Controllers` orchestrate requests and return Inertia responses or redirects.
- Validation belongs in Form Requests (`app/Http/Requests`) when reusable or non-trivial.
- Shared Inertia props are defined in `app/Http/Middleware/HandleInertiaRequests.php`.

## Business Logic Placement
- Keep controllers thin: parsing input, auth checks, orchestration only.
- Put reusable domain/business logic in dedicated classes under `app/` (for example `app/Actions` or `app/Services`).
- Keep persistence concerns in Eloquent models (`app/Models`) and migrations (`database/migrations`).

## Frontend Boundaries (Inertia/React)
- Inertia page entrypoints live in `resources/js/Pages`.
- Layout shells live in `resources/js/Layouts`.
- Reusable UI components live in `resources/js/Components`.
- App bootstrap and page resolution live in `resources/js/app.jsx`.
- Global style tokens and section-level styles are split under `resources/css/styles/` to keep concerns maintainable.

## Data/Schema Boundaries
- Schema changes: `database/migrations`.
- Seed data: `database/seeders`.
- Test data factories: `database/factories`.

## Content Configuration Pattern
- Structured content entities (for example homepage copy/images) are modeled in Eloquent (`app/Models`) and edited through authenticated dashboard routes.
- Public controllers map model-backed content to explicit Inertia props.
- Dashboard settings flows use Form Requests for validation and thin controllers for update orchestration.

## Where To Put New Code
- New route: add in `routes/*.php`.
- New page flow: route -> controller -> Inertia page in `resources/js/Pages/...`.
- New backend behavior: controller + request validation + service/action class as needed.
- New reusable UI: create component in `resources/js/Components` and compose from pages/layouts.
- New business rule: unit test in `tests/Unit` and feature/integration coverage in `tests/Feature`.
