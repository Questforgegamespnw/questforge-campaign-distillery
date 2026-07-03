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

### Export Phase 1

```powershell
node scripts/phase1/exportIdentityPitchPdf.js "exports/submissions/<slug>/phase-1/round-trip/04_VALIDATED_IDENTITY_PITCHES.json"
```

### Prepare Phase 2

```powershell
node scripts/phase2/prepareCampaignConceptRoundTrip.js "exports/submissions/<slug>/phase-1/round-trip/04_VALIDATED_IDENTITY_PITCHES.json" --direction primary
```

### Complete Phase 2

```powershell
node scripts/phase2/completeCampaignConceptRoundTrip.js "exports/submissions/<slug>/phase-2/primary/round-trip"
```

### Export Phase 2

```powershell
node scripts/phase2/exportCampaignConceptPdf.js "exports/submissions/<slug>/phase-2/primary/round-trip/04_VALIDATED_CAMPAIGN_CONCEPTS.json"
```

## Shared Utilities

Shared script plumbing belongs under `scripts/shared`, including:

- project-root paths;
- canonical submission/export paths;
- JSON and text I/O;
- CLI argument parsing;
- stable fingerprints;
- AI response extraction;
- round-trip artifact paths;
- submission processing.

Do not reimplement these utilities inside individual commands.

## Diagnostics

Diagnostics are narrow developer tools, not production entry points.

## Documentation Scripts

`buildDevWiki.js` generates the static developer reader from Markdown.
