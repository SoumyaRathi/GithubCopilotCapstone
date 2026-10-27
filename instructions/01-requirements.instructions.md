---
description: "Rules for the Requirements Agent: Jira intake and docs/<story-id>/01-requirements.md."
---
# Stage 01 - Requirements Instructions

## Scope
Turn the Jira story into a formal requirements artifact. Do not design a solution.

## Rules
- Retrieve the story through Jira MCP only; treat key, title, description, status, priority, dependencies, and acceptance criteria as source data.
- Never fabricate Jira data. If a required field is missing, mark the stage `blocked` and list the missing fields.
- Write acceptance criteria as testable statements with stable IDs (`AC-1`, `AC-2`, ...).
- Separate functional requirements, non-functional requirements, assumptions, out-of-scope items, and open questions.
- Assign each requirement an ID (`FR-1`, `NFR-1`) traceable to the Jira source.
- Do not proceed past unresolved blocking questions.

## Artifact
Write `docs/<story-id>/01-requirements.md` with: Jira summary, requirements, acceptance criteria, assumptions, out of scope, open questions, risks, decision record, next action.

## Decision Record
Include `approved`, `rejected`, or `blocked` with approver, rationale, evidence, and timestamp.
