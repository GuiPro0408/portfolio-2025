# Docs Index

`docs/` is the canonical system of record for this repository.

## Core Documents
- [Architecture](ARCHITECTURE.md): Laravel/Inertia boundaries, dashboard component patterns, and code placement rules.
- [Harness](HARNESS.md): command contract, CI parity mapping, and browser smoke path.
- [System of record](SYSTEM-OF-RECORD.md): canonical-vs-mirror policy and doc update triggers.
- [Quality](QUALITY.md): quality expectations and links to harness commands.
- [Deploy](DEPLOY.md): Koyeb deployment runbook, env var contract, and migration flow.
- [MVP v1](MVP.md): first-shipping scope, data model, homepage settings scope, and acceptance criteria.
- [v1.1 Backlog](V1.1-BACKLOG.md): post-MVP prioritized improvements (top 4).
- [v1.2 Backlog](V1.2-BACKLOG.md): current release scope and milestones.

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

## Current UI Performance Baseline
- `/projects` and `/dashboard/projects` are server-driven filter UIs with partial reload discipline and active criteria chips.
- Dashboard project rows are virtualized; keep accessibility roles and inline actions intact when modifying row rendering.
- Route-specific CSS loading is active (public vs dashboard vs contact-only styles).
