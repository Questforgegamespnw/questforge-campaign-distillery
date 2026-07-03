# QuestForge Campaign Distillery — Program Architecture

← [Back to Developer Documentation](../README.md)

## Scope

This document describes the implemented v0.10.0 architecture.

Solid workflow stages are implemented. Dashed downstream stages remain planned.

## Architecture Diagram

```mermaid
flowchart TD
classDef implemented fill:#edf9ef,stroke:#3d7a46,color:#17361d
classDef human fill:#fff0f6,stroke:#a24f77,color:#4f1830
classDef artifact fill:#e8f8f8,stroke:#2f7d7d,color:#143d3d
classDef validation fill:#ffecec,stroke:#a54343,color:#4d1717
classDef planned fill:#f0f0f0,stroke:#777,stroke-dasharray:6 4,color:#333
classDef data fill:#eef6ff,stroke:#3b6ea5,color:#0f2740
classDef process fill:#f7f7f7,stroke:#555,color:#111

FORM["Client Form / JSON"]:::data
RAW["submissions/<slug>/00_RAW_SUBMISSION.json"]:::artifact
NORMAL["01_NORMALIZED_SUBMISSION.json"]:::artifact
PIPE["02_PIPELINE_RESULT.json"]:::artifact
STATUS["submission-status.json"]:::artifact

FORM --> RAW --> NORMAL --> PIPE
RAW -.updates.-> STATUS
PIPE -.updates.-> STATUS

subgraph P1["Phase 1 — Identity Discovery"]
  SELECT["Signal adjudication, audience policy, and direction selection"]:::process
  RENDER["Deterministic Identity Pitch renderer"]:::process
  VOICE["youth/kids voice layer + client-facing boundary cleanup"]:::process
  P1PROMPT["Combined source-bound AI prompt"]:::artifact
  P1AI["Manual ChatGPT polish"]:::human
  P1VALID["Envelope, fingerprint, and direction validation"]:::validation
  P1JSON["04_VALIDATED_IDENTITY_PITCHES.json"]:::artifact
  P1PDF["Phase 1 HTML + PDF"]:::artifact
  ISR["identity-selection-record.json"]:::artifact
end

PIPE --> SELECT --> RENDER --> VOICE --> P1PROMPT --> P1AI --> P1VALID --> P1JSON --> P1PDF
P1PDF --> ISR

CLIENT["Client reviews Primary / Adjacent / Wildcard"]:::human
HANDOFF["00_PHASE2_HANDOFF.json"]:::artifact
P1PDF --> CLIENT --> ISR --> HANDOFF

subgraph P2["Phase 2 — Campaign Concept Development"]
  INPUT["Campaign Concept input builder"]:::process
  INPUTVALID["Input and handoff validation"]:::validation
  P2PROMPT["Combined source-bound Campaign Concept prompt"]:::artifact
  P2AI["Manual ChatGPT generation"]:::human
  P2VALID["Schema, identity, invention, and playability validation"]:::validation
  P2JSON["04_VALIDATED_CAMPAIGN_CONCEPTS.json"]:::artifact
  P2PDF["Phase 2 HTML + PDF"]:::artifact
end

HANDOFF --> INPUT --> INPUTVALID --> P2PROMPT --> P2AI --> P2VALID --> P2JSON --> P2PDF

SYSREC["Structured system recommendation"]:::planned
FINAL["Selected-concept refinement"]:::planned
MATCH["Individual matchmaking / compatibility pool"]:::planned
P2PDF --> SYSREC
P2PDF --> FINAL
ISR -.future pool input.-> MATCH

subgraph SUPPORT["Shared Runtime and Operations"]
  PATHS["projectPaths / submissionPathUtils"]:::process
  STATUSUTIL["submissionStatusUtils"]:::process
  JSONUTIL["JSON, CLI, fingerprints, response parsing"]:::process
  BUILDERS["src/builders"]:::process
  VALIDATORS["src/validators"]:::validation
  EXPORTERS["src/exporters/shared + phase1 + phase2"]:::process
  TESTS["pipeline / phase1 / phase2 / exporter tests"]:::validation
  TEMPLATES["root templates/*.css"]:::artifact
end

PATHS -.supports.-> RAW
PATHS -.supports.-> P1PROMPT
PATHS -.supports.-> P2PROMPT
STATUSUTIL -.updates.-> STATUS
JSONUTIL -.supports.-> P1VALID
JSONUTIL -.supports.-> P2VALID
BUILDERS -.builds.-> ISR
VALIDATORS -.validates.-> ISR
EXPORTERS -.builds.-> P1PDF
EXPORTERS -.builds.-> P2PDF
TEMPLATES -.styles.-> P1PDF
TEMPLATES -.styles.-> P2PDF
TESTS -.verifies.-> SELECT
TESTS -.verifies.-> P1VALID
TESTS -.verifies.-> ISR
TESTS -.verifies.-> P2VALID
TESTS -.verifies.-> STATUSUTIL
```

## Major Architectural Boundaries

### Authoritative records versus generated artifacts

```text
submissions/
→ durable intake, deterministic records, and lifecycle status

exports/
→ prompts, responses, validation reports, selected identity records, previews, and PDFs
```

### Phase boundary

```text
validated Identity Pitches
→ human selection
→ Identity Selection Record
→ Phase 2 handoff
→ Campaign Concept generation
```

### Runtime versus presentation

```text
src/ai
→ generation and validation contracts

src/builders and src/validators
→ reusable structured artifact construction and validation

src/exporters
→ normalization and document generation

templates
→ visual presentation

scripts
→ operator commands
```

## Implemented Components

- deterministic Phase 1 pipeline;
- Core Frame audience policy;
- youth/kids voice layer;
- client-facing phrase boundary cleanup;
- combined Phase 1 AI round trip;
- Identity Pitch validation;
- Phase 1 HTML/PDF export;
- Identity Selection Record builder and validator;
- Phase 2 handoff from Identity Selection Record;
- Campaign Concept contract and schema;
- combined Phase 2 AI round trip;
- Campaign Concept validation;
- Phase 2 HTML/PDF export;
- canonical submission/export paths;
- shared submission lifecycle status;
- shared script infrastructure;
- categorized tests;
- generated developer wiki.

## Planned Components

- system recommendation;
- selected-concept finalization;
- automated form and email transport;
- individual-player matchmaking and compatibility pools.
