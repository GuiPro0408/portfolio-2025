# ADR 0003: Docker Parity via `make check-docker`

Short description: Provides a single Docker-based parity command for container workflows.

## Status
Accepted

## Context/Problem
Container users previously needed multiple manual `docker compose exec` commands to replicate quality checks. This was slower, error-prone, and inconsistent with harness ergonomics.

## Decision
Adopt `make check-docker` as the Docker parity command.

`make check-docker` runs:
1. `./scripts/check-docs.sh`
2. `composer validate --strict` in `app`
3. `composer run lint:php` in `app`
4. `composer run lint:static` in `app`
5. `composer test` in `app`
6. `npm run typecheck` in `vite`
7. `npm run build` in `vite`

## Consequences
- Pros:
  - Docker users get one-command parity.
  - Reduced command-copy mistakes.
  - Better consistency with native workflow expectations.
- Cons:
  - Requires running containers before execution.

## ADR Template
Use this structure for new ADRs:
- Title
- Status (Proposed/Accepted)
- Context/Problem
- Decision
- Consequences
