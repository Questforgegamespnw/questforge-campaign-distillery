# QuestForge Campaign Distillery

## What This Is

The QuestForge Campaign Distillery turns rough campaign ideas and client intake into a disciplined, repeatable campaign-development workflow for tabletop RPG services.

The implemented workflow has two phases:

1. **Phase 1 — Identity Discovery**
   - produces three broad **Identity Pitches**: Primary, Adjacent, and Wildcard;
   - identifies the campaign's thematic promise, emotional direction, style of play, genre/tone/environment signals, and audience constraints;
   - remains intentionally broad, system-agnostic, and setting-agnostic.

2. **Phase 2 — Campaign Concept Development**
   - begins after the client selects one Identity Pitch;
   - turns the approved identity into concrete playable Campaign Concepts;
   - adds starting situation, central conflict, factions or forces, recurring campaign engine, escalation, meaningful choices, and a hook.

The guiding principle is:

> **Phase 1 discovers what the campaign wants to be.**  
> **Phase 2 decides what is actually happening and what the players can change.**

The goal is not one-off AI text. The goal is a consistent, testable, safety-aware workflow that can support professional campaign development at scale.

---

## Why Not Just Use GPT?

Raw prompting can produce a useful pitch, but it is inconsistent, difficult to repeat, and prone to drifting away from safety, tone, or client constraints.

The Distillery interprets first, then generates within defined boundaries. It handles:

- messy intake normalization;
- deterministic signal selection;
- audience and safety enforcement;
- repeatable Primary / Adjacent / Wildcard direction construction;
- source-bound AI collaboration;
- validation;
- client-delivery exports;
- durable lifecycle tracking.

GPT improvises. The Distillery creates a controlled process that can be reviewed, tested, tuned, and repeated.

---

## Current Runtime: v0.12.0

Matchmaking and Controlled Introduction Pipeline

### Added
- Added an optional matchmaking branch for individuals and partial groups seeking a table.
- Added compatibility-profile derivation with consent, lifecycle, completeness, provenance, and privacy boundaries.
- Added pairwise eligibility gates and weighted compatibility scoring.
- Added separate compatibility and confidence ratings.
- Added active-pool storage, comparison, ranking, persistence, and stale-result detection.
- Added group construction with weakest-pair protection, whole-group schedule checks, score spread, cohesion, and group-size validation.
- Added a dedicated Matchmaking mode to the Electron Operator Console.
- Added a wrapped demo dataset under `misc/matchmaking-demo/`.
- Added controlled introduction records with operator approval, participant consent, contact-release gating, completion, decline, archive, and audit history.

### Changed
- The canonical intake may now carry an optional `matchmaking` branch without changing the normal campaign-development path.
- The Operator Console is now a multi-mode application:
  - Campaign Operations;
  - Matchmaking.
- Matchmaking remains a separate domain branch from Identity Pitch and Campaign Concept generation.
- Runtime matchmaking records are stored separately from source code and preserved demo fixtures.

### Safety and Privacy
- Matchmaking consent is explicit and revocable.
- Operator-private fields remain separate from sanitized shareable summaries.
- Compatibility score and confidence are treated as separate signals.
- Hard blockers are evaluated before numerical scoring.
- Contact information is not released until operator approval, current consent checks, and participant approval all succeed.
- Human approval remains required for every introduction.

### Notes
- The matchmaking engine recommends and explains; it does not autonomously place people into groups.
- Low-confidence matches are held for reconfirmation even when compatibility is otherwise strong.
- Group recommendations account for the weakest pair and shared logistics rather than relying on a simple average.

---

## Human-in-the-Loop AI Model

AI transport is manual by design. The local system builds prompts, response skeletons, fingerprints, validation reports, and export files. The operator copies prompts into ChatGPT and pastes the returned JSON into the local workspace.

### Phase 1 AI Role

AI may polish readability, cadence, and client-facing presentation. It must preserve the selected deterministic identity and must not invent a concrete setting crisis, factions, plot structure, mechanics, or campaign engine.

### Phase 2 AI Role

