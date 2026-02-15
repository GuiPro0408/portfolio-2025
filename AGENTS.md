# AGENTS.md

## Purpose
Use this file as the working contract for agents in this repository.

- `docs/` is the system of record.
- Keep changes small and reviewable.
- Do not print secret values from `.env` files.

## Repo Map
- `app/`: Laravel controllers, requests, models, providers.
- `routes/`: Web/auth route entrypoints.
- `resources/js/`: Inertia React app (`Pages`, `Layouts`, `Components`).
- `database/`: Migrations, factories, seeders.
- `.github/workflows/ci.yml`: CI pipeline.
- `docs/`: Canonical architecture, quality, and deployment guidance.

## Golden Commands
- `make setup`: install PHP and Node dependencies.
- `make dev`: run local dev stack (`composer run dev`).
- `make check`: validate + lint + test + frontend build (CI parity).
- `make format`: auto-format PHP with Pint.
- `make test`: run backend tests.
- `make build`: build frontend assets.

Docker parity checks:
- `docker compose exec app composer validate --strict`
- `docker compose exec app composer run lint:php`
- `docker compose exec app composer test`
- `docker compose exec vite npm run build`

## Safe Feature Workflow
1. Confirm boundaries in `docs/ARCHITECTURE.md`.
2. Add backend behavior in `app/` (request validation, controller orchestration, domain logic).
3. Add UI behavior in `resources/js/Pages` and reusable pieces in `resources/js/Components`.
4. Add/update tests in `tests/Feature` or `tests/Unit`.
5. Run `make check` before opening a PR.
6. Update docs in `docs/` when behavior or workflow changes.

## Definition Of Done
- Behavior implemented with correct Laravel/Inertia boundary.
- Tests added/updated for changed behavior.
- `make check` passes locally.
- CI uses the same check path (`make check`) and passes.
- Docs remain accurate, with `docs/` as canonical source.
