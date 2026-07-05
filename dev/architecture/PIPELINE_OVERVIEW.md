# Pipeline Overview

← [Back to Developer Documentation](../README.md)

## Overview

The QuestForge Campaign Distillery implements a two-phase, human-reviewed campaign-development pipeline.

It separates four concerns:

1. authoritative submission records;
2. deterministic interpretation;
3. bounded AI collaboration;
4. generated client deliverables.

AI transport is currently manual. Prompt creation, response packaging, source matching, validation, status tracking, and export are automated locally.

---

## Full Implemented Flow

```text
Raw Client Submission
→ Raw Submission Capture
→ Intake Normalization
→ Deterministic Phase 1 Pipeline
→ Three Identity Directions
→ Combined Phase 1 AI Prompt
→ Manual ChatGPT Response
→ Source and Contract Validation
→ Validated Identity Pitches
→ Enriched Identity Pitch Handoff
→ Phase 1 HTML/PDF Export
→ Client Direction Selection
→ Identity Selection Record
→ Phase 2 Handoff
→ Campaign Concept Input Validation
→ Combined Phase 2 AI Prompt
→ Manual ChatGPT Response
→ Source, Schema, Identity, and Playability Validation
→ Validated Campaign Concepts
→ Phase 2 HTML/PDF Export
→ Guided Client Concept Selection
```

The structured system-recommendation stage is not yet implemented.

---

## Authoritative Storage Boundary

### Submission records

```text
submissions/<slug>/
  00_RAW_SUBMISSION.json
  01_NORMALIZED_SUBMISSION.json
  02_PIPELINE_RESULT.json
  submission-status.json
```

These files describe what was received, what the deterministic pipeline decided, and where the production workflow currently stands.

### Generated artifacts

```text
exports/submissions/<slug>/
  phase-1/
    identity-selection-record.json
    round-trip/
      05_ENRICHED_IDENTITY_PITCHES.json
    client-delivery/

  phase-2/
    <direction>/
      round-trip/
      client-delivery/
```

Prompts, pasted responses, validation reports, Identity Selection Records, HTML previews, and PDFs belong under `exports`, not `submissions`.

---

# Phase 1 Stages

## 1. Intake Capture and Normalization

**Responsibilities**

- preserve the raw submission;
- normalize aliases, punctuation, casing, and optional values;
- create a stable translator-ready representation;
- validate canonical intake boundaries.

**Outputs**

- `00_RAW_SUBMISSION.json`;
- `01_NORMALIZED_SUBMISSION.json`;
- `02_PIPELINE_RESULT.json`;
- `submission-status.json`.

---

## 2. Signal Interpretation and Adjudication

**Responsibilities**

- translate human preferences into weighted internal signals;
- infer `standard`, `youth`, or `kids` experience profile;
- apply Core Frame audience policy;
- apply safety and exclusion constraints;
- record suppression and confidence;
- prepare direction-selection guidance.

---

## 3. Direction Selection and Resolution

**Responsibilities**

- create Primary, Adjacent, and Wildcard directions;
- select compatible Core, System, Genre, Tone, and Environment components;
- preserve meaningful difference between directions;
- resolve selected IDs into complete source objects.

---

## 4. Deterministic Identity Pitch Rendering

**Responsibilities**

- build stable Identity Pitch scaffolding;
- communicate campaign meaning and style of play;
- apply tone and safety filters;
- apply youth/kids voice shaping when needed;
- apply client-facing boundary cleanup;
- produce client and audit views.

**Primary modules**

```text
pitchCore
→ pitchSectionBuilders
→ pitchAssembly
→ pitchSafetyFilters
→ youthVoiceLayer
→ pitchCleanup / client-facing boundary cleanup
→ generateCampaignPitch
```

---

## 5. Phase 1 Manual AI Round Trip

**Responsibilities**

- package all three directions into one prompt;
- bind the prompt to a SHA-256 source fingerprint;
- receive one combined JSON response;
- reject wrong-source or wrong-contract responses;
- evaluate each direction independently;
- preserve deterministic fallback output when validation fails.

**Workspace**

```text
01_IDENTITY_POLISH_PROMPT.md
02_PASTE_CHATGPT_RESPONSE_HERE.json
03_VALIDATION_RESULT.json
04_VALIDATED_IDENTITY_PITCHES.json
05_VALIDATION_SUMMARY.txt
round-trip-status.json
```

