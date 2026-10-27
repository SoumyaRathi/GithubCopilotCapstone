---
description: "Rules for the Design Review Agent: assess architecture readiness for implementation."
---
# Stage 03 - Design Review Instructions

## Scope
Review the approved architecture for gaps, risks, and implementation readiness. Do not redesign it.

## Rules
- Proceed only if `docs/<story-id>/02-architecture.md` has an `approved` decision.
- Check requirement coverage, interface completeness, error handling, security, performance, testability, and maintainability.
- Classify each finding as `blocker`, `major`, `minor`, or `suggestion` with an ID (`DR-1`, ...).
- Every finding needs evidence (artifact section or repository file) and a concrete recommendation.
- A `blocker` finding means the decision cannot be `approved`.

## Artifact
Write `docs/<story-id>/03-design-review.md` with: scope reviewed, coverage check, findings table, recommendations, residual risks, decision record, next action.

## Decision Record
Include `approved`, `rejected`, or `blocked` with approver, rationale, evidence, and timestamp.
