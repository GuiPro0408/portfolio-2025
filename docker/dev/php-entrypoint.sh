#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/html"
APP_USER="laravel"
APP_GROUP="laravel"

if [[ "$(id -u)" -eq 0 ]]; then
    mkdir -p \
        "${APP_DIR}/vendor" \
        "${APP_DIR}/storage" \
        "${APP_DIR}/bootstrap/cache"

    chown -R "${APP_USER}:${APP_GROUP}" \
        "${APP_DIR}/vendor" \
        "${APP_DIR}/storage" \
        "${APP_DIR}/bootstrap/cache"

    chmod -R ug+rwX \
        "${APP_DIR}/vendor" \
        "${APP_DIR}/storage" \
        "${APP_DIR}/bootstrap/cache"

    if command -v git >/dev/null 2>&1 && [[ -d "${APP_DIR}/.git" ]]; then
        git config --global --add safe.directory "${APP_DIR}" || true
    fi

    exec gosu "${APP_USER}:${APP_GROUP}" "$0" "$@"
fi

cd "${APP_DIR}"

if [[ ! -f .env && -f .env.docker ]]; then
    echo "[php-dev-entrypoint] Bootstrapping .env from .env.docker"
    cp .env.docker .env
fi

if [[ ! -f vendor/autoload.php ]]; then
    echo "[php-dev-entrypoint] Installing Composer dependencies"
    composer install --no-interaction
fi

if [[ -f .env ]] && grep -qE '^APP_KEY=$' .env; then
    echo "[php-dev-entrypoint] Generating APP_KEY"
    php artisan key:generate --ansi
fi

mkdir -p storage/logs bootstrap/cache vendor
chmod -R ug+rwX storage bootstrap/cache vendor

exec "$@"
