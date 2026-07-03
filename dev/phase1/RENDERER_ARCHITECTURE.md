# Phase 1 Identity Pitch Renderer Architecture

## Overview

The current renderer produces the deterministic backbone for Phase 1 Identity Pitches and is structured as a modular pipeline that separates responsibilities across clearly defined layers.

This architecture replaces the previous monolithic renderer and enables:

- safer iteration without unintended output changes  
- clearer debugging and traceability  
- reduced duplication from iterative fixes  
- controlled expansion of language and tone systems  

---

## Architecture Layers

### pitchCore
- Extracts and normalizes context from selections  
- Prepares all downstream inputs  

---

### pitchSectionBuilders
- Constructs narrative sections:
  - Title  
  - About  
  - Players Do  
  - Distinct Hook  

---

### pitchAssembly
- Combines sections into the primary Identity Pitch paragraph  
- Handles sentence structure and phrasing logic  

---

### pitchCleanup
- Shared text utilities and normalization helpers  
- Ensures consistent formatting across all layers  

---

### pitchSafetyFilters
- Applies tone constraints and audience safety rules  
- Handles youth-safe transformations and guardrails  

---

### generateCampaignPitch
- Legacy runtime name for the Phase 1 Identity Pitch orchestration function
- Orchestrates the full renderer pipeline  
- Applies final safety filters  
- Returns structured output  

---

## Design Intent

This separation ensures:

- Safe iteration without unintended output changes  
- Clear ownership of transformations across layers  
- Easier debugging by isolating logic to specific modules  
- Reduced technical debt from accumulated patch logic  

---

## Renderer Flow

```text
Context (pitchCore)
  → Section Construction (pitchSectionBuilders)
  → Sentence Assembly (pitchAssembly)
  → Cleanup & Normalization (pitchCleanup)
  → Safety & Tone Filtering (pitchSafetyFilters)
  → Phase 1 Identity Pitch Output (`generateCampaignPitch`, legacy runtime name)
```
## Responsibilities by Layer
|Layer|	Responsibility|
|pitchCore|	Data preparation|
|pitchSectionBuilders|	Narrative construction|
|pitchAssembly|	Sentence composition|
|pitchCleanup|	Text normalization|
|pitchSafetyFilters|	Safety and tone enforcement|
|generateCampaignPitch|	Pipeline orchestration|



## Scope Boundary

The renderer communicates campaign identity, thematic promise, tone, and style of play. It does not establish the concrete Phase 2 campaign situation. Runtime names are intentionally unchanged during the v0.9.x documentation migration.