AI may invent bounded fiction such as locations, factions, starting crises, threats, pressures, and recurring campaign structures. It must preserve the approved Identity Selection Record and may not impose fixed endings, mandatory protagonist history, railroaded quest chains, or contradictory genre/tone/safety choices.

---

## Quick Start

### 1. Process a raw submission

```powershell
node scripts/workflows/runSubmission.js "path/to/submission.json"
```

### 2. Prepare Phase 1 Identity Pitch polish

```powershell
node scripts/phase1/prepareIdentityPolishRoundTrip.js "submissions/<submission-slug>/02_PIPELINE_RESULT.json"
```

### 3. Complete Phase 1 after pasting the ChatGPT response

```powershell
node scripts/phase1/completeIdentityPolishRoundTrip.js "exports/submissions/<submission-slug>/phase-1/round-trip"
```

### 4. Build the enriched Phase 1 handoff

```powershell
node scripts/phase1/buildIdentityPitchHandoff.js "exports/submissions/<submission-slug>/phase-1/round-trip/04_VALIDATED_IDENTITY_PITCHES.json"
```

This creates:

```text
exports/submissions/<submission-slug>/phase-1/round-trip/05_ENRICHED_IDENTITY_PITCHES.json
```

The validated Identity Pitch file remains intentionally narrow. The enriched handoff stitches the validated prose back to the deterministic metadata needed downstream.

### 5. Export the Phase 1 client packet

```powershell
node scripts/phase1/exportIdentityPitchPdf.js "exports/submissions/<submission-slug>/phase-1/round-trip/04_VALIDATED_IDENTITY_PITCHES.json" --client "Client Name"
```

### 6. Record the client's selected identity

```powershell
node scripts/phase1/createIdentitySelectionRecord.js "exports/submissions/<submission-slug>/phase-1/round-trip/05_ENRICHED_IDENTITY_PITCHES.json" --direction primary
```

This creates:

```text
exports/submissions/<submission-slug>/phase-1/identity-selection-record.json
```

### 7. Prepare Phase 2 from the Identity Selection Record

```powershell
node scripts/phase2/prepareCampaignConceptRoundTrip.js "exports/submissions/<submission-slug>/phase-1/identity-selection-record.json"
```

### 8. Complete Phase 2 after pasting the ChatGPT response

```powershell
node scripts/phase2/completeCampaignConceptRoundTrip.js "exports/submissions/<submission-slug>/phase-2/primary/round-trip"
```

### 9. Export the Phase 2 client packet

```powershell
node scripts/phase2/exportCampaignConceptPdf.js "exports/submissions/<submission-slug>/phase-2/primary/round-trip/04_VALIDATED_CAMPAIGN_CONCEPTS.json" --client "Client Name"
```

### 10. Run matchmaking smoke tests

```powershell
node scripts/tests/matchmaking/compatibility-profile.smoke.test.js
node scripts/tests/matchmaking/pair-compatibility.smoke.test.js
node scripts/tests/matchmaking/matchmaking-pool.smoke.test.js
node scripts/tests/matchmaking/group-compatibility.smoke.test.js
node scripts/tests/matchmaking/introduction-workflow.smoke.test.js
```

### 11. Start the Operator Console

```powershell
cd operator-console
npm.cmd install
npm.cmd run dev
```

Use the Electron window, then switch between **Campaign Operations** and **Matchmaking**.

---

## Pipeline Overview

```text
Raw Form Submission
→ Raw Submission Capture
→ Intake Normalization
→ Deterministic Phase 1 Pipeline
→ Three Identity Directions
→ Phase 1 AI Polish Round Trip
→ Validated Identity Pitches
→ Enriched Identity Pitch Handoff
→ Phase 1 Client Delivery
→ Identity Selection Record
→ Phase 2 Handoff / Prompt
→ Phase 2 AI Campaign Concept Round Trip
→ Validated Campaign Concepts
→ Phase 2 Client Delivery
```

The enriched Identity Pitch handoff preserves deterministic metadata after validation. The **Identity Selection Record** is the authoritative client-selection bridge between Phase 1 and Phase 2.

Matchmaking is a parallel branch from canonical intake:

