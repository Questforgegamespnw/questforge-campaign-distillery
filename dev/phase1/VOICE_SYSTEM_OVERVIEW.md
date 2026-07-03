# Voice System Overview

← [Back to Developer Documentation](../README.md)

## Overview

The voice system turns structured frame data into clear, engaging Phase 1 Identity Pitch text.

It sits in the rendering stage of the pipeline and defines:

- how ideas are expressed;
- how sections are structured;
- how tone and genre influence phrasing;
- how audience profile affects final wording.

---

## Core Principle

> The voice system composes output from structured data. It does not invent meaning.

All output should be derived from:

- Core Frames for meaning;
- System Frames for play experience;
- tone, genre, and environment layers for presentation;
- audience and safety profile for intensity and phrasing boundaries.

---

## Audience Profiles

The current profile model is:

```text
standard
youth
kids
```

### `standard`

The default profile. It does not mean adult-only; it means no special youth/kids rewrite is required.

### `youth`

Preserves meaningful stakes and challenge while reducing hopeless, crushing, or destabilizing phrasing. Youth output should not become childish.

### `kids`

Uses warmer, clearer, more approachable phrasing. It favors curiosity, teamwork, repair, helping, and exciting problems to solve.

---

## Theme Routing vs Voice Shaping

Do not confuse these layers:

```text
Core Frame audience policy
→ decides whether themes are preserved, softened, downweighted, substituted, or suppressed

youthVoiceLayer
→ decides how final text should sound for youth/kids audiences
```

The voice layer should not perform Core Frame substitution.

---

## Output Structure

Each identity direction produces client-facing sections:

```text
Hook → Pitch → About → Players Do
```

Each section has a specific role.

---

## 1. Hook

**Purpose:** Capture attention and establish tension immediately.

Characteristics:

- short;
- evocative;
- tone-setting;
- introduces uncertainty, tension, or intrigue.

Hook is not exposition, mechanical explanation, or long-form description.

---

## 2. Pitch

**Purpose:** Summarize the proposed campaign identity and table experience in a concise, client-ready way.

Responsibilities:

- communicate what the campaign feels like;
- stay readable and concise;
- avoid overloading multiple ideas;
- use one clear system expression.

Pitch is not a full description or mechanics list.

---

## 3. About

**Purpose:** Expand the campaign identity and deepen its thematic meaning.

Responsibilities:

- elaborate on core concepts;
- introduce nuance and consequence;
- support emotional tone;
- remain broad enough to support multiple settings and systems.

About is not a repeat of Pitch or a Phase 2 concrete premise.

---

## 4. Players Do

**Purpose:** Describe what players actually do at the table.

Responsibilities:

- explain moment-to-moment play;
- reflect system frame behavior;
- stay practical and understandable.

Players Do is not narrative summary or abstract theme description.

---

## Composition Logic

```text
Core meaning + System behavior + Tone delivery + Audience profile
```

Each section uses these differently:

- Hook → tone + tension;
- Pitch → core + system;
- About → core depth;
- Players Do → system behavior;
- youthVoiceLayer → final profile-aware wording.

---

## Voice Design Principles

### Clarity Over Complexity

Prefer readable sentences and direct phrasing. Avoid long clause stacks.

### One Idea Per Sentence

Each sentence should carry one primary idea.

### Variation Without Chaos

Vary openings, rhythm, and phrasing while maintaining recognizable structure.

### Tone Alignment

Tone should influence word choice and intensity, not invent new meaning.

### Data First

Use `pitchText` and structured data. Avoid ad hoc narrative logic.

---

## Client-Facing Boundary

Final text should not expose:

- frame IDs;
- renderer language;
- adjudication labels;
- candidate bucket language;
- confidence scores;
- internal debug notes.

Internal fields may retain detailed audit information. Client-facing fields should not.

---

## Interaction with AI Layer

The Phase 1 AI polish layer should:

- polish and expand existing identity content;
- improve flow and richness;
- preserve system- and setting-agnostic scope;
- preserve audience and safety boundaries.

The AI layer should not:

- change structure;
- introduce concrete settings, factions, crises, mechanics, or other Phase 2 concepts;
- override system intent;
- intensify restricted material.

---

## Relationship to Phase 2

The Phase 1 voice system answers what the campaign should feel like and what kinds of play it should emphasize. Phase 2 uses the selected identity as a constraint when inventing a concrete situation, conflict, campaign engine, factions, escalation, and hook.
