# Renderer Architecture (v0.7.4)

## Overview

The pitch renderer is structured as a modular pipeline that separates responsibilities across clearly defined layers.

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
- Combines sections into the final pitch paragraph  
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
- Orchestrates the full pipeline  
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
  → Final Output (generateCampaignPitch)

  Responsibilities by Layer
Layer	Responsibility
pitchCore	Data preparation
pitchSectionBuilders	Narrative construction
pitchAssembly	Sentence composition
pitchCleanup	Text normalization
pitchSafetyFilters	Safety and tone enforcement
generateCampaignPitch	Pipeline orchestration

