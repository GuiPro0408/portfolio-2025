# ADR 0003: Docker Parity via `make check-docker`

Short description: Provides a single Docker-based parity command for container workflows.

## Status
Accepted

## Context/Problem
Container users previously needed multiple manual `docker compose exec` commands to replicate quality checks. This was slower, error-prone, and inconsistent with harness ergonomics.

## Decision
Adopt `make check-docker` as the Docker parity command.

`make check-docker` runs:
1. `composer validate --strict` in `app`
2. `composer run lint:php` in `app`
3. `composer test` in `app`
4. `npm run build` in `vite`

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
