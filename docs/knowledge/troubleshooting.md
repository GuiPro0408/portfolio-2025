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
5. If Docker reports missing `.env.docker.local`, create it from template:
   ```bash
   cp .env.docker.example .env.docker.local
   ```

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

## 10) Home page returns 200 but appears blank
Symptom:
- `GET /` is `200`, but the UI is empty/blank.

Actions:
1. Check browser console for runtime errors such as:
   - `Cannot convert a Symbol value to a string`
2. Confirm the issue from CLI with Playwright:
   ```bash
   node -e "const { chromium } = require('playwright'); (async()=>{ const browser = await chromium.launch({headless:true}); const page = await browser.newPage(); page.on('pageerror', e=>console.log('PAGEERROR', e.message)); page.on('console', m=>m.type()==='error' && console.log('CONSOLE', m.text())); await page.goto('http://localhost:8000', {waitUntil:'networkidle'}); console.log('bodyTextLength', (await page.locator('body').innerText()).length); await browser.close(); })();"
   ```
3. Check for React fragments inside Inertia `<Head>` blocks:
   ```bash
   rg -n "<Head|<>|</>" resources/js/Pages -S
   ```
4. If fragments are found inside `<Head>`, replace grouped fragments with separate conditional nodes.

## 11) Docker app fails at startup with seeder/owner errors
Symptom:
- `app` container exits or logs a seeding error about owner credentials.

Actions:
1. Verify owner seed env vars are set in Docker env:
   ```bash
   docker compose exec app sh -lc 'printenv | grep -E "PORTFOLIO_OWNER_EMAIL|PORTFOLIO_OWNER_PASSWORD|AUTO_MIGRATE_AND_SEED|PORTFOLIO_SEED_PROJECTS"'
   ```
2. Ensure `PORTFOLIO_OWNER_PASSWORD` is non-empty.
3. Re-run bootstrap after updating env:
   ```bash
   docker compose up -d --build app
   docker compose logs --tail=200 app
   ```
