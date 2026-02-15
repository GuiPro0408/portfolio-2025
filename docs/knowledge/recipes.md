# Recipes

Step-by-step patterns for common engineering tasks in this repository.

## 1) Add a new Inertia page
1. Create a page component in `resources/js/Pages`.
2. Add a route in `routes/web.php`.
3. Return the page from a controller or route closure using `Inertia::render(...)`.
4. Add/update feature tests.
5. Run `make check`.

## 2) Add a Laravel service class + tests
1. Create a service/action class under `app/` (for example `app/Services`).
2. Keep controller logic thin and call the service from controllers.
3. Add unit tests in `tests/Unit` for service behavior.
4. Add feature tests in `tests/Feature` where HTTP flow is affected.
5. Run `make check`.

## 3) Add request validation for a new form
1. Create a Form Request in `app/Http/Requests`.
2. Move validation rules out of controller into the Form Request.
3. Update controller method signature to use the Form Request.
4. Add tests for validation success/failure paths.
5. Run `make check`.

## 4) Update deployment-related configuration safely
1. Document the operational change in `docs/DEPLOY.md`.
2. Keep secret values out of repository docs.
3. Verify migration/runtime implications.
4. If process changed, update `docs/QUALITY.md` or `docs/knowledge/*`.
5. Run `make check`.

## 5) Add a new ADR
1. Copy ADR structure from existing entries in `docs/decisions/`.
2. Use next number (`0004-...`, `0005-...`).
3. Fill in: Title, Status, Context/Problem, Decision, Consequences.
4. Link the ADR from `docs/README.md`.
5. Open PR with a short rationale.

## 6) Validate Docker parity before merging
1. Start containers:
   ```bash
   docker compose up -d
   ```
2. Run:
   ```bash
   make check-docker
   ```
3. If successful, run native `make check` as well when possible.
