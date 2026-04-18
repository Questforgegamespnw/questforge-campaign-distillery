# QuestForge Campaign Distillery

## Overview

The Campaign Distillery is a structured pipeline that transforms raw tabletop RPG client intake into polished, client-facing campaign pitches.

It is designed to:
- Extract intent from messy human input
- Normalize that input into a controlled schema
- Select and resolve campaign direction components
- Render a cohesive, sellable narrative output

As of **v0.4.0**, the full core loop is functional end-to-end.

---

## Core Pipeline

The system operates as a staged transformation pipeline:

Raw Intake  
→ Intake Processing  
→ Normalization  
→ Translation  
→ Selection  
→ Resolution  
→ Rendering  
→ Voice Shaping  

### Flow Breakdown

1. **Intake Layer (`/src/intake`)**
   - `mapFormSubmission.js` → maps raw form data
   - `normalizeSubmission.js` → cleans and structures input
   - `toCanonicalIntake.js` → produces canonical pipeline input
   - `inferSafetySignals.js` → derives safety and tone constraints

2. **Parser Layer (`/src/parsers`)**
   - `validateNormalizedIntake.js` → ensures structural integrity
   - `loadNormalizedIntake.js` → prepares intake for processing
   - `translateFormAnswers.js` → converts input into weighted signals

3. **Selection Layer (`/src/selectors`)**
   - `scoreCandidates.js` → scores possible matches
   - `selectTopWeighted.js` → selects strongest signals
   - `selectTopThree.js` → enforces output constraints
   - `selectCampaignDirections.js` → final direction selection

4. **Resolution Layer (`/src/resolvers`)**
   - `frameCrosswalk.js` → maps across data domains
   - `resolveCampaignContext.js` → builds final structured context

5. **Rendering Layer (`/src/renderers`)**
   - `generateCampaignPitch.js` → produces structured narrative output

6. **Voice Layer (`/src/voice`)**
   - `pitchBuilder.js` → assembles final phrasing
   - `voiceMap.js` → controls tone and voice application

7. **AI Expansion Layer (`/src/ai`)**
   - `buildExpansionInput.js` → prepares expansion prompts
   - `expandPitch.js` → extends output where needed

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

## Current State (v0.5.0)

## Current State (v0.5.0)

- End-to-end pipeline is stable and fully operational
- Signal translation, weighting, and adjudication are implemented
- Safety and youth-safe inference integrated into decision layer
- Renderer produces structured, human-readable campaign pitches
- AI handoff layer outputs rich, structured expansion input
- Output is consistent, deterministic, and safe for downstream use

- This version marks the transition from:
**Functional system → Intelligent interpretation layer**

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

---
## Design Principles

- Signal over noise — minimal, meaningful tagging
- Deterministic processing — no hidden assumptions
- Separation of concerns — each layer has a single role
- Composable output — all results built from structured data
- Explicit ambiguity handling — uncertainty is preserved, not guessed

---

## Known Gaps

- Tone system lacks depth and consistency (toneSkins)
- Voice and renderer produce repetitive phrasing
- Limited phrasing variation across outputs
- No real-time form integration
- AI expansion layer not fully tuned

---

## Next Priorities

For a full, live list of milestones and fixes, see: 
https://github.com/Questforgegamespnw/questforge-campaign-distillery/issues. 

### Tone System (High Priority)
- Populate and normalize toneSkins
- Resolve tonal conflicts (e.g., kid-safe vs dangerous)
- Integrate tone into voice layer

### Renderer & Voice Polish
- Reduce repetition
- Improve phrasing variation
- Clean blending of generated text

### Live Integration
- Connect Formspree → pipeline execution
- Format outputs for client delivery

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
- **v0.4.0 → Core loop complete (stable)
- v0.4.x → Output quality refinement
- v0.5.x → Live integration

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