```text
Canonical Intake
├─ Campaign Development
│  ├─ Phase 1 Identity Pitches
│  └─ Phase 2 Campaign Concepts
└─ Matchmaking
   ├─ Compatibility Profile
   ├─ Pair Eligibility and Scoring
   ├─ Active Pool Comparison
   ├─ Group Analysis
   ├─ Operator Review
   └─ Controlled Introduction
```

The campaign translator may inform matchmaking preferences, but it is not the matcher and does not determine placement.

---

## Project Structure

```text
/submissions
  authoritative raw, normalized, deterministic, and lifecycle records

/exports
  production round trips, validation reports, previews, PDFs, and client-specific artifacts

/scripts
  /diagnostics
  /docs
  /fixtures
  /phase1
  /phase2
  /shared
  /tests
  /workflows

/src
  /ai
    /phase2
  /builders
  /config
  /data
  /exporters
    /shared
    /phase1
    /phase2
  /intake
  /matchmaking
    /data
    /groups
    /handoffs
    /pairs
    /pool
    /profiles
    /scorers
    /storage
  /parsers
  /renderers
  /resolvers
  /selectors
  /utils
  /validators
  /voice

/templates
  identity-pitch-pdf.css
  campaign-concept-pdf.css

/operator-console
  private Electron cockpit for campaign operations and matchmaking review

/misc/matchmaking-demo
  preserved wrapped demo fixtures and expected scenarios

/matchmaking
  generated runtime matchmaking profiles, evaluations, indexes, and introductions

/dev
  developer documentation and generated wiki source Markdown
```

---

## Storage Model

Authoritative intake and deterministic records live under:

```text
submissions/<submission-slug>/
  00_RAW_SUBMISSION.json
  01_NORMALIZED_SUBMISSION.json
  02_PIPELINE_RESULT.json
  submission-status.json
```

Generated artifacts and client-facing files live under:

```text
exports/submissions/<submission-slug>/
  phase-1/
    identity-selection-record.json
    round-trip/
      05_ENRICHED_IDENTITY_PITCHES.json
    client-delivery/

  phase-2/
    <selected-direction>/
      round-trip/
      client-delivery/
```


### Matchmaking runtime storage

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

These are operational records and may contain private applicant information. They are not source code or public fixtures.

Preserved demo fixtures live separately:

```text
misc/matchmaking-demo/
  dataset.json
  profiles/
  scenarios/
  expected/
```

The demo files use wrappers. Only the validated `profile` payload is copied into runtime storage.


---

## Status Tracking

`submission-status.json` is now the shared lifecycle status contract. Production workflow commands update it without erasing completed steps.

It tracks:

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
- artifact paths;
- append-only history.

---

## Design Principles

- Signal over noise — minimal, meaningful tagging.
- Deterministic before generative — decide what the campaign means before AI invents fiction.
- Source-bound AI — responses must match the exact package that generated the prompt.
- Human review between phases — Phase 2 starts only after one Phase 1 identity is selected.
- One responsibility per layer — mapping, selection, rendering, validation, export, and operations stay separate.
- Audience-aware output — `standard`, `youth`, and `kids` profiles are handled deliberately.

---

## Known Gaps

- Structured system recommendation is not yet implemented.
- Final selected-concept refinement/finalization is not yet implemented.
- Email templates exist, but email delivery is not automated.
- Formspree or other form-provider execution is not connected.
- Real contact resolution still uses opaque `contactRef` values rather than a dedicated contact directory.
- Matchmaking automation intentionally stops at operator-controlled review and introduction.

---

## Next Focus

1. Stabilize and tag v0.12.0.
2. Run the full project and Electron build validation.
3. Add a structured system-recommendation stage.
4. Add selected-concept finalization.
5. Continue expanding sanitized fixtures and operational documentation.

---

## Author

**QuestForge Games PNW**  
Professional GM Services

The Campaign Distillery is part of an ongoing effort to build scalable, high-quality tabletop RPG experiences with a focus on consistency, immersion, and player agency.

For more information or services:  
https://www.questforgegamespnw.com/

---

## License

This project is not currently released under a formal open-source license.

It is shared for demonstration and portfolio purposes only.

All rights reserved.  
For usage, adaptation, or collaboration inquiries, please contact the author.
