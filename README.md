# Portfolio 2025

A modern portfolio application built with Laravel 12 + Breeze (React + Inertia.js) stack, ready for deployment on Koyeb.

## Canonical Documentation

`docs/` is the system of record for this repository:
- [Docs index](docs/README.md)
- [Harness contract](docs/HARNESS.md)
- [System of record](docs/SYSTEM-OF-RECORD.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Quality harness](docs/QUALITY.md)
- [Deploy runbook](docs/DEPLOY.md)
- [MVP scope/status](docs/MVP.md)
- [v1.1 backlog](docs/V1.1-BACKLOG.md)
- [v1.2 backlog](docs/V1.2-BACKLOG.md)

## Stack

- **Backend**: Laravel 12 (PHP 8.3)
- **Frontend**: React + Vite + Inertia.js
- **Starter Kit**: Laravel Breeze
- **Database (active development)**: SQLite
- **Database (deferred deployment target)**: PostgreSQL
- **Deployment**: Koyeb (Docker)
- **CI**: GitHub Actions

## Current Product Surface

- MVP v1 status: complete (February 15, 2026)
- Public homepage, projects index, and project detail pages
- Public contact page at `/contact` with anti-spam guarded form submission
- Public projects supports SQL-backed keyword, stack, and sort query filters
- Authenticated project CRUD under `/dashboard/projects`
- Admin project list supports search/filter/sort and inline publish/feature toggles
- Admin project list supports duplicate and inline sort-order update actions
- Project stack is normalized through relational technologies data (with compatibility mirror field retained)
- Authenticated homepage content settings under `/dashboard/homepage`
- Homepage image fields accept hosted URLs and local filename-based values (auto-mapped to `/images/homepage/*`)
- Homepage contact links configured via env-backed `config/portfolio.php`
- Authenticated area uses dark enterprise dashboard theme with flash toasts
- SEO endpoints are available at `/sitemap.xml` and `/robots.txt` (cached public payload flow)

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

## Deployment

Deployment documentation is canonical in:
- [`docs/DEPLOY.md`](docs/DEPLOY.md)
- [`DEPLOYMENT.md`](DEPLOYMENT.md) (quick guide)

Use those documents as the operational runbook. This README intentionally avoids duplicating deployment contracts.

## CI/CD

GitHub Actions workflow automatically:
- Installs PHP and npm dependencies with `make setup-ci`
- Validates docs system-of-record consistency with `make docs-check`
- Runs the golden check command: `make check`
- Enforces composer validation, Pint linting, backend tests, and frontend build
- Uploads `public/build` from the build job and reuses it in Playwright job
- Runs Playwright browser smoke coverage with `npm run test:e2e`

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

Command contract is canonical in [`docs/HARNESS.md`](docs/HARNESS.md).

Most-used commands:
```bash
make setup
make docs-check
make check
make analyse
npm run test:e2e
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
