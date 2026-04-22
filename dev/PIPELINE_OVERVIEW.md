# Pipeline Overview

← Back to Developer Documentation (`/dev/README.md`)

---

## Overview

The QuestForge Campaign Distillery converts structured input into polished, client-facing campaign concepts.

The pipeline is designed to be:

* modular
* predictable
* easy to debug
* safe to extend

---

## High-Level Flow

```text
Intake → Mapping → Selection → Resolution → Rendering → (AI Layer)
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
Choose the most relevant campaign building blocks.

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

* fully resolved campaign components

---

### 5. Rendering

**Purpose:**
Generate structured, human-readable campaign output.

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

* complete campaign direction (JSON structure)

---

### 6. AI Layer (v0.9+)

**Purpose:**
Enhance output while preserving structure and intent.

**Responsibilities:**

* expand existing content (not replace it)
* improve richness and flow
* maintain tone consistency

**Constraints:**

* must not introduce new systems, lore, or mechanics
* must preserve structure and meaning

**Output:**

* enhanced campaign direction

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

Campaigns are built from reusable components:

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

### v1.0

* finalize structure and documentation

---

## Summary

The pipeline works because:

* each stage is isolated
* data drives behavior
* output is composed, not invented

Maintain these principles to keep the system stable and scalable.
