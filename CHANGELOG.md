# Changelog

All notable changes to this project will be documented in this file.

---

## v0.10.0 — Phase 1 → Phase 2 Handoff Hardening

### Summary

v0.10.0 completes the core production handoff between **Phase 1 Identity Discovery** and **Phase 2 Campaign Concept Development**.

This release hardens the output pipeline around audience-aware interpretation, client-facing phrasing boundaries, validated identity selection, direct Phase 2 consumption of selected identities, and shared submission lifecycle status. It closes the v0.10 goal of making the human-in-the-loop production workflow stable, reviewable, and ready for repeated operator use.

---

### Audience and Safety Architecture

- Added explicit three-way experience profile handling:
  - `standard`;
  - `youth`;
  - `kids`.
- Clarified that `standard` is the default profile and does not imply adult-only content.
- Added Core Frame audience policy for younger groups.
- Added explicit preserve, soften, downweight, substitute, and suppress behavior for Core Frames.
- Added profile-aware handling so youth preserves meaningful stakes while kids routes adult-heavy themes into safer equivalents.
- Added high-risk Core Frame combination downweighting.
- Added regression coverage for complete Core Frame audience policy coverage.

---

### Youth Voice Layer

- Added a dedicated youth voice layer under `src/voice`.
- Preserved standard-profile output unchanged.
- Added youth-profile phrasing that keeps danger and stakes meaningful while reducing hopeless, crushing, or destabilizing language.
- Added kids-profile phrasing that favors curiosity, teamwork, repair, problem-solving, and approachable challenges.
- Kept theme routing separate from voice shaping:
  - Core Frame policy decides what themes are allowed or substituted;
  - the voice layer decides how younger-audience text should sound.
- Wired the layer into final client-facing Identity Pitch fields.

---

### Client-Facing Output Boundary

- Added a dedicated client-facing phrase boundary cleanup layer.
- Cleaned final pitch fields without altering internal handoff/audit data.
- Reduced leakage of internal terms such as frame IDs, renderer language, adjudication phrasing, candidate buckets, suppressed signals, and confidence scoring.
- Preserved `aiBrief` and adjudication data as explicit internal context.

---

### System Lead Normalization

- Refactored system lead cleanup from chained string replacement into a named-rule pipeline.
- Added reusable rule application helpers.
- Exposed applied rule IDs for debugging and regression coverage.
- Improved maintainability of system-derived player-facing phrasing.

---

### Identity Selection Record

- Added a reusable Identity Selection Record builder.
- Added a validator for selected Phase 1 identity handoff records.
- Formalized the selected identity artifact between Phase 1 and Phase 2.
- Captured:
  - selected direction;
  - selected Identity Pitch;
  - client response notes;
  - liked elements;
  - concerns and requested adjustments;
  - preservation guidance;
  - intake summary;
  - safety profile;
  - system and setting context;
  - source metadata and validation state.
- Added a Phase 1 script to create the record from validated Identity Pitches.
- Established the canonical output location:

```text
exports/submissions/<submission-slug>/phase-1/identity-selection-record.json
```

---

### Phase 2 Identity Selection Bridge

- Updated Phase 2 preparation to consume a validated Identity Selection Record directly.
- Preserved legacy support for validated Identity Pitches plus `--direction`.
- Imported client response and preservation guidance from the Identity Selection Record into the Phase 2 handoff.
- Recorded source type in Phase 2 round-trip status.
- Updated completion checks so Phase 2 can source-check either validated Identity Pitches or Identity Selection Records.

Preferred Phase 2 preparation now uses:

```powershell
node scripts/phase2/prepareCampaignConceptRoundTrip.js "exports/submissions/<submission-slug>/phase-1/identity-selection-record.json"
```

---

### Submission Lifecycle Status

- Added shared submission status synchronization across production workflows.
- Updated workflow commands to write through the same `submission-status.json` contract.
- Preserved completed steps when later commands update status.
- Added current stage, next action, artifact paths, failed-validation states, and append-only history entries.
- Status now tracks:
  - deterministic processing;
  - Phase 1 round-trip preparation;
  - Phase 1 validation;
  - Phase 1 PDF export;
  - Identity Selection Record creation;
  - Phase 2 handoff/preparation;
  - Phase 2 validation;
  - Phase 2 PDF export.
