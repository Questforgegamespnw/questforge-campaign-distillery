# Debugging Guide

← [Back to Developer Documentation](../README.md)

## Core Rule

> Debug the earliest incorrect stage, not the final visible symptom.

Use this order:

```text
source record
→ normalization
→ mapping and adjudication
→ selection
→ resolution
→ deterministic rendering
→ round-trip source binding
→ AI validation
→ enriched Identity Pitch handoff
→ Identity Selection Record
→ Phase 2 handoff
→ exporter normalization
→ HTML/PDF rendering
→ submission lifecycle status
```

---

## Quick Triage

```text
Wrong raw values?                    → 00_RAW_SUBMISSION.json
Wrong normalized values?             → 01_NORMALIZED_SUBMISSION.json
Wrong selected direction data?       → 02_PIPELINE_RESULT.json
Wrong Phase 1 prose backbone?         → renderer layers
Wrong polished Identity Pitch?        → Phase 1 round-trip validation
Wrong enriched Phase 1 metadata?       → 05_ENRICHED_IDENTITY_PITCHES.json
Wrong client selection?               → identity-selection-record.json
Wrong approved identity in P2?        → identity-selection-record.json or 00_PHASE2_HANDOFF.json
Wrong concrete concept?               → Phase 2 prompt/evaluator/schema
Wrong client layout?                  → exporter HTML builder or CSS
Missing files or wrong folder?        → projectPaths/submissionPathUtils
Wrong workflow state or next action?  → submission-status.json
```

---

# Submission Workflow Failures

## Input file not found

Check:

- command working directory;
- quoted paths;
- `scripts/shared/projectPaths.js`;
- canonical slug and output-root flags.

## Raw JSON parse failure

Inspect the original file directly. Do not edit the captured raw copy to make the pipeline pass.

## Pipeline returned an error

Open:

```text
submissions/<slug>/02_PIPELINE_RESULT.json
```

The audit output should identify intake or validation failure.

---

# Deterministic Phase 1 Failures

## Wrong interpretation

Check in order:

1. normalized intake;
2. translated signals;
3. safety and audience inference;
4. Core Frame audience policy;
5. candidate weights;
6. Primary/Adjacent/Wildcard selection;
7. resolved objects.

## Poor sentence quality

Inspect:

```text
pitchCore
→ pitchSectionBuilders
→ pitchAssembly
→ pitchSafetyFilters
→ youthVoiceLayer
→ pitchCleanup / client-facing boundary cleanup
```

Do not fix grammar in mapping or selection.

## Wrong youth or kids phrasing

Check:

- `experienceProfile` propagation;
- Core Frame audience policy for theme routing;
- `youthVoiceLayer` for phrasing;
- client-facing boundary cleanup for final field cleanup.

---

# Phase 1 Round-Trip Failures

## Source mismatch

Symptoms:

```text
stage: response_source_mismatch
```

Cause:

- response came from another workspace;
- source file changed after prompt creation;
- metadata was edited.

Fix:

- paste the response generated from the current prompt;
- or rerun the prepare command.

## One or more directions rejected

Inspect:

```text
03_VALIDATION_RESULT.json
05_VALIDATION_SUMMARY.txt
```

Each direction is evaluated independently. Check missing keys, empty fields, extra keys, or forbidden drift.

---

# Enriched Identity Pitch Handoff Failures

## Missing deterministic metadata after Phase 1 validation

Do not expand `04_VALIDATED_IDENTITY_PITCHES.json`. It is intentionally narrow.

Run:

```powershell
node scripts/phase1/buildIdentityPitchHandoff.js "exports/submissions/<slug>/phase-1/round-trip/04_VALIDATED_IDENTITY_PITCHES.json"
```

Then create the Identity Selection Record from:

```text
exports/submissions/<slug>/phase-1/round-trip/05_ENRICHED_IDENTITY_PITCHES.json
```

## Source mismatch while building enriched handoff

The stitch step recomputes the Phase 1 source fingerprint from the original source listed in `round-trip-status.json`. If that source changed, rerun Phase 1 prepare and complete before building the enriched handoff.


# Identity Selection Record Failures

## Selected direction invalid

The selected direction must be:

```text
primary | adjacent | wildcard
```

## Selected pitch missing required fields

Check the source `04_VALIDATED_IDENTITY_PITCHES.json`. Each selected pitch must include:

```text
title, pitch, about, playersDo, hook
```

## Phase 2 rejects the Identity Selection Record

Run or inspect the Identity Selection Record validator. Do not bypass the record by manually copying pitch text into the handoff unless intentionally using legacy mode.

---

# Phase 2 Handoff Failures

## Handoff no longer matches Identity Pitch

The selected Identity Pitch fields in `00_PHASE2_HANDOFF.json` are source-bound and should not be edited.

Place client feedback in:

- `selectionRecord`;
- `identitySummary.mustPreserve`;
- `identitySummary.mustAvoid`;
- system or setting context;
- safety or operator notes.

## Invalid input from handoff

Inspect input-validation errors. Common causes include:

- missing selected direction;
- empty required identity fields;
- invalid generation mode;
- malformed context objects.

---

# Phase 2 Source Mismatch

Symptoms:

```text
stage: source_changed_reprepare_required
```

Cause:

The handoff changed after the prompt was generated.

Fix:

```powershell
node scripts/phase2/prepareCampaignConceptRoundTrip.js "exports/submissions/<slug>/phase-1/identity-selection-record.json"
```

Then use the regenerated prompt and response skeleton.

---

# Phase 2 Concept Rejection

Inspect:

```text
03_VALIDATION_RESULT.json
05_VALIDATION_SUMMARY.txt
```

Common causes:

- wrong number of concepts;
- missing required fields;
- duplicate or invalid variant types;
- too few factions or meaningful choices;
- vague recurring campaign activity;
- no visible escalation;
- fixed ending or prescribed solution;
- identity or safety drift.

---

# Exporter Failures

## Stylesheet missing

Verify root templates:

```text
templates/identity-pitch-pdf.css
templates/campaign-concept-pdf.css
```

Exporter scripts resolve them through `projectPaths.js`.

## Puppeteer not installed

Run:

```powershell
npm.cmd install puppeteer
```

Use `--html-only` to verify document construction without Chromium.

## Wrong client-delivery directory

Inspect:

- the input file location;
- `resolveSiblingClientDelivery`;
- submission slug derivation;
- selected Phase 2 direction.

---

# Status Failures

If `submission-status.json` looks stale or incomplete, check that the command was run through the production script rather than by manually copying files.

The shared status utility should merge updates and preserve completed flags. Later commands should not erase earlier completed steps.

---

# Anti-Patterns

Do not:

- patch final prose to hide a data error;
- duplicate shared fingerprint logic;
- treat tests as production commands;
- edit source-bound identity fields in the Phase 2 handoff;
- accept a response with a mismatched fingerprint;
- scrape PDFs to recover structured data;
- store production prompts under `submissions`;
- maintain duplicate copies of runtime schemas in `dev`.

---

## Summary

The most useful debugging questions are:

1. Which artifact first became incorrect?
2. Is the wrong value authoritative or generated?
3. Did the source change after prompt generation?
4. Did validation reject structure, meaning, or transport?
5. Is the problem content, HTML, CSS, Chromium, or lifecycle status?
