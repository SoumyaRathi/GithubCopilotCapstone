---
description: "Formalize requirements for a Jira story."
agent: "Requirements Agent"
---
Retrieve Jira story `${input:storyId:Jira issue key, for example KAN-116}` through Jira MCP and produce `docs/<story-id>/01-requirements.md`.

- Verify key, title, description, status, priority, dependencies, and acceptance criteria.
- Block and list missing fields instead of inventing data.
- Write testable requirements and acceptance criteria with stable IDs.

Return: requirements artifact path, approval status, evidence, and open questions.
