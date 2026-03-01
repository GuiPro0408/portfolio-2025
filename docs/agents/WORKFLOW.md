# Agent Workflow Contract

This document defines the in-repository integration contract for external agent runtimes.
It does not prescribe runtime/provider implementation details.

## Scope
- Applies to all repository work coordinated through specialized agent roles.
- Standardizes role boundaries, handoff artifacts, acceptance gates, and escalation paths.
- Complements `AGENTS.md` and canonical docs under `docs/`.

## Role Contracts

### Conductor
- Purpose: orchestration owner for task intake, routing, sequencing, and completion tracking.
- Required input:
  - user request and constraints
  - current repository state and canonical docs context
- Required output:
  - task brief (from `docs/agents/templates/task-brief.md`)
  - delegated subagent assignments and acceptance criteria
  - consolidated final response/checklist
- Exit criteria:
  - required subagent artifacts are present and complete
  - quality evidence is attached for affected scopes
  - docs impact is resolved or explicitly marked none
- Escalation:
  - unclear scope, contradictory constraints, failed quality gates, or blocked dependencies

### planning-subagent
- Purpose: produce decision-complete implementation specs before coding starts.
- Required input:
  - task brief
  - impacted canonical docs and architecture constraints
- Required output:
  - implementation spec from `docs/agents/templates/plan-spec.md`
  - explicit assumptions, out-of-scope boundaries, and acceptance tests
- Exit criteria:
  - no unresolved high-impact decisions
  - implementation path is executable without additional design choices
- Escalation:
  - missing product intent, incompatible constraints, unresolved tradeoff ownership

### implement-subagent
- Purpose: execute approved implementation specs and produce verifiable changes.
- Required input:
  - approved plan spec
  - coding constraints from `AGENTS.md` and canonical docs
- Required output:
  - implementation report from `docs/agents/templates/implementation-report.md`
  - list of changed files, tests run, and outcomes
- Exit criteria:
  - implementation matches plan scope
  - required checks pass (or failure is documented with mitigation)
- Escalation:
  - spec ambiguity discovered during execution
  - regressions or quality gate failures that require scope change

### code-review-subagent
- Purpose: perform independent risk-focused review of implemented changes.
- Required input:
  - implementation report
  - code diff and updated docs
- Required output:
  - review report from `docs/agents/templates/review-report.md`
  - findings prioritized by severity with concrete file references
- Exit criteria:
  - critical findings resolved or explicitly accepted by decision owner
  - residual risks and test gaps are documented
- Escalation:
  - unresolved high-severity issues
  - missing evidence for required checks or docs updates

## Handoff Sequence
1. Conductor creates task brief and defines acceptance criteria.
2. planning-subagent produces a decision-complete plan spec.
3. Conductor validates plan completeness and authorizes execution.
4. implement-subagent executes and submits implementation report.
5. code-review-subagent submits review report with findings/risk assessment.
6. Conductor confirms closure criteria and publishes final result.

## Ownership Transitions
- Intake to plan: Conductor -> planning-subagent
- Plan to execution: Conductor -> implement-subagent
- Execution to review: implement-subagent -> code-review-subagent
- Review to close: code-review-subagent -> Conductor

Each transition must include:
- artifact path
- scope statement
- unresolved risks/assumptions
- required validation status

## Quality Gate Integration
- Behavior/workflow changes must include `make docs-check` and `make check` evidence.
- Documentation changes must satisfy `scripts/check-docs.mjs` contract rules.
- Agent artifacts and memory records must satisfy:
  - `scripts/check-agent-contract.mjs`
  - `scripts/check-memory-registry.mjs`

## Escalation Rules
- Any failed mandatory check blocks handoff completion.
- Any scope expansion beyond plan requires a planning loop before implementation resumes.
- If canonical docs and code diverge, canonical docs must be updated in the same change set.
