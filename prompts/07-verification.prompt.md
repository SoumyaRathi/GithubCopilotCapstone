---
description: "Verify completeness and release readiness."
agent: "Verification Agent"
---
Read the approved `docs/${input:storyId:Jira issue key}/06-code-review.md` and produce `docs/<story-id>/07-verification-report.md`.

- Build a requirement-to-evidence traceability matrix.
- Run tests and checks; confirm every acceptance criterion is verified.
- State an explicit release-readiness decision.

Return: verification report artifact path, validation evidence, readiness decision, and risk summary.
