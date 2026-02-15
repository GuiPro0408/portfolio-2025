# FAQ

Quick answers to common repository workflow questions.

## 1) Where should I add new documentation?
Add canonical engineering docs under `docs/`. Use:
- `docs/ARCHITECTURE.md` for boundaries and code placement.
- `docs/QUALITY.md` for quality/check workflows.
- `docs/DEPLOY.md` for deployment operations.
- `docs/knowledge/*` for internal operational knowledge.

## 2) What is the primary quality gate?
Use `make check`. It is the golden command and runs validation, PHP lint, backend tests, and frontend build.

## 3) How do I run checks in Docker?
Start services, then run:
```bash
docker compose up -d
make check-docker
```
This mirrors local/CI checks through the `app` and `vite` containers.

## 4) When should I run `make setup` vs `make setup-ci`?
- `make setup`: local developer setup (`composer install` + `npm install`).
- `make setup-ci`: deterministic CI-style install (`composer install` + `npm ci`).

## 5) Where do architecture decisions go?
Add a new ADR under `docs/decisions/` using sequential numbering (`0004-...`, `0005-...`) and the standard template sections.

## 6) Which docs are canonical vs historical?
Canonical docs are in `docs/` (except `docs/archive/`). Files in `docs/archive/` are historical and non-canonical.

## 7) What PHP checker should I run with VS Code?
Use the repository checker:
```bash
make analyse
```
It runs Larastan/PHPStan with Laravel-aware rules.

Recommended VS Code extensions:
- PHP Tools (`DEVSENSE.phptools-vscode`) or
- Intelephense (`bmewburn.vscode-intelephense-client`)
