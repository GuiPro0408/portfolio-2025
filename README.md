# Portfolio 2025

A modern portfolio application built with Laravel 12 + Breeze (React + Inertia.js) stack, ready for deployment on Koyeb.

## Canonical Documentation

`docs/` is the system of record for this repository:
- [Docs index](docs/README.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Quality harness](docs/QUALITY.md)
- [Deploy runbook](docs/DEPLOY.md)

## Stack

- **Backend**: Laravel 12 (PHP 8.3)
- **Frontend**: React + Vite + Inertia.js
- **Starter Kit**: Laravel Breeze
- **Database (active development)**: SQLite
- **Database (deferred deployment target)**: PostgreSQL
- **Deployment**: Koyeb (Docker)
- **CI**: GitHub Actions

## Local Development

### Option A – Docker (no local PHP)

1. Install Docker Desktop (or Docker Engine + Compose plugin) and make sure it is running.
2. Copy `.env.docker` to `.env` if you want to tweak the defaults before the first boot. The PHP container will otherwise copy it automatically.
3. Build the images and start the stack:
   ```bash
   docker compose build
   docker compose up
   ```
   The first startup installs Composer and npm dependencies into named volumes.
4. Once the containers are up, run the database migrations:
   ```bash
   docker compose exec app php artisan migrate
   ```
5. Visit the services:
   - App: `http://localhost:8000`
   - Vite dev server with HMR: `http://localhost:5173`
6. Run project commands through the containers, for example:
   ```bash
   docker compose exec app php artisan test
   docker compose exec app ./vendor/bin/pint
   docker compose exec app php artisan queue:listen
   ```
   For CI-parity checks in Docker:
   ```bash
   make check-docker
   ```
7. Stop everything with `Ctrl+C` (foreground) or `docker compose down` when you are done. The `vendor`, `node_modules`, and PostgreSQL data persist in named volumes.

### Option B – Native toolchain

If you prefer to install the toolchain locally, ensure you have:

- PHP 8.3+
- Composer 2
- Node.js 20+
- SQLite (recommended)

Then follow the usual Laravel flow:

1. Clone the repository:
   ```bash
   git clone https://github.com/GuiPro0408/portfolio-2025.git
   cd portfolio-2025
   ```
2. Install dependencies:
   ```bash
   composer install
   npm install
   ```
3. Copy environment file and generate the application key:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
4. Configure your database in `.env` (SQLite-first local workflow):
   ```env
   DB_CONNECTION=sqlite
   DB_DATABASE=/home/guillaume/code/GuiPro0408/portfolio-2025/database/database.sqlite
   DB_URL=
   ```
   Keep `DB_URL` empty during local SQLite development. When set, `DB_URL` overrides connection behavior.
5. Run migrations:
   ```bash
   php artisan migrate
   ```
6. Start the dev servers:
   ```bash
   php artisan serve
   npm run dev
   ```

Visit `http://localhost:8000` (and `http://localhost:5173` for Vite) in your browser.

## Deployment to Koyeb (Deferred For Now)

Koyeb/PostgreSQL deployment is intentionally deferred while active development continues on SQLite.
Keep this section as the runbook for when deployment resumes.

> **📝 Quick Start**: For a step-by-step deployment guide with screenshots, see [DEPLOYMENT.md](DEPLOYMENT.md).

### 1. Create PostgreSQL Database

