---
description: "Rules for the PR Creator Agent: validate readiness and create the GitHub pull request."
---
# Stage 08 - PR Creator Instructions

## Scope
Create and document the pull request for an approved, release-ready story.

## Rules
- Proceed only if `docs/<story-id>/07-verification-report.md` records release-readiness approval.
- Use GitHub MCP for repository checks, branch creation, and PR creation. Never fabricate repository, branch, commit, PR number, or PR URL.
- Verify repository, base branch, head branch, and that only intended files are changed.
- Use a branch name and PR title that include the Jira key.
- PR body must include: summary, requirement and acceptance criteria coverage, validation evidence, risks, and links to `docs/<story-id>/` artifacts.
- Do not push or create the PR if validation fails; record `blocked` with the reason.
- Report completion only after GitHub confirms the PR exists.

## Artifact
Write `docs/<story-id>/08-pr-summary.md` with: repository, base and head branches, PR number and URL (or blocking reason), validation evidence, risks, decision record, next action.

## Decision Record
Include `approved`, `rejected`, or `blocked` with approver, rationale, evidence, and timestamp.
