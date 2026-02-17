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

### Native toolchain
```bash
make setup
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
make dev
```

## Required Quality Checks
```bash
make docs-check
make check
```

## Canonical References
- [docs/README.md](docs/README.md)
- [docs/HARNESS.md](docs/HARNESS.md)
- [docs/QUALITY.md](docs/QUALITY.md)
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
