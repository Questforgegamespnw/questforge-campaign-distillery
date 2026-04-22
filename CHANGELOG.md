# Changelog

All notable changes to this project will be documented in this file.

---

## v0.7.2 — Voice Layer Stabilization & Pitch Refactor

### 🎯 Core Improvements

- Introduced `pitchText` field to **coreFrames** and **systemFrames**
  - Enables clean, player-facing phrasing without relying on label transformation
  - Replaces brittle string normalization logic

- Refactored pitch generation to use structured phrasing
  - Eliminated reliance on `normalizeSystemLead`
  - Removed design-language leakage into client-facing output

- Updated resolution layer (`lookupById`)
  - Now preserves `pitchText` through the full pipeline
  - Ensures renderer receives complete, intended data

---

### 🧠 Voice & Output Quality

- Rebuilt `buildPitchParagraph()` for clarity and readability
  - Reduced sentence stacking and clause overload
  - Limited pitch to a single system expression for cleaner delivery
  - Removed core-to-core transition sentence (moved responsibility to `About`)

- Improved sentence templates
  - Better handling of longer, natural-language phrases
  - More consistent tone across Primary / Adjacent / Wildcard outputs

- Added `cleanCoreLead()` helper
  - Smooths insertion of core phrases into pitch sentences
  - Prevents awkward constructions (e.g. “centering trying to…”)

---

### ✂️ Data Layer Refinement

- Tightened high-frequency `coreFrames.pitchText` entries
  - Reduced verbosity
  - Improved readability in repeated pitch usage
  - Better compatibility with sentence templates

---

### 🧹 Cleanup

- Removed legacy guard logic for system/core label filtering
  - Pipeline now produces clean output without fallback protections
  - Reduces technical debt and improves maintainability

---

### ✅ Result

- No raw system/core labels in Pitch output
- Consistent, readable player-facing copy across all batch tests
- Stable voice pipeline ready for expansion

---

### 📌 Notes

This version marks the transition from:
> “patched output formatting”

to:
> “structured, reliable voice generation”

Future work will focus on:
- voiceMap depth and variation
- genre/tone system expansion
- UI and intake integration

---

## [0.7.1] – Voice Stabilization Pass

### Improved
- Refined campaign pitch voice to read more naturally and less system-generated
- Reworked pitch paragraph construction to emphasize player-facing language over system terminology
- Expanded variation pools for core transitions and system-driven lines to reduce repetition
- Improved fallback handling when system language is filtered or unavailable
- Enhanced phrasing for system-derived text (e.g., exploration, clue discovery, environmental pressure)

### Fixed
- Removed duplicate phrasing issues (e.g., repeated "and" constructions)
- Eliminated raw system ID leakage into pitch output
- Corrected redundancy across second-line pitch generation
- Fixed inconsistent sentence structure in pitch assembly

### Internal
- Added systemText filtering layer to block low-quality or design-facing language
- Introduced deduplication and cleanup passes in system text normalization
- Added temporary guardrails for system phrasing (scheduled for removal in v0.7.3)

---
## v0.7.0 — Voice Stability & Full Coverage Pass

### 🚧 Core Milestone: "Make It Hold Under All Inputs"

This release stabilizes the voice and rendering layer across a full range of campaign inputs, eliminating structural sentence failures and achieving complete batch coverage.

---

## ✅ Added

### Expanded Voice Coverage
- Added comprehensive test input set covering:
  - tone variations
  - environment diversity
  - system/gameplay styles
  - edge-case combinations
- Enabled full batch validation across all major campaign archetypes

### VoiceMap Expansion
- Expanded environment, system, and tone entries
- Increased variation depth for imagery and gameplay descriptions
- Improved alignment between data layer and voice layer outputs

---

## 🔧 Changed

### Pitch Builder Stabilization
- Refactored core phrase handling to use fragment-safe variants
- Removed clause-based variants causing grammar conflicts
- Standardized sentence templates for consistent structure
- Fixed “is what gives…” and similar composition collisions

### Environment Rendering
- Reworked environment description joining for natural sentence flow
- Eliminated list-like and broken “X. and Y” constructions

### Core Variant Handling
- Normalized coreVariants to noun-phrase structures
- Removed “as X becomes…” and “as X emerges…” patterns
- Reduced clause stacking and mid-sentence grammar conflicts

---

## 🧠 Behavioral Improvements

- Output now remains stable across all tested combinations
- Sentence composition is consistent and predictable
- Reduced structural repetition and phrasing collisions
- Improved readability of generated campaign pitches

---

## 🧪 Validation

- Batch test suite: **24/24 passing**
- No structural sentence failures across coverage set
- All pipeline stages verified under expanded input conditions

---

## 📌 Notes

- Core phrase humanization is still in progress (internal labels occasionally surface in output)
- Voice refinement and cadence improvements are the next major focus
- Some repetition patterns remain at the sentence structure level

---

## 🚀 Result

v0.7.0 marks the transition from:

**Stable system → Reliable, full-coverage output generation**

The Campaign Distillery can now consistently produce structured campaign pitches across a wide range of input scenarios without breaking composition.

---

## v0.6.0 — Intake Normalization & Safety Enforcement Pass

