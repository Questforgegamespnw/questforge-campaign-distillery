# Phase Model and Terminology

← [Back to Developer Documentation](../README.md)

## Canonical Phase Names

### Phase 1 — Identity Discovery

**Output:** Phase 1 Identity Pitches  
**Directions:** Primary, Adjacent, Wildcard

Phase 1 identifies the campaign's thematic center, emotional promise, style of play, broad genre, tone, and environment signals. It remains intentionally system-agnostic and does not establish a concrete campaign situation.

Phase 1 is implemented as:

```text
raw intake
→ deterministic interpretation
→ three identity directions
→ combined AI polish
→ source-bound validation
→ enriched Identity Pitch handoff
→ client Identity Pitch PDF
→ Identity Selection Record
```

### Phase 2 — Campaign Concept Development

**Output:** Phase 2 Campaign Concept Pitches  
**Variants:** Core Interpretation, Alternate Situation, Distinctive Interpretation

Phase 2 converts one approved identity into concrete playable premises. It adds:

- a starting situation;
- a central conflict;
- active factions or forces;
- recurring player activity;
- a campaign engine;
- escalation;
- distinctive elements;
- meaningful player choices.

Phase 2 generation, validation, manual round trip, and PDF delivery are implemented.

---

## Working Principle

> Phase 1 discovers what the campaign wants to be.  
> Phase 2 decides what is actually happening and what the players can change.

---

## Terminology Rules

Use **Identity Pitch** for Phase 1 outputs.

Use **identity direction** for Primary, Adjacent, and Wildcard.

Use **Enriched Identity Pitch Handoff** for `05_ENRICHED_IDENTITY_PITCHES.json`, the post-validation artifact that combines validated prose with deterministic Phase 1 metadata.

Use **Identity Selection Record** for the validated client-selection artifact that bridges Phase 1 and Phase 2.

Use **Campaign Concept Pitch** for Phase 2 outputs.

Use **concept variant** for Core Interpretation, Alternate Situation, and Distinctive Interpretation.

Use **Phase 2 handoff** for `00_PHASE2_HANDOFF.json`, the operator-reviewable file used to prepare Phase 2 generation.

---


## Enriched Identity Pitch Handoff

`04_VALIDATED_IDENTITY_PITCHES.json` is intentionally narrow. It contains only the validator-approved client-facing prose fields:

- title;
- pitch;
- about;
- playersDo;
- hook.

After validation, `buildIdentityPitchHandoff.js` creates `05_ENRICHED_IDENTITY_PITCHES.json` by stitching that validated prose back onto the deterministic source metadata from the original Phase 1 pipeline result.

This preserves source frame data, context, constraints, genre, tone, environment, safety guidance, audience guidance, and handoff guidance for Phase 2 without expanding the validator output.

## Identity Selection Record

The Identity Selection Record is the authoritative Phase 1 → Phase 2 boundary artifact.

It records:

- selected direction;
- selected Identity Pitch;
- client liked elements;
- concerns and requested adjustments;
- preservation guidance;
- intake summary;
- safety profile;
- system and setting context;
- source metadata;
- validation state.

It lives at:

```text
exports/submissions/<slug>/phase-1/identity-selection-record.json
```

---

## Phase 1 Must Not Invent

- named settings;
- concrete crises;
- factions;
- starting situations;
- recurring campaign structures;
- fixed antagonists;
- setting history;
- specific game-system mechanics.

Phase 1 AI may improve clarity, cadence, readability, and restrained presentation only.

---

## Phase 2 May Invent

- factions and institutions;
- locations;
- a starting crisis;
- threats and pressures;
- distinctive setting features;
- concise supporting history;
- recurring campaign structures;
- meaningful player-facing choices.

All invention must support the approved identity and recorded client constraints.

---

## Phase 2 Must Not Invent

- a complete plot;
- a fixed ending;
- a required adventure sequence;
- a predetermined solution;
- mandatory protagonist backstories;
- mandatory personal relationships;
- decisions already assigned to players;
- excessive unrelated lore;
- contradictory genre, tone, safety, or play emphasis.

---

## Current Human Boundary

```text
validated Phase 1 Identity Pitches
→ enriched Identity Pitch Handoff
→ client review
→ Identity Selection Record
→ Phase 2 handoff
→ Campaign Concept generation
```

---

## Legacy Runtime Names

The following remain valid source identifiers during v0.10.x:

- `generateCampaignPitch`;
- `buildExpansionInput`;
- `clientPitch`;
- `auditPitch`;
- `campaignPitch`.

Documentation should describe their conceptual roles accurately without forcing unnecessary runtime renames.
