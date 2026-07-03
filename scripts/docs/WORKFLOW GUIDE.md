# QuestForge Canonical Export Paths Update

This update moves production output defaults out of `misc` and into a submission-first structure:

```text
exports/
  submissions/
    <submission-slug>/
      phase-1/
        round-trip/
        client-delivery/
      phase-2/
        <primary|adjacent|wildcard>/
          round-trip/
          client-delivery/
```

## Replace or add these scripts

Add:

- `scripts/submissionPathUtils.js`

Replace with the versions in this package:

- `scripts/runSubmission.js`
- `scripts/runSubmissionBatch.js`
- `scripts/prepareIdentityPolishRoundTrip.js`
- `scripts/exportIdentityPitchPdf.js`
- `scripts/prepareCampaignConceptRoundTrip.js`
- `scripts/exportCampaignConceptPdf.js`

The package also includes unchanged companion scripts so the whole workflow can be copied together safely:

- `identityPolishRoundTripUtils.js`
- `completeIdentityPolishRoundTrip.js`
- `campaignConceptRoundTripUtils.js`
- `completeCampaignConceptRoundTrip.js`

## Canonical workflow

### 1. Process one raw submission

```powershell
node scripts/runSubmission.js "misc/submissions/submission-03-johannab253.json"
```

Creates:

```text
exports/submissions/submission-03-johannab253/phase-1/round-trip/
  00_SOURCE_SUBMISSION.json
  00_PIPELINE_RESULT.json
```

### 2. Prepare Phase 1 AI polish

```powershell
node scripts/prepareIdentityPolishRoundTrip.js "exports/submissions/submission-03-johannab253/phase-1/round-trip/00_PIPELINE_RESULT.json"
```

All Phase 1 prompt, response, validation, and status files remain in:

```text
exports/submissions/submission-03-johannab253/phase-1/round-trip/
```

### 3. Export the Phase 1 client PDF

```powershell
node scripts/exportIdentityPitchPdf.js "exports/submissions/submission-03-johannab253/phase-1/round-trip/04_VALIDATED_IDENTITY_PITCHES.json"
```

Creates:

```text
exports/submissions/submission-03-johannab253/phase-1/client-delivery/
  submission-03-johannab253_identity-pitches-preview.html
  submission-03-johannab253_identity-pitches.pdf
```

### 4. Prepare Phase 2

```powershell
node scripts/prepareCampaignConceptRoundTrip.js "exports/submissions/submission-03-johannab253/phase-1/round-trip/04_VALIDATED_IDENTITY_PITCHES.json" --direction primary
```

Creates:

```text
exports/submissions/submission-03-johannab253/phase-2/primary/round-trip/
```

### 5. Export the Phase 2 client PDF

```powershell
node scripts/exportCampaignConceptPdf.js "exports/submissions/submission-03-johannab253/phase-2/primary/round-trip/04_VALIDATED_CAMPAIGN_CONCEPTS.json"
```

Creates:

```text
exports/submissions/submission-03-johannab253/phase-2/primary/client-delivery/
  submission-03-johannab253_primary_campaign-concepts-preview.html
  submission-03-johannab253_primary_campaign-concepts.pdf
```

## Optional overrides

Preparation and submission scripts support:

```text
--submission-slug <slug>
--output-root <path>
```

Examples:

```powershell
node scripts/runSubmission.js input.json --submission-slug custom-client-project
```

```powershell
node scripts/prepareIdentityPolishRoundTrip.js input.json --output-root temp/test-exports
```

These are useful for unusual filenames, tests, and migration work.

## Existing files under misc

Old work under `misc/ai-round-trips` can remain as an archive. The updated scripts will place newly prepared work under `exports/submissions` by default.

To continue an old submission in the new structure, either:

1. copy its full folder manually into the corresponding canonical phase folder; or
2. rerun the preparation script against the old validated source file. The script will derive the submission slug from the path and create the new canonical workspace.

## Design decisions

- Submission slug is established once and reused throughout both phases.
- Internal round-trip files and client-delivery files are separated.
- PDF exporters write to the sibling `client-delivery` folder when their input comes from a `round-trip` folder.
- Phase 2 remains direction-specific to support primary, adjacent, and wildcard development without collisions.
- `misc` is no longer the default location for real client work.