1. Log in to your [Koyeb dashboard](https://app.koyeb.com)
2. Navigate to **Databases** → **Create Database**
3. Choose **PostgreSQL** and configure:
   - Region: Choose closest to your users
   - Plan: Select based on your needs
4. Note the connection string (format: `postgres://user:pass@host:5432/db?sslmode=require`)

### 2. Prepare Environment Variables

Generate your application key locally:
```bash
php artisan key:generate --show
```

You'll need the following environment variables for Koyeb:

| Variable | Value | Description |
|----------|-------|-------------|
| `APP_NAME` | `Portfolio` | Application name |
| `APP_ENV` | `production` | Environment |
| `APP_KEY` | `base64:...` | Generate with `php artisan key:generate --show` |
| `APP_DEBUG` | `false` | Disable debug in production |
| `APP_URL` | `https://your-app.koyeb.app` | Your Koyeb app URL |
| `LOG_CHANNEL` | `stderr` | Log to stderr for Koyeb |
| `LOG_LEVEL` | `error` | Minimum log level |
| `DB_URL` | `postgres://user:pass@host:5432/db?sslmode=require` | From Koyeb PostgreSQL |
| `SESSION_DRIVER` | `database` | Store sessions in database |
| `CACHE_STORE` | `database` | Store cache in database |

### 3. Deploy Service

1. In Koyeb dashboard, go to **Services** → **Create Service**
2. Choose **Deploy from GitHub**:
   - Connect your GitHub account
   - Select repository: `GuiPro0408/portfolio-2025`
   - Branch: `main`
3. Configure build:
   - Build method: **Dockerfile**
   - Dockerfile path: `Dockerfile`
4. Configure deployment:
   - Service name: `portfolio-app` (or your choice)
   - Region: Same as your database
   - Instance type: Choose based on needs (nano/small recommended to start)
   - Port: `80`
5. Add environment variables:
   - Click **Add environment variable** for each variable listed above
   - Use the connection string from your Koyeb PostgreSQL database for `DB_URL`
6. Click **Deploy**

### 4. Run Database Migrations

After deployment, run migrations using Koyeb CLI:

```bash
# Install Koyeb CLI if not already installed
# Visit: https://www.koyeb.com/docs/cli/installation

# Login to Koyeb
koyeb login

# Run migrations
koyeb services exec portfolio-app/web -- php artisan migrate --force
```

Alternatively, you can:
- Use the Koyeb web terminal (available in service details)
- Run: `php artisan migrate --force`

### 5. Access Your Application

Your application will be available at: `https://your-app.koyeb.app`

The default Breeze authentication is available at:
- Register: `/register`
- Login: `/login`
- Dashboard: `/dashboard`

## CI/CD

GitHub Actions workflow automatically:
- Installs PHP and npm dependencies with `make setup-ci`
- Runs the golden check command: `make check`
- Enforces composer validation, Pint linting, backend tests, and frontend build

The workflow runs on every push and pull request to the `main` branch.

## Project Structure

```
├── app/                    # Application core
│   ├── Http/
│   │   ├── Controllers/   # Controllers (Auth, Profile, etc.)
│   │   └── Middleware/    # Middleware (Inertia, etc.)
│   └── Models/            # Eloquent models
├── resources/
│   ├── js/                # React components and pages
│   │   ├── Components/   # Reusable React components
│   │   ├── Layouts/      # Layout components
│   │   └── Pages/        # Inertia pages
│   └── css/              # Stylesheets (Tailwind CSS)
├── routes/
│   ├── web.php           # Web routes
│   └── auth.php          # Authentication routes
├── public/               # Public assets
├── database/
│   ├── migrations/       # Database migrations
│   └── seeders/          # Database seeders
├── tests/                # PHPUnit tests
├── Dockerfile            # Multi-stage Docker build
├── .dockerignore         # Docker ignore rules
└── .github/
    └── workflows/
        └── ci.yml        # GitHub Actions CI workflow
```

## Available Commands

### Harness (Golden Commands)

```bash
make setup      # Install PHP + Node dependencies
make setup-ci   # Deterministic CI install (composer install + npm ci)
make dev        # Start native development workflow (composer run dev)
make check      # Validate + lint + test + frontend build (CI parity)
make check-docker # Run parity checks through docker compose services
make format     # Auto-fix PHP formatting (Pint)
make test       # Run backend tests
make build      # Build frontend assets
```

### Backend (Laravel)

```bash
composer install              # Install PHP dependencies
composer validate            # Validate composer.json
php artisan migrate          # Run database migrations
php artisan migrate:fresh    # Drop all tables and re-run migrations
php artisan key:generate     # Generate application key
php artisan serve            # Start development server
./vendor/bin/pint            # Run code style fixer
./vendor/bin/phpunit         # Run tests
```

### Frontend (React + Vite)

```bash
npm install                  # Install npm dependencies
npm run dev                  # Start development server with HMR
npm run build                # Build for production
```

## License

MIT License. See [LICENSE](LICENSE) for details.

## Contributing

Pull requests are welcome! Please ensure:
- `make check` passes locally
- Docs in `docs/` are updated when behavior/workflow changes


## Support

For issues or questions:
- Open an issue on [GitHub](https://github.com/GuiPro0408/portfolio-2025/issues)
- Check [Laravel documentation](https://laravel.com/docs)
- Check [Koyeb documentation](https://www.koyeb.com/docs)
