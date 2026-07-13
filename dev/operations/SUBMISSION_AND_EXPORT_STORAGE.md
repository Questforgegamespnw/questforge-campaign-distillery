# Submission and Export Storage

← [Back to Developer Documentation](../README.md)

## Purpose

The project separates authoritative records from regenerated artifacts.

---

## Authoritative Submission Records

```text
submissions/<submission-slug>/
  00_RAW_SUBMISSION.json
  01_NORMALIZED_SUBMISSION.json
  02_PIPELINE_RESULT.json
  submission-status.json
```

### Rules

- Preserve the raw submission unchanged.
- Treat normalized and pipeline records as deterministic outputs tied to that raw source.
- Treat `submission-status.json` as the shared lifecycle status contract.
- Do not store AI prompts, pasted responses, Identity Selection Records, or PDFs here.
- Use one stable slug through every phase.

---

## Generated Exports

```text
exports/submissions/<submission-slug>/
  phase-1/
    identity-selection-record.json
    round-trip/
      05_ENRICHED_IDENTITY_PITCHES.json
    client-delivery/

  phase-2/
    primary/
      round-trip/
      client-delivery/
```

### Phase 1 root contains

- `identity-selection-record.json`, the validated selected-identity artifact.

### Phase 1 round-trip contains

- `04_VALIDATED_IDENTITY_PITCHES.json`, the narrow validator-approved client prose artifact;
- `05_ENRICHED_IDENTITY_PITCHES.json`, the stitched Phase 1 handoff artifact that preserves deterministic metadata for selection and Phase 2.

### Round-trip folders contain

- editable handoff files;
- generated prompts;
- pasted AI responses;
- validation reports;
- validated JSON;
- status and summary files.

### Client-delivery folders contain

- HTML previews;
- PDFs;
- future client-facing worksheets.

---

## `submission-status.json`

The lifecycle status file tracks:

- deterministic processing;
- Phase 1 round-trip preparation;
- Phase 1 validation;
- Phase 1 PDF export;
- enriched Identity Pitch handoff creation;
- Identity Selection Record creation;
- Phase 2 handoff/preparation;
- Phase 2 validation;
- Phase 2 PDF export;
- current stage;
- next action;
- artifacts;
- history.

Commands should merge updates rather than replacing previously completed state.

---

## `misc`

`misc` is not a production-record system.

Use it only for:

- temporary investigation;
- legacy material awaiting migration;
- unclassified scratch files.

## Sanitized Examples

Public or portfolio-safe material belongs under:

```text
examples/
```

Tests should use:

```text
scripts/fixtures/
```


---

## Matchmaking Runtime Records

```text
matchmaking/
  profiles/<player-id>/
    compatibility-profile.json
    profile-status.json
  evaluations/
    pairs/
    groups/
  introductions/
  pool-index.json
```

### Rules

- Compatibility profiles are derived operational artifacts.
- Pair and group evaluations are regenerable but preserve model and profile-version provenance.
- Introduction records are durable audit records.
- Runtime matchmaking data may contain private information and should not be committed.
- Rebuild the pool index from authoritative stored profiles rather than hand-editing it.

## Matchmaking Demo Fixtures

```text
misc/matchmaking-demo/
  dataset.json
  profiles/
  scenarios/
  expected/
```

The demo dataset is intentionally preserved in `misc` because it is a development fixture package rather than a live production record.

Each profile file is wrapped with fixture metadata. The wrapper is not written into runtime profile storage.
