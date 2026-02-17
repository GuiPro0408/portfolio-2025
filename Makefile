.PHONY: setup setup-ci ensure-deps local-preflight dev run-project-locally check docs-check check-docker format test build analyse typecheck

setup:
	composer install --prefer-dist --no-interaction
	npm install

setup-ci:
	COMPOSER_NO_INTERACTION=1 composer install --prefer-dist --no-progress --no-interaction
	npm ci

ensure-deps:
	@if [ ! -f vendor/autoload.php ] || [ ! -d node_modules ]; then \
		echo "Missing dependencies detected. Running make setup..."; \
		$(MAKE) setup; \
	fi

local-preflight: ensure-deps
	@set -eu; \
	if command -v docker >/dev/null 2>&1; then \
		running_services=$$(docker compose ps --status running --services 2>/dev/null || true); \
		if [ -n "$$running_services" ]; then \
			echo "Docker services are currently running:"; \
			echo "$$running_services"; \
			echo "Stop Docker services before native local run:"; \
			echo "  docker compose down"; \
			exit 1; \
		fi; \
	fi
	@set -eu; \
	if [ ! -f .env ]; then \
		echo "No .env found. Copying from .env.example..."; \
		cp .env.example .env; \
	fi; \
	if ! grep -Eq '^APP_KEY=base64:' .env; then \
		echo "APP_KEY missing. Generating application key..."; \
		php artisan key:generate --force --no-interaction; \
	fi; \
	if grep -Eq '^DB_CONNECTION=sqlite' .env; then \
		db_path=$$(grep -E '^DB_DATABASE=' .env | tail -n 1 | cut -d= -f2-); \
		if [ -z "$$db_path" ]; then db_path=database/database.sqlite; fi; \
		case "$$db_path" in /*) : ;; *) db_path="$$PWD/$$db_path" ;; esac; \
		mkdir -p "$$(dirname "$$db_path")"; \
		if [ ! -f "$$db_path" ]; then \
			echo "Creating SQLite database at $$db_path"; \
			touch "$$db_path"; \
		fi; \
	fi; \
	if ! php artisan migrate:status --no-interaction >/dev/null 2>&1; then \
		echo "Database not ready. Running migrations and seeders..."; \
		php artisan migrate --seed --force --no-interaction; \
	fi

dev: local-preflight
	@set -eu; \
	app_port=8000; \
	while ! php -r '$$p=(int)$$argv[1]; $$s=@stream_socket_server("tcp://127.0.0.1:$$p", $$errno, $$errstr); if ($$s) { fclose($$s); exit(0); } exit(1);' "$$app_port"; do \
		app_port=$$((app_port + 1)); \
	done; \
	vite_port=5173; \
	while ! php -r '$$p=(int)$$argv[1]; $$s=@stream_socket_server("tcp://127.0.0.1:$$p", $$errno, $$errstr); if ($$s) { fclose($$s); exit(0); } exit(1);' "$$vite_port"; do \
		vite_port=$$((vite_port + 1)); \
	done; \
	echo "Starting local stack on:"; \
	echo "  - App:  http://127.0.0.1:$$app_port"; \
	echo "  - Vite: http://localhost:$$vite_port"; \
	APP_URL="http://127.0.0.1:$$app_port" npx concurrently -c "#93c5fd,#c4b5fd,#fb7185,#fdba74" "php artisan serve --host=127.0.0.1 --port=$$app_port --no-reload" "php artisan queue:listen --tries=1" "php artisan pail --timeout=0" "npm run dev -- --port $$vite_port" --names=server,queue,logs,vite --kill-others

run-project-locally: dev

check:
	$(MAKE) docs-check
	composer validate --strict
	composer run lint:php
	composer run lint:static
	composer test
	npm run lint
	npm run typecheck
	npm run build

analyse:
	composer run lint:static

docs-check:
	./scripts/check-docs.sh
	node scripts/check-agent-contract.mjs
	node scripts/check-memory-registry.mjs

check-docker:
	$(MAKE) docs-check
	docker compose exec -T app sh -lc 'while [ ! -f vendor/autoload.php ]; do echo "Waiting for Composer dependencies..."; sleep 1; done'
	docker compose exec -T app composer validate --strict
	docker compose exec -T app composer run lint:php
	docker compose exec -T app composer run lint:static
	docker compose exec -T -e APP_ENV=testing app composer test
	docker compose exec -T -u node vite npm run lint
	docker compose exec -T -u node vite npm run typecheck
	docker compose exec -T -u node vite npm run build

format:
	composer run format:php

test:
	composer test

build:
	npm run build

typecheck:
	npm run typecheck
