---
description: "Run the Agentic SDLC pipeline for a Jira story."
agent: "SDLC Pipeline Agent"
---
Run the Agentic SDLC pipeline for Jira story `${input:storyId:Jira issue key, for example KAN-116}`.

- Validate the story key and create `docs/<story-id>/` once accepted.
- Execute stages 01-08 in order; require an explicit `approved` decision before each handoff.
- Update `docs/<story-id>/pipeline-state.json` after every stage.
- Stop on `rejected` or `blocked` and report the reason and required action.

Return: current stage, status, artifact path, evidence, risks, and next action.
