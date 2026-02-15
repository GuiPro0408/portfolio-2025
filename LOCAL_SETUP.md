# Local Development Setup

This guide explains how to provision a working PHP/Laravel toolchain for the project inside WSL/Ubuntu when you do **not** have sudo access. The steps complement the high-level notes in `README.md`.

> Canonical architecture/quality/deploy guidance lives in `docs/`: start with [docs/README.md](docs/README.md).

> Prefer using containers? The repository now ships with a `docker-compose.yml`. Follow the “Option A – Docker” section in `README.md` instead of the steps below.

> The commands assume the repository lives at `~/code/GuiPro0408/portfolio-2025`. Adjust paths if yours differ.

## 1. Required Tooling

- PHP 8.3 CLI with extensions: `phar`, `iconv`, `fileinfo`, `tokenizer`, `dom`, `simplexml`, `xml`, `xmlreader`, `xmlwriter`
- Composer 2.x
- Node.js 20.x (via `nvm` or the Node installer)
- npm 10.x (bundled with Node 20)

If you already have system PHP via apt (with sudo), you can skip to [Install project dependencies](#3-install-project-dependencies). Otherwise follow the next section to create a user-scoped PHP distribution.

## 2. Install PHP 8.3 Without sudo

1. Download the Ubuntu PHP packages into the repository root:

   ```bash
   cd ~/code/GuiPro0408/portfolio-2025
   apt-get download php8.3-cli php8.3-common php8.3-xml
   ```

2. Extract them into `~/php83`:

   ```bash
   mkdir -p ~/php83
   dpkg-deb -x php8.3-cli_*.deb ~/php83
   dpkg-deb -x php8.3-common_*.deb ~/php83
   dpkg-deb -x php8.3-xml_*.deb ~/php83
   ```

3. Point a wrapper script at the extracted binary so it appears on your `PATH`:

   ```bash
   cat <<'EOF' > ~/.local/bin/php
   #!/bin/bash
   export PHPRC="$HOME/php83/etc/php/8.3/cli"
   export PHP_INI_SCAN_DIR="$HOME/php83/etc/php/8.3/cli/conf.d"
   exec "$HOME/php83/usr/bin/php8.3" "$@"
   EOF
   chmod +x ~/.local/bin/php
   ```

   Restart the shell (or `hash -r`) so `which php` resolves to `~/.local/bin/php`.

4. Create a minimal `php.ini` that enables the bundled extensions:

   ```bash
   cat <<'EOF' > ~/php83/etc/php/8.3/cli/php.ini
   extension_dir="${HOME}/php83/usr/lib/php/20230831"
   extension=phar
   extension=iconv
   extension=fileinfo
   extension=tokenizer
   extension=dom
   extension=simplexml
   extension=xml
   extension=xmlreader
   extension=xmlwriter
   EOF
   ```

5. Verify the installation:

   ```bash
   php -v
   php -m | egrep 'Phar|iconv|fileinfo|tokenizer|dom|SimpleXML|xml'
   ```

   Clean up the downloaded `.deb` archives when you no longer need them.

## 3. Install Project Dependencies

1. Ensure Composer can see the custom PHP and install PHP packages:

   ```bash
   composer --version
   composer install
   ```

2. Install JavaScript dependencies:

   ```bash
   npm install
   ```

## 4. Configure the Application

1. Copy and edit the environment file:

   ```bash
   cp .env.example .env
   ```

   Update database credentials. For the quickest start, switch to SQLite:

   ```dotenv
   DB_CONNECTION=sqlite
   ```

   When using SQLite, also create the database file:

   ```bash
   touch database/database.sqlite
   ```

2. Generate the Laravel application key:

   ```bash
   php artisan key:generate
   ```

3. Run database migrations:

   ```bash
   php artisan migrate
   ```

## 5. Run the App

Use separate terminals (or background processes) for backend and frontend tooling:

```bash
# Terminal 1 – Laravel backend
php artisan serve

# Terminal 2 – Vite dev server
npm run dev
```

Visit `http://localhost:8000` to access the application.

## 6. Optional Tools

- **Laravel Sail**: `./vendor/bin/sail up` (requires Docker Desktop)
- **Code styling**: `./vendor/bin/pint`
- **Test suite**: `./vendor/bin/phpunit`
- **Harness checks**: `make check` (see [docs/QUALITY.md](docs/QUALITY.md))

Keep `README.md` handy for deployment notes (Koyeb) and overall project structure.
