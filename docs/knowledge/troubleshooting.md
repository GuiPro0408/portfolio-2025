# Troubleshooting

Common issues and fast fixes for the repository harness.

## 1) Pint lint fails with little or no feedback
Symptom:
- `composer run lint:php` fails without obvious file context.

Actions:
1. Run verbose lint directly:
   ```bash
   ./vendor/bin/pint --test -v
   ```
2. Auto-fix formatting:
   ```bash
   make format
   ```
3. Re-run `make check`.

## 2) CI caching seems ineffective
Symptom:
- CI dependency steps are unexpectedly slow on repeated runs.

Actions:
1. Confirm `composer.lock` and `package-lock.json` are committed and stable.
2. Avoid changing dependency manifests unless required.
3. Verify workflow still uses setup-node npm cache and Composer cache step.

## 3) `make check-docker` fails because containers are unavailable
Symptom:
- `docker compose exec` errors about missing/running services.

Actions:
1. Start services first:
   ```bash
   docker compose up -d
   ```
2. Confirm service health:
   ```bash
   docker compose ps
   ```
3. If `app` exits with Composer write errors under `/var/www/html/vendor`, recreate the dependency volumes:
   ```bash
   docker compose down -v
   docker compose up -d
   ```
4. Retry `make check-docker`.

## 4) `make dev` fails on a fresh clone
Symptom:
- Dependencies are missing and dev startup fails.

Actions:
1. Run:
   ```bash
   make setup
   ```
2. Re-run:
   ```bash
   make dev
   ```

## 5) Frontend build fails during `make check`
Symptom:
- `npm run build` exits with Vite errors.

Actions:
1. Ensure dependencies are installed (`make setup` or `make setup-ci`).
2. Run build standalone to isolate:
   ```bash
   npm run build
   ```
3. Fix import/path errors, then rerun `make check`.

## 8) Frontend lint fails during `make check`
Symptom:
- `npm run lint` reports ESLint rule violations.

Actions:
1. Run lint standalone to isolate:
   ```bash
   npm run lint
   ```
2. If safe to auto-fix stylistic findings:
   ```bash
   npm run lint:fix
   ```
3. Re-run `make check`.

## 6) Tests pass locally but fail in CI
Symptom:
- `composer test` succeeds locally, fails in pipeline.

Actions:
1. Run CI-like flow locally:
   ```bash
   make setup-ci
   make check
   ```
2. Verify tests do not depend on machine-specific state.
3. Keep assertions deterministic and isolated.

## 7) Rolling back backfill migrations unexpectedly leaves data in place
Symptom:
- `php artisan migrate:rollback` does not remove rows from historical backfill migrations.

Actions:
1. Confirm whether the migration is intentionally irreversible (non-destructive `down()`).
2. Treat rollback as schema-only for those migrations and use explicit cleanup migrations for data changes.
3. Document any manual remediation plan before running rollback in shared environments.

## 9) Investigating Docker runtime errors quickly
Symptom:
- App errors are hard to trace from Docker output alone.

Actions:
1. Stream structured app logs from Docker:
   ```bash
   docker compose logs -f app
   ```
2. Inspect rotated Laravel file logs from the app container:
   ```bash
   docker compose exec app ls -lah storage/logs
   docker compose exec app tail -n 200 storage/logs/laravel.log
   ```
3. Filter only error-level messages from Docker logs:
   ```bash
   docker compose logs app | grep -iE '\"level\":\"(error|critical|alert|emergency)\"|\\berror\\b'
   ```
