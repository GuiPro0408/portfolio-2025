# Quality Harness

This repository uses one golden command path for quality checks.

## Golden Commands
- `make setup`: install dependencies (`composer install`, `npm install`)
- `make dev`: run local development workflow (`composer run dev`)
- `make check`: full CI-parity quality gate
- `make format`: auto-fix PHP formatting with Pint
- `make test`: backend tests
- `make build`: frontend production build

## What `make check` Runs
1. `composer validate --strict`
2. `composer run lint:php` (`./vendor/bin/pint --test`)
3. `composer test` (`php artisan test`)
4. `npm run build`

## CI Parity
- CI installs dependencies, then runs `make check`.
- Local quality expectation before PR: run `make check` and keep it green.

## Formatting And Tests
- PHP formatting is enforced with Laravel Pint.
- Backend behavior changes require tests in `tests/Feature` and/or `tests/Unit`.
- Frontend changes must at least pass `npm run build`.

## Commit / PR Expectations
- Keep PRs focused and reviewable.
- Do not mix unrelated refactors with feature fixes.
- If architecture/workflow changes, update docs in `docs/` in the same PR.
- A PR is ready when `make check` passes locally and in CI.