- Prepared the status contract for a future operator dashboard.

---

### Intake and Group Context

- Added group-context fields to intake handling.
- Preserved legacy group-size compatibility while adding current and desired group-size handling.
- Distinguished individual, partial-group, existing-group, and organizer submissions.
- Preserved the difference between family-friendly standard campaigns and full kids-profile routing.

---

### Tests

- Added regression coverage for:
  - system lead normalization;
  - client-facing phrase boundaries;
  - Core Frame audience policy;
  - youth voice behavior;
  - Identity Selection Record building and validation;
  - Identity Selection Record → Phase 2 bridge;
  - submission lifecycle status synchronization.
- Full routine suite passes with 14 tests.

---

### Deferred to v0.11

- Moved individual-player matchmaking and compatibility pools to v0.11.
- Matchmaking is a new capability area and should receive its own data model, privacy boundaries, compatibility scoring rules, and operator workflow.

---

## v0.9.1 — Two-Phase Client Delivery Workflow

### Summary

Implemented the first complete manual production workflow for both phases of QuestForge Campaign Distillery.

The system can now process a client submission, generate and validate three Phase 1 Identity Pitches, export a polished client-facing PDF, develop three Phase 2 Campaign Concepts from a selected identity, validate those concepts, and export a full Campaign Concept packet.

The workflow remains intentionally human-in-the-loop. AI interaction is performed manually through ChatGPT Plus, while prompt construction, response packaging, source binding, validation, status tracking, and client-document generation are automated locally.

---

### Phase 1 Manual AI Round Trip

- Added a combined Identity Pitch polish workflow for Primary, Adjacent, and Wildcard.
- Replaced the previous three-prompt, three-chat, multi-file response process with:
  - one generated Markdown prompt;
  - one ChatGPT conversation;
  - one combined JSON response;
  - one local validation command.
- Added a dedicated round-trip workspace for each submission.
- Added round-trip status tracking with a clearly recorded next action.
- Preserved independent validation for all three Identity Pitch directions.
- Preserved deterministic fallback content when AI output fails validation.
- Added source-bound SHA-256 fingerprints to prevent responses from being accepted against the wrong campaign input.
- Added tolerance for accidental Markdown fences and wrapper text around AI JSON responses.

---

### Phase 1 Client PDF Export

- Added a dedicated Identity Pitch PDF exporter using JavaScript, HTML, CSS, and Puppeteer.
- Added a browser-previewable HTML version alongside each PDF.
- Added a five-page client packet containing:
  - cover and campaign-stage explanation;
  - Primary Identity Pitch;
  - Adjacent Identity Pitch;
  - Wildcard Identity Pitch;
  - selection and feedback guidance.
- Derived the document theme from the existing QuestForge website styling:
  - charcoal-purple surfaces;
  - warm cream interiors;
  - muted gold accents;
  - Georgia-style serif typography.
- Added optional client-name and submission-reference metadata.
- Added a dedicated client-delivery folder separate from internal prompts and validation files.

---

### Phase 2 Campaign Concept Development

- Implemented the Phase 2 Campaign Concept source layer under `src/ai/phase2`.
- Added canonical Phase 2 input construction.
- Added Phase 2 input validation.
- Added structured AI prompt generation.
- Added raw-response parsing and JSON extraction.
- Added structural and semantic Campaign Concept validation.
- Added response evaluation with accepted, rejected, warning, and fallback states.
- Added formal Campaign Concept schema constants and JSON Schema.
- Added support for:
  - `core_interpretation`;
  - `alternate_situation`;
  - `distinctive_interpretation`;
  - optional single-concept generation mode.
- Added required support for:
  - starting situation;
  - central conflict;
  - recurring campaign engine;
  - active factions or forces;
  - visible escalation;
  - distinctive campaign element;
  - meaningful player choices;
  - system and setting implementation notes.
- Added safeguards against:
  - fixed campaign endings;
  - mandatory adventure sequences;
  - predetermined solutions;
  - assigned player decisions;
  - excessive lore;
  - unsupported identity, genre, or tone drift.

