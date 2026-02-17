# Local Setup (Mirror)

> Canonical source: `docs/README.md` and `docs/HARNESS.md`.

This file is a short entry point. Keep deep setup and workflow contracts in canonical docs.

## Preferred Paths

### Docker-first
```bash
docker compose up -d
make check-docker
```

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
