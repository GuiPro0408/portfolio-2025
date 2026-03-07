# Architecture

This project is Laravel 12 + Breeze (React/Inertia) with Vite.
Current development mode is SQLite-first. Koyeb/PostgreSQL remains the deferred deployment target.

## Request/Response Boundaries
- Routing lives in `routes/web.php` and `routes/auth.php`.
- Public HTTP surface includes `/`, `/projects`, `/projects/{slug}`, `/contact`, `/sitemap.xml`, and `/robots.txt`.
- Auth/owner surface includes `/login`, password reset routes, owner email verification routes, `/dashboard`, `/dashboard/projects/*`, `/dashboard/homepage`, and `/profile`.
- Public registration is disabled for the single-owner deployment model.
- Controllers in `app/Http/Controllers` orchestrate requests and return Inertia responses or redirects.
- Validation belongs in Form Requests (`app/Http/Requests`) when reusable or non-trivial.
- Shared Inertia props are defined in `app/Http/Middleware/HandleInertiaRequests.php`.
- Flash feedback for authenticated UI is shared via Inertia `flash.success` / `flash.error` props.
- Public page controllers should pass a consistent `contact` prop contract when rendering pages using `PublicLayout`.
- Contact page responses also pass `formStartedAt` so the frontend can enforce timed anti-spam validation with the backend contract.
- Dashboard/admin routes require `auth + verified + owner` middleware (owner from `PORTFOLIO_OWNER_EMAIL`).
- Dashboard/admin write routes add duplicate-submission protection middleware (`prevent.duplicate`) to guard accidental replay/double-submit actions.
- Profile reads/writes live behind authenticated routes; owner-specific profile restrictions are enforced in controller/request logic rather than duplicated in the frontend alone.

## Business Logic Placement
- Keep controllers thin: parsing input, auth checks, orchestration only.
- Put reusable domain/business logic in dedicated classes under `app/` (for example `app/Actions` or `app/Services`).
- List query/filter/sort orchestration lives in action classes under `app/Actions/Projects` (public and admin index resolvers).
- Project duplication behavior lives in `app/Actions/Projects/DuplicateProject`.
- Technology synchronization from the legacy `stack` string into the relational pivot lives in `app/Actions/Projects/SyncProjectTechnologies`.
- Shared public contact payload resolution lives in `app/Actions/Public/ResolveContactPayload` and is reused by public controllers.
- Contact form delivery is asynchronous via queued job dispatch (`SendContactSubmissionNotification`) with retries.
- Home page payload assembly and caching live in `app/Actions/Home/ResolveHomePayload`.
- Sitemap XML construction lives in `app/Actions/Seo/BuildSitemapXml`.
- Public cache invalidation behavior lives in `app/Actions/Cache/InvalidatePublicCaches` and is reused by admin write flows.
- Keep persistence concerns in Eloquent models (`app/Models`) and migrations (`database/migrations`).

