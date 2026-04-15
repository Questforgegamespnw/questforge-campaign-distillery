# Changelog

All notable changes to this project will be documented in this file.

---

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
