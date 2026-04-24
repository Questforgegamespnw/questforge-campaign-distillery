# QuestForge Campaign Distillery

## What This Is (Non-Technical)

The Campaign Distillery turns rough campaign ideas or client input into structured, high-quality tabletop RPG experiences.

It is designed to produce consistent, playable, and sellable campaign concepts—not just one-off AI-generated text.

It produces structured, reliable narrative inputs that can be expanded into full campaign pitches using AI.

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

---

## 🧠 How This Fits With AI

This system is not meant to replace AI writing—it is meant to improve it.

The Distillery handles:
- structure
- intent clarity
- tone consistency
- safety constraints

AI handles:
- expression
- flow
- stylistic polish
- narrative richness

This separation allows for:
- more consistent outputs
- better control over tone and content
- higher-quality final results when expanded

---

## Example Outputs

These examples reflect current output quality following voice layer stabilization and renderer refactor (v0.7.4).

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

Run the full pipeline locally:
node scripts/testFormFlow.js

---

## ⚙️ Technical Overview (For Developers)

The sections below describe the high-level system architecture and pipeline behavior.

If you are looking for internal implementation details, see the developer documentation in `/dev`.

---

## System Overview

The Campaign Distillery is a structured pipeline that transforms raw tabletop RPG client intake into clean, consistent narrative scaffolding.

The output is designed as **AI-ready input**, not final prose, enabling downstream AI systems to expand and refine it into client-facing copy.

It is designed to:

- Extract intent from messy human input  
- Normalize that input into a controlled schema  
- Select and resolve campaign direction components  
- Render a cohesive, sellable narrative output  
- Prioritize deterministic, safety-aware interpretation over generative ambiguity  

---

## Renderer Architecture (v0.7.4)

The rendering layer has been refactored into a modular pipeline to separate responsibilities and improve maintainability without altering output behavior.

The renderer now operates as a composed system of focused modules:

- **pitchCore** → extracts and normalizes context from selections  
- **pitchSectionBuilders** → constructs narrative sections (Title, About, Players Do, Hook)  
- **pitchAssembly** → composes sentences into a cohesive pitch  
- **pitchCleanup** → shared normalization and formatting utilities  
- **pitchSafetyFilters** → applies tone constraints and audience safety rules  
- **generateCampaignPitch** → orchestrates the full pipeline  

This replaces the previous monolithic renderer and enables safer iteration, clearer debugging, and controlled language tuning going forward.

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

The project is organized by pipeline responsibility to maintain clear separation between stages.

```text
/misc
  test inputs and supporting materials

/scripts
  runCoreFrameSmokeTest.js   – core frame validation
  testAiExpansion.js         – AI expansion testing
  testBatchForms.js          – batch input testing
  testFormFlow.js            – full pipeline test runner

/src
  /ai        – AI integration and expansion logic
  /config    – enums, aliases, and normalization config
  /data      – core data sources (frames, skins, mappings)
  /intake    – intake processing and canonical shaping
  /parsers   – form/input translation
  /renderers – pitch generation pipeline (modular)
    generateCampaignPitch.js  – orchestration layer
    pitchCore.js              – context extraction
    pitchSectionBuilders.js   – section generation
    pitchAssembly.js          – sentence + pitch composition
    pitchCleanup.js           – normalization and utilities
    pitchSafetyFilters.js     – tone and safety enforcement

  /resolvers – ID → object resolution
  /selectors – campaign direction selection logic
  /utils     – shared helpers
  /voice     – phrasing and voice system data

  index.js   – pipeline entry point
  ```

For detailed file-level documentation, see:

/dev/README.md

  ---

## Current State (v0.8.0 — Stable Narrative Input Layer)

- End-to-end pipeline is stable and fully operational
- Renderer is fully modular and maintainable
- Sentence assembly and cleanup layers are finalized
- Outputs are grammatically stable and structurally consistent
- Designed for AI expansion workflows rather than final prose
- Full batch test coverage passing (24/24)
---

## 🛡️ Intake & Safety System (v0.6 Highlights)

The system includes a normalized intake and safety inference layer that ensures reliable, structured outputs even from messy or incomplete input.

### Core Capabilities

- Input normalization (handles inconsistent formatting)
- Structured safety model (explicit vs inferred vs enforced)
- Automatic youth-safe detection
- Constraint-aware output shaping (softening instead of stripping)

This ensures:

- Stable outputs from inconsistent input  
- Consistent safety enforcement  
- Clean, validated data across the pipeline  

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
- Tone and genre variation can be expanded further  
- VoiceMap depth is still limited for certain combinations  
- AI expansion layer not fully tuned for voice consistency  
- No real-time intake → pipeline execution yet  

--- 

## Next Focus (v0.8.x)

### Voice Expansion & Depth
- Expand voiceMap coverage across tone and genre combinations  
- Increase phrasing variation and stylistic diversity  

### AI Expansion Layer
- Refine AI prompt for expansion
- Improve downstream voice consistency
- Tune narrative amplification behavior 

### Integration
- Connect Formspree → pipeline execution  
- Format outputs for direct client delivery  
---

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



