# Developer Documentation

## Overview

This folder contains internal documentation for the QuestForge Campaign Distillery.

Use these documents to understand, extend, and safely maintain the system.

---

## System Overview

* [Pipeline Overview](./PIPELINE_OVERVIEW.md)  
  End-to-end flow: intake → mapping → selection → resolution → rendering → AI  

* [Renderer Architecture](./RENDERER_ARCHITECTURE.md)  
  Modular renderer structure: context → sections → assembly → cleanup → safety  

* [Voice System Overview](./VOICE_SYSTEM_OVERVIEW.md)  
  How structured data becomes player-facing narrative output  

---

## System Evolution

The Campaign Distillery has progressed through distinct capability stages:

- **v0.4** → The system works (end-to-end pipeline established)  
- **v0.5** → The system understands intent (signal adjudication + intelligence layer)  
- **v0.6** → The system normalizes and enforces safety constraints  
- **v0.7** → The system produces stable, consistent outputs across all scenarios  
- **v0.7.4** → Renderer modularized into a maintainable pipeline architecture  

---


---

## Data Layer

* [Data Expansion Guidelines](./DATA_EXPANSION_GUIDELINES.md)
  Rules for adding new entries without introducing bloat

* [New Entry Review Template](./NEW_ENTRY_REVIEW.md)
  Checklist for validating proposed additions

* [Entry Decision Log](./ENTRY_DECISION_LOG.md)
  Record of accepted, refined, and rejected concepts

---

## Development & Debugging

* [Debugging Guide](./DEBUGGING_GUIDE.md)
  Common failure points and troubleshooting steps

---

## How to Use This Documentation

* Start with **Pipeline Overview** if you are learning the system
* Use **Data Expansion Guidelines** before modifying data
* Use **Entry Decision Log** to avoid redundant additions
* Use **Debugging Guide** when something breaks

---

## Notes

* This documentation is developer-facing and may evolve over time
* Root README remains the primary user-facing entry point
