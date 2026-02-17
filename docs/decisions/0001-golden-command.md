# ADR 0001: Golden Command Is `make check`

Short description: Defines one primary quality command for humans and agents.

## Status
Accepted

## Context/Problem
Before harness standardization, validation, linting, testing, and build could be run in different orders with different command sets. This increased drift between contributors and slowed reviews.

## Decision
Adopt `make check` as the single golden quality command.

`make check` must run the full harness-integrated quality sequence.
The exact ordered step list is canonical only in `docs/HARNESS.md`.

## Consequences
- Pros:
  - One command for quality verification.
  - Lower onboarding friction for contributors and agents.
  - Clear pass/fail gate before PR submission.
- Cons:
  - A single command can take longer than running one subsystem only.

## ADR Template
Use this structure for new ADRs:
- Title
- Status (Proposed/Accepted)
- Context/Problem
- Decision
- Consequences
