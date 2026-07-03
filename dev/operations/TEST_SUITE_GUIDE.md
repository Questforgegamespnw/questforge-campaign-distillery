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

Tests the public `runCampaignPipelineFromForm` entry point, intake bridges, audience profile propagation, phrase boundaries, and submission workflow behavior.

### Phase 1

Tests expansion contracts, prompt export, fingerprints, response envelopes, JSON extraction, Identity Selection Record construction, and Identity Selection Record validation.

### Phase 2

Tests input building, handoff source binding, Identity Selection Record source handling, prompt creation, schema validation, and response evaluation.

### Exporters

Tests normalization and HTML construction without requiring Chromium.

## Current Routine Coverage

The v0.10 routine suite includes regression coverage for:

- shared script utilities;
- experience-profile bridge;
- intake group context;
- AI expansion;
- Identity Pitch round trip;
- Campaign Concept round trip;
- system lead normalization;
- client-facing phrase boundaries;
- Core Frame audience policy;
- youth voice layer;
- Identity Selection Record builder/validator;
- Identity Selection Record → Phase 2 bridge;
- submission lifecycle status synchronization.

## Rules

- Tests must not become alternate production workflows.
- Tests should not write routine output into `misc`.
- Prefer assertions over human-inspection dumps.
- Use sanitized fixtures.
- Test public entry points when validating full-stage behavior.
- Test small modules directly when validating contracts and edge cases.

## Retired Behavior

The old three-response AI import test is retired. The combined Phase 1 round trip is the only supported operator workflow.
