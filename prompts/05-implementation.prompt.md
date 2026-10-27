---
description: "Execute the approved implementation plan."
agent: "Implementation Agent"
---
Read the approved `docs/${input:storyId:Jira issue key}/04-impl-plan.md`, implement it, and produce `docs/<story-id>/05-implementation-summary.md`.

- Apply only planned changes, in plan order.
- Run targeted checks after each task and record commands and results.
- Stop and record `blocked` if a task cannot be completed as planned.

Return: implementation summary artifact path, changed files, validation results, and approval status.
