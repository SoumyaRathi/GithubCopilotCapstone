---
description: "Plan implementation from an approved design review."
agent: "Implementation Planner Agent"
---
Read the approved `docs/${input:storyId:Jira issue key}/03-design-review.md` and produce `docs/<story-id>/04-impl-plan.md`.

- Create ordered tasks with IDs, target files, dependencies, and done conditions.
- Define a validation strategy per task and trace tasks to requirements.

Return: implementation plan artifact path, ordered tasks, validation strategy, and approval status.
