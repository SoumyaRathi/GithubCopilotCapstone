# Skill 08 - PR Creation

## Purpose
Validate PR readiness and create the branch and pull request through GitHub MCP.

## Inputs
- Approved `docs/<story-id>/07-verification-report.md`.
- `.cache/<story-id>.github-context.json`.

## Procedure
1. Re-run the readiness validation in `skills/07-release-verification-skill.md`; stop if it fails.
2. Check GitHub context: repository, base branch, head branch, and working-tree changes. Refresh `.cache/<story-id>.github-context.json` if the repository or branches changed.
3. Create the head branch (name includes the Jira key) if it does not exist.
4. Confirm only intended files are included.
5. Create the pull request with a title including the Jira key and a body containing: summary, requirement and acceptance criteria coverage, validation evidence, risks, and links to `docs/<story-id>/` artifacts.
6. Read back the PR from GitHub to confirm number and URL.
7. Write `docs/<story-id>/08-pr-summary.md` and record the decision.

## Rules
- Never fabricate repository, branch, commit, PR number, or PR URL.
- If any check fails, record `blocked` with the reason and do not create the PR.
- Report completion only after GitHub confirms the PR.

## Output
PR summary artifact, repository and branch details, PR URL or blocking reason, and status.
