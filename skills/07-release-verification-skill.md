# Skill 07 - Release Verification

## Purpose
Verify completeness, traceability, and release readiness. Also reused by the PR Creator to re-validate readiness.

## Inputs
- Approved `docs/<story-id>/06-code-review.md`.
- All prior stage artifacts in `docs/<story-id>/`.
- `.cache/<story-id>.atlassian-issue.json`.

## Procedure
1. Confirm the code review is `approved`.
2. Build a traceability matrix: requirement -> architecture -> task -> change -> evidence.
3. Run project tests and checks; record commands and results.
4. Confirm every acceptance criterion has passing evidence.
5. Confirm no open `blocker` or `major` findings in stages 03 and 06.
6. Re-check Jira acceptance criteria; refetch only if the Jira `updated` value changed.
7. Summarize residual risks and state the release-readiness decision.
8. Write `docs/<story-id>/07-verification-report.md` and record the decision.

## Rules
- Unverified acceptance criteria block release.
- Do not modify source code in this stage.

## Output
Verification report artifact, validation evidence, readiness decision, and risk summary.
