# QuestForge Campaign Distillery

## What This Is (Non-Technical)

The Campaign Distillery turns rough campaign ideas or client input into structured, high-quality tabletop RPG experiences.

It is designed to produce consistent, playable, and sellable campaign concepts—not just one-off AI-generated text.

## Why Not Just Use GPT?

You can absolutely paste notes into GPT and get a campaign pitch. 
**But that approach is:**
  - inconsistent
  - hard to control
  - difficult to repeat at scale
  - prone to ignoring tone, safety, or audience constraints
  
This Distillery however, is built to understand the intake first, make disciplined decisions about it, and only then write the pitch. 
This disciplined process is what makes the output more consistent, safer, easier to tune, and more scalable for a professional GM service.

In other words, GPT alone gives you a response but this Distillery gives you a consistant, dependable and repeatable process that delivers results even after thousands of iterations. 

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

In short, GPT improvises. This system interprets first, then generates.

---

## Example Outputs

These examples reflect the current output quality following the v0.7.2 voice layer stabilization pass.

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


## ⚙️ Technical Overview (For Developers)

The sections below describe the internal architecture, pipeline stages, and system design.

If you are looking for what this system does and the outputs it produces, see the sections above.

## System Overview

The Campaign Distillery is a structured pipeline that transforms raw tabletop RPG client intake into polished, client-facing campaign pitches.

It is designed to:
- Extract intent from messy human input
- Normalize that input into a controlled schema
- Select and resolve campaign direction components
- Render a cohesive, sellable narrative output
- Prioritizes deterministic, safety-aware interpretation over generative ambiguity.

## Voice Layer Design (v0.7.2)

The system separates **what a campaign means** from **how it is expressed**.

- Data layer (`pitchText`) defines player-facing phrasing
- Renderer composes that phrasing into structured output

This replaces earlier approaches that relied on:
- string normalization
- label transformation
- post-processing cleanup

The result is:
- more natural language
- consistent tone across outputs
- a scalable foundation for future voice expansion

## Current Focus (v0.7.2)

The voice layer has been stabilized and is now producing consistent, client-ready output.

Recent work focused on:
- eliminating system/core label leakage from pitch output
- replacing normalization logic with structured phrasing (`pitchText`)
- improving sentence clarity and reducing clause stacking
- ensuring consistent voice across all batch scenarios

This phase represents the transition from:
**polished output → stable, scalable voice system**

---

## Pipeline Overview

The system operates as a staged transformation pipeline:

Raw Intake  
→ Intake Normalization  
→ Canonical Validation  
→ Translation  
→ Selection  
→ Resolution  
→ Rendering  
→ Voice Shaping  

---

## Project Structure

- The project is organized by pipeline responsibility to maintain clear separation between stages.
```text
/misc
- test inputs and support materials

/scripts
- runCoreFrameSmokeTest.js
- testAiExpansion.js
- testBatchForms.js
- testFormFlow.js

/src
  /ai
  - AI-assisted expansion helpers

  /config
  - intakeEnums.js

  /data
  - coreFrames.js
  - environmentSkins.js
  - genreSkins.js
  - intakeMappings.js
  - systemFrames.js
  - tagRegistry.js
  - toneSkins.js
  - youthCoreFrames.js

  /intake
  - index.js
  - inferSafetySignals.js
  - mapFormSubmission.js
  - normalizeSubmission.js
  - toCanonicalIntake.js

  /parsers
  - loadNormalizedIntake.js
  - translateFormAnswers.js
  - validateNormalizedIntake.js

  /renderers
  - generateCampaignPitch.js

  /resolvers
  - frameCrosswalk.js
  - resolveCampaignContext.js

  /selectors
  - scoreCandidates.js
  - selectCampaignDirections.js
  - selectTopThree.js
  - selectTopWeighted.js

  /utils
  - lookupById.js

  /voice
  - pitchBuilder.js
  - voiceMap.js

  index.js

/.gitignore
/CHANGELOG.md
/package.json
/package-lock.json
/README.md
```

---

## Current State (v0.7.2)

- End-to-end pipeline is stable and fully operational
- Intake normalization layer is fully implemented and centralized
- Canonical schema validation enforced at intake boundary (AJV)
- Safety system distinguishes explicit vs inferred vs enforced modes
- Adjudication layer applies safety-aware signal shaping
- Renderer produces structured, client-ready campaign pitches
- AI handoff layer outputs rich, structured expansion input

### Voice Layer Stability (v0.7)

- Full batch coverage achieved across all test scenarios
- Pitch builder sentence composition stabilized
- Core fragment handling normalized to prevent grammar collisions
- Environment descriptions now join cleanly and read naturally
- Major repetition and clause-stacking issues resolved

- This version marks the transition from:
**Reliable system → Consistent, multi-scenario output generation**

### Voice Layer Stabilization (v0.7.2)

