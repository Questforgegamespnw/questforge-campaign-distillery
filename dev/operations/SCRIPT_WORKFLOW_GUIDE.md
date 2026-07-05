# Script Workflow Guide

← [Back to Developer Documentation](../README.md)

## Script Layout

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

## Production Commands

### Process one submission

```powershell
node scripts/workflows/runSubmission.js "path/to/submission.json"
```

### Process a directory

```powershell
node scripts/workflows/runSubmissionBatch.js "path/to/submissions"
```

### Prepare Phase 1

```powershell
node scripts/phase1/prepareIdentityPolishRoundTrip.js "submissions/<slug>/02_PIPELINE_RESULT.json"
```

### Complete Phase 1

```powershell
node scripts/phase1/completeIdentityPolishRoundTrip.js "exports/submissions/<slug>/phase-1/round-trip"
```

### Build the enriched Phase 1 handoff

```powershell
node scripts/phase1/buildIdentityPitchHandoff.js "exports/submissions/<slug>/phase-1/round-trip/04_VALIDATED_IDENTITY_PITCHES.json"
```

This writes:

```text
exports/submissions/<slug>/phase-1/round-trip/05_ENRICHED_IDENTITY_PITCHES.json
```

### Export Phase 1

```powershell
node scripts/phase1/exportIdentityPitchPdf.js "exports/submissions/<slug>/phase-1/round-trip/04_VALIDATED_IDENTITY_PITCHES.json" --client "Client Name"
```

### Record the selected identity

```powershell
node scripts/phase1/createIdentitySelectionRecord.js "exports/submissions/<slug>/phase-1/round-trip/05_ENRICHED_IDENTITY_PITCHES.json" --direction primary
```

Optional client-response flags may include `--selected-by`, `--notes`, `--liked`, `--concerns`, and `--requested-adjustments`.

### Prepare Phase 2 — preferred v0.10 mode

```powershell
node scripts/phase2/prepareCampaignConceptRoundTrip.js "exports/submissions/<slug>/phase-1/identity-selection-record.json"
```

### Prepare Phase 2 — legacy compatibility mode

```powershell
node scripts/phase2/prepareCampaignConceptRoundTrip.js "exports/submissions/<slug>/phase-1/round-trip/04_VALIDATED_IDENTITY_PITCHES.json" --direction primary
```

### Complete Phase 2

```powershell
node scripts/phase2/completeCampaignConceptRoundTrip.js "exports/submissions/<slug>/phase-2/primary/round-trip"
```

### Export Phase 2

```powershell
node scripts/phase2/exportCampaignConceptPdf.js "exports/submissions/<slug>/phase-2/primary/round-trip/04_VALIDATED_CAMPAIGN_CONCEPTS.json" --client "Client Name"
```

---

## Shared Utilities

The validated Identity Pitch file is intentionally narrow. Use the enriched handoff file for client selection and Phase 2 continuity.

Shared script plumbing belongs under `scripts/shared`, including:

- project-root paths;
- canonical submission/export paths;
- JSON and text I/O;
- CLI argument parsing;
- stable fingerprints;
- AI response extraction;
- round-trip artifact paths;
- submission processing;
- submission lifecycle status updates.

Do not reimplement these utilities inside individual commands.

---

## Status Updates

Production workflow commands should update `submission-status.json` through shared status utilities.

Status updates must:

- merge without erasing completed steps;
- record current stage;
- record next action;
- preserve artifact paths;
- append history entries;
- record failed validation states when a workflow cannot proceed.

---

## Diagnostics

Diagnostics are narrow developer tools, not production entry points.

## Documentation Scripts

`buildDevWiki.js` generates the static developer reader from Markdown.
