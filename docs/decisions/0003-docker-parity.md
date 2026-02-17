# ADR 0003: Docker Parity via `make check-docker`

Short description: Provides a single Docker-based parity command for container workflows.

## Status
Accepted

## Context/Problem
Container users previously needed multiple manual `docker compose exec` commands to replicate quality checks. This was slower, error-prone, and inconsistent with harness ergonomics.

## Decision
Adopt `make check-docker` as the Docker parity command.

`make check-docker` must mirror the shared harness quality sequence.
The exact ordered step list is canonical only in `docs/HARNESS.md`.

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
