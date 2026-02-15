# System Of Record

`docs/` is the canonical source for architecture, quality workflow, and operational contracts.

## Canonical vs Mirror Rule
- Canonical: files under `docs/` (except `docs/archive/`).
- Mirrors: root-level summaries like `README.md`.
- If a mirror conflicts with canonical docs, canonical docs win.

## Ownership
- Engineering changes that affect behavior or workflow must update canonical docs in the same PR.
- Root `README.md` may summarize canonical docs but must link back instead of redefining contracts.

## Mandatory Styling Policy
- CSS authored in this repository must use CSS nesting for selector relationships.
- New or updated styles should prefer nested selectors over flat duplicated selector blocks.
- This rule applies to files under `resources/css/styles/`.

## Update Triggers Matrix

| Change Type | Required Doc Updates |
|---|---|
| Route/controller/model behavior | `docs/ARCHITECTURE.md` (if boundary/contract changes), relevant backlog/milestone docs |
| Frontend styling conventions | `docs/ARCHITECTURE.md`, `docs/SYSTEM-OF-RECORD.md` |
| Quality commands / CI flow | `docs/HARNESS.md`, `docs/QUALITY.md`, `docs/README.md`, `.github/workflows/ci.yml` |
| Deployment/runtime env contract | `docs/DEPLOY.md` |
| MVP/release scope changes | `docs/MVP.md` and/or version backlog file |
| Process/decision policy updates | `docs/knowledge/*` and/or ADR in `docs/decisions/` |

## Mandatory Links
- Root `README.md` must link to:
  - `docs/README.md`
  - `docs/HARNESS.md`
  - `docs/SYSTEM-OF-RECORD.md`
- `docs/README.md` must list both documents above.
