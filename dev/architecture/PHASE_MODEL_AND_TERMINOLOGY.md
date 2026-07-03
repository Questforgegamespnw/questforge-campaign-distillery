# Phase Model and Terminology

← [Back to Developer Documentation](../README.md)

## Canonical Phase Names

### Phase 1 — Identity Discovery

**Output:** Phase 1 Identity Pitches  
**Directions:** Primary, Adjacent, Wildcard

Phase 1 identifies the campaign’s thematic center, emotional promise, style of play, broad genre, tone, and environment signals. It remains intentionally system-agnostic and does not establish a concrete campaign situation.

Phase 1 is implemented as:

```text
raw intake
→ deterministic interpretation
→ three identity directions
→ combined AI polish
→ source-bound validation
→ client Identity Pitch PDF
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

Use **Campaign Concept Pitch** for Phase 2 outputs.

Use **concept variant** for Core Interpretation, Alternate Situation, and Distinctive Interpretation.

Use **Phase 2 handoff** for the current implemented `00_PHASE2_HANDOFF.json`.

Reserve **Identity Selection Record** for the future formalized, validated client-selection schema. The current handoff performs much of that practical role, but it is not yet the finalized runtime contract.

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
- contradictory genre, tone, or play emphasis.

---

## Current Human Boundary

The implemented boundary is:

```text
validated Phase 1 Identity Pitches
→ client review
→ operator records selection and feedback
→ Phase 2 handoff
→ Campaign Concept generation
```

A future formal Identity Selection Record should replace ad hoc operator interpretation without changing this phase boundary.

---

## Legacy Runtime Names

The following remain valid source identifiers during v0.9.x:

- `generateCampaignPitch`;
- `buildExpansionInput`;
- `clientPitch`;
- `auditPitch`;
- `campaignPitch`.

Documentation should describe their conceptual roles accurately without forcing unnecessary runtime renames.
