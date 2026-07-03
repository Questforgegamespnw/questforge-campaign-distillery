# QuestForge Campaign Distillery

## What This Is (Non-Technical)

The QuestForge Campaign Distillery turns rough campaign ideas and client intake into a disciplined, repeatable campaign-development process.

Its current implemented output is a set of three **Phase 1 Identity Pitches**:

- **Primary** — the strongest overall interpretation of the group’s preferences;
- **Adjacent** — a closely related direction with a shifted emphasis;
- **Wildcard** — a credible but more adventurous interpretation.

These pitches identify what the campaign is fundamentally about, what kind of play it emphasizes, and what emotional or thematic promise best fits the group. They are intentionally broad, generally system-agnostic, and setting-agnostic.

They are not yet complete campaign concepts. After the client selects an Identity Pitch, **Phase 2 Campaign Concept Development** turns that direction into a concrete, playable premise with a starting situation, central conflict, factions or forces in tension, recurring campaign engine, escalation, meaningful choices, and a clear hook.

The guiding principle is:

> **Phase 1 discovers what the campaign wants to be.**  
> **Phase 2 decides what is actually happening and what the players can change.**

The goal is not to produce one-off AI text. It is to create a consistent, testable, safety-aware workflow that can support professional campaign development at scale.

## Why Not Just Use GPT?

You can absolutely paste notes into GPT and get a campaign pitch. 
**But that approach is:**
  - inconsistent
  - hard to control
  - difficult to repeat at scale
  - prone to ignoring tone, safety, or audience constraints
  
The Distillery is built to understand the intake first, make disciplined decisions about it, and only then produce a controlled campaign direction. 
This disciplined process is what makes the output more consistent, safer, easier to tune, and more scalable for a professional GM service.

In other words, GPT alone gives you a response. The Distillery provides a consistent, dependable, and repeatable process that can be tested and refined across many submissions. 

### The Campaign Distillery is designed to do the parts that raw prompting handles unreliably:
  - normalize messy client input into structured intent
  - apply deterministic selection logic instead of freeform guesswork
  - enforce audience and safety constraints consistently
  - preserve ambiguity instead of inventing false certainty
  - generate repeatable outputs that can be tested, tuned, and improved over time

### That process matters when you want:
  - reliable client-facing quality
  - scalable onboarding
  - safety-aware outputs
  - consistency across many submissions
  - a refinable system over time without starting over

In short, GPT improvises. This system interprets first, then generates within defined boundaries.

---

---

## 🧠 How This Fits With AI

This system is not meant to replace AI writing—it is meant to constrain and improve it.

The Distillery handles:

- intake normalization;
- structured interpretation;
- direction selection;
- tone and audience consistency;
- safety constraints;
- deterministic narrative scaffolding;
- validation and audit data.

AI handles:

- expression;
- flow;
- stylistic polish;
- narrative richness;
- bounded invention during later campaign-concept development.

The AI role changes by phase:

### Phase 1 — Identity Pitch Polish

AI may improve readability, cadence, and presentation while preserving the selected identity. It should not invent a setting crisis, factions, plot structure, or mechanics.

### Phase 2 — Campaign Concept Development

AI may invent bounded fiction such as locations, factions, a starting crisis, threats, campaign pressures, and recurring structures. It must preserve the approved identity and may not impose a fixed ending, mandatory protagonist history, railroaded quest chain, or contradictory genre and tone.

This separation creates more consistent outputs, clearer human review points, and stronger control over what the AI is permitted to add.

## Example Outputs

These examples reflect the stabilized renderer and phrase-aware assembly system through v0.8.2. They demonstrate **Phase 1 Identity Pitch language**: broad campaign direction, thematic promise, and table experience rather than a fully specified campaign premise.

---

### Mystery / Investigation (Urban Gothic, Psychological)

**Input Focus**
- Hidden truth + investigator burden  
- Clue web + hidden information  
- Dense urban environment  
- Psychological tone  

**Output**
Something is already starting to slip out of place.

The city is dense with overlapping lives, quiet tensions, and things that don’t quite add up. Beneath the surface, something important has been covered over—and the more closely you look, the harder it is to ignore.

At the table, play revolves around following scattered clues and slowly piecing together the bigger picture. Information is incomplete, sometimes misleading, and often raises more questions than it answers.

The deeper you dig, the harder it becomes to walk away from what you’ve uncovered.

The real question is: what happens when you finally understand what the city has been hiding—and it refuses to stay buried?

---

### Survival Frontier (Grimdark Western, High Pressure)

**Input Focus**
- Survival against overwhelming force + endless pressure  
- Resource scarcity + attrition combat  
- Harsh frontier / wasteland  
- Grimdark tone  

**Output**
At its best, this feels like a grimdark western frontier campaign that keeps circling back to surviving a world far harsher and stronger than the characters are.

