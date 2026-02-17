# Deploy Runbook (Koyeb)

This document is the canonical deployment reference for this repository.
Deployment is currently deferred while active development continues on SQLite locally.

## Platform
- Runtime: Docker (`Dockerfile`)
- Host: Koyeb
- Database: Koyeb PostgreSQL

Production note:
- Local Docker env files (`.env.docker.local`, `.env.docker.example`) are for developer machines only.
- Koyeb production must use platform-configured environment variables.
- `docker-compose.yml` is development-only.
- `docker-compose.prod.yml` is provided for self-hosted production parity/testing, but Koyeb + `Dockerfile` remains the primary production path.

## Required Environment Variables
Set these in Koyeb (names only, no secrets shown here):

- `APP_NAME`
- `APP_ENV`
- `APP_KEY`
- `APP_DEBUG`
- `APP_URL`
- `LOG_CHANNEL`
- `LOG_LEVEL`
- `DB_URL`
- `SESSION_DRIVER`
- `CACHE_STORE`
- `PORTFOLIO_EMAIL`
- `PORTFOLIO_OWNER_EMAIL`
- `PORTFOLIO_OWNER_PASSWORD`
- `PORTFOLIO_LINKEDIN`
- `PORTFOLIO_GITHUB`

## Deployment Flow
1. Create PostgreSQL database in Koyeb.
2. Create a Koyeb service from this GitHub repo using the repository `Dockerfile`.
3. Configure the environment variables above.
4. Deploy from `main`.
5. Run at least one queue worker process in production (for example `php artisan queue:work --tries=3 --timeout=120`).

## Optional Self-Hosted Compose Production Parity
For non-Koyeb environments, a production-oriented compose file is available:

```bash
docker compose -f docker-compose.prod.yml up -d
```

Notes:
- This file intentionally does not load local `.env.docker.local`.
- It does not mount repository source code.
- It does not run a Vite development service.

## Database Bootstrap And Migrations
After the first deploy, bootstrap schema and owner account with:

```bash
koyeb services exec <service-name>/web -- php artisan migrate --seed --force
```

For subsequent deploys that only need schema changes, run:

```bash
koyeb services exec <service-name>/web -- php artisan migrate --force
```

## Post-Deploy Checks
1. Open the public app URL.
2. Confirm `/login` renders and `/register` is not exposed.
3. Confirm the configured owner can log in and must verify email before dashboard access.
4. Confirm database-backed flows work (session/profile, projects, homepage settings).
5. Check logs in Koyeb if any startup or DB errors occur.
6. Confirm queue jobs are being processed (contact notifications are asynchronous).

## Operational Notes
- Keep app and database in the same region.
- Run migrations with `--force` in production only.
- Set `PORTFOLIO_SEED_PROJECTS=false` in production to avoid demo project seeding.
- If config/cache appears stale, run:

```bash
koyeb services exec <service-name>/web -- php artisan config:clear
koyeb services exec <service-name>/web -- php artisan cache:clear
```
