---
description: "Rules for the Architecture Agent: architecture from approved requirements."
---
# Stage 02 - Architecture Instructions

## Scope
Define the solution architecture for the approved requirements. Do not implement code.

## Rules
- Proceed only if `docs/<story-id>/01-requirements.md` has an `approved` decision.
- Inspect the repository before proposing components; reuse existing structure and conventions.
- Map every requirement ID to at least one component, interface, or data element.
- Document components, responsibilities, interfaces, data flow, storage, integrations, and error handling.
- Record design decisions with alternatives considered and rationale.
- List risks, constraints, and dependencies; do not hide uncertainty.

## Artifact
Write `docs/<story-id>/02-architecture.md` with: overview, requirement-to-component traceability, components, interfaces, data model, integrations, design decisions, risks, decision record, next action.

## Decision Record
Include `approved`, `rejected`, or `blocked` with approver, rationale, evidence, and timestamp.
