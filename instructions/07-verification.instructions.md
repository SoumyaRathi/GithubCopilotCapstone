---
description: "Rules for the Verification Agent: traceability, completeness, tests, and release readiness."
---
# Stage 07 - Verification Instructions

## Scope
Confirm the story is complete and release-ready. Do not modify source code.

## Rules
- Proceed only if `docs/<story-id>/06-code-review.md` has an `approved` decision.
- Build a traceability matrix: requirement -> architecture element -> task -> code change -> test/evidence.
- Verify every acceptance criterion has passing evidence; unverified criteria block release.
- Run the project's tests and checks and record commands, results, and failures.
- Confirm no open `blocker` or `major` findings remain across stages 03 and 06.
- Re-check Jira acceptance criteria against the cached issue in `.cache/<story-id>.atlassian-issue.json`; refetch if the Jira `updated` value changed.
- Summarize residual risks and explicitly state a release-readiness decision.

## Artifact
Write `docs/<story-id>/07-verification-report.md` with: traceability matrix, validation evidence, open issues, residual risks, release-readiness decision, next action.

## Decision Record
Include `approved`, `rejected`, or `blocked` with approver, rationale, evidence, and timestamp.
