# Phase 1 Identity Pitch Renderer Architecture

← [Back to Developer Documentation](../README.md)

## Overview

The current renderer produces the deterministic backbone for Phase 1 Identity Pitches and is structured as a modular pipeline that separates responsibilities across clearly defined layers.

This architecture enables:

- safer iteration without unintended output changes;
- clearer debugging and traceability;
- reduced duplication from iterative fixes;
- controlled expansion of language and tone systems;
- profile-aware audience handling.

---

## Architecture Layers

### `pitchCore`

- Extracts and normalizes context from selections.
- Prepares downstream renderer inputs.

### `pitchSectionBuilders`

- Constructs narrative sections:
  - Title;
  - About;
  - Players Do;
  - Distinct Hook.

### `pitchAssembly`

- Combines sections into the primary Identity Pitch paragraph.
- Handles sentence structure and phrasing logic.

### `pitchSafetyFilters`

- Applies tone constraints and safety rules.
- Handles safety guardrails and audience guidance.

### `youthVoiceLayer`

- Applies profile-aware final phrasing.
- Leaves `standard` output unchanged.
- Softens youth-facing fatalistic or destabilizing wording without replacing stakes.
- Warms kids-facing phrasing toward curiosity, teamwork, repair, and approachable challenges.

### `pitchCleanup`

- Provides shared text utilities and normalization helpers.
- Applies client-facing boundary cleanup.
- Removes internal renderer/adjudication/frame language from final client fields.

### `generateCampaignPitch`

- Legacy runtime name for the Phase 1 Identity Pitch orchestration function.
- Orchestrates the full renderer pipeline.
- Returns structured output.

---

## Renderer Flow

```text
Context (pitchCore)
→ Section Construction (pitchSectionBuilders)
→ Sentence Assembly (pitchAssembly)
→ Safety & Tone Filtering (pitchSafetyFilters)
→ Profile-Aware Voice Shaping (youthVoiceLayer)
→ Cleanup & Client-Facing Boundary Rules (pitchCleanup)
→ Phase 1 Identity Pitch Output (`generateCampaignPitch`, legacy runtime name)
```

---

## Responsibilities by Layer

| Layer | Responsibility |
| --- | --- |
| `pitchCore` | data preparation |
| `pitchSectionBuilders` | narrative section construction |
| `pitchAssembly` | sentence composition |
| `pitchSafetyFilters` | safety and tone enforcement |
| `youthVoiceLayer` | youth/kids final phrasing |
| `pitchCleanup` | text normalization and client-facing boundary cleanup |
| `generateCampaignPitch` | pipeline orchestration |

---

## Client-Facing Boundary

Final client-facing fields are cleaned separately from internal audit and handoff fields.

The boundary cleanup applies to:

- title;
- pitch;
- about;
- playersDo;
- distinct hook.

It does not erase internal `aiBrief`, adjudication summaries, confidence, or handoff guidance.

---

## Scope Boundary

The renderer communicates campaign identity, thematic promise, tone, and style of play. It does not establish the concrete Phase 2 campaign situation.

Runtime names are intentionally unchanged during v0.10.x unless a dedicated naming refactor is planned.
