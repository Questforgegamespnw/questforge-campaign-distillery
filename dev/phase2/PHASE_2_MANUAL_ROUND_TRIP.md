# Phase 2 Manual AI Round Trip

← [Back to Developer Documentation](../README.md)

## Purpose

The Phase 2 round trip converts one validated Identity Pitch into one or three source-bound Campaign Concepts.

## Prepare

```powershell
node scripts/phase2/prepareCampaignConceptRoundTrip.js "exports/submissions/<slug>/phase-1/round-trip/04_VALIDATED_IDENTITY_PITCHES.json" --direction primary
```

## First Run Behavior

The preparation command creates:

```text
00_PHASE2_HANDOFF.json
```

Review and update that handoff before generation when client feedback, system preferences, setting decisions, or safety constraints are available.

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

## Source Checks

The workflow verifies:

- the selected direction still exists;
- the handoff still contains the exact validated Identity Pitch;
- the normalized Phase 2 input is valid;
- the input fingerprint still matches the prompt source.

Changing the handoff after prompt generation requires preparing the prompt again.

## Complete

```powershell
node scripts/phase2/completeCampaignConceptRoundTrip.js "exports/submissions/<slug>/phase-2/primary/round-trip"
```

A successful run writes:

```text
04_VALIDATED_CAMPAIGN_CONCEPTS.json
```

## Validation Layers

- source fingerprint;
- handoff identity binding;
- input contract;
- JSON parsing;
- output schema;
- identity alignment;
- invention boundaries;
- playability;
- agency;
- variant differentiation.
