#!/usr/bin/env sh
set -e

APP_DIR="/var/www/html"

if [ "$(id -u)" -eq 0 ]; then
    mkdir -p "${APP_DIR}/node_modules"
    mkdir -p "${APP_DIR}/public"
    rm -f "${APP_DIR}/public/hot"
    chown -R node:node "${APP_DIR}/node_modules" "${APP_DIR}/public"
    exec su node -s /bin/sh -c "$0"
fi

cd "${APP_DIR}"

if [ ! -x node_modules/.bin/vite ]; then
    echo "[vite-entrypoint] Installing npm dependencies"
    npm install
fi

exec npm run dev -- --host 0.0.0.0 --port 5173
