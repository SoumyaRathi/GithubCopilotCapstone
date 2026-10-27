---
description: "Create and document the GitHub pull request."
agent: "PR Creator Agent"
---
Read the approved `docs/${input:storyId:Jira issue key}/07-verification-report.md`, create the pull request through GitHub MCP, and produce `docs/<story-id>/08-pr-summary.md`.

- Confirm repository, base branch, head branch, and intended file changes before creating the PR.
- Never fabricate branch, commit, PR number, or URL values.
- Report completion only after GitHub confirms the PR.

Return: PR summary artifact path, repository and branch details, PR URL or blocking reason, and status.