The world doesn’t bend to you. Every step forward costs something, and even small victories feel temporary against the weight of everything pushing back.

At the table, play revolves around making hard calls when time, safety, and supplies are always running short. Every decision trades one problem for another—and sometimes you don’t get a good option at all.

The pressure never fully lets up. Survival isn’t about winning—it’s about lasting long enough to matter.

The real question is: how much can you lose before you stop being able to keep going?

---

### Cosmic Discovery (Eldritch, Psychological)

**Input Focus**
- Lost knowledge + hidden truth  
- Exploration + clue web  
- Abstract / underground environments  
- Psychological tone  

**Output**
The first signs are easy to dismiss—until they stop being dismissible.

The world doesn’t behave the way it should. Spaces shift, logic bends, and places seem to exist more as ideas than locations. Somewhere inside it, something important has been rearranged rather than removed.

At the table, play moves through exploration and interpretation—figuring out what places mean as much as what they are. Clues don’t just point forward; they reshape how everything behind you is understood.

The deeper you go, the harder it becomes to separate the world from what it’s doing to you.

What matters is not just what you discover—but who you are by the time it finally makes sense.

---

## Quick Start

- Process a raw submission:

```powershell
node scripts/workflows/runSubmission.js "path/to/submission.json"
```

- Prepare the Phase 1 manual AI round trip:

node scripts/phase1/prepareIdentityPolishRoundTrip.js "submissions/<submission-slug>/02_PIPELINE_RESULT.json"

- After pasting the generated prompt into ChatGPT and saving the returned JSON:

node scripts/phase1/completeIdentityPolishRoundTrip.js "exports/submissions/<submission-slug>/phase-1/round-trip"

- Create the Phase 1 client packet:

node scripts/phase1/exportIdentityPitchPdf.js "exports/submissions/<submission-slug>/phase-1/round-trip/04_VALIDATED_IDENTITY_PITCHES.json"


---

## ⚙️ Technical Overview (For Developers)

The sections below describe the high-level system architecture and pipeline behavior.

If you are looking for internal implementation details, see the developer documentation in `/dev`.

---

## System Overview

The Campaign Distillery is a structured pipeline that transforms raw tabletop RPG client intake into controlled campaign-development outputs.

The current implemented pipeline produces three **Phase 1 Identity Pitches**. Each direction is assembled from structured campaign frames, intake signals, audience constraints, and safety guidance.

Phase 1 is designed to:

- extract intent from messy human input;
- normalize that input into a controlled schema;
- infer audience, safety, and experience constraints;
- translate preferences into weighted signals;
- select three distinct but credible identity directions;
- resolve those directions into canonical frame data;
- render stable, human-readable Identity Pitch sections;
- provide normalized client output and richer audit output;
- support AI polish without allowing new campaign facts to drift into the result.

The planned Phase 2 pipeline begins only after the client selects an Identity Pitch. It will add the concrete campaign situation, central conflict, factions or forces, starting position, recurring campaign engine, escalation, distinctive elements, and meaningful player choices.

The Distillery therefore separates two different creative decisions:

```text
Identity discovery → concrete campaign development
```

This prevents the system from inventing setting facts before the client has approved the campaign’s fundamental direction.

## Renderer Architecture (v0.8.2)

The rendering layer has been refactored into a modular pipeline to separate responsibilities and improve maintainability without altering output behavior.

The renderer now operates as a composed system of focused modules:

- **pitchCore** → extracts and normalizes context from selections  
- **pitchSectionBuilders** → constructs narrative sections (Title, About, Players Do, Hook)  
- **pitchAssembly** → composes sentences into a cohesive pitch  
- **pitchCleanup** → shared normalization and formatting utilities  
- **pitchSafetyFilters** → applies tone constraints and audience safety rules  
- **generateCampaignPitch** → orchestrates the full pipeline  

This replaces the previous monolithic renderer and enables safer iteration, clearer debugging, and controlled language tuning.

As of v0.8.2, `pitchAssembly` also classifies campaign identity, activity/process, abstract pressure/theme, and proposition/clause phrases before selecting sentence shapes. This keeps campaign identity in the lead, routes system behavior into support sentences, and limits cleanup to punctuation, duplication, and other surface corrections.

### Runtime Naming Note

Some current source files and exported functions still use earlier names such as `generateCampaignPitch`, `clientPitch`, and `auditPitch`. During v0.9.x documentation work, these identifiers remain unchanged to avoid unnecessary code churn.

Conceptually, their current outputs should be understood as:

- `generateCampaignPitch` → deterministic Phase 1 Identity Pitch rendering;
- `clientPitch` → client-facing Identity Pitch sections;
- `auditPitch` → internal Identity Pitch reasoning and safety data.

