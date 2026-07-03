# Phase 1 Manual AI Round Trip

← [Back to Developer Documentation](../README.md)

## Purpose

The Phase 1 round trip polishes all three deterministic Identity Pitches in one controlled AI interaction.

It is manual only at the transport boundary:

```text
local prompt generation
→ copy prompt into ChatGPT
→ paste returned JSON locally
→ local validation
```

## Prepare

```powershell
node scripts/phase1/prepareIdentityPolishRoundTrip.js "submissions/<slug>/02_PIPELINE_RESULT.json"
```

## Workspace

```text
exports/submissions/<slug>/phase-1/round-trip/
  01_IDENTITY_POLISH_PROMPT.md
  02_PASTE_CHATGPT_RESPONSE_HERE.json
  03_VALIDATION_RESULT.json
  04_VALIDATED_IDENTITY_PITCHES.json
  05_VALIDATION_SUMMARY.txt
  round-trip-status.json
```

## Source Binding

The prompt contains:

- contract version;
- source filename;
- SHA-256 source fingerprint;
- all three direction payloads.

The completion command recomputes the fingerprint from the current source. A response produced from a different source is rejected before direction evaluation.

## Validation

Each direction is evaluated independently for:

- required keys;
- non-empty text;
- forbidden extra keys;
- fallback behavior;
- deterministic title preservation;
- source and contract metadata.

## Complete

```powershell
node scripts/phase1/completeIdentityPolishRoundTrip.js "exports/submissions/<slug>/phase-1/round-trip"
```

A complete run writes `04_VALIDATED_IDENTITY_PITCHES.json`.

## Scope

The AI may improve expression. It may not add:

- factions;
- named locations;
- a concrete crisis;
- a campaign engine;
- plot events;
- game mechanics;
- a different identity.