---

### Phase 2 Manual AI Round Trip

- Added a source-bound Phase 2 handoff file.
- Added support for recording:
  - selected Identity Pitch;
  - liked elements;
  - elements to avoid;
  - requested changes;
  - system preferences;
  - setting preferences;
  - campaign-length and player-count context;
  - safety and audience constraints;
  - operator notes.
- Added one-prompt and one-response manual ChatGPT workflow for all three Campaign Concept variants.
- Added handoff fingerprinting to detect changes made after prompt generation.
- Added validation that the Phase 2 handoff still matches the approved Phase 1 Identity Pitch.
- Added dedicated Phase 2 validation, summary, and final-output files.
- Added per-direction Phase 2 folders so Primary, Adjacent, and Wildcard may be explored independently without collisions.

---

### Phase 2 Client PDF Export

- Added a dedicated Campaign Concept PDF exporter.
- Added a browser-previewable HTML version alongside each PDF.
- Added a twelve-page client packet containing:
  - cover;
  - reading guide and selected campaign identity;
  - three pages for each Campaign Concept;
  - final comparison and selection guidance.
- Each concept packet includes:
  - one-sentence premise;
  - campaign pitch;
  - starting situation;
  - central conflict;
  - recurring player activity;
  - campaign engine;
  - reason the crisis is happening now;
  - factions and forces;
  - escalation;
  - distinctive element;
  - meaningful choices;
  - system and setting implementation notes;
  - opening hook.
- Reused the Phase 1 QuestForge visual language while allowing greater information density.

---

### Email and Client Communication Templates

- Added professional email templates for:
  - initial form receipt;
  - Phase 1 Identity Pitch delivery;
  - Phase 2 Campaign Concept delivery.
- Clarified the action requested from clients at each stage.
- Added language explaining that Campaign Concept packets are best reviewed before a guided follow-up meeting.

---

### Production Folder Architecture

- Established a permanent submission-first storage model.

Authoritative intake and deterministic records now belong under:

```text
submissions/<submission-slug>/
  00_RAW_SUBMISSION.json
  01_NORMALIZED_SUBMISSION.json
  02_PIPELINE_RESULT.json
  submission-status.json
```

Generated and client-facing artifacts now belong under:

```text
exports/submissions/<submission-slug>/
  phase-1/
    round-trip/
    client-delivery/

  phase-2/
    <selected-direction>/
      round-trip/
      client-delivery/
```
- Removed active client work from the conceptual responsibility of misc.
- Kept internal AI prompts, pasted responses, validation reports, and final client deliverables clearly separated.
- Standardized one stable submission slug across every stage.
- Added support for alternate export roots during tests and migrations.

---

### Script Architecture Cleanup

Reorganized scripts into functional folders:

```text
scripts/
  diagnostics/
  docs/
  fixtures/
  phase1/
  phase2/
  shared/
  tests/
  workflows/
```
- Separated operator workflows from tests and diagnostics.
- Added shared project-root path resolution.
- Added canonical submission and export path helpers.
- Consolidated repeated JSON and text file utilities.
- Consolidated stable serialization and SHA-256 fingerprint generation.
- Consolidated AI-response JSON extraction.
- Consolidated command-line argument parsing.
- Consolidated round-trip artifact paths and status updates.
- Replaced fragile relative-path climbing with project-root-based resolution.

---

### Submission Workflow Improvements
- Updated single-submission and batch-submission processing.
- Added permanent raw-submission capture.
- Added normalized-submission export.
- Added deterministic pipeline-result export.
- Added submission-level status tracking.
- Updated printed next-step commands to use the reorganized script locations and canonical folders.

---

### Test Suite Restructure

- Reorganized tests into:
  pipeline tests;
  Phase 1 tests;
  Phase 2 tests;
  exporter tests;
  shared utility tests.
- Added a shared test runner.
- Added direct regression tests for both manual AI round trips.
- Added tests for:
  fingerprint stability;
  source mismatch rejection;
  response-envelope validation;
  fenced JSON extraction;
  Phase 2 handoff drift;
  Phase 2 input validity;
  exporter normalization;
  HTML document construction.