### 🚧 Core Milestone: "Lock It Down Before Scale"

This release establishes a stable, validated intake pipeline from raw form submission through canonical normalization, safety inference, adjudication, and pitch generation.

---

## ✅ Added

### Intake Normalization Layer
- Introduced `normalizeLabelText()` for consistent preprocessing of human-readable inputs
  - Handles casing, punctuation (`&`, `/`, `,`, `-`, etc.), and whitespace normalization
- Implemented explicit normalization functions:
  - `normalizeTone()`
  - `normalizeGenre()`
  - `normalizeEnvironment()`

### Centralized Enum Configuration
- Added `src/config/intakeEnums.js`
  - Canonical enum definitions for:
    - tones
    - genres
    - environments
  - Alias maps for human-readable → canonical translation
- Replaced inline normalization maps with shared config usage

### Safety Signal Inference System
- Expanded `inferSafetySignals()` to include:
  - `explicitYouthMode`
  - `inferredYouthSafe`
  - `youthSafeMode` (final enforcement flag)
  - signal breakdown (audience, age band, boundaries, text cues)
  - `softYouthCueCount`
  - `contradictionNotes`

### Enforcement Model
- Introduced clear separation of:
  - explicit user intent
  - inferred safety signals
  - final enforcement flag (`youthSafeMode`)

### Adjudication Integration
- Safety signals now properly influence:
  - tone shaping
  - content suppression (e.g. horror restrictions)
  - signal softening instead of removal

---

## 🔧 Changed

### mapFormSubmission.js
- Integrated shared enum config (`intakeEnums`)
- Replaced direct mappings with normalized + alias-driven resolution
- Updated `resolvedFlags.youthSafeMode` to use `safetySignals.youthSafeMode`
- Removed duplication of `contradictionNotes` from diagnostics

### Diagnostics Cleanup
- `diagnostics` now only contains:
  - `hasMinimumViableSignal`
- Safety-related reasoning moved fully into safety signals layer

---

## 🧠 Behavioral Improvements

- Handles imperfect or inconsistent form input:
  - missing fields
  - mismatched casing
  - punctuation differences
  - descriptive text instead of structured selection
- Prevents schema rejection from minor formatting differences
- Maintains strong signal fidelity while enforcing safety constraints
- Implements "softening" instead of hard removal for sensitive content

---

## 🧪 Validation

- Canonical schema validation (AJV) now enforced at intake boundary
- End-to-end pipeline confirmed:


form → normalization → canonical validation → crosswalk → adjudication → pitch


---

## 📌 Notes

- Output phrasing polish is pending (minor repetition/wording improvements)
- Future work may include:
- schema ↔ enum config synchronization
- expanded signal weighting
- richer crosswalk mappings

---

## 🚀 Result

v0.6.0 establishes a stable, scalable intake architecture capable of handling messy human input while producing structured, safety-aware campaign outputs.


---
## v0.5.0 — Intelligence & Signal Quality Layer

### Added

- Signal adjudication system with priority tiers
- Constraint-aware decision logic (safety, tone, exclusions)
- Confidence scoring across all domains
- Suppression tracking for filtered signals
- Structured AI handoff (`aiBrief`) output block
- Tone guardrails and audience safety propagation

### Improved

- Campaign pitch renderer readability and structure
- System label normalization into natural language
- Tone handling and youth-safe phrasing consistency
- Grammar correctness and sentence flow
- Deduplication of repeated phrasing and punctuation cleanup

### Fixed

- Duplicate phrase artifacts (e.g. "divided, or incomplete, and incomplete")
- Tone label casing inconsistencies
- System phrase composition issues ("Exploration Discovery" → natural phrasing)
- Double punctuation and malformed sentence joins
- Safety filter conflicts with tone rendering

### Notes

- This version introduces the system’s **decision-making layer**
- Output is now stable, interpretable, and safe for downstream AI expansion
- Marks transition from **pipeline correctness → intelligent interpretation**

---
## v0.4.0
added structured intake layer for raw form submissions
added mapFormSubmission, normalizeSubmission, and toCanonicalIntake
created end-to-end pipeline runner in src/index.js
moved test and smoke runners into scripts/
added canonical pipeline bridge from form-shaped input to translator pipeline
enabled full end-to-end resolution and pitch generation from raw intake JSON
organized roadmap tickets into milestone-based development phases


## v0.3.0 - Stable Builder + AI Prompt Layer

### Added

* End-to-end campaign generation pipeline (form → translate → select → build → AI prompt)
* Pitch builder with structured narrative blocks (opening, premise, gameplay, escalation, closing)
* VoiceMap integration for core, system, environment, genre, and tone
* Manual AI expansion workflow with copy-ready prompt output
* AI prompt v1 with QuestForge voice constraints

### Improved

* Gameplay sentence handling with standalone vs intro guard logic
* Paragraph structure and readability across all pitch sections
* Deduplication of overlapping voice lines
* Prompt clarity and output consistency for AI expansion

### Fixed

* Sentence collision issues between pitch sections
* Mid-sentence capitalization errors
* Awkward intro + fragment joins in gameplay lines

### Notes

* This version represents a stable, client-ready output layer
* Next phase will focus on input translation robustness and front-end pipeline quality
