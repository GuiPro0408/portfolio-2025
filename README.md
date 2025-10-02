# Portfolio 2025

A full-stack portfolio application bootstrapped with [Laravel 12](https://laravel.com/) and the [Breeze](https://laravel.com/docs/starter-kits#laravel-breeze) Inertia React starter kit. The frontend is powered by React and Vite while PostgreSQL provides persistent storage.

## Tech Stack

- **Backend:** Laravel 12 (PHP 8.3)
- **Frontend:** React + Vite via Laravel Breeze (Inertia)
- **Database:** PostgreSQL
- **Tooling:** Composer, npm, Tailwind CSS, Pest/PHPUnit
- **Deployment:** Docker (Node build, Composer dependencies, PHP-FPM + Nginx) on [Koyeb](https://www.koyeb.com/)
- **CI:** GitHub Actions (`.github/workflows/ci.yml`)

## Local Development

### Requirements

- PHP 8.3+
- Composer 2+
- Node.js 20+
- PostgreSQL (or SQLite for quick starts)

### Setup

```bash
cp .env.example .env
composer install
php artisan key:generate
npm ci
```

### Running the App

1. Start the Laravel development server:
   ```bash
   php artisan serve
   ```
2. Start the Vite dev server in a separate terminal:
   ```bash
   npm run dev
   ```

Visit `http://localhost:8000` to access the application.

### Tests

```bash
php artisan test
```

## Docker Image

The project includes a multi-stage `Dockerfile` that:

1. Builds frontend assets with Node 20 and Vite.
2. Installs PHP dependencies (without dev packages) using Composer 2.
3. Packages the application with `webdevops/php-nginx:8.3-alpine`, serves `/app/public`, and fixes storage permissions.

Build and run locally:

```bash
docker build -t portfolio-2025 .
docker run --rm -p 8000:80 --env-file .env portfolio-2025
```

## Continuous Integration

GitHub Actions workflow [`ci.yml`](.github/workflows/ci.yml) validates Composer configuration, installs PHP dependencies, installs Node dependencies, and builds assets on every push and pull request targeting `main`.

## Environment Variables

The `.env.example` file documents the required configuration for deployment. Important values for Koyeb include:

- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_URL` set to your public Koyeb URL (e.g., `https://<your-app>.koyeb.app`)
- `APP_KEY` generated via `php artisan key:generate --show`
- `LOG_CHANNEL=stderr`
- `DB_URL` using the PostgreSQL connection string from Koyeb (e.g., `postgres://user:pass@host:5432/db?sslmode=require`)

## Deployment on Koyeb

1. **Create a PostgreSQL database** from the Koyeb dashboard and copy the connection URI.
2. **Add a new service** connected to this GitHub repository.
3. **Select the provided `Dockerfile`** as the build target.
4. **Expose port 80** in the service configuration.
5. **Configure environment variables** using the `.env.example` template and your generated `APP_KEY`.
6. **Deploy** the service.

After the first deployment run migrations once:

```bash
koyeb services exec <app>/<service> -- php artisan migrate --force
```

Your application will be live at the URL assigned by Koyeb.