## Frontend Boundaries (Inertia/React)
- Inertia page entrypoints live in `resources/js/Pages`.
- Current public pages are `Welcome`, `Projects/Index`, `Projects/Show`, and `Contact`.
- Current authenticated pages are `Dashboard`, `Dashboard/Projects/Index`, `Dashboard/Projects/Create`, `Dashboard/Projects/Edit`, `Dashboard/Homepage/Edit`, and `Profile/Edit`, plus the Breeze auth pages.
- Layout shells live in `resources/js/Layouts`.
- Reusable UI components live in `resources/js/Components`.
- Shared TypeScript type contracts live in `resources/js/types` (`PaginationShape<T>`, `SharedPageProps`, `ContactPayload`, etc.).
- Shared utility functions live in `resources/js/utils` (e.g. `resolveSocialImage` for SEO image resolution).
- App bootstrap and page resolution live in `resources/js/app.tsx`.
- Frontend source under `resources/js` is TypeScript-only (`.ts` / `.tsx`) with strict type checking.
- Global style tokens and section-level styles are split under `resources/css/styles/` to keep concerns maintainable.
- CSS in `resources/css/styles/` must use nesting for selector relationships to keep style hierarchy explicit and reduce duplicated flat selectors.
- Dashboard design primitives live under `resources/js/Components/Dashboard` and should be reused across authenticated pages.
- Shared filtering primitives live under `resources/js/Components/Filters` (`ListboxSelect`, `ActiveFilterChips`) and must be reused between public and dashboard list pages.
- List pages (`/projects`, `/dashboard/projects`) are server-driven and should use Inertia partial reloads (`only`) rather than local in-memory datasets.
- Large dashboard collections should use virtualized rendering windows (`@tanstack/react-virtual`) to cap DOM node count while preserving row semantics.
- Route-level CSS loading is enforced via layout/page imports (`PublicLayout`, `AuthenticatedLayout`, and page-specific imports like `Contact`) instead of app-wide style imports.
- Shared public chrome lives in `PublicHeader` and `PublicFooter`; authenticated dashboard chrome lives in `AuthenticatedLayout` and the dashboard design primitives.

## UI Performance Baseline
- `/projects` and `/dashboard/projects` remain server-driven filter UIs with partial reload discipline and active criteria chips.
- Dashboard project rows remain virtualized; preserve table semantics, accessibility roles, and inline row actions when changing rendering behavior.
- Route-specific CSS loading remains separated by surface (`PublicLayout`, `AuthenticatedLayout`, and page-specific imports) rather than app-wide imports.

## Data/Schema Boundaries
- Schema changes: `database/migrations`.
- Seed data: `database/seeders`.
- Test data factories: `database/factories`.
- Core persisted tables for product behavior are `users`, `projects`, `homepage_settings`, `technologies`, and `project_technology`, with framework tables for cache and jobs.
- Project stack taxonomy is modeled relationally (`projects` <-> `technologies` via pivot) and should be the filtering source of truth.
- `technologies` and `project_technology` are baseline schema requirements; runtime `Schema::hasTable(...)` fallbacks are intentionally removed from request paths.
- `Technology.name_normalized` stores a lowercase version of the technology name and is used for case-insensitive filtering in public query resolution.
- Public payload caching (homepage/sitemap) must use explicit cache keys with clear invalidation on project/homepage-admin writes.
- Project cover images may be stored on the public disk under `/storage/projects/covers/...`; request validation must allow either a direct URL/app path or an uploaded image file.
- Backfill data migrations that cannot be safely reversed should use non-destructive `down()` no-op behavior and be documented as irreversible.

## Content Configuration Pattern
- Structured content entities (for example homepage copy/images) are modeled in Eloquent (`app/Models`) and edited through authenticated dashboard routes.
- Public controllers map model-backed content to explicit Inertia props.
- Dashboard settings flows use Form Requests for validation and thin controllers for update orchestration.
- Project management flows include list/search/filter/sort, create/edit forms, duplication, inline flag updates, and sort-order updates through explicit controller actions and validated requests.
- Homepage settings request normalization handles friendly image inputs (filename-only values) and maps them to app-local asset paths before persistence.
- Owner profile management supports password updates, but owner email changes and owner account deletion remain intentionally restricted.

## Where To Put New Code
- New route: add in `routes/*.php`.
- New page flow: route -> controller -> Inertia page in `resources/js/Pages/...`.
- New backend behavior: controller + request validation + service/action class as needed.
- New reusable UI: create component in `resources/js/Components` and compose from pages/layouts.
- New TypeScript type contract: add in `resources/js/types`.
- New shared utility function: add in `resources/js/utils`.
- New business rule: unit test in `tests/Unit` and feature/integration coverage in `tests/Feature`.
- Bundle hygiene adjustments: prefer route-level lazy boundaries first (Inertia page resolution); add Vite chunk tuning only for verified leakage.
