# Debugging Guide

← Back to Developer Documentation (`/dev/README.md`)

---

## Overview

This guide helps diagnose issues in the QuestForge Campaign Distillery pipeline.

When output is incorrect, confusing, or broken, the goal is to:

* isolate the failing stage
* verify data at each step
* fix the root cause (not patch the output)

---

## Core Rule

> Always debug **upstream first**

Do NOT start by modifying rendering or output text.

Most issues originate earlier in the pipeline.

> Debug the pipeline in stages, and the renderer in layers.

---

## Layer Map & Quick Triage

### Quick Debug Map

```
Wrong input?           → Intake
Wrong interpretation?  → Mapping / Selection
Wrong object data?     → Resolution
Wrong section content? → pitchSectionBuilders
Wrong sentence flow?   → pitchAssembly
Wrong cleanup?         → pitchCleanup
Wrong tone/safety?     → pitchSafetyFilters
Wrong AI expansion?    → AI Layer
```

Use this when something looks wrong and you need to decide **which layer to inspect first**.


RAW INPUT
  ↓
INTAKE
  - form data
  - normalization
  - canonical shaping
  Symptoms:
    missing fields / bad structure / wrong normalized values

  ↓
MAPPING / TRANSLATION
  - tags
  - weights
  - inferred signals
  Symptoms:
    wrong themes / weak signals / missing campaign intent

  ↓
SELECTION
  - core/system/tone/genre/environment picks
  Symptoms:
    wrong direction chosen / duplicate-feeling outputs / weak variety

  ↓
RESOLUTION
  - full objects returned by ID
  - name / description / pitchText / tags
  Symptoms:
    fallback labels / undefined values / missing pitchText

  ↓
RENDERING PIPELINE
    ↓
    pitchCore
      - context extraction / normalized renderer inputs
      Symptoms:
        wrong names, defaults, IDs, tone, genre, environment lists

    ↓
    pitchSectionBuilders
      - title / about / playersDo / hook section content
      Symptoms:
        weak section focus / wrong emphasis / thin or mismatched sections

    ↓
    pitchAssembly
      - sentence joining / pitch paragraph construction
      Symptoms:
        awkward grammar / repeated phrasing / clunky sentence flow

    ↓
    pitchCleanup
      - text normalization / cleanup helpers
      Symptoms:
        punctuation issues / spacing / capitalization / artifact phrasing

    ↓
    pitchSafetyFilters
      - youth-safe / tone / guardrail enforcement
      Symptoms:
        tone drift / too harsh / too soft / safety rules not applied

  ↓
FINAL OUTPUT
  Symptoms:
    output is structurally correct but still reads poorly
    → usually Assembly, Cleanup, or Safety Filters

  ↓
AI LAYER (v0.9+)
  Symptoms:
    hallucinations / structure drift / new ideas introduced unexpectedly

---

## Debug Flow (Step-by-Step)

Follow this order:

```text id="x8q1r9"
Intake → Mapping → Selection → Resolution → Rendering (Core → Sections → Assembly → Cleanup → Safety) → AI Layer
```

---

## 1. Intake Issues

### Symptoms

* missing or incorrect values
* unexpected empty fields
* inconsistent structure

### Check

* raw input object
* normalized intake output

### Common Problems

* field not passed correctly
* alias not recognized
* empty arrays where values expected

### Fix

* update normalization logic
* improve alias handling
* ensure consistent input structure

---

## 2. Mapping Issues

### Symptoms

* wrong tags applied
* weak or missing signals
* unexpected weighting

### Check

* mapped signal output
* tag assignments
* weight values

### Common Problems

* alias not mapped correctly
* missing mapping entry
* incorrect weight assignment

### Fix

* update mapping tables
* refine alias logic
* adjust weight rules

---

## 3. Selection Issues

### Symptoms

* wrong core/system chosen
* duplicate or conflicting entries
* lack of variety in output

### Check

* selected IDs
* weight comparisons
* selection logic

### Common Problems

* weights too similar
* selection bias toward certain entries
* missing diversity logic

### Fix

* adjust selection rules
* tweak weight thresholds
* ensure variety safeguards

---

## 4. Resolution Issues

### Symptoms

* missing fields in output
* fallback to labels instead of `pitchText`
* undefined values

