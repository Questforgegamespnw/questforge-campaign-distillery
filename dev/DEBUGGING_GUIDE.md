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

---

## Debug Flow (Step-by-Step)

Follow this order:

```text id="x8q1r9"
Intake → Mapping → Selection → Resolution → Rendering → AI Layer
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

## 5. Rendering Issues

### Symptoms

* awkward phrasing
* repeated sentence structures
* overly long or clunky sentences

### Check

* generated pitch / about / playersDo
* sentence templates
* phrase composition

### Common Problems

* poor template fit for data
* repeated patterns
* improper text joining

### Fix

* refine templates
* adjust phrasing helpers
* improve variation pools

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
