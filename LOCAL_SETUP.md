# Local Setup (Mirror)

> Canonical source: `docs/README.md` and `docs/HARNESS.md`.

This file is a short entry point. Keep deep setup and workflow contracts in canonical docs.

## Preferred Paths

### Docker-first
```bash
cp .env.docker.example .env.docker.local
docker compose up -d
make check-docker
```

Notes:
- Docker app startup runs `php artisan migrate --seed --force` when `AUTO_MIGRATE_AND_SEED=true` (see `.env.docker.local`).
- Docker seeding skips demo projects by default via `PORTFOLIO_SEED_PROJECTS=false`.
- `.env.docker.local` is local-only and should not be committed.
- `docker-compose.yml` is development-only; production guidance is in `docs/DEPLOY.md`.

### Native toolchain
```bash
make setup
make docs-check
make check
make dev
```

Notes:
- `make dev` runs local preflight checks, creates `.env` when missing, generates `APP_KEY` when needed, prepares the SQLite database, and bootstraps migrations/seeders if the database is not ready.
- Use the manual Laravel bootstrap steps only if you need to inspect or override the preflight behavior described in `docs/HARNESS.md`.

## Canonical References
- [docs/README.md](docs/README.md)
- [docs/HARNESS.md](docs/HARNESS.md)
- [docs/QUALITY.md](docs/QUALITY.md)
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
