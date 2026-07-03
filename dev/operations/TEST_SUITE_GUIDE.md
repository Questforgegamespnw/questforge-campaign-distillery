# Test Suite Guide

← [Back to Developer Documentation](../README.md)

## Layout

```text
scripts/tests/
  pipeline/
  phase1/
  phase2/
  exporters/
  testUtils.js
  runAllTests.js
```

## Core Test Run

```powershell
node scripts/tests/runAllTests.js
```

## Fixture-Backed Run

```powershell
node scripts/tests/runAllTests.js --include-fixtures
```

## Test Responsibilities

### Pipeline

Tests the public `runCampaignPipelineFromForm` entry point.

### Phase 1

Tests expansion contracts, prompt export, fingerprints, response envelopes, and JSON extraction.

### Phase 2

Tests input building, handoff source binding, prompt creation, schema validation, and response evaluation.

### Exporters

Tests normalization and HTML construction without requiring Chromium.

## Rules

- Tests must not become alternate production workflows.
- Tests should not write routine output into `misc`.
- Prefer assertions over human-inspection dumps.
- Use sanitized fixtures.
- Test public entry points when validating full-stage behavior.
- Test small modules directly when validating contracts and edge cases.

## Retired Behavior

The old three-response AI import test is retired. The combined Phase 1 round trip is the only supported operator workflow.