Runtime naming can be migrated later as a controlled refactor.

---

## Pipeline Overview

### Implemented Phase 1 Flow

```text
Raw Form Submission
→ Form Mapping
→ Intake Normalization
→ Canonical Intake
→ Canonical Validation
→ Translator Input
→ Signal Translation
→ Adjudication and Safety Inference
→ Identity Direction Selection
→ Frame Resolution
→ Deterministic Identity Pitch Rendering
→ AI Identity Pitch Polish
→ Validation
→ Client Identity Pitch Delivery
→ Client Direction Selection
```

### Planned Phase 2 Flow

```text
Selected Identity Pitch
+ Identity Selection Record
+ Canonical Intake
→ Campaign Concept Expansion
→ Concept Validation
→ System Recommendation
→ Client PDF Export
→ Campaign Concept Delivery
```

The client’s structured selection record forms the authoritative boundary between the two phases. Phase 2 should not rely on informal email summaries as its primary input.

## Project Structure

The project is organized by pipeline responsibility to maintain clear separation between stages.

```text
/submissions
  authoritative raw, normalized, and deterministic submission records

/exports
  production round trips, validation results, previews, and client PDFs

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
    existing Phase 1 AI modules
    /phase2
  /exporters
    /shared
    /phase1
    /phase2
  /config
  /data
  /intake
  /parsers
  /renderers
  /resolvers
  /selectors
  /utils
  /voice

/templates
  identity-pitch-pdf.css
  campaign-concept-pdf.css

/examples
  sanitized example inputs and generated deliverables

/misc
  temporary, legacy, or unclassified development material
  ```

For detailed file-level documentation, see:

/dev/README.md

  ---

## Current State

### Current Runtime: v0.9.1 — Two-Phase Client Delivery Workflow

- Phase 1 deterministic Identity Pitch generation is stable.
- Combined manual AI polish is operational.
- Source-bound Identity Pitch validation is operational.
- Phase 1 HTML and PDF client delivery is operational.
- Phase 2 Campaign Concept generation contracts are implemented.
- Phase 2 manual AI round trip is operational.
- Phase 2 structural and semantic validation is operational.
- Phase 2 HTML and PDF client delivery is operational.
- Submission and export storage are separated.
- Scripts, tests, shared utilities, and exporters are modularized.


## Design Principles

- Signal over noise — minimal, meaningful tagging  
- Deterministic processing — no hidden assumptions  
- Separation of concerns — each layer has a single role  
- Composable output — all results built from structured data  
- Explicit ambiguity handling — uncertainty is preserved, not guessed  

---

## Known Gaps

- The Identity Selection Record is not yet implemented as a formal validated runtime schema.
- Client feedback must still be entered manually into the Phase 2 handoff.
- The system-recommendation stage is not yet implemented.
- The final selected Campaign Concept does not yet have a dedicated refinement/finalization stage.
- Submission lifecycle status is not yet automatically updated by every workflow command.
- Email templates exist, but email delivery is not automated.
- Formspree or other form-provider execution is not connected.
- Real client records still require a completed migration from legacy `misc` folders.
- Matchmaking and compatibility scoring for individual players remains a future pathway.
- 
--- 

## Next Focus

1. Formalize and validate the Identity Selection Record.
2. Build the system-recommendation stage.
3. Add selected-concept refinement and final campaign-foundation output.
4. Add submission lifecycle/status orchestration.
5. Complete legacy data and fixture migration.
6. Build an operator-facing workflow guide.
7. Design the individual-player matchmaking compatibility pathway.

### Human Selection Handoff

- Create a structured Identity Selection Record.
- Preserve liked elements, exclusions, requested changes, system decisions, and setting decisions.
- Make this record the authoritative Phase 2 input.

### System Recommendation

- Recommend one familiar system and one or two mechanically distinct alternatives.
- Consider group experience, complexity tolerance, tactical versus narrative preference, campaign length, age profile, and required mechanics.
- Explain implementation notes and tradeoffs.

### Client Delivery

- Export normalized Identity Pitch data into a polished combined PDF.
- Support optional individual Primary, Adjacent, and Wildcard PDFs.
- Reuse the export architecture later for Phase 2 Campaign Concept Pitches.
- Create professional email templates for intake receipt, Identity Pitch delivery, and Campaign Concept delivery.

### Integration

- Connect form intake to the production pipeline.
- Record client selections in a structured handoff.
- Integrate Phase 2 generation, recommendation, validation, PDF export, and delivery.

## Next Priorities

For a full list of milestones and fixes:
https://github.com/Questforgegamespnw/questforge-campaign-distillery/issues

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

It is shared for **demonstration and portfolio purposes only**.

All rights reserved.  
For usage, adaptation, or collaboration inquiries, please contact the author.