- Introduced structured `pitchText` fields for core and system frames
- Refactored renderer to use data-driven phrasing instead of string normalization
- Eliminated internal label leakage in client-facing Pitch output
- Simplified pitch composition (single system expression, no core stacking)
- Improved readability, cadence, and sentence clarity across all outputs
- Removed legacy guard logic and fallback filtering

This marks the completion of the voice layer foundation.

The system now produces:
- consistent, repeatable campaign pitches
- natural language output suitable for direct client delivery
- stable behavior across all tested input scenarios

---

## 🛡️ Intake & Safety System (v0.6— Highlights)

Introduced a fully normalized intake and safety inference layer that ensures reliable, structured outputs even from messy or incomplete user input.
### Core Capabilities

- **Input Normalization**
  - Handles inconsistent casing, punctuation, and phrasing
  - Uses shared preprocessing and alias mapping for stable interpretation  

- **Structured Safety Model**
  - Separates:
    - explicit user intent  
    - inferred safety signals  
    - final enforced safety mode  

- **Automatic Safety Detection**
  - Detects youth-safe intent even when not explicitly selected  
  - Applies tone and content constraints during selection and rendering  

- **Constraint-Aware Output**
  - Softens or redirects sensitive content instead of stripping it  
  - Generates tone and audience guardrails for downstream systems  
### Why It Matters
This layer ensures:
- inconsistent inputs still produce coherent results
- safety and audience expectations are respected automatically
- downstream systems operate on clean, validated data

```
Intake → normalization + safety inference
Parsing → validation + signal translation
Selection → weighted direction resolution
Rendering → structured pitch generation
Voice → tone + phrasing assembly
```

---

## v0.5 Highlights

### Intelligence Layer
- Introduced signal adjudication system
- Added priority tiers and override rules
- Integrated safety constraints into selection and output
- Implemented confidence scoring and suppression tracking

### Output Quality
- Cleaned renderer phrasing and repetition
- Reduced system-label leakage into prose
- Normalized tone handling and safety language
- Improved grammar and sentence structure consistency

### AI Handoff
- Added structured `aiBrief` output
- Included guardrails, tone constraints, and safety profile
- Enabled reliable downstream AI expansion

---

## What Changed Conceptually

v0.4:
> “The system works”

v0.5:
> “The system understands intent and makes decisions”

v0.6:
> “The system normalizes messy input and safely enforces constraints”

---
## Design Principles

- Signal over noise — minimal, meaningful tagging
- Deterministic processing — no hidden assumptions
- Separation of concerns — each layer has a single role
- Composable output — all results built from structured data
- Explicit ambiguity handling — uncertainty is preserved, not guessed

---

## Known Gaps

- Some phrasing patterns still repeat across large batch outputs
- Tone and genre variation can be expanded further at the sentence level
- VoiceMap depth is still limited for certain combinations
- AI expansion layer not fully tuned for voice consistency
- No real-time intake → pipeline execution yet

---

## Next Focus (v0.8)

### Voice Expansion & Depth (Primary)
- Expand voiceMap coverage across tone and genre combinations
- Increase phrasing variation and stylistic diversity
- Add nuance to different campaign identities (e.g. heroic vs tragic vs surreal)

### Genre & Tone System Refinement
- Refactor genre layer into:
  - era / setting frame
  - aesthetic / narrative tone
  - world condition
- Reduce conceptual overlap between genre and environment
- Improve composability of campaign identity

### Output Polish
- Further refine cadence and sentence flow
- Reduce subtle repetition across outputs
- Increase “sellability” and distinctiveness

### Integration
- Connect Formspree → pipeline execution
- Format outputs for direct client delivery

## Next Priorities

For a full, live list of milestones and fixes, see: 
https://github.com/Questforgegamespnw/questforge-campaign-distillery/issues. 


---

## Usage (Current)

Run full pipeline test:
```
node scripts/testFormFlow.js
```
Run batch tests:
```
node scripts/testBatchForms.js
```
Test AI expansion:
```
node scripts/testAiExpansion.js
```
Input files are located in:
```
/misc/test-inputs/
```

---

## Versioning 

- v0.3.x → Pipeline construction
- v0.4.0 → Core loop complete (stable)
- v0.4.x → Output quality refinement
- v0.5.x → Intelligence & signal quality layer
- v0.6.x → Intake normalization, validation, and safety enforcement
- **v0.7.0–0.7.1** → Voice layer development and stabilization
- **v0.7.2** → Voice layer finalized (structured phrasing, no label leakage)
- v0.8.x → Voice expansion, tone/genre depth, and polish
- v0.8.x → Language refinment & premium output polish

## Future Vision

### The Campaign Distillery will evolve into:

A client intake processor
A campaign design assistant
A scalable content generation system for QuestForge

### Enabling:

Faster onboarding
Higher consistency in campaign quality
Scalable GM services

---
## Author

QuestForge Games PNW
Professional GM Services

