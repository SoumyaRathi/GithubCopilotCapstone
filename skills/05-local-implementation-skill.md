# Skill 05 - Local Implementation

## Purpose
Build and validate the approved plan locally.

## Inputs
- Approved `docs/<story-id>/04-impl-plan.md`.

## Procedure
1. Confirm the plan is `approved`.
2. For each task in order: read affected files, apply the planned change, run the task's validation.
3. Run project tests, lint, or build commands relevant to the changed files.
4. Record each task status, changed files, commands run, and results.
5. Record any deviation from the plan with rationale; stop with `blocked` if a deviation changes scope.
6. Write `docs/<story-id>/05-implementation-summary.md` and record the decision.

## Rules
- Apply only planned changes.
- Follow existing repository conventions and secure coding practices (OWASP Top 10).
- Do not mark a task done until its validation passes.

## Output
Implementation summary artifact, changed files, validation results, and approval status.
