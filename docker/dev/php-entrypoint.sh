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

if [[ "${APP_ENV:-local}" != "production" ]] && [[ ! -f .env && -f .env.docker.local ]]; then
    echo "[php-dev-entrypoint] Bootstrapping .env from .env.docker.local"
    cp .env.docker.local .env
fi

# Avoid stale cached config from host/local runs pinning Docker to wrong DB settings.
if [[ -f bootstrap/cache/config.php ]]; then
    echo "[php-dev-entrypoint] Removing stale Laravel config cache"
    rm -f bootstrap/cache/config.php
fi

if [[ ! -f vendor/autoload.php ]]; then
    echo "[php-dev-entrypoint] Installing Composer dependencies"
    composer install --no-interaction
fi

if [[ -z "${APP_KEY:-}" ]]; then
    echo "[php-dev-entrypoint] APP_KEY is empty in environment, generating ephemeral key"
    export APP_KEY="base64:$(php -r 'echo base64_encode(random_bytes(32));')"
fi

if [[ -f .env ]] && grep -qE '^APP_KEY=$' .env; then
    echo "[php-dev-entrypoint] Generating APP_KEY"
    php artisan key:generate --ansi
fi

storage_link_path="${APP_DIR}/public/storage"
storage_link_target="../storage/app/public"

if [[ -L "${storage_link_path}" ]]; then
    current_target="$(readlink "${storage_link_path}" || true)"

    if [[ "${current_target}" != "${storage_link_target}" ]]; then
        echo "[php-dev-entrypoint] Rebuilding storage symlink"
        rm -f "${storage_link_path}"
        ln -s "${storage_link_target}" "${storage_link_path}"
    fi
elif [[ ! -e "${storage_link_path}" ]]; then
    echo "[php-dev-entrypoint] Creating storage symlink"
    ln -s "${storage_link_target}" "${storage_link_path}"
fi

if [[ "${AUTO_MIGRATE_AND_SEED:-false}" =~ ^(1|true|TRUE|yes|YES|on|ON)$ ]]; then
    echo "[php-dev-entrypoint] Running migrations and seeders"
    php artisan migrate --seed --force --no-interaction
fi

mkdir -p storage/logs bootstrap/cache vendor
chmod -R ug+rwX storage bootstrap/cache vendor

exec "$@"
