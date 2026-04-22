# Voice System Overview

← Back to Developer Documentation (`/dev/README.md`)

---

## Overview

The voice system is responsible for turning structured campaign data into **clear, engaging, client-facing text**.

It sits in the **Rendering stage** of the pipeline and defines:

* how ideas are expressed
* how sections are structured
* how tone and genre influence phrasing

---

## Core Principle

> The voice system composes output from structured data.
> It does not invent meaning.

All output should be derived from:

* coreFrames (meaning)
* systemFrames (play experience)
* tone / genre / environment layers

---

## Output Structure

Each campaign direction produces four sections:

```text id="6lq9ns"
Hook → Pitch → About → Players Do
```

Each section has a **specific role**.

---

## Section Breakdown

---

## 1. Hook

**Purpose:**
Capture attention and establish tension immediately.

---

### Characteristics

* short (1–2 lines)
* evocative
* sets tone and direction
* introduces uncertainty, tension, or intrigue

---

### Example Patterns

* something is off or changing
* a situation that raises questions
* a shift in expectations

---

### What Hook is NOT

* exposition
* explanation of systems
* long-form description

---

## 2. Pitch

**Purpose:**
Summarize the campaign experience in a concise, sellable way.

---

### Structure

* Sentence 1: Core + tone + genre framing
* Sentence 2: Primary system-driven play experience
* Optional Sentence 3: tone reinforcement or flavor

---

### Responsibilities

* communicate what the campaign *feels like*
* stay readable and concise
* avoid overloading with multiple ideas

---

### Key Rules

* use **only one system expression** in Pitch
* avoid stacking multiple core ideas
* prefer clarity over density

---

### What Pitch is NOT

* a full description
* a list of mechanics
* overly abstract

---

## 3. About

**Purpose:**
Expand the campaign concept and deepen meaning.

---

### Characteristics

* 1–2 paragraphs
* explores core tensions more fully
* connects theme to world and narrative

---

### Responsibilities

* elaborate on core concepts
* introduce nuance and consequence
* support emotional tone

---

### What About is NOT

* a repeat of Pitch
* purely mechanical explanation

---

## 4. Players Do

**Purpose:**
Describe what players actually do at the table.

---

### Characteristics

* concrete and action-oriented
* based on systemFrames
* grounded in player behavior

---

### Responsibilities

* explain moment-to-moment play
* reflect system mechanics
* stay practical and understandable

---

### Example Language

* “following scattered clues…”
* “making hard calls when resources are limited…”
* “negotiating and leveraging relationships…”

---

### What Players Do is NOT

* narrative summary
* thematic description
* abstract phrasing

---

## Composition Logic

The voice system combines:

```text id="7u0q8t"
Core (meaning) + System (behavior) + Tone (delivery)
```

Each section uses these differently:

* Hook → tone + tension
* Pitch → core + system
* About → core depth
* Players Do → system behavior

---

## Voice Design Principles

---

### Clarity Over Complexity

Prefer:

* short, readable sentences
* direct phrasing

Avoid:

* overly long clauses
* stacked concepts

---

### One Idea Per Sentence

Each sentence should carry a single primary idea.

This prevents:

* confusion
* loss of impact

---

### Variation Without Chaos

Use variation in:

* sentence openings
* phrasing patterns
* rhythm

But maintain:

* consistent structure
* recognizable flow

---

### Tone Alignment

Tone should influence:

* word choice
* sentence rhythm
* emotional intensity

But not:

* structure
* meaning

---

### Data First

Voice is driven by:

* `pitchText`
* structured data

Avoid:

* ad hoc phrasing
* hardcoded narrative logic

---

## Common Issues

---

### Repetition

Cause:

* limited variation pools

Fix:

* expand voiceMap options

---

### Overloaded Sentences

Cause:

* stacking multiple systems or ideas

Fix:

* simplify sentence structure

---

### Awkward Phrasing

Cause:

* inserting data into poorly matched templates

Fix:

* adjust templates or helper functions (e.g. `cleanCoreLead`)

---

### Tone Drift

Cause:

* inconsistent phrasing or AI output

Fix:

* tighten tone guidance and templates

---

## Interaction with AI Layer (v0.9+)

The AI layer should:

* expand existing content
* improve flow and richness

The AI layer should NOT:

* change structure
* introduce new concepts
* override system intent

---

## Summary

The voice system works because:

* structure is consistent
* data drives expression
* each section has a clear role

Maintaining these principles ensures:

* readable output
* consistent tone
* scalable variation
