# Skill 00 - Pipeline Orchestration

## Purpose
Run stages 01-08 for one Jira story in order, with hooks, approval gates, and persisted state.

## Inputs
- Jira issue key (`<story-id>`).
- `docs/<story-id>/pipeline-state.json` (if resuming).
- `.cache/<story-id>.session.json` (if resuming).

## Procedure
1. Validate the story key format; stop if invalid.
2. Check GitHub context (repository, base branch) through GitHub MCP and cache it in `.cache/<story-id>.github-context.json`.
3. Create `docs/<story-id>/` and initialize `pipeline-state.json` if absent; otherwise resume from the recorded stage.
4. For each stage 01-08 in order:
   1. Run `hooks/01-pre-step-hook.md`.
   2. Confirm the predecessor artifact records `approved`; otherwise stop.
   3. Invoke the stage agent with only the approved predecessor artifact and minimum context.
   4. Run `hooks/02-approval-hook.md` to capture the decision.
   5. Run `hooks/03-post-step-hook.md`.
   6. Update `pipeline-state.json` and `.cache/<story-id>.session.json`.
5. On `rejected` or `blocked`, record the reason and required action, then stop.
6. After stage 08, report completion only when GitHub confirms the PR.

## State Schema (`pipeline-state.json`)
```json
{
  "storyId": "KAN-116",
  "currentStage": "01",
  "updatedAt": "<ISO-8601>",
  "stages": [
    {
      "stage": "01",
      "agent": "Requirements Agent",
      "status": "pending|in-progress|approved|rejected|blocked",
      "artifact": "docs/KAN-116/01-requirements.md",
      "decision": { "approver": "", "rationale": "", "evidence": "", "timestamp": "" }
    }
  ]
}
```

## Rules
- Never skip, reorder, or parallelize stages.
- Never infer approval from tool success or passing tests.
- Never store secrets, tokens, or credentials in state or cache files.
- The state file wins over the session cache on any conflict.

## Output
Current stage, status, artifact path, evidence, risks, and next action.
