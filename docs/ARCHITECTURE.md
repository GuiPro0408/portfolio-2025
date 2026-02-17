# Architecture

This project is Laravel 12 + Breeze (React/Inertia) with Vite.
Current development mode is SQLite-first. Koyeb/PostgreSQL remains the deferred deployment target.

## Request/Response Boundaries
- Routing lives in `routes/web.php` and `routes/auth.php`.
- Public registration is disabled for the single-owner deployment model.
- Controllers in `app/Http/Controllers` orchestrate requests and return Inertia responses or redirects.
- Validation belongs in Form Requests (`app/Http/Requests`) when reusable or non-trivial.
- Shared Inertia props are defined in `app/Http/Middleware/HandleInertiaRequests.php`.
- Flash feedback for authenticated UI is shared via Inertia `flash.success` / `flash.error` props.
- Public page controllers should pass a consistent `contact` prop contract when rendering pages using `PublicLayout`.
- Dashboard/admin routes require `auth + verified + owner` middleware (owner from `PORTFOLIO_OWNER_EMAIL`).

## Business Logic Placement
- Keep controllers thin: parsing input, auth checks, orchestration only.
- Put reusable domain/business logic in dedicated classes under `app/` (for example `app/Actions` or `app/Services`).
- List query/filter/sort orchestration lives in action classes under `app/Actions/Projects` (public and admin index resolvers).
- Project duplication behavior lives in `app/Actions/Projects/DuplicateProject`.
- Shared public contact payload resolution lives in `app/Actions/Public/ResolveContactPayload` and is reused by public controllers.
- Home page payload assembly and caching live in `app/Actions/Home/ResolveHomePayload`.
- Sitemap XML construction lives in `app/Actions/Seo/BuildSitemapXml`.
- Public cache invalidation behavior lives in `app/Actions/Cache/InvalidatePublicCaches` and is reused by admin write flows.
- Keep persistence concerns in Eloquent models (`app/Models`) and migrations (`database/migrations`).

## Frontend Boundaries (Inertia/React)
- Inertia page entrypoints live in `resources/js/Pages`.
- Layout shells live in `resources/js/Layouts`.
- Reusable UI components live in `resources/js/Components`.
- App bootstrap and page resolution live in `resources/js/app.tsx`.
- Frontend source under `resources/js` is TypeScript-only (`.ts` / `.tsx`) with strict type checking.
- Global style tokens and section-level styles are split under `resources/css/styles/` to keep concerns maintainable.
- CSS in `resources/css/styles/` must use nesting for selector relationships to keep style hierarchy explicit and reduce duplicated flat selectors.
- Dashboard design primitives live under `resources/js/Components/Dashboard` and should be reused across authenticated pages.
- Shared filtering primitives live under `resources/js/Components/Filters` (`ListboxSelect`, `ActiveFilterChips`) and must be reused between public and dashboard list pages.
- List pages (`/projects`, `/dashboard/projects`) are server-driven and should use Inertia partial reloads (`only`) rather than local in-memory datasets.
- Large dashboard collections should use virtualized rendering windows (`@tanstack/react-virtual`) to cap DOM node count while preserving row semantics.
- Route-level CSS loading is enforced via layout/page imports (`PublicLayout`, `AuthenticatedLayout`, and page-specific imports like `Contact`) instead of app-wide style imports.

## UI Performance Baseline
- `/projects` and `/dashboard/projects` remain server-driven filter UIs with partial reload discipline and active criteria chips.
- Dashboard project rows remain virtualized; preserve table semantics, accessibility roles, and inline row actions when changing rendering behavior.
- Route-specific CSS loading remains separated by surface (`PublicLayout`, `AuthenticatedLayout`, and page-specific imports) rather than app-wide imports.

## Data/Schema Boundaries
- Schema changes: `database/migrations`.
- Seed data: `database/seeders`.
- Test data factories: `database/factories`.
- Project stack taxonomy is modeled relationally (`projects` <-> `technologies` via pivot) and should be the filtering source of truth.
- Public payload caching (homepage/sitemap) must use explicit cache keys with clear invalidation on project/homepage-admin writes.
- Backfill data migrations that cannot be safely reversed should use non-destructive `down()` no-op behavior and be documented as irreversible.

## Content Configuration Pattern
- Structured content entities (for example homepage copy/images) are modeled in Eloquent (`app/Models`) and edited through authenticated dashboard routes.
- Public controllers map model-backed content to explicit Inertia props.
- Dashboard settings flows use Form Requests for validation and thin controllers for update orchestration.
- Project list workflow enhancements (search/filter/sort/inline flag updates) belong in admin controllers with explicit query contracts and validated toggle requests.
- Homepage settings request normalization handles friendly image inputs (filename-only values) and maps them to app-local asset paths before persistence.

## Where To Put New Code
- New route: add in `routes/*.php`.
- New page flow: route -> controller -> Inertia page in `resources/js/Pages/...`.
- New backend behavior: controller + request validation + service/action class as needed.
- New reusable UI: create component in `resources/js/Components` and compose from pages/layouts.
- New business rule: unit test in `tests/Unit` and feature/integration coverage in `tests/Feature`.
- Bundle hygiene adjustments: prefer route-level lazy boundaries first (Inertia page resolution); add Vite chunk tuning only for verified leakage.