### Check

* resolved objects
* presence of:

  * name
  * description
  * pitchText
  * tags

### Common Problems

* missing `pitchText`
* incomplete data objects
* lookup mismatch

### Fix

* update data files
* ensure `lookupById` preserves all fields
* verify IDs match data entries

---

## 5. Rendering Issues (Modular Pipeline)

Rendering is now composed of multiple layers.  
When debugging, isolate the issue to the correct layer before making changes.

---

### 5.1 pitchCore (Context Issues)

### Symptoms

* missing or incorrect names (core/system/tone/genre)
* unexpected defaults (e.g. "Hidden Truth")
* incorrect environment lists

### Check

* output of `buildPitchContext`
* extracted names and IDs

### Common Problems

* missing data in selections
* incorrect normalization
* fallback values triggering unexpectedly

### Fix

* verify upstream resolution data
* adjust normalization logic

---

### 5.2 Section Builders (Content Issues)

### Symptoms

* sections feel empty or thin
* incorrect focus (wrong core/system emphasis)
* weak or mismatched tone

### Check

* outputs of section builders (title, about, playersDo, hook)

### Common Problems

* incorrect data passed into builders
* missing phrasing templates
* poor system/core alignment

### Fix

* refine section builder logic
* adjust phrasing sources (`pitchText`)

---

### 5.3 Assembly (Sentence Issues)

### Symptoms

* awkward sentence structure
* repeated phrasing
* unnatural flow between ideas

### Check

* assembled pitch string
* sentence join logic

### Common Problems

* poor sentence joining
* repeated connectors
* overloading sentences with multiple ideas

### Fix

* refine assembly logic
* simplify sentence structure
* adjust phrasing helpers

---

### 5.4 Cleanup (Formatting Issues)

### Symptoms

* extra spaces or punctuation issues
* inconsistent capitalization
* awkward phrasing artifacts

### Check

* output before/after cleanup functions

### Common Problems

* missing normalization step
* conflicting cleanup rules

### Fix

* adjust cleanup helpers
* ensure consistent formatting rules

---

### 5.5 Safety Filters (Tone Issues)

### Symptoms

* tone mismatch (too harsh / too soft)
* youth-safe output not applied
* unintended content slips through

### Check

* output before/after safety filters

### Common Problems

* safety rules not applied
* incorrect tone detection
* missing soften logic

### Fix

* adjust safety filter logic
* verify tone inputs and flags

---

### Key Rule for Rendering Debugging

> Always identify the failing layer before making changes.

Do NOT:
- fix grammar inside section builders  
- apply tone fixes in assembly  
- patch output instead of correcting the correct layer  

---

## 6. AI Layer Issues (v0.9+)

### Symptoms

* tone mismatch
* hallucinated content
* broken structure

### Check

* AI input payload
* AI output JSON
* validation results

### Common Problems

* weak prompt constraints
* AI adding new systems or lore
* inconsistent formatting

### Fix

* tighten prompt contract
* enforce validation rules
* restrict AI scope

---

## Quick Debug Checklist

When something looks wrong, ask:

* Is the input correct?
* Are the right signals mapped?
* Were the correct items selected?
* Did resolution return full objects?
* Is rendering combining data correctly?
* (v0.9+) Did AI change something unexpectedly?

---

## Logging Strategy

When debugging, log at key stages:

```js id="l5j8t2"
console.log("INTAKE:", intake);
console.log("MAPPING:", mappedSignals);
console.log("SELECTION:", selected);
console.log("RESOLUTION:", resolved);
console.log("OUTPUT:", finalOutput);
```

This helps quickly identify where data diverges.

---

## Common Anti-Patterns

### ❌ Fixing Output Instead of Cause

* adjusting text instead of fixing data or mapping

---

### ❌ Mixing Responsibilities

* adding selection logic in rendering
* adding mapping logic in data files

---

### ❌ Ignoring Upstream Errors

* patching symptoms instead of root issues

---

## Debugging Philosophy

* Fix the **earliest point of failure**
* Prefer **data fixes over logic patches**
* Keep stages **clean and isolated**

---

## Summary

Debugging is easiest when:

* each stage does one job
* data flows cleanly between stages
* issues are traced from source to output

If the pipeline is respected, problems are easy to locate and fix.
