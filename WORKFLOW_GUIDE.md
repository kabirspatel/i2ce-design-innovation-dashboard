# I2CE Design Innovation Workspace Workflow

## Purpose

The workspace connects planning, research, notebook documentation, virtual and real experiments, phase decisions, and reusable project data. Enter a record once and reuse it through stable IDs, tags, relationships, and provenance.

## Core Workflow

1. Define work in **Plan** and connect it to a phase, requirements, protocols, and materials.
2. Use **Start work** from a task to create or resume its linked notebook entry.
3. Capture observations, files, interpretation, and next action in **Notebook**.
4. Add literature and market evidence through **Research Intelligence**.
5. Run virtual and real evidence from the same controlled protocol in **Experiments**.
6. Review outputs and generated tags in the relevant **Phase review** section.
7. Use **Project Map** to see what each task consumes, creates, and feeds downstream.
8. Record a gate decision after reviewing derived readiness checks.
9. Export a typed **Data lake package** from Project Knowledge.

## Notebook and Files

Start from Today or a task so the work-item relationship is retained. Confirm the phase and phase section, then record objective, method, observations or raw data, results, interpretation, and next action. Link applicable requirement, material, protocol, and run IDs. Save active work as Draft and sign only when the record is complete and reviewable.

Uploads currently create file metadata: filename, type, size, modification time, metadata checksum, parent record, phase, tags, uploader, and proposed object-store key. This static prototype does not persist binary files to governed storage. A production connector must stream binaries to approved object storage and return an immutable URI and cryptographic checksum.

Generated tags describe entity type, phase, section, evidence mode, requirements, materials, and detected project terms. They support retrieval but do not replace human review.

## Literature Review

1. Open **Research Intelligence > Literature review**.
2. Enter citation, source, year, and research question.
3. Extract methods/context, findings, limitations, and evidence strength.
4. State which project decision the source affects.
5. Link phase section, work items, and requirements.
6. Attach source evidence where permitted and move Draft to In review to Approved.

Use synthesis and phase coverage to identify duplicated themes and evidence gaps.

## Market Analysis

1. Open **Research Intelligence > Market analysis**.
2. Record incumbents, competitors, substitutes, or solution classes.
3. Capture segment, geography, maturity, price model, strengths, and gaps.
4. Score opportunity from 0 to 100 using the team rubric.
5. State project relevance and link tasks and requirements.
6. Cross-check sustainability claims before approval.

## Virtual and Real Experiments

Use one versioned protocol for both modes. Define purpose, controlled steps, acceptance criteria, requirements, and materials. Virtual runs cover models, simulations, calculations, and digital analysis. Real runs cover builds, bench tests, field observations, and supplier evidence. Record measurements, the result against acceptance criteria, and a conclusion, then link the run to a notebook entry. Superseded runs remain in history with an exclusion reason.

## Project Map

- **Scope flow** shows the path from need through research, requirements, design, evidence, lifecycle, and governance.
- **Evidence composition** shows signed notebook records and virtual/real runs.
- **Phase activity orbit** shows where work and evidence are concentrated.
- **Requirement coverage** shows design inputs with linked evidence.
- **Task role cards** identify upstream inputs, created outputs, and downstream consumers.

Select a visual element to open its underlying phase or task.

## Phase Gates

Review all phase sections, compare modeled and observed evidence, and inspect completion, signed documentation, requirement coverage, and virtual/real agreement. Record Pass, Hold, or Rework with reviewer, date, rationale, unresolved evidence, and next action. The readiness score is an orientation aid, not an automatic approval.

## Data Lake Handoff

The export contains a manifest and typed object envelopes with entity ID/type, schema version, project ID, phase section, tags, relationships, provenance, and payload. Attachment metadata and object keys are included; binaries are not. Production ingest should validate schemas, IDs, relationships, checksums, permissions, and retention before acceptance.

## Security Boundary

This public static prototype is for workflow evaluation and non-sensitive demonstration data. Do not enter confidential, regulated, personal, medical, export-controlled, or proprietary data. Production use requires authentication, role-based access, encrypted transport and storage, immutable audit logs, backup/recovery, retention controls, controlled signatures, tenant isolation, and governed data-lake/object-storage connectors.
