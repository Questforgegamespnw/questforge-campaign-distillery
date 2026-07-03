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
    client-delivery/

  phase-2/
    primary/
      round-trip/
      client-delivery/
```

### Phase 1 root contains

- `identity-selection-record.json`, the validated selected-identity artifact.

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
