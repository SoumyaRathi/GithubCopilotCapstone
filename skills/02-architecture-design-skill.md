# Skill 02 - Architecture Design

## Purpose
Produce a traceable architecture from approved requirements.

## Inputs
- Approved `docs/<story-id>/01-requirements.md`.
- Repository structure and conventions.

## Procedure
1. Confirm the requirements artifact is `approved`.
2. Inspect the repository for existing modules, patterns, and constraints.
3. Identify components and responsibilities; prefer reuse over new structure.
4. Define interfaces, data model, storage, integrations, and error handling.
5. Map every requirement ID to components and interfaces; list any unmapped requirement as a gap.
6. Record design decisions with alternatives and rationale.
7. List risks, constraints, and dependencies.
8. Write `docs/<story-id>/02-architecture.md` and record the decision.

## Rules
- Do not write implementation code.
- Do not introduce scope beyond the approved requirements.

## Output
Architecture artifact, traceability table, design decisions, risks, and approval status.
