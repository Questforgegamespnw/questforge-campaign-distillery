# QuestForge Campaign Distillery — Developer Documentation

## Overview

This directory contains the technical and design documentation for the QuestForge Campaign Distillery.

The current system implements a complete human-in-the-loop, two-phase campaign-development workflow:

1. **Phase 1 — Identity Discovery**
   - deterministic intake interpretation;
   - Primary, Adjacent, and Wildcard Identity Pitches;
   - combined AI polish round trip;
   - source-bound validation;
   - client-facing HTML and PDF export;
   - enriched Identity Pitch handoff creation;
   - validated Identity Selection Record creation.

2. **Phase 2 — Campaign Concept Development**
   - direct input from an Identity Selection Record;
   - selected-identity handoff;
   - bounded Campaign Concept generation;
   - three playable concept variants;
   - structural, semantic, source, and identity validation;
   - client-facing HTML and PDF export.

The guiding principle remains:

> **Phase 1 discovers what the campaign wants to be.**  
> **Phase 2 decides what is actually happening and what the players can change.**

v0.10.1 hardens the production handoff between those phases and adds a post-validation enrichment step so Phase 2 keeps deterministic Phase 1 metadata.

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
- `standard` / `youth` / `kids` audience profile propagation;
- Core Frame audience policy for preserve, soften, downweight, substitute, and suppress behavior;
- youth/kids voice layer;
- client-facing output boundary cleanup;
- source-bound Phase 1 AI polish;
- Phase 1 validation and client PDF delivery;
- enriched Identity Pitch handoff script;
- Identity Selection Record builder, validator, and creation script;
- Phase 2 preparation from Identity Selection Records;
- Campaign Concept input, prompt, schema, evaluation, and validation;
- source-bound Phase 2 manual AI round trip;
- Phase 2 client PDF delivery;
- canonical submission and export folder architecture;
- shared submission lifecycle status synchronization;
- categorized scripts, tests, shared utilities, and exporters;
- static developer wiki generation.
- opt-in matchmaking intake and addendum support;
- compatibility-profile derivation and lifecycle;
- pair eligibility, scoring, confidence, and explanations;
- active-pool persistence, ranking, and stale-result detection;
- group compatibility analysis with weakest-pair protection;
- multi-mode Electron Operator Console;
- controlled introductions with approval and audit history.

### Not Yet Implemented

- structured system recommendation;
- automatic email delivery;
- automatic Formspree execution;
- final selected-concept refinement stage;
- dedicated contact-directory resolution for released `contactRef` values.

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
