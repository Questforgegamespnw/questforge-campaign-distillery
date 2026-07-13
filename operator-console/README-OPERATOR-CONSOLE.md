# QuestForge Operator Console v0.2

Private local Electron cockpit for QuestForge Campaign Distillery.

The console remains a thin operator layer. Campaign actions continue to call the existing Distillery workflow, while Matchmaking views call the root matchmaking modules through narrow Electron IPC handlers. The console does not duplicate campaign or matching logic.

## Application modes

```text
Campaign Operations
Matchmaking
```

### Campaign Operations

Supports the existing two-phase production workflow:

- staged submission creation;
- deterministic processing;
- Phase 1 prompt preparation and response completion;
- enriched Identity Pitch handoff creation;
- Identity Selection Record creation;
- Phase 1 and Phase 2 PDF export;
- status and validation review;
- legacy submission migration support.

### Matchmaking

Supports:

- pool overview;
- active, paused, and invalid profile review;
- operator-only profile details;
- pair evaluation review;
- manual group building;
- grouped blockers and Session Zero topics;
- demo dataset loading and selective cleanup;
- controlled introduction records;
- operator approval;
- participant-by-participant consent;
- contact-reference release;
- completion, decline, archive, and audit review.

## Required repo placement

```text
questforge-campaign-distillery/
  src/
  scripts/
  submissions/
  exports/
  templates/
  matchmaking/
  misc/
    matchmaking-demo/
  operator-console/
```

The default project root is the parent of `operator-console/`.

## Install and run

From `operator-console/`:

```powershell
npm.cmd install
npm.cmd run dev
```

Use the Electron desktop window. The Vite browser tab does not have access to `window.questforge`.

Build validation:

```powershell
npm.cmd run build
```

## Architecture

```text
operator-console/
  electron/
    main.js
    preload.js
    ipc/
      matchmakingHandlers.js
  src/
    App.jsx
    campaign/
    matchmaking/
    shared/
    styles/
```

### Boundary rules

- `src/` at repository root contains the production pipeline and matchmaking engine.
- `operator-console/src/` contains Electron renderer code only.
- `operator-console/electron/` owns the desktop process and IPC boundary.
- `templates/*.css` styles generated campaign PDFs.
- `operator-console/src/styles/` styles the console interface.
- Runtime matchmaking records live under root `matchmaking/`.
- Preserved demo fixtures live under `misc/matchmaking-demo/`.

## Matchmaking storage

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

The console resolves the root project and calls the shared modules directly.

## Demo dataset

Preserved fixtures:

```text
misc/matchmaking-demo/
  dataset.json
  profiles/
  scenarios/
  expected/
```

Each profile fixture is wrapped:

```json
{
  "fixture": {
    "isDemo": true,
    "datasetId": "questforge-matchmaking-demo-v1"
  },
  "profile": {
    "...": "validated compatibility profile"
  }
}
```

**Load Demo Dataset** validates and copies only the `profile` payload into runtime storage, rebuilds the pool, generates pair evaluations, and creates the weak-link group example.

**Clear Demo Data** removes only records associated with player IDs in that preserved demo set. It does not wipe unrelated runtime matchmaking data.

## Matchmaking interpretation

The console presents three distinct judgments:

- **Eligibility** — whether hard blockers permit consideration.
- **Compatibility** — how well preferences align.
- **Confidence** — how complete and current the underlying information is.

A high compatibility score with low confidence should trigger reconfirmation, not immediate introduction.

For groups, the console also surfaces:

- weakest pair;
- pair average;
- score spread;
- shared logistics;
- group-level blockers;
- pair-level blockers;
- likely Session Zero topics.

## Introduction workflow

```text
draft
→ awaiting_operator_approval
→ awaiting_participant_consent
→ approved
→ contact_released
→ introduced
→ archived
```

A decline moves the record to:

```text
declined
→ archived
```

### Guardrails

- Drafts contain sanitized previews only.
- Operator approval is explicit.
- Participant responses are tracked individually.
- Current profile version and consent are rechecked before release.
- Contact references remain hidden until all required approvals succeed.
- Profiles become `matched` only after completion.
- Every transition is recorded in audit history.

The current system uses opaque `contactRef` values. A later contact-directory resolver can map those references to real contact details without changing the introduction lifecycle.

## Campaign workflow note

The console still uses the established root scripts:

```text
scripts/workflows/runSubmission.js
scripts/phase1/prepareIdentityPolishRoundTrip.js
scripts/phase1/completeIdentityPolishRoundTrip.js
scripts/phase1/buildIdentityPitchHandoff.js
scripts/phase1/createIdentitySelectionRecord.js
scripts/phase1/exportIdentityPitchPdf.js
scripts/phase2/prepareCampaignConceptRoundTrip.js
scripts/phase2/completeCampaignConceptRoundTrip.js
scripts/phase2/exportCampaignConceptPdf.js
```

The console remains an operator surface, not a second campaign pipeline.

## Privacy doctrine

- Operator-private fields stay inside profile review.
- Match summaries use sanitized explanations.
- Contact references are not displayed in pair or group previews.
- Introduction release requires current consent.
- Demo data must remain clearly marked and separable.
- Runtime applicant data should not be committed to public source control.

## Troubleshooting

### Browser tab shows bridge warning
Use the Electron desktop window rather than the Vite browser tab.

### `node` or script action fails
Launch the console from a terminal where `node --version` succeeds.

### Matchmaking views are empty
Load the demo dataset or create runtime compatibility profiles, then rebuild the pool index.

### A match looks strong but cannot proceed
Review confidence, missing fields, consent, profile version, and introduction readiness blockers.

### A group average looks high but classification is cautious
Review the weakest pair and score spread. Group classification intentionally prevents a weak relationship from being hidden by a strong average.

## Current status

v0.2 is functional for private local operator use across both campaign production and matchmaking review. The remaining work is ordinary hardening and polish rather than missing core workflow.
