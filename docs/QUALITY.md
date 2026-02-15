# Quality Harness

This repository uses one golden command path for quality checks.

## Golden Commands
- `make setup`: install dependencies (`composer install`, `npm install`)
- `make setup-ci`: deterministic CI install (`composer install`, `npm ci`)
- `make dev`: run local development workflow (`composer run dev`)
- `make check`: full CI-parity quality gate
- `make check-docker`: Docker parity check gate (`app` + `vite` services)
- `make format`: auto-fix PHP formatting with Pint
- `make test`: backend tests
- `make build`: frontend production build

## Toolchain Baseline
- PHP: 8.3
- Node.js: 20.x (see `.nvmrc`)

## What `make check` Runs
1. `composer validate --strict`
2. `composer run lint:php` (`./vendor/bin/pint --test`)
3. `composer test` (`php artisan test`)
4. `npm run build`

## CI Parity
- CI installs dependencies with `make setup-ci`, then runs `make check`.
- Local quality expectation before PR: run `make check` and keep it green.
- Docker quality expectation: run `make check-docker` after `docker compose up -d`.

## Formatting And Tests
- Canonical PHP formatter: `make format` (Laravel Pint).
- Canonical CI style gate: `make check` (includes `pint --test` via `composer run lint:php`).
- Backend behavior changes require tests in `tests/Feature` and/or `tests/Unit`.
- Frontend changes must at least pass `npm run build`.

## Commit / PR Expectations
- Keep PRs focused and reviewable.
- Do not mix unrelated refactors with feature fixes.
- If architecture/workflow changes, update docs in `docs/` in the same PR.
- A PR is ready when `make check` passes locally and in CI.
