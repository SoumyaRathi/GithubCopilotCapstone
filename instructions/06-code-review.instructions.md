---
description: "Rules for the Code Review Agent: quality, standards, security, and acceptance coverage."
---
# Stage 06 - Code Review Instructions

## Scope
Review the change set against approved artifacts. Do not fix issues in this stage.

## Rules
- Proceed only if `docs/<story-id>/05-implementation-summary.md` has an `approved` decision.
- Review only the files listed as changed; compare against requirements, architecture, and plan.
- Check correctness, acceptance criteria coverage, standards, security (OWASP Top 10), error handling, test quality, and maintainability.
- Classify findings as `blocker`, `major`, `minor`, or `suggestion` with IDs (`CR-1`, ...), file and line evidence, and a recommendation.
- Re-run targeted checks to verify any claimed blocker before reporting it.
- Any open `blocker` or `major` finding prevents an `approved` decision.

## Artifact
Write `docs/<story-id>/06-code-review.md` with: scope, acceptance coverage, findings table, checks run, risks, decision record, next action.

## Decision Record
Include `approved`, `rejected`, or `blocked` with approver, rationale, evidence, and timestamp.