---

## 5A. Enriched Identity Pitch Handoff

**Responsibilities**

- keep `04_VALIDATED_IDENTITY_PITCHES.json` narrow and validator-focused;
- stitch validated GPT-polished prose back onto deterministic Phase 1 metadata;
- preserve source frame data, context, constraints, genre, tone, environment, safety, audience, and handoff guidance;
- provide the enriched source used by Identity Selection Record creation.

**Artifact**

```text
05_ENRICHED_IDENTITY_PITCHES.json
```


## 6. Phase 1 Client Export

**Responsibilities**

- normalize validated Identity Pitch data;
- build client-facing HTML;
- render a PDF through Puppeteer;
- write deliverables separately from internal round-trip artifacts;
- update submission lifecycle status.

---

# Human Selection Boundary

The client reviews the three Identity Pitches and selects one direction.

The operator records the decision by creating an Identity Selection Record from the enriched Identity Pitch handoff.

**Artifact**

```text
exports/submissions/<slug>/phase-1/identity-selection-record.json
```

The record captures selected direction, selected enriched pitch, client response notes, preservation guidance, intake summary, safety profile, deterministic context, and optional system/setting context.

---

# Phase 2 Stages

## 7. Phase 2 Handoff Construction

**Responsibilities**

- consume the Identity Selection Record directly;
- preserve the exact selected Identity Pitch;
- summarize the approved identity;
- record selection feedback;
- record intake, safety, system, and setting context;
- reject handoff drift from the validated identity source.

**Artifact**

```text
00_PHASE2_HANDOFF.json
```

Legacy mode still supports validated Identity Pitches plus `--direction`.

---

## 8. Campaign Concept Input and Prompt Construction

**Responsibilities**

- normalize handoff data into the Phase 2 input contract;
- validate required identity and context fields;
- generate the Campaign Concept prompt;
- create a stable source fingerprint;
- prepare a three-variant response skeleton.

---

## 9. Campaign Concept Generation

The AI produces exactly three variants in `three_variants` mode:

1. Core Interpretation;
2. Alternate Situation;
3. Distinctive Interpretation.

Each variant preserves the same identity while changing the concrete implementation.

---

## 10. Campaign Concept Validation

Validation checks:

- JSON parse success;
- schema structure;
- required fields;
- exact source fingerprint;
- selected-identity alignment;
- invention boundaries;
- playable starting situation;
- active factions or forces;
- recurring campaign engine;
- visible escalation;
- meaningful player agency;
- variant differentiation.

**Workspace**

```text
00_PHASE2_HANDOFF.json
01_CAMPAIGN_CONCEPT_PROMPT.md
02_PASTE_CHATGPT_RESPONSE_HERE.json
03_VALIDATION_RESULT.json
04_VALIDATED_CAMPAIGN_CONCEPTS.json
05_VALIDATION_SUMMARY.txt
round-trip-status.json
```

---

## 11. Phase 2 Client Export

The exporter builds:

- a cover;
- a selected-identity reading guide;
- three pages per concept;
- a final comparison and response page.

The HTML preview and PDF are written to the Phase 2 `client-delivery` directory.

---

# Submission Lifecycle Status

`submission-status.json` is the shared production status spine.

It records:

- current stage;
- next action;
- Phase 1 and Phase 2 completion flags;
- failed-validation states;
- generated artifact paths;
- append-only history.

Commands should merge status updates rather than replacing previously completed steps.

---

# Design Principles

## Deterministic Before Generative

The pipeline must decide what the campaign means before AI is permitted to invent concrete fiction.

## Source-Bound AI

A response must be evaluated against the exact source package that generated its prompt.

## Human Review Between Phases

Phase 2 begins only after a human approves one Phase 1 direction and records it in an Identity Selection Record.

## Generated Artifacts Are Not Source Records

Exports may be regenerated. Raw and normalized submission records must remain stable and authoritative.

## One Responsibility Per Layer

Mapping does not render. Rendering does not select. Exporters do not redefine contracts. Tests do not become alternate operator workflows.

---

## Future Pipeline Work

- structured system recommendation;
- selected-concept refinement;
- automatic email delivery;
- form-provider integration;
- individual-player matchmaking and compatibility pools.
