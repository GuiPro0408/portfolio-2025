# ADR 0002: CI Parity Uses Identical Checks

Short description: Ensures CI executes the same quality checks as local harness usage.

## Status
Accepted

## Context/Problem
Historically, CI pipelines often diverge from local developer commands. Divergence causes “works on my machine” failures and unclear ownership of quality regressions.

## Decision
Set CI to install dependencies with `make setup-ci`, then run the same golden check command used locally: `make check`.

This guarantees CI enforces the exact same validation/lint/test/build sequence.

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
