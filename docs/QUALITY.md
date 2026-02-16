# Quality Policy

This document defines quality expectations.
Command-level definitions are canonical in [`docs/HARNESS.md`](HARNESS.md).

## Baseline Expectations
- Run `make docs-check` and `make check` before opening a PR.
- Keep CI green on the same command path as local (`setup-ci -> docs-check -> check`).
- Treat Docker checks as parity checks when container workflow is used.

## Test Expectations
- Backend behavior changes require tests in `tests/Feature` and/or `tests/Unit`.
- Frontend changes must pass `npm run build`.
- Browser-critical paths should be covered by Playwright smoke tests when affected.
- For list UX changes, verify debounced server-driven filters, partial reload contracts (`only` props), and active-filter chips behavior.
- Perceived-performance UX changes must verify skeleton behavior (visible during list transitions, no flashing on unrelated actions).
- Prefetch behavior should stay scoped to high-intent public links and avoid dashboard-wide prefetch.

## Static Analysis And Formatting
- Canonical formatter: Laravel Pint (`make format`).
- Canonical static analyzer: Larastan/PHPStan (`make analyse`).
- `make check` is the integration gate and must remain deterministic.

## PR Hygiene
- Keep changes focused and reviewable.
- Do not mix unrelated refactors with feature work.
- If behavior/workflow changes, update canonical docs in `docs/` in the same PR.
- Performance-sensitive UI PRs should include before/after bundle output notes when chunking or route CSS loading changes.
