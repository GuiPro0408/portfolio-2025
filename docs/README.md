# Docs Index

`docs/` is the canonical system of record for this repository.

## Core Documents
- [Architecture](ARCHITECTURE.md): Laravel/Inertia boundaries, dashboard component patterns, and code placement rules.
- [Quality](QUALITY.md): golden commands, check expectations, and CI parity.
- [Deploy](DEPLOY.md): Koyeb deployment runbook, env var contract, and migration flow.
- [MVP v1](MVP.md): first-shipping scope, data model, homepage settings scope, and acceptance criteria.

## Knowledge Base
- [FAQ](knowledge/faq.md): common process and workflow questions.
- [Troubleshooting](knowledge/troubleshooting.md): common failure modes and fixes.
- [Recipes](knowledge/recipes.md): repeatable implementation playbooks.

## Architecture Decision Records (ADRs)
- [0001 - Golden command](decisions/0001-golden-command.md): adopt `make check` as the quality gate.
- [0002 - CI parity](decisions/0002-ci-parity.md): CI runs identical checks to local harness.
- [0003 - Docker parity](decisions/0003-docker-parity.md): container workflows use `make check-docker`.

## Historical / Archived
- [Archived portfolio overview](archive/portfolio-project-overview.md): deprecated Next.js-era planning document (non-canonical).

## Related Entry Points
- Root project overview: [`README.md`](../README.md)
- Native setup notes: [`LOCAL_SETUP.md`](../LOCAL_SETUP.md)
- Quick deployment guide: [`DEPLOYMENT.md`](../DEPLOYMENT.md)
