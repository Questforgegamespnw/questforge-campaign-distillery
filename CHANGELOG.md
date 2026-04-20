# Changelog

All notable changes to this project will be documented in this file.


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
