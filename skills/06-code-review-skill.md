# Skill 06 - Code Review

## Purpose
Review the implementation against approved artifacts.

## Inputs
- Approved `docs/<story-id>/05-implementation-summary.md`.
- Approved requirements, architecture, and implementation plan.

## Procedure
1. Confirm the implementation summary is `approved`.
2. Read each changed file listed in the summary.
3. Check against requirements, acceptance criteria, architecture, and plan.
4. Review correctness, standards, security (OWASP Top 10), error handling, test quality, and maintainability.
5. Record each finding with ID (`CR-n`), severity, file and line evidence, and recommendation.
6. Re-run targeted checks to verify any blocker.
7. Write `docs/<story-id>/06-code-review.md` and record the decision.

## Rules
- Any open `blocker` or `major` finding prevents `approved`.
- Report issues only; do not fix them in this stage.

## Output
Code review artifact, findings with severity, checks run, and approval status.
