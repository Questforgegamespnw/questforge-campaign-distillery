# Phase 2 Manual AI Round Trip

← [Back to Developer Documentation](../README.md)

## Purpose

The Phase 2 round trip converts one validated Identity Selection Record into one or three source-bound Campaign Concepts.

The preferred v0.10 source is:

```text
exports/submissions/<slug>/phase-1/identity-selection-record.json
```

Legacy compatibility mode still supports validated Identity Pitches plus `--direction`.

---

## Prepare — preferred mode

```powershell
node scripts/phase2/prepareCampaignConceptRoundTrip.js "exports/submissions/<slug>/phase-1/identity-selection-record.json"
```

## Prepare — legacy mode

```powershell
node scripts/phase2/prepareCampaignConceptRoundTrip.js "exports/submissions/<slug>/phase-1/round-trip/04_VALIDATED_IDENTITY_PITCHES.json" --direction primary
```

---

## First Run Behavior

The preparation command creates:

```text
00_PHASE2_HANDOFF.json
```

When the source is an Identity Selection Record, client selection details and preservation guidance are imported automatically.

Review and update the handoff before generation when system preferences, setting decisions, operator notes, or additional safety constraints are available.

---

## Workspace

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

---

## Source Checks

The workflow verifies:

- the Identity Selection Record is valid, when used;
- the selected direction still exists;
- the handoff still contains the exact selected Identity Pitch;
- the normalized Phase 2 input is valid;
- the input fingerprint still matches the prompt source.

Changing the handoff after prompt generation requires preparing the prompt again.

---

## Complete

```powershell
node scripts/phase2/completeCampaignConceptRoundTrip.js "exports/submissions/<slug>/phase-2/primary/round-trip"
```

A successful run writes:

```text
04_VALIDATED_CAMPAIGN_CONCEPTS.json
```

---

## Validation Layers

- source fingerprint;
- Identity Selection Record validation, when used;
- handoff identity binding;
- input contract;
- JSON parsing;
- output schema;
- identity alignment;
- invention boundaries;
- playability;
- agency;
- variant differentiation.

---

## Status

Prepare and complete commands update `submission-status.json` with current stage, next action, validation outcome, source type, and artifact paths.