- Rewrote batch pipeline testing to use the public runCampaignPipelineFromForm entry point.
- Retired the obsolete three-response AI import test.
- Stopped routine tests from writing diagnostic output files into misc.

---

### PDF Exporter Modularization

- Moved reusable document-generation logic into:

```text
src/exporters/
  shared/
  phase1/
  phase2/
```

- Split input normalization from HTML construction.
- Split HTML construction from Puppeteer PDF rendering.
- Reduced PDF workflow scripts to thin command-line entry points.
- Kept visual styles under the root templates directory.
- Added shared HTML escaping, date formatting, file-writing, and browser-rendering utilities.
- Added exporter tests that do not require launching Chromium.

---

### Documentation and Architecture
- Added professional email-template documentation.
- Added the Phase 2 schema and AI-generation contract package.
- Added a detailed Mermaid program and file-architecture map.
- Documented the manual-transport, automated-processing AI model.
- Clarified that the current business workflow does not require direct API integration.
- Added migration checklists for each script-cleanup pass.

---

### Future Work Identified
- Add a structured system-recommendation stage.
- Add a concise Phase 2 meeting/comparison worksheet.
- Add a matchmaking and compatibility-pool pathway for individual players seeking groups in v0.11.
- Consider automated notifications when new compatible player profiles enter the matchmaking pool.
- Add Formspree or intake-platform automation when business scale justifies it.

---

## v0.9.0 — Identity Discovery Architecture

### Architectural Clarification

- Reclassified the existing three-direction output as **Phase 1 Identity Pitches**.
- Defined Primary, Adjacent, and Wildcard as identity directions rather than finished campaign concepts.
- Clarified that Phase 1 identifies thematic promise, emotional direction, and style of play while remaining system-agnostic and setting-agnostic.
- Defined **Phase 2 Campaign Concept Development** as the downstream stage that adds a concrete setting situation, conflict, starting position, factions or forces, campaign engine, escalation, and player-facing choices.
- Established the working principle:

  > Phase 1 discovers what the campaign wants to be.  
  > Phase 2 decides what is actually happening and what the players can change.

### Documentation

- Updated root and developer documentation to use the two-phase model.
- Added explicit phase boundaries for deterministic rendering and AI behavior.
- Reserved **Campaign Concept Pitch** terminology for Phase 2 outputs.
- Documented that current runtime filenames and exported function names remain unchanged during v0.9.x.

### Behavior

- No intentional runtime renaming or output behavior change in this documentation pass.
- Existing `campaignPitch`-style identifiers remain compatibility names for the Phase 1 implementation.

---

## v0.8.2 — Voice Variation + Assembly Audit

### 🎯 Summary
This patch improves first-impression quality while tightening the pitch assembly layer around explicit phrase types and safer sentence shapes.

### ✅ Improved
- Expanded structural and tonal variation across Pitch, Players Do, and Hook output
- Strengthened genre and environment routing so setting details reinforce the selected campaign direction
- Reduced repeated opener patterns and generic “something is wrong” phrasing
- Differentiated Primary, Adjacent, and Wildcard rhythm through sentence structure:
  - Primary is more definitive and marketable
  - Adjacent communicates a clear shift in gameplay emphasis
  - Wildcard uses bolder or stranger framing

### 🧠 Assembly Audit
- Classified pitch concepts before assembly as:
  - campaign identity phrases
  - activity / process phrases
  - abstract pressure / theme phrases
  - proposition / clause phrases
- Replaced templates that depended on dangling articles or prepositions
- Removed routine reliance on the generic `campaign defined by` fallback
- Added separate bare-clause and nominalized-clause routing for proposition concepts
- Rebalanced pitch construction so campaign identity leads and system behavior supports it
- Reduced cleanup responsibility to surface corrections rather than grammar repair

### 🧪 Validation
- Full batch test suite: **24/24 passing**
- Verified against three live campaign submissions
- No regressions found in youth-safe routing, tone handling, or prior variation work

