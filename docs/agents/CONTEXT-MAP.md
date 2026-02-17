# Agent Context Map

Use this map to find the fastest canonical context for common tasks.

## By Task

| Task | Read First | Follow-Up Files | Core Commands |
|---|---|---|---|
| Add/modify feature behavior | `docs/ARCHITECTURE.md` | `routes/web.php`, `app/Http/Controllers`, `resources/js/Pages`, `tests/Feature` | `make check` |
| Update quality workflow/commands | `docs/HARNESS.md` | `Makefile`, `.github/workflows/ci.yml`, `docs/QUALITY.md` | `make docs-check`, `make check` |
| Update deployment behavior | `docs/DEPLOY.md` | `Dockerfile`, `docker-compose.yml`, `DEPLOYMENT.md` | `make docs-check` |
| Update docs governance policy | `docs/SYSTEM-OF-RECORD.md` | `docs/contracts/docs-contract.json`, `scripts/check-docs.mjs`, `README.md` | `make docs-check` |
| Introduce architecture/process decision | `docs/decisions/` | `docs/README.md`, relevant canonical doc | `make docs-check` |
| Add/modify agent workflow artifacts | `docs/agents/WORKFLOW.md` | `docs/agents/templates/*`, `AGENTS.md` | `make docs-check` |
| Update repository memory records | `docs/agents/MEMORY-LIFECYCLE.md` | `docs/agents/memory-registry.yaml` | `node scripts/check-memory-registry.mjs` |

## By Contract Surface
- Architecture boundary: `docs/ARCHITECTURE.md`
- Command and CI parity contract: `docs/HARNESS.md`
- Quality policy: `docs/QUALITY.md`
- Documentation governance: `docs/SYSTEM-OF-RECORD.md`
- Agent workflow contract: `docs/agents/WORKFLOW.md`
- Memory lifecycle and registry: `docs/agents/MEMORY-LIFECYCLE.md`, `docs/agents/memory-registry.yaml`
- Machine-checkable docs policy: `docs/contracts/docs-contract.json`

## Validation Entry Points
- Docs governance and index integrity: `./scripts/check-docs.sh`
- Agent artifact structure: `node scripts/check-agent-contract.mjs`
- Memory registry freshness: `node scripts/check-memory-registry.mjs`
- Full docs gate: `make docs-check`
- Full quality gate: `make check`
