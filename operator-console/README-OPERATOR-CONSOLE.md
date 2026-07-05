# QuestForge Operator Console v0.1

Private local Electron cockpit for QuestForge Campaign Distillery.

The console is intentionally thin: it runs the existing Distillery CLI scripts, reads the existing `submissions/` and `exports/submissions/` folder model, displays status and validation files, and provides prompt/response/PDF workflow buttons. It is not a second pipeline and should not duplicate the deterministic campaign logic.

## v0.1 status

v0.1 is considered good enough for current private operator use.

It has already proven useful by making the workflow visible enough to expose two real pipeline issues:

- canonical schema drift against the newer enriched intake shape
- Phase 1 to Phase 2 metadata loss caused by using narrow validator output as a handoff source

The second issue led to the dedicated enriched identity handoff step documented below.

## What v0.1 does

- Lists folders under `submissions/`
- Displays `submission-status.json`
- Shows Phase 1 and Phase 2 round-trip files
- Opens/copies generated prompts
- Writes pasted AI responses to the expected response bucket files
- Runs existing scripts from buttons
- Exports Phase 1 and Phase 2 PDFs through existing scripts
- Opens generated folders/files
- Creates staged source JSON from pasted structured Formspree text
- Supports legacy submission folders long enough to reprocess them into canonical records
- Flags invalid canonical intake outputs as re-intake candidates
- Builds the enriched Phase 1 Identity Pitch handoff before identity selection

## Required repo placement

Place this folder at the root of the Distillery repo:

```text
questforge-campaign-distillery/
  src/
  scripts/
  submissions/
  exports/
  templates/
  operator-console/
```

The default project root is inferred as the parent folder of `operator-console/`.

## Root package compatibility

The current root project package is CommonJS and only depends on `ajv` and `puppeteer`, so this console is intentionally a standalone nested package for v0.1. Do not convert the repo to workspaces yet unless you want that as a separate refactor.

The root Puppeteer dependency requires modern Node, so use Node `>=22.12.0` for the console as well.

Optional root scripts you can add later:

```json
{
  "scripts": {
    "console": "npm --prefix operator-console run dev",
    "console:install": "npm --prefix operator-console install"
  }
}
```

## Install

From inside `operator-console/`:

```bash
npm install
npm run dev
```

On Windows PowerShell, use `npm.cmd` if script execution policy blocks `npm.ps1`:

```powershell
npm.cmd install
npm.cmd run dev
```

This starts Vite and launches Electron. Use the Electron desktop window, not the Vite browser tab, because the browser tab does not have the `window.questforge` bridge.

## Current workflow strategy

v0.1 calls existing scripts:

```text
scripts/workflows/runSubmission.js
scripts/phase1/prepareIdentityPolishRoundTrip.js
scripts/phase1/completeIdentityPolishRoundTrip.js
scripts/phase1/buildIdentityPitchHandoff.js
scripts/phase1/createIdentitySelectionRecord.js
scripts/phase1/exportIdentityPitchPdf.js
scripts/phase2/prepareCampaignConceptRoundTrip.js
scripts/phase2/completeCampaignConceptRoundTrip.js
scripts/phase2/exportCampaignConceptPdf.js
```

This is deliberate. The console is not a second pipeline.

Future versions can extract shared workflow actions so both CLI and Electron call the same engine directly.

## New Submission intake

The New Submission modal can parse simple labeled Formspree text:

```text
Name: Example Client
Email: example@example.com
Player Count: 4
Tone: Heroic, mysterious
Avoid: heavy horror
```

It creates:

```text
operator-console/staging/<submission-slug>.input.json
```

Then use `Run Deterministic Processing` to call:

```bash
node scripts/workflows/runSubmission.js operator-console/staging/<slug>.input.json --submission-slug <slug>
```

The normal canonical records are then written by the existing workflow:

```text
submissions/<slug>/
  00_RAW_SUBMISSION.json
  01_NORMALIZED_SUBMISSION.json
  02_PIPELINE_RESULT.json
  submission-status.json
```

### Intake parser note

The parser maps labeled Formspree fields into the current raw form JSON shape expected by the deterministic pipeline. It handles multi-select values, including options that contain commas, such as:

```text
Coastlines, Islands & Oceans
Strange, Dreamlike, or Reality-Warped Places
```

Always review the staged JSON before running deterministic processing, especially when recreating older submissions.

## Canonical records

Generated canonical records should be treated as pipeline output, not hand-edited source files.

Prefer fixing or recreating the source/staged input, then rerunning deterministic processing.

Canonical output folder:

```text
submissions/<slug>/
  00_RAW_SUBMISSION.json
  01_NORMALIZED_SUBMISSION.json
  02_PIPELINE_RESULT.json
  submission-status.json
```

If a folder named `submissions/submission/` appears, it is probably a fallback-slug remnant from a run where the real slug was not passed. Check whether it contains unique artifacts before archiving or deleting it.

## Phase 1: Identity Pitch workflow

Current Phase 1 flow:

```text
Run Deterministic Processing
→ Prepare Phase 1 Prompt
→ Paste/Save Phase 1 AI Response
→ Complete Identity Polish Round Trip
→ Build Identity Pitch Handoff
→ Create Identity Selection Record
→ Export Phase 1 PDF as needed
→ Prepare Phase 2 Prompt
```

### Phase 1 round-trip files

