# Deploy Runbook (Koyeb)

This document is the canonical deployment reference for this repository.
Deployment is currently deferred while active development continues on SQLite locally.

## Platform
- Runtime: Docker (`Dockerfile`)
- Host: Koyeb
- Database: Koyeb PostgreSQL

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
- `PORTFOLIO_LINKEDIN`
- `PORTFOLIO_GITHUB`

## Deployment Flow
1. Create PostgreSQL database in Koyeb.
2. Create a Koyeb service from this GitHub repo using the repository `Dockerfile`.
3. Configure the environment variables above.
4. Deploy from `main`.

## Migrations
After first deploy and after each migration change, run:

```bash
koyeb services exec <service-name>/web -- php artisan migrate --force
```

## Post-Deploy Checks
1. Open the public app URL.
2. Confirm auth routes (`/login`, `/register`) render.
3. Confirm database-backed flows work (login/session/profile, projects, homepage settings).
4. Check logs in Koyeb if any startup or DB errors occur.

## Operational Notes
- Keep app and database in the same region.
- Run migrations with `--force` in production only.
- If config/cache appears stale, run:

```bash
koyeb services exec <service-name>/web -- php artisan config:clear
koyeb services exec <service-name>/web -- php artisan cache:clear
```
