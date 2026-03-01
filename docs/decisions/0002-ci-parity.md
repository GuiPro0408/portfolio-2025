# ADR 0002: CI Parity Uses Identical Checks

Short description: Ensures CI executes the same quality checks as local harness usage.

## Status
Accepted

## Context/Problem
Historically, CI pipelines often diverge from local developer commands. Divergence causes “works on my machine” failures and unclear ownership of quality regressions.

## Decision
Set CI to use the same canonical non-browser quality path as local harness usage:
1. `make setup-ci`
2. `make docs-check`
3. `make check`

The exact command-step contract is canonical only in `docs/HARNESS.md`.
This guarantees CI enforces the same validated workflow as local execution.

## Consequences
- Pros:
  - Local and CI results are directly comparable.
  - Fewer pipeline surprises at PR time.
  - Harness behavior is explicit and documented.
- Cons:
  - CI failures may require local reproduction with CI-like install mode (`make setup-ci`).

## ADR Template
Use this structure for new ADRs:
- Title
- Status (Proposed/Accepted)
- Context/Problem
- Decision
- Consequences
