# Quick Start Guide for Koyeb Deployment

> Canonical deployment runbook: [docs/DEPLOY.md](docs/DEPLOY.md).  
> This file remains as a quick-start walkthrough.

## Prerequisites
- GitHub account connected to Koyeb
- Koyeb account (sign up at https://app.koyeb.com)

## Step-by-Step Deployment

### 1. Generate Application Key
Before deploying, generate your application key locally:
```bash
php artisan key:generate --show
```
Copy the generated key (starts with `base64:...`).

### 2. Create PostgreSQL Database on Koyeb
1. Log in to Koyeb Dashboard: https://app.koyeb.com
2. Go to **Databases** → **Create Database**
3. Select **PostgreSQL**
4. Choose your preferred region and plan
5. Click **Create**
6. Once created, copy the **Connection String** (format: `postgres://user:pass@host:5432/db?sslmode=require`)

### 3. Deploy the Application
1. In Koyeb Dashboard, go to **Services** → **Create Service**
2. Select **Deploy from GitHub**:
   - Authorize GitHub if not already done
   - Select repository: `GuiPro0408/portfolio-2025`
   - Select branch: `main`
3. Configure Build:
   - Build method: **Dockerfile**
   - Dockerfile path: `Dockerfile` (default)
4. Configure Service:
   - Service name: `portfolio-app` (or your choice)
   - Region: **Same as your database**
   - Instance type: Start with **Nano** or **Small**
   - Port: `80`
5. Add Environment Variables (click **Advanced** → **Environment Variables**):

   | Variable | Value |
   |----------|-------|
   | `APP_NAME` | `Portfolio` |
   | `APP_ENV` | `production` |
   | `APP_KEY` | `base64:...` (from step 1) |
   | `APP_DEBUG` | `false` |
   | `APP_URL` | `https://your-service.koyeb.app` |
   | `LOG_CHANNEL` | `stderr` |
   | `LOG_LEVEL` | `error` |
   | `DB_URL` | (from step 2) |
   | `SESSION_DRIVER` | `database` |
   | `CACHE_STORE` | `database` |

   **Important**: Replace `your-service.koyeb.app` with your actual Koyeb service URL (you'll get this after creating the service).

6. Click **Deploy**

### 4. Run Database Migrations
After the first deployment completes:

**Option A: Using Koyeb CLI**
```bash
# Install Koyeb CLI (if not installed)
# Follow: https://www.koyeb.com/docs/cli/installation

# Login to Koyeb
koyeb login

# Run migrations
koyeb services exec portfolio-app/web -- php artisan migrate --force
```

**Option B: Using Web Terminal**
1. Go to your service in Koyeb Dashboard
2. Click on the **Shell** tab
3. Run:
```bash
php artisan migrate --force
```

### 5. Access Your Application
Your application is now live at: `https://your-service.koyeb.app`

Default routes:
- Home: `/`
- Register: `/register`
- Login: `/login`
- Dashboard: `/dashboard` (requires login)

## Updating the Application
After pushing changes to GitHub:
1. Koyeb will automatically rebuild and redeploy
2. If you added new migrations, run: `koyeb services exec portfolio-app/web -- php artisan migrate --force`

## Troubleshooting

### Build Fails
- Check build logs in Koyeb Dashboard
- Verify all environment variables are set correctly
- Ensure `APP_KEY` is set

### Database Connection Issues
- Verify `DB_URL` is correct
- Ensure database and app are in the same region
- Check database is running

### Application Errors
View logs in Koyeb Dashboard:
1. Go to your service
2. Click **Logs** tab
3. Filter by date/severity

### Clear Cache
If needed, clear application cache:
```bash
koyeb services exec portfolio-app/web -- php artisan config:clear
koyeb services exec portfolio-app/web -- php artisan cache:clear
```

## Local Development
For local development, see [README.md](README.md) for setup instructions.

## Support
- Koyeb Documentation: https://www.koyeb.com/docs
- Laravel Documentation: https://laravel.com/docs
- Laravel Breeze Documentation: https://laravel.com/docs/breeze