### 🚀 Result
v0.8.2 moves the renderer from broadly stable phrasing to controlled, phrase-aware assembly with stronger direction identity and less dependence on post-hoc cleanup.

---

## v0.8.1 — Pipeline Integrity + Youth System Activation

### 🎯 Summary
This patch finalizes the core pipeline wiring and activates the youth experience layer, resolving several critical gaps discovered during end-to-end AI expansion testing.

### ✅ Added / Fixed
- Integrated `resolveCampaignContext` into main pipeline flow
  - Ensures experience profile (standard vs youth) is respected before selection
- Activated frame crosswalk system for youth experiences
  - Youth-safe core frames now correctly supplement and reshape candidate pools
- Fixed core frame resolution to use profile-aware pools
  - Prevents missing data when resolving youth-specific frames
- Added `pitchText` support to youth core frames
  - Enables proper narrative language generation for youth outputs

### 🧪 Validation Improvements
- Full pipeline smoke tests now validate:
  - experience profile detection
  - crosswalk activation
  - correct data pool resolution
  - AI prompt input quality

### ⚠️ Known Gaps (Next Iteration)
- Youth voice still inherits adult phrasing patterns
- Description text occasionally bleeds into player-facing output
- Cleanup layer is not yet age-aware

### 🧠 Impact
The system now maintains consistent signal flow from intake → AI expansion across both standard and youth experiences. This marks the transition from structural stability to voice and output quality refinement.

---

## v0.8.0 — Stable Narrative Input Layer

### 🎯 Overview
Major stabilization pass transforming the renderer into a structured, reliable narrative input system for AI expansion.

---

### 🧠 Core Changes

**Sentence Assembly System**
- Introduced structured sentence assembly layer (`pitchAssembly`)
- Added controlled variation patterns for multi-line output
- Reduced rigid sentence templating

**Players Do Improvements**
- Added action compatibility layer for player-facing phrasing
- Introduced concept softening to reduce cross-section repetition
- Improved alignment between system phrases and player actions

**Joiner & Flow Fixes**
- Expanded and refined joiner system
- Removed unsafe joiners causing grammatical collisions
- Added cleanup normalization for verb-chain artifacts

**Cleanup Layer Enhancements**
- Centralized post-assembly normalization in `cleanOutputText`
- Added targeted fixes for common grammatical issues
- Improved consistency across all output sections

---

### ✨ Output Improvements

- Eliminated verb collisions and malformed joins
- Reduced mechanical repetition across sections
- Improved readability and sentence flow
- Maintained consistent tone across all inputs
- Outputs now optimized for AI expansion rather than final delivery

---

### ⚙️ System Behavior

- Outputs are:
  - structurally consistent
  - grammatically stable
  - semantically clear
- Designed as **input for AI writing**, not final copy

---

### 🚀 Result

v0.8.0 marks the transition from:

"Stable voice generator"

to:

"Reliable narrative input layer for AI-assisted expansion"

---
## v0.7.4 — Pipeline Refactor & Modular Renderer Architecture

### Core Refactor (No Output Changes)
Refactored generateCampaignPitch.js into a modular, pipeline-based architecture without intentionally altering output behavior

- Split responsibilities into dedicated modules: 
  - pitchCore.js → context extraction and normalization
  - pitchSectionBuilders.js → section-level narrative construction
  - pitchAssembly.js → sentence assembly and pitch composition
  - pitchCleanup.js → normalization and text utilities
  - pitchSafetyFilters.js → tone filtering and safety enforcement
  - generateCampaignPitch.js → orchestration layer only

### Structural Improvments
- Renderer now reads as a clear pipeline instead of a monolithic function
- Eliminated duplicated cleanup and splice logic from iterative fixes
- Isolated fragile transforms into clearly defined layers
- Improved debuggability and future iteration safety

### Validation
- Full batch test suite: 24/24 passing
- No intentional changes to output, structure, or tone
- verified stability across all existing test scenarios

### Outcome
This version marks the transition from: 
"Working Renderer" 

to: 

"maintainable, modular pitch generation system" 

This establishes a safe foundation for: 
- Voice Expansion
- Tone/Genre Refinement
- Output Quality Tuning


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
