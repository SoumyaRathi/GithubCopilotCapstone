---
description: "Rules for the Implementation Planner Agent: ordered, verifiable implementation plan."
---
# Stage 04 - Implementation Planner Instructions

## Scope
Convert the approved design review into an executable plan. Do not change source code.

## Rules
- Proceed only if `docs/<story-id>/03-design-review.md` has an `approved` decision.
- Incorporate accepted design review recommendations; note any deferred ones with rationale.
- Break work into small tasks with IDs (`T-1`, ...), target files, dependencies, and a done condition.
- Order tasks by dependency; mark which requirement and acceptance criteria each task satisfies.
- Define a validation strategy per task: tests, commands, or manual checks.
- Keep the plan limited to approved scope; no speculative tasks.

## Artifact
Write `docs/<story-id>/04-impl-plan.md` with: scope, task list, dependencies and order, validation strategy, traceability matrix, risks, decision record, next action.

## Decision Record
Include `approved`, `rejected`, or `blocked` with approver, rationale, evidence, and timestamp.
