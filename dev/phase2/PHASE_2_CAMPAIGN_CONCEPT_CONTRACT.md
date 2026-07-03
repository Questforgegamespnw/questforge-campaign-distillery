# Phase 2 Campaign Concept Contract

← [Back to Developer Documentation](../README.md)

## Purpose

This document defines the human-readable contract for implemented Phase 2 Campaign Concept Development.

The authoritative machine-readable schema lives at:

```text
src/ai/phase2/campaignConcept.schema.json
```

Phase 2 does not rediscover the campaign identity. It preserves one approved Phase 1 direction while inventing enough bounded fiction to make the campaign playable.

---

## Required Input

The normalized input contains:

- submission ID;
- selected identity direction;
- generation mode;
- selected Identity Pitch;
- identity summary;
- client selection feedback;
- intake summary;
- safety profile;
- system context;
- setting context;
- must-preserve elements;
- must-avoid elements.

The current operator-facing source is:

```text
00_PHASE2_HANDOFF.json
```

---

## Generation Modes

### `three_variants`

Produces exactly:

1. `core_interpretation`;
2. `alternate_situation`;
3. `distinctive_interpretation`.

### `single`

Produces exactly one concept when a single final direction is required.

---

## Variant Doctrine

### Core Interpretation

The clearest, most direct realization of the identity.

### Alternate Situation

Changes at least three concrete implementation dimensions, such as:

- starting crisis;
- faction arrangement;
- player starting position;
- recurring campaign engine;
- contested resource;
- setting condition.

### Distinctive Interpretation

Adds one bold but accessible feature, such as:

- a mobile home base;
- an unusual world condition;
- a changing campaign map;
- a nontraditional faction relationship;
- a recurring transformation.

Distinctiveness must remain playable rather than becoming novelty for its own sake.

---

## Allowed Invention

Phase 2 may invent:

- factions;
- institutions;
- communities;
- locations;
- threats;
- starting crises;
- contested resources;
- political and social pressures;
- public misunderstandings;
- hidden causes;
- recurring mission structures;
- escalation paths;
- meaningful choices;
- names and concise descriptive details needed to explain play.

---

## Prohibited Invention

Phase 2 must not invent:

- a complete plot;
- a predetermined ending;
- a required adventure sequence;
- a fixed solution;
- mandatory protagonist backstories;
- mandatory personal relationships;
- decisions already assigned to players;
- excessive unrelated history;
- large unnecessary named casts;
- detailed rules subsystems unless requested;
- contradictory identity, genre, tone, or play emphasis;
- excluded or unsafe content.

---

## Identity Preservation

Every concept must preserve:

1. the selected thematic promise;
2. approved style of play;
3. emotional tone;
4. relevant genre and environment signals;
5. client-liked elements;
6. client boundaries and safety constraints.

The concrete situation may change. The campaign promise may not.

---

## Top-Level Output

```json
{
  "schemaVersion": "0.9.0",
  "submissionId": "",
  "selectedIdentityDirection": "primary",
  "generationMode": "three_variants",
  "identitySummary": {},
  "systemContext": {},
  "settingContext": {},
  "concepts": [],
  "validationSummary": {}
}
```

---

## Campaign Concept Object

```json
{
  "variantType": "core_interpretation",
  "conceptTitle": "",
  "oneSentencePremise": "",
  "campaignPitch": "",
  "startingSituation": "",
  "centralConflict": "",
  "playersDo": "",
  "recurringCampaignEngine": "",
  "whyNow": "",
  "factionsOrForces": [],
  "escalation": "",
  "distinctiveElement": "",
  "meaningfulChoices": [],
  "hook": "",
  "systemImplementationNotes": "",
  "settingImplementationNotes": ""
}
```

---

## Field Intent

### `startingSituation`

What has already happened and what is immediately in front of the players.

### `centralConflict`

The incompatible forces, needs, or outcomes that organize the campaign.

### `playersDo`

The concrete recurring activity at the table.

### `recurringCampaignEngine`

The structure capable of producing multiple sessions or arcs.

### `whyNow`

The threshold, collapse, discovery, arrival, awakening, or political change that makes the campaign begin now.

### `factionsOrForces`

Two to six active groups, institutions, communities, threats, or impersonal pressures.

### `escalation`

How the situation worsens or spreads without dictating a final outcome.

### `meaningfulChoices`

Examples of decisions that can change power, alliances, access, institutions, resources, or the long-term campaign direction.

### `distinctiveElement`

The feature that separates the concept from a generic implementation of similar themes.

---

## Minimum Playable Premise Test

A valid concept must answer:

1. What is happening?
2. Why is it happening now?
3. Where do the players begin?
4. What do they repeatedly do?
5. Who or what pushes back?
6. How does the situation escalate?
7. What can players meaningfully change?
8. What makes this version distinct?

---

## Validation

Validation may reject or warn for:

- malformed JSON;
- missing fields;
- wrong concept count;
- invalid variant types;
- identity drift;
- contradictory tone or genre;
- vague player activity;
- decorative factions;
- missing escalation;
- absent agency;
- fixed endings;
- railroaded quest chains;
- unsupported invention;
- source fingerprint mismatch.

---

## Runtime References

```text
src/ai/phase2/
  buildCampaignConceptInput.js
  validateCampaignConceptInput.js
  buildCampaignConceptPrompt.js
  campaignConcept.schema.json
  validateCampaignConceptOutput.js
  evaluateCampaignConceptResponse.js
  index.js
```

The runtime code is authoritative where this document and implementation differ.
