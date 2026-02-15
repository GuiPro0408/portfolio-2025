.PHONY: setup setup-ci ensure-deps dev check docs-check check-docker format test build analyse

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

dev: ensure-deps
	composer run dev

check:
	composer validate --strict
	composer run lint:php
	composer run lint:static
	composer test
	npm run build

analyse:
	composer run lint:static

docs-check:
	./scripts/check-docs.sh

check-docker:
	docker compose exec -T app composer validate --strict
	docker compose exec -T app composer run lint:php
	docker compose exec -T app composer test
	docker compose exec -T vite npm run build

format:
	composer run format:php

test:
	composer test

build:
	npm run build
