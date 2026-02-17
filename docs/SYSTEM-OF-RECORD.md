# System Of Record

`docs/` is the canonical source for architecture, quality workflow, and operational contracts.

## Canonical vs Mirror Rule
- Canonical: files under `docs/` (except `docs/archive/`).
- Mirrors: root-level summaries like `README.md`.
- If a mirror conflicts with canonical docs, canonical docs win.

## Ownership
- Engineering changes that affect behavior or workflow must update canonical docs in the same PR.
- Root `README.md` may summarize canonical docs but must link back instead of redefining contracts.
- Agent workflow contracts must live under `docs/agents/` and remain source-aligned with `AGENTS.md`.
- Machine-checkable docs rules live in `docs/contracts/docs-contract.json`.

## Mandatory Styling Policy
- CSS authored in this repository must use CSS nesting for selector relationships.
- New or updated styles should prefer nested selectors over flat duplicated selector blocks.
- This rule applies to files under `resources/css/styles/`.

## Command Contract Rule
- Exact quality command step sequences are canonical only in `docs/HARNESS.md`.
- Duplicating full command step lists in ADRs or process documents is prohibited.
- Non-harness docs should link to `docs/HARNESS.md` instead of restating full ordered command steps.

## Update Triggers Matrix

| Change Type | Required Doc Updates |
|---|---|
| Route/controller/model behavior | `docs/ARCHITECTURE.md` (if boundary/contract changes), `docs/ROADMAP.md` (if priority/scope changes) |
| Frontend styling conventions | `docs/ARCHITECTURE.md`, `docs/SYSTEM-OF-RECORD.md` |
| Quality commands / CI flow | `docs/HARNESS.md`, `docs/QUALITY.md`, `docs/README.md`, `.github/workflows/ci.yml` |
| Deployment/runtime env contract | `docs/DEPLOY.md` |
| MVP/release scope changes | `docs/MVP.md`, `docs/ROADMAP.md`, and archive updates under `docs/archive/` when milestones close |
| Process/decision policy updates | `docs/knowledge/*` and/or ADR in `docs/decisions/` |
| Agent workflow/handoff updates | `docs/agents/*`, `AGENTS.md`, `docs/README.md` |
| Repository memory policy updates | `docs/agents/MEMORY-LIFECYCLE.md`, `docs/agents/memory-registry.yaml` |

## Mandatory Links
- Root `README.md` must link to:
  - `docs/README.md`
  - `docs/HARNESS.md`
  - `docs/SYSTEM-OF-RECORD.md`
- `docs/README.md` must list both documents above.

## Mirror Doc Banner
- Root-level mirror docs (`README.md`, `LOCAL_SETUP.md`, `DEPLOYMENT.md`) must include a `Canonical source:` banner near the top.
- Mirror docs should be concise entry points and must not redefine deep operational contracts.
