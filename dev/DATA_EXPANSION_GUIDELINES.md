# Data Expansion Guidelines

## Purpose

This document defines how to safely expand the QuestForge Campaign Distillery data layer without introducing redundancy, ambiguity, or system bloat.

The goal is to preserve a **clean, composable, and scalable system of narrative and gameplay building blocks**.

---

## Core Principle

> This system is not a content library.
> It is a **grammar for building campaigns**.

Each entry must function as a **reusable, combinable unit** that contributes meaningfully to output.

---

## What Counts as a Valid Entry

A new entry (core, system, environment, etc.) is valid only if it meets **all three** conditions:

### 1. Specific Experience or Tension

It must represent a clear, recognizable player experience or narrative tension.

✔ Good:

* hidden truth
* survival against overwhelming force
* power has a cost

✘ Bad:

* conflict
* adventure
* narrative experience

---

### 2. Cross-Context Portability

It must apply across multiple settings.

✔ Good:

* clue web (works in fantasy, noir, sci-fi, etc.)
* corruption / transformation

✘ Bad:

* frontier horror (genre-specific combination)
* cyberpunk rebellion (setting-locked concept)

---

### 3. Distinct Output Impact

It must produce **new, identifiable language** in output.

If adding the entry does not change how generated text reads:

→ It is redundant and should not be added.

---

## What Should NOT Be Added

### ❌ Combined Concepts

Do not add entries that merge multiple layers:

* "dark survival mystery"
* "political intrigue system"
* "frontier gothic horror"

These belong to combinations of:

* core
* system
* tone
* genre

---

### ❌ Overly Abstract Concepts

Avoid design-language or theoretical constructs:

* narrative progression
* player engagement loop
* transformation arc

If it doesn’t translate directly into player-facing language, it does not belong here.

---

### ❌ Redundant Variants

Do not add entries that are slight variations of existing ones:

* "hidden conspiracy" vs "hidden truth"
* "resource tension" vs "resource scarcity"

Instead, improve the existing entry.

---

## Core vs System Distinction

### Core = Meaning

Answers:

> What is this campaign fundamentally about?

Examples:

* power has a cost
* hidden truth
* war of ideologies

---

### System = Play Experience

Answers:

> What does play feel like moment-to-moment?

Examples:

* clue web
* resource scarcity
* escalation meter

---

### If unclear:

* If it describes **theme or tension** → Core
* If it describes **player behavior or loop** → System

---

## Expansion Checklist (Use Before Adding Anything)

Before adding a new entry, ask:

### 1. Can this be created by combining existing elements?

If yes → do not add it

---

### 2. Does this create new output language?

If no → do not add it

---

### 3. Is this portable across genres/settings?

If no → it likely belongs in a different layer

---

### 4. Is this already represented indirectly?

If yes → improve existing data instead

---

### 5. Is this a true “atomic” concept?

If it contains multiple ideas → split or discard

---

## Expansion Strategy by Version

### v0.8

* small, targeted additions only
* focus on refining existing entries
* fill obvious gaps, do not expand broadly

---

### v0.9

* **no data expansion**
* data layer is frozen while AI layer is built

---

### v1.x

* controlled expansion after system stability
* introduce new entries only when justified by output needs

---

## Final Rule

> If you are unsure whether something should be added:
> **Do not add it yet.**

Unnecessary entries are far more harmful than missing ones.

---

## Summary

Good entries are:

* specific
* reusable
* impactful

Bad entries are:

* vague
* redundant
* combined

Maintain discipline here, and the system will scale cleanly.
