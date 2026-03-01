# Harness Contract

This document is the single source of truth for repository command behavior.

## Canonical Commands
- `make setup`: local dependency install (`composer install`, `npm install`)
- `make setup-ci`: deterministic CI install (`composer install --no-progress`, `npm ci`)
- `make dev`: native local development workflow with preflight checks, database bootstrap, and concurrent app/queue/logs/vite processes
- `make run-project-locally`: alias for `make dev`
- `make docs-check`: documentation + agent workflow contract integrity checks
- `make prod-readiness`: validate production deployment guardrails (dev/prod compose split + env policy)
- `make check`: full quality gate (validation, lint, static analysis, tests, type checks, frontend build)
- `make analyse`: static analysis with Larastan/PHPStan
- `make check-docker`: full parity checks inside running Docker services
- `make format`: PHP auto-format (`./vendor/bin/pint`)
- `make test`: backend test suite (`php artisan test`)
- `make build`: frontend production build (`vite build`)

## CI Parity Mapping
1. `make setup-ci`
2. `make docs-check`
3. `make check`

This sequence is the canonical non-browser CI quality path.

`make check` and `make check-docker` both include:
1. `make docs-check`
2. `composer validate --strict`
3. `composer run lint:php`
4. `composer run lint:static`
5. `composer test`
6. `npm run lint`
7. `npm run typecheck`
8. `npm run build`

`make docs-check` includes:
1. `./scripts/check-docs.sh`
2. `./scripts/check-prod-readiness.sh`
3. `node scripts/check-agent-contract.mjs`
4. `node scripts/check-memory-registry.mjs`

## Browser Smoke Path
- Browser smoke tests run through Playwright with:
  - `npm run test:e2e`
- CI job prerequisites:
  - seeded SQLite database
  - built frontend assets restored from the `frontend-build` artifact produced by the `build` job
  - running PHP application server

## Change Rules
- Any change to command behavior must update:
  - `Makefile`
  - this document (`docs/HARNESS.md`)
  - `.github/workflows/ci.yml` if CI behavior changes
