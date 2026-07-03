# QuestForge Campaign Distillery — Developer Documentation

## Overview

This directory contains the technical and design documentation for the QuestForge Campaign Distillery.

The current system implements a complete human-in-the-loop, two-phase campaign-development workflow:

1. **Phase 1 — Identity Discovery**
   - deterministic intake interpretation;
   - Primary, Adjacent, and Wildcard Identity Pitches;
   - combined AI polish round trip;
   - source-bound validation;
   - client-facing HTML and PDF export.

2. **Phase 2 — Campaign Concept Development**
   - selected-identity handoff;
   - bounded Campaign Concept generation;
   - three playable concept variants;
   - structural, semantic, and source validation;
   - client-facing HTML and PDF export.

The guiding principle remains:

> **Phase 1 discovers what the campaign wants to be.**  
> **Phase 2 decides what is actually happening and what the players can change.**

The system-recommendation stage and formal Identity Selection Record schema remain future work.

---

## Start Here

### Architecture

- [Pipeline Overview](./architecture/PIPELINE_OVERVIEW.md)
- [Phase Model and Terminology](./architecture/PHASE_MODEL_AND_TERMINOLOGY.md)
- [Program Architecture Map](./architecture/QUESTFORGE_PROGRAM_ARCHITECTURE.md)

### Phase 1

- [Renderer Architecture](./phase1/RENDERER_ARCHITECTURE.md)
- [Voice System Overview](./phase1/VOICE_SYSTEM_OVERVIEW.md)
- [Phase 1 Manual Round Trip](./phase1/PHASE_1_MANUAL_ROUND_TRIP.md)
- [Phase 1 PDF Export](./phase1/PHASE_1_PDF_EXPORT.md)

### Phase 2

- [Campaign Concept Contract](./phase2/PHASE_2_CAMPAIGN_CONCEPT_CONTRACT.md)
- [Phase 2 Manual Round Trip](./phase2/PHASE_2_MANUAL_ROUND_TRIP.md)
- [Phase 2 PDF Export](./phase2/PHASE_2_PDF_EXPORT.md)

### Data

- [Data Model Overview](./data/DATA_MODEL_OVERVIEW.md)
- [Campaign Frame Library](./data/CAMPAIGN_FRAME_LIBRARY.md)
- [Data Expansion Guidelines](./data/DATA_EXPANSION_GUIDELINES.md)
- [New Entry Review](./data/NEW_ENTRY_REVIEW.md)
- [Entry Decisions Log](./data/ENTRY_DECISIONS_LOG.md)

### Operations

- [Submission and Export Storage](./operations/SUBMISSION_AND_EXPORT_STORAGE.md)
- [Script Workflow Guide](./operations/SCRIPT_WORKFLOW_GUIDE.md)
- [Test Suite Guide](./operations/TEST_SUITE_GUIDE.md)
- [Debugging Guide](./operations/DEBUGGING_GUIDE.md)

---

## Current Capability State

### Implemented

- canonical intake normalization and validation;
- deterministic Phase 1 direction selection and rendering;
- source-bound Phase 1 AI polish;
- Phase 1 validation and client PDF delivery;
- Phase 2 handoff construction;
- Campaign Concept input, prompt, schema, evaluation, and validation;
- source-bound Phase 2 manual AI round trip;
- Phase 2 client PDF delivery;
- canonical submission and export folder architecture;
- categorized scripts, tests, shared utilities, and exporters;
- static developer wiki generation.

### Not Yet Implemented

- formal runtime Identity Selection Record schema;
- structured system recommendation;
- automatic email delivery;
- automatic Formspree execution;
- final selected-concept refinement stage;
- full lifecycle orchestration across every workflow command.

---

## Runtime Naming Note

Some Phase 1 source APIs retain earlier names such as:

- `generateCampaignPitch`;
- `clientPitch`;
- `auditPitch`;
- `campaignPitch`.

These are compatibility names. Conceptually, the current deterministic output is a **Phase 1 Identity Pitch**, not a completed Campaign Concept.

---

## Documentation Authority

- Source code and runtime schemas are authoritative for current behavior.
- Developer Markdown explains intended architecture and operating doctrine.
- The generated wiki is a reader, not a separate source of truth.
- Sanitized examples illustrate contracts but do not define them.

---

## Developer Wiki

Open:

```text
dev/wiki/index.html
```

The wiki is generated from the Markdown files by:

```powershell
node scripts/docs/buildDevWiki.js
```

No web server or external dependency is required.
