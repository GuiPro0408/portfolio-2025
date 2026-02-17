# Deployment Quick Guide (Mirror)

> Canonical source: `docs/DEPLOY.md`.

This file is a quick entry point. Operational deployment contracts are defined in canonical docs.

## Deployment Baseline
1. Configure Koyeb PostgreSQL.
2. Deploy service from repository `Dockerfile`.
3. Set required environment variables listed in [docs/DEPLOY.md](docs/DEPLOY.md).
4. Run migrations:
   - First deploy: `koyeb services exec <service>/web -- php artisan migrate --seed --force`
   - Subsequent deploys: `koyeb services exec <service>/web -- php artisan migrate --force`

Production env policy:
- `.env.docker.local` and `.env.docker.example` are local-only developer files.
- Koyeb production must use platform environment variables.
- `docker-compose.yml` is development-only; use `docker-compose.prod.yml` only for self-hosted production parity.

## Post-Deploy Verification
- Public app loads.
- Owner authentication + verification flow works.
- Projects/homepage settings workflows are operational.

## Canonical References
- [docs/DEPLOY.md](docs/DEPLOY.md)
- [docs/HARNESS.md](docs/HARNESS.md)
- [docs/SYSTEM-OF-RECORD.md](docs/SYSTEM-OF-RECORD.md)
