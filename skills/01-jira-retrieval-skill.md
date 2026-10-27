# Skill 01 - Jira Retrieval

## Purpose
Retrieve and verify a Jira story through Jira MCP and cache the raw response.

## Inputs
- Jira issue key (`<story-id>`).

## Procedure
1. Check `.cache/<story-id>.atlassian-issue.json`. If present, make one lightweight Jira check (the `updated` value only); reuse the cache if unchanged.
2. Otherwise fetch the full issue through Jira MCP.
3. Store the raw response plus a `fetchedAt` timestamp in `.cache/<story-id>.atlassian-issue.json`.
4. Verify required fields: key, title, description, status, priority, dependencies, acceptance criteria.
5. If any required field is missing, return `blocked` with the missing field list.
6. Return a concise structured summary for the Requirements Agent.

## Invalidate the Cache When
- The Jira `updated` value differs from the cached value or the story key changes.
- A stage is rejected or blocked and the requirements change.
- The user asks for a refresh.

## Rules
- Never fabricate Jira data.
- Never cache secrets, tokens, or credentials.
- Summarize large responses; keep the raw payload only in `.cache/`.

## Output
Structured story summary, missing-field list (if any), and cache status (hit, refreshed, or created).
