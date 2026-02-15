#!/usr/bin/env sh
set -e

cd /var/www/html

if [ ! -d node_modules ]; then
    echo "[vite-entrypoint] Installing npm dependencies"
    npm install
fi

exec npm run dev -- --host 0.0.0.0 --port 5173
