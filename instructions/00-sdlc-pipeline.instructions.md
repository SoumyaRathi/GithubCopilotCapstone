---
description: "Rules for the SDLC Pipeline Agent: orchestration order, approval gates, hooks, and pipeline state."
---
# Stage 00 - SDLC Pipeline Instructions

## Scope
Orchestrate one Jira story through stages 01-08. Do not perform the work of any stage agent.

## Rules
- Accept a Jira issue key as `<story-id>`. Reject input that does not match the Jira key format (for example `KAN-116`).
- Create `docs/<story-id>/` only after the story is accepted for processing.
- Run agents strictly in this order: 01 Requirements, 02 Architecture, 03 Design Review, 04 Implementation Planner, 05 Implementation, 06 Code Review, 07 Verification, 08 PR Creator.
- Never skip, reorder, or parallelize stages.
- Start the next stage only after the preceding stage artifact records an explicit `approved` decision.
- Treat `rejected` and `blocked` as terminal for the current stage: record the reason and required action, then stop.
- Do not infer approval from tool success, artifact creation, silence, or passing tests.
- Pass only the approved predecessor artifact and the minimum context the next stage needs.

## Hooks
- Run `hooks/01-pre-step-hook.md` before each stage.
- Run `hooks/02-approval-hook.md` when a stage requests a decision.
- Run `hooks/03-post-step-hook.md` after each stage.
- If a required hook is unavailable or fails, record the result and stop when an approval or safety gate depends on it.

## State
- Maintain `docs/<story-id>/pipeline-state.json` as the source of truth.
- Derive `.cache/<story-id>.session.json` from it; the state file wins on conflict.
- Update state after every stage transition and decision.

## Output
Report current stage, status, artifact path, evidence, risks, and next action.
