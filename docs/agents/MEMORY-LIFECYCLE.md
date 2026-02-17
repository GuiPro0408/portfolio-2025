# Repository Memory Lifecycle

Repository memories capture durable conventions and facts that help agents act consistently.

## Purpose
- Keep high-value memory entries current, traceable, and auditable.
- Prevent stale or unverified conventions from shaping implementation decisions.
- Define lifecycle states and verification cadence.

## Canonical Registry
- File: `docs/agents/memory-registry.yaml`
- Required fields per entry:
  - `id`
  - `statement`
  - `source_path`
  - `verified_at`
  - `owner`
  - `expiry_days`

## Lifecycle States

### Proposed
- Draft memory captured but not yet validated against canonical sources.
- Must not be treated as authoritative.

### Verified
- Source-aligned and reviewed by owner.
- `verified_at` set to review date.

### Active
- Verified and within freshness window (`verified_at + expiry_days`).
- Eligible for default agent retrieval/use.

### Stale
- Freshness window expired or source changed without re-verification.
- Must be refreshed or archived before use.

### Archived
- Kept for historical context only.
- Not eligible for operational retrieval.

## Invalidation Triggers
- Failed `make check` or `make docs-check` affecting memory source areas.
- Canonical doc changes in referenced `source_path`.
- ADR updates that supersede current conventions.
- Framework/runtime major-version updates with potential contract impact.

## Maintenance Cadence
- Review memory registry at least once per sprint (or bi-weekly minimum).
- Any memory entry touched by changed source files must be re-verified in the same PR.
- Stale entries must be refreshed or removed before merge.

## Validation
- `node scripts/check-memory-registry.mjs` validates:
  - schema fields
  - source path existence
  - date format and freshness windows
  - duplicate IDs
