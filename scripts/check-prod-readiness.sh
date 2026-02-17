#!/usr/bin/env bash
set -euo pipefail

fail() {
    echo "[prod-readiness] $1" >&2
    exit 1
}

if [[ ! -f docker-compose.yml ]]; then
    fail "Missing docker-compose.yml."
fi

if [[ ! -f docker-compose.prod.yml ]]; then
    fail "Missing docker-compose.prod.yml."
fi

if ! grep -q "docker/dev/php.Dockerfile" docker-compose.yml; then
    fail "docker-compose.yml must remain development-focused (docker/dev/php.Dockerfile)."
fi

if ! grep -q ".env.docker.local" docker-compose.yml; then
    fail "docker-compose.yml must use local-only env file .env.docker.local."
fi

if grep -q ".env.docker.local" docker-compose.prod.yml; then
    fail "docker-compose.prod.yml must not depend on local-only env files."
fi

if grep -q "APP_ENV: local" docker-compose.prod.yml; then
    fail "docker-compose.prod.yml must not force APP_ENV=local."
fi

if grep -q 'APP_DEBUG: "true"' docker-compose.prod.yml; then
    fail "docker-compose.prod.yml must not force APP_DEBUG=true."
fi

if grep -q "./:/var/www/html" docker-compose.prod.yml; then
    fail "docker-compose.prod.yml must not bind mount repository source."
fi

if grep -q "vite:" docker-compose.prod.yml; then
    fail "docker-compose.prod.yml must not include Vite dev service."
fi

if ! grep -q "Koyeb production must use platform-configured environment variables" docs/DEPLOY.md; then
    fail "docs/DEPLOY.md must state production env policy."
fi

echo "[prod-readiness] OK"
