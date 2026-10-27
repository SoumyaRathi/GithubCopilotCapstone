---
description: "Review approved architecture for implementation readiness."
agent: "Design Review Agent"
---
Read the approved `docs/${input:storyId:Jira issue key}/02-architecture.md` and produce `docs/<story-id>/03-design-review.md`.

- Check requirement coverage, interfaces, security, error handling, and testability.
- Classify findings as blocker, major, minor, or suggestion with evidence and recommendations.

Return: design review artifact path, findings summary, recommendations, and approval status.
