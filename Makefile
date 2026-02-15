.PHONY: setup dev check format test build

setup:
	composer install --prefer-dist --no-interaction
	npm install

dev:
	composer run dev

check:
	composer validate --strict
	composer run lint:php
	composer test
	npm run build

format:
	composer run format:php

test:
	composer test

build:
	npm run build
