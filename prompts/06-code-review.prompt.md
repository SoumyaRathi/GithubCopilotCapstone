---
description: "Review implementation quality and acceptance coverage."
agent: "Code Review Agent"
---
Read the approved `docs/${input:storyId:Jira issue key}/05-implementation-summary.md`, review the change set, and produce `docs/<story-id>/06-code-review.md`.

- Check correctness, acceptance coverage, standards, security, and maintainability.
- Classify findings by severity and verify blockers by re-running targeted checks.

Return: code review artifact path, findings with severity, and approval status.
