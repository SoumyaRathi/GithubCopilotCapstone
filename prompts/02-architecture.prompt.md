---
description: "Define architecture from approved requirements."
agent: "Architecture Agent"
---
Read the approved `docs/${input:storyId:Jira issue key}/01-requirements.md` and produce `docs/<story-id>/02-architecture.md`.

- Inspect the repository and reuse existing conventions.
- Map each requirement ID to components, interfaces, and data.
- Record design decisions, alternatives, and risks.

Return: architecture artifact path, approval status, key decisions, and risks.
