# Pipeline Overview

← Back to Developer Documentation (`/dev/README.md`)

---

## Overview

The QuestForge Campaign Distillery currently converts structured intake into three Phase 1 Identity Pitches. After client selection, the planned Phase 2 pipeline will convert the chosen identity into concrete, playable Campaign Concept Pitches.

The pipeline is designed to be:

* modular
* predictable
* easy to debug
* safe to extend

---

## High-Level Flow

```text
Phase 1: Intake → Mapping → Normalization → Canonical Validation → Signal Translation
         → Adjudication → Direction Selection → Frame Resolution
         → Deterministic Identity Pitch Rendering → AI Identity Pitch Polish
         → Validation → Client Selection

Phase 2: Identity Selection Record → Campaign Concept Expansion
         → Concept Validation → System Recommendation
         → PDF Export → Client Delivery
```

Each stage has a **single responsibility** and should not leak logic into other stages.

---

## Stage Breakdown

### 1. Intake

**Purpose:**
Normalize raw user input into a consistent structure.

**Responsibilities:**

* accept form or JSON input
* clean and standardize values
* apply alias normalization
* handle missing or optional fields

**Output:**

* canonical intake object

---

### 2. Mapping

**Purpose:**
Translate normalized input into structured system signals.

**Responsibilities:**

* map input values to internal tags and IDs
* apply weights (strength of preference)
* handle alias resolution
* expand partial matches

**Output:**

* weighted signal set

---

### 3. Selection

**Purpose:**
Choose the most relevant building blocks for each Phase 1 identity direction.

**Responsibilities:**

* select top entries based on weights
* ensure diversity of selections
* avoid redundant or conflicting choices

**Output:**

* selected core, systems, tone, genre, environment

---

### 4. Resolution

**Purpose:**
Convert selected IDs into full data objects.

**Responsibilities:**

* look up entries from data files
* attach full definitions (name, description, pitchText, tags)
* preserve all required fields for rendering

**Output:**

* fully resolved Identity Pitch components

---

### 5. Rendering

**Purpose:**
Generate structured, human-readable Phase 1 Identity Pitch output.

**Responsibilities:**

* build:

  * hook
  * pitch
  * about
  * playersDo
* combine:

  * core meaning
  * system behavior
  * tone and genre context
* ensure:

  * readability
  * consistency
  * natural language flow

**Output:**

* complete identity direction (JSON structure)

---

### 6. AI Layer (v0.9+)

**Purpose:**
Polish the Identity Pitch while preserving its structure and intent.

**Responsibilities:**

* expand existing content (not replace it)
* improve richness and flow
* maintain tone consistency

**Constraints:**

* must not introduce new systems, lore, or mechanics
* must preserve structure and meaning

**Output:**

* polished Identity Pitch direction

---

## Design Principles

### Single Responsibility per Stage

Each stage should only do one job.

Examples:

* Mapping should not generate text
* Rendering should not select systems

---

### Deterministic Core

The pipeline should produce consistent results before AI is applied.

AI is an enhancement layer—not a dependency.

---

### Data-Driven Output

All output should be driven by structured data:

* coreFrames
* systemFrames
* tone/genre/environment layers

Avoid hardcoding narrative logic in the renderer.

---

### Composability

Identity directions are composed from reusable components:

* core = meaning
* system = behavior
* tone = delivery
* genre/environment = context

These should combine cleanly without overlap.

---

## Common Failure Points

### Missing `pitchText`

* causes fallback to labels
* results in poor output quality

---

### Overlapping Concepts

* leads to redundant or muddy output
* often caused by bad data entries

---

### Layer Leakage

* mapping logic in rendering
* narrative logic in data layer
* selection logic in resolution

---

## Debugging Strategy

When something looks wrong:

1. Check Intake → is the input normalized correctly?
2. Check Mapping → are weights and tags correct?
3. Check Selection → are the right items chosen?
4. Check Resolution → are full objects being returned?
5. Check Rendering → is phrasing behaving correctly?

Always debug **upstream first**.

---

## Future Expansion

### v0.8

* increase variation and expression (voiceMap)

### v0.9

* integrate AI layer safely

### v0.9.x

* formalize the Phase 1 Identity Pitch contract
* define the client selection handoff
* define and validate the Phase 2 Campaign Concept contract
* add system recommendation and client export stages

### v1.0

* finalize the integrated two-phase workflow and documentation

---

## Summary

The pipeline works because:

* each stage is isolated
* data drives behavior
* output is composed, not invented

Maintain these principles to keep the system stable and scalable.


## Phase Boundary

Phase 1 must not invent a named setting, concrete crisis, factions, starting situation, fixed antagonist, or recurring campaign structure. Phase 2 may invent those elements within the selected identity and recorded client constraints, but must not invent a complete plot, fixed ending, railroaded quest chain, mandatory protagonist history, or contradictory genre and tone.
