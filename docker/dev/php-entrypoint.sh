#!/usr/bin/env bash
set -euo pipefail

cd /var/www/html

if [[ ! -f .env && -f .env.docker ]]; then
    echo "[php-dev-entrypoint] Bootstrapping .env from .env.docker"
    cp .env.docker .env
fi

if [[ ! -f vendor/autoload.php ]]; then
    echo "[php-dev-entrypoint] Installing Composer dependencies"
    composer install --no-interaction
fi

if grep -qE '^APP_KEY=$' .env; then
    echo "[php-dev-entrypoint] Generating APP_KEY"
    php artisan key:generate --ansi
fi

mkdir -p storage/logs bootstrap/cache
chmod -R ug+rwX storage bootstrap/cache

exec "$@"
