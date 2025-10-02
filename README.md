# Portfolio 2025

A modern portfolio application built with Laravel 12 + Breeze (React + Inertia.js) stack, ready for deployment on Koyeb.

## Stack

- **Backend**: Laravel 12 (PHP 8.3)
- **Frontend**: React + Vite + Inertia.js
- **Starter Kit**: Laravel Breeze
- **Database**: PostgreSQL
- **Deployment**: Koyeb (Docker)
- **CI**: GitHub Actions

## Local Development

### Prerequisites

- PHP 8.3+
- Composer 2
- Node.js 20+
- PostgreSQL (or SQLite for development)

### Setup

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

3. Copy environment file and generate application key:
```bash
cp .env.example .env
php artisan key:generate
```

4. Configure your database in `.env` (use SQLite for quick start):
```env
DB_CONNECTION=sqlite
```

5. Run migrations:
```bash
php artisan migrate
```

6. Build frontend assets:
```bash
npm run dev
# or for production build
npm run build
```

7. Start the development server:
```bash
php artisan serve
```

Visit `http://localhost:8000` in your browser.

## Deployment to Koyeb

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
- Validates Composer configuration
- Installs PHP and npm dependencies
- Runs PHP linter (Pint)
- Builds frontend assets
- Runs PHPUnit tests

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
- Code follows PSR-12 standards (use `./vendor/bin/pint`)
- Tests pass (`./vendor/bin/phpunit`)
- Frontend builds successfully (`npm run build`)

## Support

For issues or questions:
- Open an issue on [GitHub](https://github.com/GuiPro0408/portfolio-2025/issues)
- Check [Laravel documentation](https://laravel.com/docs)
- Check [Koyeb documentation](https://www.koyeb.com/docs)
