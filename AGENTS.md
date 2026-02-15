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
- `make setup-ci`: deterministic CI install (`composer install` + `npm ci`).
- `make dev`: run local dev stack (`composer run dev`).
- `make check`: validate + lint + test + frontend build (CI parity).
- `make check-docker`: run the same check set through Docker services.
- `make format`: auto-format PHP with Pint.
- `make test`: run backend tests.
- `make build`: build frontend assets.

Docker parity:
- Start stack: `docker compose up -d`
- Run parity checks: `make check-docker`

## Safe Feature Workflow
1. Confirm boundaries in `docs/ARCHITECTURE.md`.
2. Add backend behavior in `app/` (request validation, controller orchestration, domain logic).
3. Add UI behavior in `resources/js/Pages` and reusable pieces in `resources/js/Components`.
4. Add/update tests in `tests/Feature` or `tests/Unit`.
5. Run `make check` before opening a PR.
6. Update docs in `docs/` when behavior or workflow changes.
7. Keep root `README.md` and `docs/README.md` links/summaries aligned with current implemented routes and contracts.
8. Ask for explicit user permission before creating any commit.

## Definition Of Done
- Behavior implemented with correct Laravel/Inertia boundary.
- Tests added/updated for changed behavior.
- `make check` passes locally.
- `make check-docker` passes when Docker workflow is used.
- CI uses the same check path (`make check`) and passes.
- Docs remain accurate, with `docs/` as canonical source.
