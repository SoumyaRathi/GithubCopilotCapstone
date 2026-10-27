# Skill 03 - Design Review

## Purpose
Assess whether the approved architecture is ready for implementation.

## Inputs
- Approved `docs/<story-id>/02-architecture.md`.
- Approved `docs/<story-id>/01-requirements.md`.

## Procedure
1. Confirm the architecture artifact is `approved`.
2. Check requirement coverage using the traceability table.
3. Review interfaces, data flow, error handling, security, performance, testability, and maintainability.
4. Record each finding with ID (`DR-n`), severity (`blocker`, `major`, `minor`, `suggestion`), evidence, and recommendation.
5. Summarize residual risks.
6. Write `docs/<story-id>/03-design-review.md` and record the decision.

## Rules
- Any open `blocker` prevents `approved`.
- Do not redesign; recommend changes only.

## Output
Design review artifact, findings table, recommendations, and approval status.
