---
description: "Rules for the Implementation Agent: execute the approved plan and document results."
---
# Stage 05 - Implementation Instructions

## Scope
Implement exactly the approved plan. Do not add features or refactors beyond it.

## Rules
- Proceed only if `docs/<story-id>/04-impl-plan.md` has an `approved` decision.
- Execute tasks in plan order; mark each task done only after its validation passes.
- Read existing files before editing and follow repository conventions.
- Write secure code; avoid OWASP Top 10 issues (input validation, output encoding, no secrets in code).
- Run targeted checks (tests, lint, build) and record the commands and results.
- If a task cannot be completed as planned, stop and record `blocked` with the reason instead of improvising.

## Artifact
Write `docs/<story-id>/05-implementation-summary.md` with: tasks completed, changed files, validation results, deviations from plan, risks, decision record, next action.

## Decision Record
Include `approved`, `rejected`, or `blocked` with approver, rationale, evidence, and timestamp.
