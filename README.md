# Portfolio 2025

> Canonical source: `docs/README.md`, `docs/HARNESS.md`, and `docs/SYSTEM-OF-RECORD.md`.

Laravel 12 + Breeze (React + Inertia) portfolio application.

## Canonical Documentation
- [Docs index](docs/README.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Harness contract](docs/HARNESS.md)
- [System of record](docs/SYSTEM-OF-RECORD.md)
- [Quality policy](docs/QUALITY.md)
- [Deploy runbook](docs/DEPLOY.md)
- [MVP scope](docs/MVP.md)
- [Active roadmap](docs/ROADMAP.md)
- [Agent workflow contract](docs/agents/WORKFLOW.md)

## Quick Start

### Docker workflow
```bash
docker compose up -d
make check-docker
```

### Native workflow
```bash
make setup
make docs-check
make check
make dev
```

Detailed setup guidance:
- [LOCAL_SETUP.md](LOCAL_SETUP.md) (mirror)
- [docs/README.md](docs/README.md) (canonical)

## CI
CI runs the canonical command path:
1. `make setup-ci`
2. `make docs-check`
3. `make check`

Workflow file: [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

## Contribution Baseline
- Keep changes focused and reviewable.
- Update canonical docs in `docs/` when behavior/workflow changes.
- Run `make docs-check` and `make check` before opening a PR.

## License
MIT. See [LICENSE](LICENSE).
