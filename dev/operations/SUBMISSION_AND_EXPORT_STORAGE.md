# Submission and Export Storage

← [Back to Developer Documentation](../README.md)

## Purpose

The project separates authoritative records from regenerated artifacts.

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
- Do not store AI prompts, pasted responses, or PDFs here.
- Use one stable slug through every phase.

## Generated Exports

```text
exports/submissions/<submission-slug>/
  phase-1/
    round-trip/
    client-delivery/

  phase-2/
    primary/
      round-trip/
      client-delivery/
```

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
