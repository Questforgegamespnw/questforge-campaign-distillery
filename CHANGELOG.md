# Changelog

All notable changes to this project will be documented in this file.

---
## v0.4.0
added structured intake layer for raw form submissions
added mapFormSubmission, normalizeSubmission, and toCanonicalIntake
created end-to-end pipeline runner in src/index.js
moved test and smoke runners into scripts/
added canonical pipeline bridge from form-shaped input to translator pipeline
enabled full end-to-end resolution and pitch generation from raw intake JSON
organized roadmap tickets into milestone-based development phases


## v0.3.0 - Stable Builder + AI Prompt Layer

### Added

* End-to-end campaign generation pipeline (form → translate → select → build → AI prompt)
* Pitch builder with structured narrative blocks (opening, premise, gameplay, escalation, closing)
* VoiceMap integration for core, system, environment, genre, and tone
* Manual AI expansion workflow with copy-ready prompt output
* AI prompt v1 with QuestForge voice constraints

### Improved

* Gameplay sentence handling with standalone vs intro guard logic
* Paragraph structure and readability across all pitch sections
* Deduplication of overlapping voice lines
* Prompt clarity and output consistency for AI expansion

### Fixed

* Sentence collision issues between pitch sections
* Mid-sentence capitalization errors
* Awkward intro + fragment joins in gameplay lines

### Notes

* This version represents a stable, client-ready output layer
* Next phase will focus on input translation robustness and front-end pipeline quality