```text
exports/submissions/<slug>/phase-1/round-trip/
  01_IDENTITY_POLISH_PROMPT.md
  02_PASTE_CHATGPT_RESPONSE_HERE.json
  03_VALIDATION_RESULT.json
  04_VALIDATED_IDENTITY_PITCHES.json
  05_ENRICHED_IDENTITY_PITCHES.json
  05_VALIDATION_SUMMARY.txt
  round-trip-status.json
```

Note: `05_ENRICHED_IDENTITY_PITCHES.json` and `05_VALIDATION_SUMMARY.txt` currently share the `05_` prefix. This is acceptable for v0.1 but should be cleaned up in a future naming pass if it becomes confusing.

## Enriched Identity Pitch handoff

`04_VALIDATED_IDENTITY_PITCHES.json` is intentionally narrow. It contains only the validator-approved GPT-polished Identity Pitch prose:

```text
title
pitch
about
playersDo
hook
```

That file should stay narrow. It is the validation artifact, not the Phase 2 handoff source.

Phase 2 needs richer deterministic context, including source frames, constraints, genre, tone, environment, safety profile, and campaign handoff guidance. To preserve that, the console now runs:

```bash
node scripts/phase1/buildIdentityPitchHandoff.js "<phase1-round-trip>/04_VALIDATED_IDENTITY_PITCHES.json" --submission-slug <slug>
```

This writes:

```text
exports/submissions/<slug>/phase-1/round-trip/05_ENRICHED_IDENTITY_PITCHES.json
```

`Create Identity Selection Record` must use the enriched handoff file:

```text
05_ENRICHED_IDENTITY_PITCHES.json
```

not the narrow validator file:

```text
04_VALIDATED_IDENTITY_PITCHES.json
```

This preserves metadata such as:

```json
"environment": [
  "Coastal / Oceanic",
  "Underground / Caverns"
]
```

## Phase 2: Campaign Concept workflow

Phase 2 begins after an Identity Selection Record exists.

The Phase 2 prepare step uses the selected identity direction and enriched identity context to create:

```text
exports/submissions/<slug>/phase-2/<direction>/round-trip/
  00_PHASE2_HANDOFF.json
  01_CAMPAIGN_CONCEPT_PROMPT.md
  02_PASTE_CHATGPT_RESPONSE_HERE.json
  03_VALIDATION_RESULT.json
  04_VALIDATED_CAMPAIGN_CONCEPTS.json
  05_VALIDATION_SUMMARY.txt
  round-trip-status.json
```

Client delivery exports go to:

```text
exports/submissions/<slug>/phase-2/<direction>/client-delivery/
```

## Legacy submission folders

v0.1 can read both current canonical submission records and older submission folders that contain files such as:

```text
submissions/submission-03-johannab253/
  submission-03-johannab253.json
  submission-03-johannab253.result.json
```

If a folder has legacy raw/result files but no `submission-status.json`, the console marks it as `legacy_files_found` and uses the legacy raw/result files as fallbacks.

Click **Run Deterministic Processing** once for that submission to create the newer canonical record set:

```text
submissions/<slug>/
  00_RAW_SUBMISSION.json
  01_NORMALIZED_SUBMISSION.json
  02_PIPELINE_RESULT.json
  submission-status.json
```

The existing legacy JSON files are not deleted. The console simply starts preferring the canonical files once they exist.

## Re-intake note

If a legacy or GPT-shaped submission produces `Invalid canonical intake`, the console flags it as a re-intake candidate. Use **Recreate From Formspree Paste** and paste the original Formspree response.

Common causes:

- the old source file was GPT-shaped instead of raw Formspree-shaped
- the canonical schema was behind the newer intake shape
- a multi-select value was split incorrectly before normalization
- the run used a fallback slug such as `submission` instead of the intended client slug

## Notes

- This scaffold assumes the repo scripts use the folder names and file names established in v0.9.1+.
- The Phase 2 handoff filename is `00_PHASE2_HANDOFF.json`.
- Response buckets are edited directly in the UI but validation remains owned by the existing scripts.
- The UI intentionally displays raw validation summaries rather than trying to interpret every possible validation error.
- If a script button fails with `node not found`, launch the console from a terminal where `node --version` works.

## Patch history

### v0.1.3

- Fixed the preload import so the renderer receives `window.questforge` correctly.
- Added a visible bridge warning if the Vite browser tab is opened directly instead of the Electron desktop window.

### v0.1.4

- Fixed script execution so Electron calls the system `node` executable rather than the Electron binary.
- Improved command output reporting with stdout, stderr, exit code, duration, and error state.

### v0.1.5

- Added detection for `Invalid canonical intake` pipeline results.
- Added **Recreate From Formspree Paste** for legacy/GPT-shaped records.

### v0.1.6

- Improved multi-select parsing for pasted Formspree responses.
- Added more aliases for group size / player count fields.

### v0.1.7

- Fixed multi-select options that contain commas so values like `Coastlines, Islands & Oceans` remain intact.

### v0.1.8

- Added the **Build Identity Pitch Handoff** Phase 1 step.
- Added detection/viewing for `05_ENRICHED_IDENTITY_PITCHES.json`.
- Updated Identity Selection Record creation to use enriched identity pitches instead of narrow validator output.
- Confirmed the console is useful as a private production/debugging cockpit for the current workflow.

## Future cleanup candidates

- Rename Phase 1 artifacts so the enriched handoff and validation summary do not both use `05_`.
- Add a warning when a submission slug resolves to the generic fallback `submission`.
- Add stronger staged-input review warnings for blank or suspicious fields.
- Eventually move repeated CLI logic into shared workflow modules and let both CLI and Electron call the same engine directly.
