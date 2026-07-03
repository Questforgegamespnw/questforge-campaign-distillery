# QuestForge Campaign Frame Library

## Purpose

This document defines the human-readable campaign vocabulary used by the QuestForge Campaign Distillery.

It explains:

- what each campaign-building layer means;
- how individual frames differ from one another;
- how frames combine without becoming redundant;
- how current runtime entries relate to the intended future data model;
- which concepts are implemented, bundled, experimental, or still awaiting source verification.

The Distillery is not a library of premade campaign plots. It is a grammar for building campaign identities from reusable parts, which Phase 2 can later develop into concrete playable concepts.

---

## Authority and Scope

The source data remains authoritative for current runtime behavior.

This library is authoritative for:

- conceptual meaning;
- layer ownership;
- pairing and contrast guidance;
- distinction between similar entries;
- future architectural intent;
- design vocabulary used when reviewing or expanding the data model.

Where the current runtime structure and the intended conceptual structure differ, this document records both.

A documented conceptual split should not be assumed to exist in source code until it has been implemented and tested.

---

## Relationship to the Two-Phase Workflow

The current frame library primarily supports **Phase 1 Identity Discovery**. Its job is to describe what the campaign means, how it should feel, and what kinds of play it emphasizes without committing to a specific setting situation.

After client selection, **Phase 2 Campaign Concept Development** may use the chosen frame composition to invent bounded fiction such as factions, locations, a starting crisis, threats, and a recurring campaign engine. It must preserve the selected identity and client constraints.

## Current Runtime Composition

A Phase 1 identity direction currently resolves approximately:

- 2 Core Frames;
- 2 System Frames;
- 1 Genre Skin;
- 1 Tone Skin;
- 1–2 Environment Skins;
- intake-specific emphasis, exclusions, audience constraints, and safety guidance.

The current composition model is:

```text
Core + System + Genre + Tone + Environment
```

Each layer contributes something different:

- **Core** → what the campaign means;
- **System** → what players repeatedly do;
- **Genre** → the broad narrative and aesthetic frame;
- **Tone** → how the experience feels emotionally;
- **Environment** → where and through what physical pressures play occurs.

---

## Intended Future Composition

The current Genre layer is intentionally recognized as overloaded. A later source refactor may separate it into more precise layers:

```text
Core Frames
System Frames
Setting Frame
Era or Social Frame
Aesthetic or Narrative Skin
Cultural or Mythological Brush
World Condition
Tone Skin
Environment Skin
```

This future split exists in the library now so the project has stable language to design toward before source files, schemas, selectors, aliases, and renderers are restructured.

---

# Layer Definitions

## Core Frame

**Question:**

> What is this campaign fundamentally about?

A Core Frame defines a central tension, meaning, or ideological engine.

A Core Frame is:

- thematic;
- portable across settings;
- capable of altering choices, stakes, or interpretation;
- distinct enough to create recognizable output language.

A Core Frame is not:

- a setting;
- a mechanic;
- a tone;
- a premade plot;
- a combination of several layers.

---

## System Frame

**Question:**

> What do players repeatedly do, manage, or respond to during play?

A System Frame defines a recurring player behavior, gameplay loop, decision structure, or campaign pressure.

A System Frame is:

- player-facing;
- repeatable;
- observable at the table;
- portable across settings and genres.

A System Frame is not:

- a theme by itself;
- a single encounter gimmick;
- a setting;
- a vague design goal such as “engagement.”

---

## Setting Frame

**Question:**

> What broad kind of fictional or technological world contains the campaign?

Examples may include:

- Fantasy;
- Modern;
- Science Fiction;
- Historical Fantasy;
- Post-Apocalyptic;
- Spacefaring;
- Contemporary Supernatural.

The current runtime does not yet represent Setting as an independent layer.

---

## Era or Social Frame

**Question:**

> What period, social structure, or stage of development shapes everyday life?

Examples may include:

- Ancient;
- Feudal;
- Medieval;
- Victorian;
- Industrial;
- Contemporary;
- Far Future.

An Era or Social Frame does not need to represent literal Earth history. A fantasy or science-fiction setting may use Victorian, feudal, industrial, or ancient institutions without being historically Earth-based.

The current runtime does not yet represent Era or Social Frame as an independent layer.

---

## Aesthetic or Narrative Skin

**Question:**

> Through what recognizable fictional language is the campaign presented?

Examples may include:

- Gothic;
- Western;
- Noir;
- Eldritch;
- Sword and Sorcery;
- Pulp Adventure;
- Dieselpunk;
- Solarpunk.

An Aesthetic Skin influences imagery, architecture, institutions, character roles, and narrative expectations. It does not decide the campaign’s core meaning or gameplay loop.

The current runtime bundles many aesthetics into Genre Skins.

---

## Cultural or Mythological Brush

**Question:**

> What cultural, legendary, or symbolic vocabulary shapes the world?

Examples may include:

- Norse;
- Greek;
- Egyptian;
- Arthurian;
- Celtic;
- Mesopotamian;
- Folkloric;
- Divine or Pantheonic.

A Cultural or Mythological Brush may influence:

- symbols;
- social roles;
- cosmology;
- architecture;
- names;
- rituals;
- legendary expectations;
- how powers and institutions are described.

A mythological brush is not automatically a genre or tone. A Norse brush could support heroic fantasy, political tragedy, cosmic horror, science fiction, or post-apocalyptic survival.

The current runtime does not yet represent this as an independent layer.

---

## World Condition

**Question:**

> What is happening to the world before the player characters begin acting within it?

Examples may include:

- Frontier;
- Occupied;
- Collapsing;
- Rebuilding;
- Post-War;
- Industrializing;
- Isolated;
- Decadent;
- Prosperous but Fragile;
- Under Siege;
- Recovering from Catastrophe.

World Condition creates pressure and opportunity, but it is not itself a Core Frame.

Examples of reinforcement rather than equivalence:

- **Collapsing** may reinforce **Entropy / Decay**;
- **Occupied** may reinforce **War of Ideologies**;
- **Frontier** may reinforce **Exploration Discovery Loop**;
- **Rebuilding** may reinforce **Creation vs Destruction**.

The current runtime does not yet represent World Condition as an independent layer.

---

## Tone Skin

**Question:**

> How should engaging with this campaign feel?

Tone defines emotional pressure, intensity, and narrative delivery.

Tone may influence:

- word choice;
- cadence;
- emotional intensity;
- optimism or bleakness;
- how consequences are framed.

Tone should not redefine the campaign’s core meaning or replace the system loop.

---

## Environment Skin

**Question:**

> What physical spaces do the characters move through?

Environment defines:

- terrain;
- spatial constraints;
- travel pressure;
- physical hazards;
- visual context;
- recurring environmental opportunities.

Environment does not independently determine ideology, tone, or gameplay structure.

---

# Composition Doctrine

## Default Identity Direction Shape

A strong campaign direction usually uses:

- 2 Core Frames;
- 2 primary System Frames;
- 1 principal Genre or Setting identity;
- 1 principal Tone;
- 1–2 Environments;
- optional secondary tone or supporting system only when the contrast is intentional.

Two System Frames are the normal target. A third should represent a supporting structure rather than a competing primary loop.

---

## Reinforcement Rule

Selected layers should reinforce one another without repeating the same idea.

Good reinforcement:

```text
Core: Survival Against Overwhelming Force
System: Resource Scarcity
Tone: Tense
Environment: Frozen Expanse
```

Each layer contributes a different part of the experience.

Redundant stacking:

```text
Core: Entropy / Decay
Core: Endless Siege
World Condition: Collapsing
Tone: Grimdark
```

This combination may work, but only if each element has a distinct job. Otherwise, the campaign risks repeating “everything is getting worse” without creating additional play or meaning.

---

## High-Contrast Rule

Contrasting layers may be combined when the contrast is intentional and explainable.

Examples:

- serious world + chaotic players;
- heroic tone inside a collapsing world;
- mythic presentation applied to intimate psychological conflict;
- beautiful environment paired with horror pressure.

Contrast should create a deliberate identity, not an unresolved contradiction.

---

## Minimal Necessary Structure

Use the smallest number of frames that clearly defines the experience.

Do not add a frame merely because it is compatible. Every selected frame should materially change:

- player behavior;
- campaign meaning;
- emotional delivery;
- narrative expectations;
- or physical context.

---

# Core Frame Library

## I. Identity and Existential Frames

### Fate vs Free Will

**Runtime ID:** `fate_vs_free_will`  
**Layer:** Core Frame  
**Status:** Implemented in current voice doctrine

**Central question:**  
Are the characters choosing their path, or fulfilling one already prepared for them?

**Meaning:**  
The campaign tests whether choice can alter prophecy, design, expectation, inherited role, or apparent inevitability.

**Use when:**

- destiny or prophecy exerts real pressure;
- choices matter because their freedom is uncertain;
- characters must decide whether to comply, reinterpret, or resist an expected path.

**Do not confuse with:**

- **Cycle / Recurrence:** focuses on repeating history or events;
- **Duty vs Self:** a potential separate concept focused on obligation rather than destiny;
- **Power Must Be Controlled:** focuses on restraint rather than authorship of one’s path.

**Strong pairings:**

- Cycle / Recurrence;
- War of Ideologies;
- Power Comes From Within;
- Hidden Truth.

**Typical systems:**

- Living World Reaction;
- Legacy / Inheritance;
- Faction Reputation;
- Hidden Information.

**Design notes:**  
The frame works best when player choices remain meaningful even if prophecy or expectation is real.

---

### Becoming Something Else

**Runtime ID:** `becoming_something_else`  
**Layer:** Core Frame  
**Status:** Implemented

**Central question:**  
What are the characters becoming, and how much of that change can they still choose?

**Meaning:**  
Transformation is already occurring or becoming increasingly difficult to avoid. Change may be physical, mental, spiritual, social, or functional.

**Use when:**

- power or survival reshapes identity;
- transformation offers both advantage and loss;
- returning to an earlier self may become impossible.

**Do not confuse with:**

- **Fragmented Self:** focuses on reconstruction of an already divided identity;
- **What Is Humanity?:** focuses on the boundary of personhood;
- **Power Has a Cost:** focuses on exchange and consequence rather than transformation itself.

**Strong pairings:**

- Power Has a Cost;
- What Is Humanity?;
- Power Comes From Within;
- Fragmented Self.

**Typical systems:**

- Corruption / Transformation Track;
- Upgrade Through Risk;
- Modular Build System;
- Legacy / Inheritance.

**Youth-safe interpretation:**  
Frame change as growth, adaptation, self-discovery, or surprising new capability rather than loss of personhood.

---

### Fragmented Self

**Runtime ID:** `fragmented_self`  
**Layer:** Core Frame  
**Status:** Implemented

**Central question:**  
How is identity reconstructed when memory, history, or self-understanding no longer aligns?

**Meaning:**  
A person, group, or identity is divided, incomplete, altered, or assembled from conflicting pieces.

**Use when:**

- memory or identity is unreliable;
- discovery reconstructs the self;
- multiple versions of a person or history compete.

**Do not confuse with:**

- **Hidden Truth:** the concealed information may concern anything, not specifically identity;
- **Becoming Something Else:** focuses on ongoing transformation;
- **Lost Knowledge:** focuses on recovery of absent information rather than selfhood.

**Strong pairings:**

- Hidden Truth;
- Lost Knowledge;
- Investigator’s Burden;
- What Is Humanity?

**Typical systems:**

- Clue Web;
- Hidden Information;
- Legacy / Inheritance;
- Corruption / Transformation Track.

**Youth-safe interpretation:**  
Use missing memories, mistaken assumptions, changing roles, or rediscovered connections rather than identity erasure or severe psychological destabilization.

---

### What Is Humanity?

**Runtime ID:** `what_is_humanity`  
**Layer:** Core Frame  
**Status:** Implemented

**Central question:**  
What still defines a person when power, change, utility, or survival disrupts familiar boundaries?

**Meaning:**  
The campaign tests personhood, empathy, recognition, moral status, and the line between person and monster, human and artificial, self and tool.

**Use when:**

- transformation or technology challenges personhood;
- empathy becomes difficult but important;
- characters must decide who still deserves recognition or protection.

**Do not confuse with:**

- **Becoming Something Else:** focuses on transformation;
- **Fragmented Self:** focuses on incomplete identity;
- **War of Ideologies:** may debate personhood politically but is broader.

**Strong pairings:**

- Becoming Something Else;
- Power Has a Cost;
- Hidden Truth;
- Creation vs Destruction.

**Typical systems:**

- Corruption / Transformation Track;
- Hidden Information;
- Alliance vs Betrayal;
- Living World Reaction.

---

## II. Conflict and Pressure Frames

### Survival Against Overwhelming Force

**Runtime ID:** `survival_against_overwhelming_force`  
**Layer:** Core Frame  
**Status:** Implemented

**Central question:**  
What can the characters preserve when they cannot simply overpower the threat?

**Meaning:**  
The group faces a danger larger, harsher, or more persistent than a clean victory can solve.

**Use when:**

- endurance matters more than dominance;
- not everything can be saved;
- survival requires sacrifice, timing, and prioritization.

**Do not confuse with:**

- **Endless Siege:** emphasizes recurring or uninterrupted pressure;
- **Entropy / Decay:** emphasizes systemic deterioration;
- **Power Has a Cost:** emphasizes exchange rather than scale of threat.

**Strong pairings:**

- Endless Siege;
- Entropy / Decay;
- Power Has a Cost;
- The World Is Alive.

**Typical systems:**

- Resource Scarcity;
- Attrition Combat;
- Escalation Meter;
- Environmental Combat.

---

### War of Ideologies

**Runtime ID:** `war_of_ideologies`  
**Layer:** Core Frame  
**Status:** Implemented

**Central question:**  
Which vision of the world deserves to endure, and what does supporting it require?

**Meaning:**  
The real conflict is between incompatible beliefs, systems, or principles rather than simple opposing teams.

**Use when:**

- factions embody different philosophies;
- choosing a side means inheriting its compromises;
- beliefs create material consequences.

**Do not confuse with:**

- **Power Vacuum:** focuses on instability after authority disappears;
- **Alliance vs Betrayal:** is a system of relationship pressure;
- **Political Intrigue:** is a tone and style of power maneuvering.

**Strong pairings:**

- Power Vacuum;
- Fate vs Free Will;
- Hidden Truth;
- Creation vs Destruction.

**Typical systems:**

- Faction Reputation;
- Influence / Social Leverage;
- Alliance vs Betrayal;
- Living World Reaction.

---

### Power Vacuum

**Runtime ID:** `power_vacuum`  
**Layer:** Core Frame  
**Status:** Implemented

**Central question:**  
What should replace the authority, structure, or force that once held the world together?

**Meaning:**  
An old center of power has failed or disappeared, and competing forces are reorganizing the world around the resulting absence.

**Use when:**

- instability is driven by absent authority;
- every intervention strengthens one possible future;
- factions compete to define what comes next.

**Do not confuse with:**

- **War of Ideologies:** focuses on competing beliefs;
- **Entropy / Decay:** focuses on deterioration rather than succession;
- **Endless Siege:** focuses on sustained pressure rather than governance.

**Strong pairings:**

- War of Ideologies;
- Hidden Truth;
- Creation vs Destruction;
- The World Is Alive.

**Typical systems:**

- Faction Reputation;
- Alliance vs Betrayal;
- Influence / Social Leverage;
- Territory Control.

---

### The Endless Siege

**Runtime ID:** `endless_siege`  
**Layer:** Core Frame  
**Status:** Implemented

**Central question:**  
What does it cost to keep holding when relief is always temporary?

**Meaning:**  
The campaign is shaped by recurring, uninterrupted, or structurally persistent pressure that prevents lasting safety.

**Use when:**

- every reprieve is temporary;
- defense and recovery happen simultaneously;
- pressure accumulates faster than stability can be restored.

**Do not confuse with:**

- **Survival Against Overwhelming Force:** emphasizes threat scale and endurance;
- **Entropy / Decay:** emphasizes deterioration of systems;
- **Escalation Meter:** is a tracked system for rising pressure.

**Strong pairings:**

- Survival Against Overwhelming Force;
- Entropy / Decay;
- Power Has a Cost;
- War of Ideologies.

**Typical systems:**

- Attrition Combat;
- Resource Scarcity;
- Escalation Meter;
- Territory Control.

---

## III. Mystery and Discovery Frames

### Hidden Truth

**Runtime ID:** `hidden_truth`  
**Layer:** Core Frame  
**Status:** Implemented

**Central question:**  
What important truth has been concealed, and what changes once it is known?

**Meaning:**  
Something important about the setting, conflict, or situation has been concealed, distorted, or kept incomplete.

**Use when:**

- discovery changes the characters’ understanding;
- someone benefits from the truth remaining incomplete;
- revelation alters choices, relationships, or obligations.

**Do not confuse with:**

- **Lost Knowledge:** the answer was forgotten, buried, or made inaccessible;
- **Something Is Wrong:** reality or apparent order is fundamentally misaligned;
- **Investigator’s Burden:** the pressure comes from what knowing requires.

**Strong pairings:**

- Investigator’s Burden;
- Power Vacuum;
- Something Is Wrong;
- Fragmented Self.

**Typical systems:**

- Clue Web;
- Hidden Information;
- Living World Reaction;
- Influence / Social Leverage.

**Design notes:**  
The truth should alter decisions, not merely provide exposition.

**Youth-safe interpretation:**  
The concealed truth should lead toward understanding, repair, or constructive choice rather than betrayal-heavy despair.

---

### Lost Knowledge

**Runtime ID:** `lost_knowledge`  
**Layer:** Core Frame  
**Status:** Implemented

**Central question:**  
What can still be recovered from knowledge damaged, forgotten, erased, or left behind?

**Meaning:**  
Important understanding exists but is inaccessible because of time, ruin, deliberate erasure, incomplete records, or cultural loss.

**Use when:**

- ruins, archives, relics, or fragments carry needed answers;
- recovery requires interpretation;
- the past continues shaping the present through absence.

**Do not confuse with:**

- **Hidden Truth:** someone or something actively conceals the answer;
- **Fragmented Self:** the missing information concerns identity reconstruction;
- **Exploration Discovery Loop:** describes how play advances through discovery.

**Strong pairings:**

- Hidden Truth;
- Cycle / Recurrence;
- Entropy / Decay;
- The World Is Alive.

**Typical systems:**

- Exploration Discovery Loop;
- Clue Web;
- Hidden Information;
- Legacy / Inheritance.

---

### Something Is Wrong

**Runtime ID:** `something_is_wrong`  
**Layer:** Core Frame  
**Status:** Implemented

**Central question:**  
What has caused reality, logic, time, or ordinary expectation to slip out of alignment?

**Meaning:**  
The campaign is driven by an increasingly undeniable sense that the world is behaving incorrectly.

**Use when:**

- patterns do not fit;
- ordinary reality becomes less trustworthy;
- paradox, distortion, or impossible behavior is central.

**Do not confuse with:**

- **Hidden Truth:** reality may be normal but concealed;
- **Cycle / Recurrence:** repetition may be known and structurally consistent;
- **Otherworld / Abstract:** is an environment rather than a core meaning.

**Strong pairings:**

- Hidden Truth;
- What Is Humanity?;
- Fragmented Self;
- Cycle / Recurrence.

**Typical systems:**

- Hidden Information;
- Clue Web;
- Escalation Meter;
- Living World Reaction.

---

### The Investigator’s Burden

**Runtime ID:** `investigators_burden`  
**Layer:** Core Frame  
**Status:** Implemented

**Central question:**  
What responsibility comes with finally understanding the truth?

**Meaning:**  
Knowledge does not arrive as relief. It creates obligation, exposure, consequence, or responsibility.

**Use when:**

- investigation changes what the characters owe others;
- learning more makes detachment impossible;
- answers create harder choices instead of closure.

**Do not confuse with:**

- **Hidden Truth:** concerns concealment;
- **Lost Knowledge:** concerns recovery;
- **Power Has a Cost:** concerns exchange for strength rather than knowledge.

**Strong pairings:**

- Hidden Truth;
- Lost Knowledge;
- Fragmented Self;
- War of Ideologies.

**Typical systems:**

- Clue Web;
- Hidden Information;
- Influence / Social Leverage;
- Alliance vs Betrayal.

---

## IV. Power Frames

### Power Has a Cost

**Runtime ID:** `power_has_a_cost`  
**Layer:** Core Frame  
**Status:** Implemented

**Central question:**  
What price is acceptable when strength solves one problem by creating another?

**Meaning:**  
Every meaningful gain extracts sacrifice, corruption, dependency, loss, obligation, or damage in return.

**Use when:**

- strength is available but never free;
- repeated compromise compounds;
- characters must decide when power becomes too expensive.

**Do not confuse with:**

- **Becoming Something Else:** focuses on transformation;
- **Power Must Be Controlled:** focuses on restraint;
- **Power Is Stolen or Borrowed:** focuses on ownership and dependency.

**Strong pairings:**

- Becoming Something Else;
- Survival Against Overwhelming Force;
- Creation vs Destruction;
- What Is Humanity?

**Typical systems:**

- Corruption / Transformation Track;
- Upgrade Through Risk;
- Escalation Meter;
- Resource Scarcity.

---

### Power Must Be Controlled

**Runtime ID:** `power_must_be_controlled`  
**Layer:** Core Frame  
**Status:** Implemented

**Central question:**  
What limits must be imposed before strength becomes its own threat?

**Meaning:**  
Power is useful or necessary, but discipline, safeguards, judgment, and restraint determine whether it remains survivable.

**Use when:**

- unchecked strength creates catastrophic risk;
- the fastest path is also the least restrained;
- control is a moral and practical responsibility.

**Do not confuse with:**

- **Power Has a Cost:** focuses on exchange;
- **Power Comes From Within:** focuses on awakening and mastery;
- **War of Ideologies:** may debate control politically but is broader.

**Strong pairings:**

- Power Comes From Within;
- Power Has a Cost;
- Creation vs Destruction;
- What Is Humanity?

**Typical systems:**

- Escalation Meter;
- Corruption / Transformation Track;
- Upgrade Through Risk;
- Modular Build System.

---

### Power Comes From Within

**Runtime ID:** `power_comes_from_within`  
**Layer:** Core Frame  
**Status:** Implemented

**Central question:**  
What kind of force do the characters become when their potential can no longer remain dormant?

**Meaning:**  
Strength originates from the characters’ own nature, identity, growth, awakening, discipline, or self-understanding.

**Use when:**

- growth is personal rather than externally granted;
- power and identity develop together;
- mastery matters as much as acquisition.

**Do not confuse with:**

- **Power Is Stolen or Borrowed:** power originates elsewhere;
- **Power Must Be Controlled:** focuses on restraint;
- **Becoming Something Else:** focuses on transformation rather than source.

**Strong pairings:**

- Fate vs Free Will;
- Becoming Something Else;
- Power Must Be Controlled;
- Creation vs Destruction.

**Typical systems:**

- Modular Build System;
- Upgrade Through Risk;
- Corruption / Transformation Track;
- Legacy / Inheritance.

---

### Power Is Stolen or Borrowed

**Proposed Runtime ID:** `power_is_stolen_or_borrowed`  
**Layer:** Core Frame  
**Status:** Preserve for source verification

**Central question:**  
What does using power that belongs to someone or something else make the characters owe?

**Meaning:**  
Strength originates outside the characters and is stolen, loaned, inherited conditionally, leased, granted by a patron, or extracted from a dangerous source.

**Use when:**

- dependency matters;
- ownership of power is contested;
- access can be revoked;
- obligation or contamination follows external strength.

**Do not confuse with:**

- **Power Has a Cost:** any power may carry a price;
- **Legacy / Inheritance System:** describes how the past persists mechanically;
- **Power Comes From Within:** explicitly uses the opposite source relationship.

**Strong pairings:**

- Power Has a Cost;
- Hidden Truth;
- War of Ideologies;
- What Is Humanity?

**Typical systems:**

- Corruption / Transformation Track;
- Legacy / Inheritance;
- Alliance vs Betrayal;
- Escalation Meter.

**Review note:**  
This concept fills a distinct narrative space but should be checked against current `coreFrames` data before being treated as implemented.

---

## V. Cosmic and World-State Frames

### Cycle / Recurrence

**Runtime ID:** `cycle_recurrence`  
**Layer:** Core Frame  
**Status:** Implemented

**Central question:**  
Can the characters break a pattern the world keeps returning to?

**Meaning:**  
History, events, identities, or crises repeat through loops, returns, inherited patterns, or recurring structures.

**Use when:**

- current events echo older failures;
- repetition creates inevitability pressure;
- understanding the pattern may create a chance to interrupt it.

**Do not confuse with:**

- **Fate vs Free Will:** focuses on authorship of the future;
- **Death / Respawn Loop:** is a gameplay structure;
- **Legacy / Inheritance:** describes persistence of prior characters or consequences.

**Strong pairings:**

- Fate vs Free Will;
- Lost Knowledge;
- Entropy / Decay;
- Hidden Truth.

**Typical systems:**

- Death / Respawn Loop;
- Legacy / Inheritance;
- Clue Web;
- Living World Reaction.

---

### Entropy / Decay

**Runtime ID:** `entropy_decay`  
**Layer:** Core Frame  
**Status:** Implemented

**Central question:**  
What remains worth preserving when the larger system is already coming apart?

**Meaning:**  
The world, institution, body, civilization, or order is deteriorating faster than it can be fully restored.

**Use when:**

- collapse is an active condition;
- victories remain meaningful but provisional;
- repair competes with irreversible decline.

**Do not confuse with:**

- **Endless Siege:** emphasizes repeated external pressure;
- **Survival Against Overwhelming Force:** emphasizes threat scale;
- **Collapsing World Condition:** describes current state rather than core meaning.

**Strong pairings:**

- Survival Against Overwhelming Force;
- Cycle / Recurrence;
- Creation vs Destruction;
- Power Has a Cost.

**Typical systems:**

- Resource Scarcity;
- Attrition Combat;
- Escalation Meter;
- Living World Reaction.

---

### Creation vs Destruction

**Runtime ID:** `creation_vs_destruction`  
**Layer:** Core Frame  
**Status:** Implemented

**Central question:**  
What must be broken, preserved, or sacrificed for something new to exist?

**Meaning:**  
Renewal and ruin are tightly linked. Building, restoring, or transforming the world creates consequences for what already exists.

**Use when:**

- progress requires dismantling old systems;
- preservation and change conflict;
- acts of creation risk becoming destructive.

**Do not confuse with:**

- **Entropy / Decay:** decline occurs whether or not renewal is attempted;
- **Power Vacuum:** focuses on succession after authority disappears;
- **Power Must Be Controlled:** focuses on restraint of dangerous strength.

**Strong pairings:**

- Entropy / Decay;
- Power Has a Cost;
- War of Ideologies;
- The World Is Alive.

**Typical systems:**

- Living World Reaction;
- Territory Control;
- Faction Reputation;
- Upgrade Through Risk.

---

### The World Is Alive

**Runtime ID:** `the_world_is_alive`  
**Layer:** Core Frame  
**Status:** Implemented

**Central question:**  
How do the characters act inside a world that notices, adapts, and pushes back?

**Meaning:**  
The environment is an active participant rather than a neutral backdrop. Places, ecosystems, or world-scale systems respond to action.

**Use when:**

- the environment changes in reaction to the group;
- place has motive-like pressure or adaptive behavior;
- understanding the world is part of surviving or cooperating with it.

**Do not confuse with:**

- **Living World Reaction:** is a system for dynamic consequences;
- **Environmental Combat:** concerns battlefield interaction;
- **Environment Skins:** define physical spaces.

**Strong pairings:**

- Lost Knowledge;
- Creation vs Destruction;
- Survival Against Overwhelming Force;
- Something Is Wrong.

**Typical systems:**

- Living World Reaction;
- Exploration Discovery Loop;
- Environmental Combat;
- Territory Control.

---

# System Frame Library

## I. Loop and Progression Systems

### Death / Respawn Loop

**Proposed Runtime ID:** `death_respawn_loop`  
**Layer:** System Frame  
**Status:** Preserve for source verification

**Player loop:**  
Failure, death, or reset is expected; progress comes from repetition, retained knowledge, changed conditions, or persistent consequences.

**Use when:**

- repeated attempts are part of normal play;
- the world resets fully or partially;
- learning encounters is itself progression.

**Do not confuse with:**

- **Cycle / Recurrence:** a thematic frame about repetition;
- **Legacy / Inheritance:** preserves effects across characters or generations;
- **Attrition Combat:** assumes consequences accumulate rather than reset.

**Strong core pairings:**

- Cycle / Recurrence;
- Entropy / Decay;
- Power Has a Cost;
- Hidden Truth.

**Design warning:**  
This is a specialized loop and should not receive the same default selection weight as broadly reusable systems.

---

### Escalation Meter

**Runtime ID:** `escalation_meter`  
**Layer:** System Frame  
**Status:** Implemented

**Player loop:**  
A visible or implied condition worsens through time, exposure, choices, failures, or specific actions.

**Use when:**

- thresholds alter play;
- delay creates compounding pressure;
- players must decide when to act before conditions worsen.

**Possible expressions:**

- corruption;
- heat;
- instability;
- panic;
- threat level;
- countdown pressure.

**Do not confuse with:**

- **Time Pressure System:** external events advance because time passes;
- **Corruption / Transformation Track:** specifically changes characters;
- **Endless Siege:** a thematic pressure frame.

**Strong core pairings:**

- Power Has a Cost;
- Survival Against Overwhelming Force;
- Something Is Wrong;
- Endless Siege.

---

### Resource Scarcity

**Runtime ID:** `resource_scarcity`  
**Layer:** System Frame  
**Status:** Implemented

**Player loop:**  
Players repeatedly decide what to spend, save, risk, abandon, or preserve because useful resources never meet total need.

**Use when:**

- supplies affect choices;
- logistics belong on-screen;
- tradeoffs matter more than inventory bookkeeping alone.

**Do not confuse with:**

- **Attrition Combat:** focuses on accumulated strain from encounters;
- **Survival Against Overwhelming Force:** is a core meaning;
- **Economy and Trade:** a possible future system focused on circulation and exchange.

**Strong core pairings:**

- Survival Against Overwhelming Force;
- Entropy / Decay;
- Endless Siege;
- Power Has a Cost.

---

### Upgrade Through Risk

**Runtime ID:** `upgrade_through_risk`  
**Layer:** System Frame  
**Status:** Implemented

**Player loop:**  
Meaningful growth is tied to optional danger, exposure, commitment, or high-risk opportunity.

**Use when:**

- players choose how aggressively to pursue power;
- advancement and safety pull in different directions;
- stronger rewards require deeper engagement with danger.

**Do not confuse with:**

- **Power Has a Cost:** a core meaning about exchange;
- **Corruption / Transformation Track:** tracks ongoing character change;
- **Modular Build System:** defines how players construct abilities.

**Strong core pairings:**

- Power Has a Cost;
- Becoming Something Else;
- Power Comes From Within;
- Survival Against Overwhelming Force.

---

## II. Information and Investigation Systems

### Clue Web

**Runtime ID:** `clue_web`  
**Layer:** System Frame  
**Status:** Implemented

**Player loop:**  
Players gather fragments, compare them, and connect multiple lines of evidence into a larger understanding.

**Use when:**

- investigation should be non-linear;
- no single clue resolves the mystery;
- interpretation matters as much as discovery.

**Do not confuse with:**

- **Hidden Information:** information is withheld or incomplete;
- **Hidden Truth:** the campaign is thematically about concealment;
- **Lost Knowledge:** the campaign is thematically about recovery.

**Strong core pairings:**

- Hidden Truth;
- Investigator’s Burden;
- Lost Knowledge;
- Fragmented Self.

---

### Hidden Information / Partial Knowledge

**Runtime ID:** `hidden_information`  
**Layer:** System Frame  
**Status:** Implemented

**Player loop:**  
Players act without the full picture and must read omissions, conflicting accounts, inaccessible records, and unreliable sources.

**Use when:**

- NPCs or institutions withhold information;
- uncertainty materially affects decisions;
- learning who shaped the information matters.

**Do not confuse with:**

- **Clue Web:** focuses on connecting evidence;
- **Hidden Truth:** focuses on campaign meaning;
- **Something Is Wrong:** focuses on reality being misaligned.

**Strong core pairings:**

- Hidden Truth;
- War of Ideologies;
- Investigator’s Burden;
- Power Vacuum.

---

### Time Pressure System

**Proposed Runtime ID:** `time_pressure_system`  
**Layer:** System Frame  
**Status:** Preserve for source verification

**Player loop:**  
Events, threats, opportunities, and factions continue progressing while players choose where to spend limited time.

**Use when:**

- players cannot address every problem;
- delays close options or alter the world;
- scheduling and prioritization shape the campaign.

**Do not confuse with:**

- **Escalation Meter:** a tracked condition worsens through defined triggers;
- **Living World Reaction:** the world changes in response to player action;
- **Endless Siege:** pressure is thematic rather than procedural.

**Strong core pairings:**

- Endless Siege;
- Power Vacuum;
- War of Ideologies;
- Survival Against Overwhelming Force.

---

## III. Combat and Encounter Systems

### Asymmetrical Boss Design

**Runtime ID:** `asymmetrical_boss_design`  
**Layer:** System Frame  
**Status:** Implemented

**Player loop:**  
Major enemies create distinct encounter rules, phases, vulnerabilities, or tactical problems that require adaptation.

**Use when:**

- bosses should be learned rather than merely damaged;
- routine tactics should not solve every major encounter;
- set pieces deserve individual identities.

**Do not confuse with:**

- **Environmental Combat:** the battlefield itself shapes the encounter;
- **Tactical Positioning:** controls movement and space throughout combat;
- a one-off gimmick with no recurring campaign relevance.

**Compatibility:**  
Broadly compatible, but complexity, tone, and campaign emphasis should still be considered.

---

### Environmental Combat

**Runtime ID:** `environmental_combat`  
**Layer:** System Frame  
**Status:** Implemented

**Player loop:**  
Players repeatedly account for terrain, hazards, unstable surroundings, and interactive features during conflict.

**Use when:**

- battlefields should behave as active systems;
- terrain alters safe actions;
- environmental interaction creates opportunity as well as danger.

**Do not confuse with:**

- **The World Is Alive:** a thematic frame;
- **Living World Reaction:** campaign-scale response;
- **Tactical Positioning:** movement and zone control may matter without active hazards.

**Strong core pairings:**

- The World Is Alive;
- Survival Against Overwhelming Force;
- Creation vs Destruction;
- Something Is Wrong.

---

### Attrition Combat

**Runtime ID:** `attrition_combat`  
**Layer:** System Frame  
**Status:** Implemented

**Player loop:**  
Encounters leave lasting strain, depletion, damage, or reduced resilience that affects later choices.

**Use when:**

- the aftermath of combat matters;
- endurance matters more than single-round burst;
- repeated encounters narrow future options.

**Do not confuse with:**

- **Resource Scarcity:** applies beyond combat;
- **Endless Siege:** is a core pressure frame;
- **Death / Respawn Loop:** often resets or recontextualizes failure.

**Strong core pairings:**

- Endless Siege;
- Survival Against Overwhelming Force;
- Entropy / Decay;
- Power Has a Cost.

---

### Tactical Positioning / Zone Control

**Runtime ID:** `tactical_positioning_zone_control`  
**Layer:** System Frame  
**Status:** Implemented

**Player loop:**  
Movement, spacing, chokepoints, elevation, denial, and control of local space materially determine outcomes.

**Use when:**

- where characters stand matters as much as what they do;
- encounters reward movement and spatial planning;
- loss of position creates compounding danger.

**Do not confuse with:**

- **Territory Control:** campaign-scale ownership and access;
- **Environmental Combat:** terrain may be active without zone-control play;
- **Asymmetrical Boss Design:** focuses on unique major enemies.

**Strong core pairings:**

- War of Ideologies;
- Survival Against Overwhelming Force;
- The World Is Alive;
- Endless Siege.

---

## IV. Faction and Social Systems

### Faction Reputation

**Runtime ID:** `faction_reputation`  
**Layer:** System Frame  
**Status:** Implemented

**Player loop:**  
Groups remember what the characters do, interpret those actions differently, and alter access, support, hostility, or opportunity.

**Use when:**

- reputation should persist;
- alliances close some doors while opening others;
- perception matters independently of intent.

**Do not confuse with:**

- **Influence / Social Leverage:** focuses on active negotiation and pressure;
- **Alliance vs Betrayal:** focuses on trust and loyalty;
- **War of Ideologies:** is a core conflict.

**Strong core pairings:**

- War of Ideologies;
- Power Vacuum;
- Hidden Truth;
- Creation vs Destruction.

---

### Alliance vs Betrayal

**Runtime ID:** `alliance_vs_betrayal`  
**Layer:** System Frame  
**Status:** Implemented

**Player loop:**  
Players repeatedly decide whom to trust, what compromises cooperation requires, and how to respond when loyalty is uncertain or fails.

**Use when:**

- alliances create both help and exposure;
- trust is strategically and emotionally important;
- choosing sides creates long-term consequences.

**Do not confuse with:**

- **Faction Reputation:** tracks standing with groups;
- **Influence / Social Leverage:** focuses on persuasion and pressure;
- **War of Ideologies:** defines what factions believe.

**Strong core pairings:**

- Power Vacuum;
- War of Ideologies;
- Hidden Truth;
- Investigator’s Burden.

---

### Influence / Social Leverage

**Runtime ID:** `influence_social_leverage`  
**Layer:** System Frame  
**Status:** Implemented

**Player loop:**  
Players gain ground through relationships, negotiation, pressure, favors, vulnerabilities, and control of what others believe is possible.

**Use when:**

- words and relationships should alter outcomes;
- force is not the only meaningful route;
- information about people becomes a practical resource.

**Do not confuse with:**

- **Faction Reputation:** persistent group standing;
- **Alliance vs Betrayal:** trust and loyalty pressure;
- **Political Intrigue:** emotional and narrative presentation.

**Strong core pairings:**

- War of Ideologies;
- Power Vacuum;
- Hidden Truth;
- Investigator’s Burden.

---

## V. World Interaction Systems

### Living World Reaction

**Runtime ID:** `living_world_reaction`  
**Layer:** System Frame  
**Status:** Implemented

**Player loop:**  
Places, threats, factions, and NPCs change in response to player action and continue developing over time.

**Use when:**

- prior decisions should remain active;
- the setting should not wait passively;
- consequences visibly reshape later options.

**Do not confuse with:**

- **The World Is Alive:** a thematic frame about an active environment;
- **Faction Reputation:** one form of social reaction;
- **Time Pressure:** events may advance without being direct reactions.

**Strong core pairings:**

- The World Is Alive;
- Power Vacuum;
- War of Ideologies;
- Creation vs Destruction.

---

### Territory Control

**Proposed Runtime ID:** `territory_control`  
**Layer:** System Frame  
**Status:** Preserve for source verification

**Player loop:**  
Players capture, defend, lose, restore, or politically influence areas whose control changes access, safety, resources, or strategic position.

**Use when:**

- the campaign map should change meaningfully;
- control of locations creates strategic consequences;
- factions contest space over time.

**Do not confuse with:**

- **Tactical Positioning / Zone Control:** encounter-scale space;
- **Faction Reputation:** social standing;
- **Living World Reaction:** broader dynamic change.

**Strong core pairings:**

- Power Vacuum;
- War of Ideologies;
- Endless Siege;
- Creation vs Destruction.

---

### Exploration Discovery Loop

**Runtime ID:** `exploration_discovery_loop`  
**Layer:** System Frame  
**Status:** Implemented

**Player loop:**  
Players advance by entering unfamiliar places, discovering hidden paths, interpreting environmental information, and unlocking new routes or understanding.

**Use when:**

- discovery is the engine of progress;
- place carries story and practical information;
- curiosity opens access and opportunity.

**Do not confuse with:**

- **Lost Knowledge:** a core frame;
- **Clue Web:** connects evidence rather than spaces;
- **The World Is Alive:** a thematic relationship with environment.

**Strong core pairings:**

- Lost Knowledge;
- The World Is Alive;
- Hidden Truth;
- Something Is Wrong.

---

## VI. Player Evolution Systems

### Corruption / Transformation Track

**Runtime ID:** `corruption_transformation_track`  
**Layer:** System Frame  
**Status:** Implemented

**Player loop:**  
Character change is tracked as an active tradeoff between capability, identity, stability, consequence, or control.

**Use when:**

- transformation should remain visible in play;
- power creates cumulative character changes;
- players decide how far to continue despite consequences.

**Do not confuse with:**

- **Escalation Meter:** may track world or threat pressure;
- **Becoming Something Else:** a core meaning;
- **Power Has a Cost:** a thematic exchange.

**Strong core pairings:**

- Becoming Something Else;
- Power Has a Cost;
- What Is Humanity?;
- Fragmented Self.

---

### Modular Build System

**Runtime ID:** `modular_build_system`  
**Layer:** System Frame  
**Status:** Implemented

**Player loop:**  
Players construct capabilities and identity through flexible combinations rather than a single predetermined progression path.

**Use when:**

- advancement should express priorities;
- builds should be authored through meaningful components;
- growth and identity are linked.

**Do not confuse with:**

- **Upgrade Through Risk:** defines how advancement is earned;
- **Power Comes From Within:** defines thematic source;
- a rules-heavy character creator with no campaign-facing consequence.

**Strong core pairings:**

- Power Comes From Within;
- Becoming Something Else;
- Fragmented Self;
- Power Must Be Controlled.

---

### Legacy / Inheritance System

**Runtime ID:** `legacy_inheritance_system`  
**Layer:** System Frame  
**Status:** Implemented

**Player loop:**  
Prior characters, generations, identities, or unresolved choices continue shaping present options and consequences.

**Use when:**

- the past should remain mechanically active;
- previous lives or characters affect current play;
- inheritance creates obligation, advantage, or constraint.

**Do not confuse with:**

- **Cycle / Recurrence:** a thematic repetition frame;
- **Death / Respawn Loop:** repeats attempts or lives;
- **Lost Knowledge:** concerns recovery of absent understanding.

**Strong core pairings:**

- Cycle / Recurrence;
- Fate vs Free Will;
- Fragmented Self;
- Power Is Stolen or Borrowed.

---

# Current Genre Skin Library

## Important Runtime Note

The entries below are currently treated as Genre Skins, but several combine setting, era, aesthetic, cultural language, or world condition.

Their likely future decomposition is included as design annotation only.

---

### Classic Fantasy

**Runtime ID:** `classic_fantasy`  
**Current runtime type:** Genre Skin  
**Status:** Implemented

**Current identity:**  
Traditional fantasy adventure shaped by kingdoms, monsters, old magic, dangerous roads, ruins, and familiar mythic institutions.

**Likely future decomposition:**

- Setting Frame: Fantasy;
- Era or Social Frame: Medieval or Feudal;
- Aesthetic: Traditional Adventure Fantasy;
- Common World Conditions: Stable Realm, Threatened Kingdoms, Frontier Pressure.

**Do not confuse with:**

- **Heroic Fantasy:** emphasizes scale, aspiration, and powerful protagonists;
- **Dark Fantasy:** emphasizes corruption, compromise, and decay.

---

### Dark Fantasy

**Runtime ID:** `dark_fantasy`  
**Current runtime type:** Genre Skin  
**Status:** Implemented

**Current identity:**  
Fantasy shaped by corruption, failing orders, dangerous magic, moral compromise, and a world already marked by decline.

**Likely future decomposition:**

- Setting Frame: Fantasy;
- Aesthetic: Dark Fantasy;
- Common World Conditions: Decaying, Blighted, Compromised;
- Common Tones: Grimdark, Horror, Melancholic.

**Design note:**  
Dark Fantasy is not identical to Grimdark. Dark Fantasy describes fictional and aesthetic expectations; Grimdark describes emotional and moral delivery.

---

### Heroic Fantasy

**Runtime ID:** `heroic_fantasy`  
**Current runtime type:** Genre Skin  
**Status:** Implemented

**Current identity:**  
Fantasy built around capable heroes, rising power, large threats, meaningful resistance, and the possibility of world-shaping action.

**Likely future decomposition:**

- Setting Frame: Fantasy;
- Aesthetic: Epic or Heroic Adventure;
- Common World Conditions: Threatened but Recoverable;
- Common Tones: Heroic, Mythic, Hopeful.

---

### Western Frontier

**Runtime ID:** `western_frontier`  
**Current runtime type:** Genre Skin  
**Status:** Implemented

**Current identity:**  
Remote settlements, uncertain law, exposed travel, scarcity, distance, grit, and communities beyond reliable protection.

**Likely future decomposition:**

- Era or Social Frame: Early Industrial or Frontier-era;
- Aesthetic: Western;
- World Condition: Frontier;
- Common Environments: Desert Wasteland, Frontier Wildlands;
- Common Tones: Tense, Noir, Heroic, Grimdark.

**Design note:**  
“Western” is primarily an aesthetic and narrative language. “Frontier” is primarily a world condition.

---

### Victorian Gothic

**Runtime ID:** `victorian_gothic`  
**Current runtime type:** Genre Skin  
**Status:** Implemented

**Current identity:**  
Industry, rigid social structures, reputation, old power, shadowed streets, archives, estates, secrecy, and institutional pressure.

**Likely future decomposition:**

- Era or Social Frame: Victorian;
- Aesthetic: Gothic;
- Common World Conditions: Industrializing, Decadent, Institutionally Rigid;
- Common Environments: Dense City, Ruined Estate, Industrial District;
- Common Tones: Noir, Psychological, Horror, Political Intrigue.

---

### Feudal Eastern

**Runtime ID:** `feudal_eastern`  
**Current runtime type:** Genre Skin  
**Status:** Implemented

**Current identity:**  
Duty, hierarchy, ritual, honor, spirits, disciplined warfare, lineage, and inherited order.

**Likely future decomposition:**

- Era or Social Frame: Feudal;
- Aesthetic: Courtly, Martial, or Saga-like;
- Cultural Brush: currently broad and should eventually become more precise;
- Common World Conditions: Rigid Order, Fragmented Clans, Contested Succession;
- Common Tones: Mythic, Political Intrigue, Heroic, Melancholic.

**Design warning:**  
The label is broad and risks flattening distinct cultures. A later refactor should use specific cultural or mythological brushes rather than treating “Eastern” as a single identity.

---

### Science Fiction

**Runtime ID:** `sci_fi`  
**Current runtime type:** Genre Skin  
**Status:** Implemented

**Current identity:**  
Advanced systems, technological dependence, engineered environments, widening frontiers, machine logic, infrastructure, and discovery at large scale.

**Likely future decomposition:**

- Setting Frame: Science Fiction;
- Era or Social Frame: Near Future, Far Future, or Spacefaring;
- Aesthetic: Hard SF, Soft SF, Corporate, Pulp, Cybernetic, or other future subtype;
- World Condition: Expansion, Collapse, Occupation, Frontier, Isolation.

**Design note:**  
Punk aesthetics such as cyberpunk, solarpunk, and dieselpunk need a cleaner future home and should not be forced into Tone.

---

### Post-Apocalyptic

**Runtime ID:** `post_apocalyptic`  
**Current runtime type:** Genre Skin  
**Status:** Implemented

**Current identity:**  
Survival, reconstruction, scavenging, fractured communities, ruined infrastructure, and the question of what deserves to be rebuilt after systemic failure.

**Likely future decomposition:**

- Setting Frame: variable;
- Era or Social Frame: Post-Collapse;
- World Condition: Recovering from Catastrophe;
- Aesthetic: Ruin, Salvage, Improvisation;
- Common Tones: Hopeful, Grimdark, Melancholic, Heroic.

**Design note:**  
Post-Apocalyptic is strongly tied to world condition and may eventually cease functioning as a single genre layer.

---

### Cosmic / Eldritch

**Runtime ID:** `cosmic_eldritch`  
**Current runtime type:** Genre Skin  
**Status:** Implemented

**Current identity:**  
Incomprehensible forces, hostile scale, altered reality, unstable meaning, and truths that exceed ordinary human perspective.

**Likely future decomposition:**

- Setting Frame: variable;
- Aesthetic: Eldritch or Cosmic;
- Optional Cultural or Mythological Brush: Divine, Pantheonic, Alien Cosmology;
- Common World Conditions: Reality Destabilizing, Contact Event, Hidden Cosmology;
- Common Tones: Horror, Psychological, Mythic.

**Design note:**  
Cosmic or Eldritch is not automatically Horror. It may be presented as Mythic, Psychological, Exploratory, or even Heroic depending on tone.

---

## Genre or Setting Entries Pending Verification

The following concepts appeared in earlier design staging but should be checked against current source before being treated as implemented:

- Urban Modern;
- Mythological;
- explicit Contemporary Supernatural;
- explicit Historical Fantasy;
- explicit station or corporate science-fiction subtypes.

---

# Tone Skin Library

### Grimdark

**Runtime ID:** `grimdark`  
**Status:** Implemented

**Emotional experience:**  
Harsh compromise, attritional loss, moral abrasion, and survival inside systems already failing.

**Use when:**

- choices are costly;
- damage and compromise remain visible;
- triumph should never erase consequence.

**Do not confuse with:**

- **Dark Fantasy:** an aesthetic and genre expectation;
- **Melancholic:** emphasizes quiet loss rather than brutality;
- **Tense:** emphasizes narrow margins and urgency.

---

### Horror

**Runtime ID:** `horror`  
**Status:** Implemented

**Emotional experience:**  
Vulnerability, creeping dread, destabilized certainty, and exposure to an unknown or invasive threat.

**Use when:**

- fear and uncertainty are central;
- answers widen vulnerability;
- the group cannot assume full control.

**Do not confuse with:**

- **Gothic:** an aesthetic;
- **Cosmic / Eldritch:** an aesthetic or narrative frame;
- **Psychological:** may be intense without relying on fear.

---

### Mythic

**Runtime ID:** `mythic`  
**Status:** Implemented

**Emotional experience:**  
Symbolic consequence, legendary scale, sacred meaning, destiny, and events that echo beyond the immediate moment.

**Use when:**

- actions carry larger significance;
- the world is interpreted through symbol and legend;
- the campaign should feel elevated without becoming vague.

**Do not confuse with:**

- **Mythological Brush:** supplies cultural and symbolic vocabulary;
- **Heroic:** focuses on agency and resistance;
- **Fate vs Free Will:** a core question.

---

### Heroic

**Runtime ID:** `heroic`  
**Status:** Implemented

**Emotional experience:**  
Meaningful agency, courage under pressure, hard-won momentum, and the belief that action can matter.

**Use when:**

- characters should be capable of changing outcomes;
- stakes are real but not purely hopeless;
- resolve matters more than comfort.

**Do not confuse with:**

- **Heroic Fantasy:** a genre identity;
- **Hopeful:** emphasizes recovery and possibility;
- **Mythic:** emphasizes symbolic and legendary scale.

---

### Psychological

**Runtime ID:** `psychological`  
**Status:** Implemented

**Emotional experience:**  
Internal strain, unstable interpretation, identity pressure, doubt, and conflict that lands close to the characters.

**Use when:**

- perception and meaning are unstable;
- discoveries alter self-understanding;
- internal and external conflict interact.

**Do not confuse with:**

- **Horror:** centers vulnerability and fear;
- **Fragmented Self:** a core frame;
- **Noir:** emphasizes concealment and compromise.

---

### Noir

**Runtime ID:** `noir`  
**Status:** Implemented

**Emotional experience:**  
Fragile trust, hidden motives, moral compromise, hard-edged investigation, and truth that does not cleanly resolve damage.

**Use when:**

- answers have social or moral cost;
- trust is difficult;
- the campaign should feel lean, measured, and unsentimental.

**Do not confuse with:**

- **Victorian Gothic:** a bundled genre identity;
- **Political Intrigue:** emphasizes maneuvering and leverage;
- **Investigator’s Burden:** a core meaning.

---

### Political Intrigue

**Runtime ID:** `political_intrigue`  
**Status:** Implemented

**Emotional experience:**  
Calculated pressure, shifting alliances, leverage, careful maneuvering, and power expressed through institutions and relationships.

**Use when:**

- appearance and motive diverge;
- every gain changes the balance;
- persuasion and positioning matter.

**Do not confuse with:**

- **War of Ideologies:** a core conflict;
- **Power Vacuum:** a core world-state tension;
- **Influence / Social Leverage:** a gameplay system.

---

### Lighthearted / Chaotic

**Runtime ID:** `lighthearted_chaotic`  
**Status:** Implemented

**Emotional experience:**  
Fast-moving complications, playful unpredictability, curiosity, improvisation, and trouble that feels exciting rather than crushing.

**Use when:**

- fun and energy should lead;
- complications invite improvisation;
- pressure remains approachable.

**Design note:**  
This currently bundles two related but separable ideas: world-level lightness and player-driven chaos. A future modifier system may better represent “serious world, chaotic players.”

---

### Melancholic

**Runtime ID:** `melancholic`  
**Status:** Implemented

**Emotional experience:**  
Quiet loss, memory, fading structures, bittersweet endurance, and attention to what remains rather than what is conquered.

**Use when:**

- emotional residue matters;
- loss should gather gradually;
- continuation may be meaningful without full restoration.

**Do not confuse with:**

- **Grimdark:** harsher and more abrasive;
- **Hopeful:** emphasizes restoration;
- **Entropy / Decay:** a core meaning.

---

### Tense

**Runtime ID:** `tense`  
**Status:** Implemented

**Emotional experience:**  
Compressed decision space, narrow margins, urgency, instability, and limited room for error.

**Use when:**

- pressure should feel immediate;
- pacing should remain tight;
- choices happen before full certainty is available.

**Do not confuse with:**

- **Time Pressure System:** procedural advancement of events;
- **Escalation Meter:** tracked worsening condition;
- **Horror:** vulnerability and fear.

---

### Hopeful

**Runtime ID:** `hopeful`  
**Status:** Implemented

**Emotional experience:**  
Resilience, repair, earned possibility, and the belief that improvement remains believable despite hardship.

**Use when:**

- restoration matters;
- effort should accumulate meaningfully;
- difficulty should not become despair.

**Do not confuse with:**

- **Heroic:** emphasizes agency and resistance;
- **Lighthearted:** emphasizes fun and energy;
- **Creation vs Destruction:** a core tension.

---

# Environment Skin Library

### Desert / Wasteland

**Runtime ID:** `desert_wasteland`  
**Status:** Implemented

**Physical identity:**  
Heat, exposure, distance, failing routes, sparse shelter, and dwindling supplies.

**Common pressures:**

- travel attrition;
- scarcity;
- exposed movement;
- long distance between safety.

---

### Frontier Wildlands

**Runtime ID:** `frontier_wildlands`  
**Status:** Implemented

**Physical identity:**  
Remote territory, scattered settlements, uncertain roads, limited support, and wide spaces that stretch protection thin.

**Common pressures:**

- divided attention;
- delayed response;
- vulnerable communities;
- uncertain routes.

**Do not confuse with:**  
**Frontier** as a World Condition. The environment describes the physical territory; the condition describes social and structural reach.

---

### Dense City / Urban

**Runtime ID:** `dense_city_urban`  
**Status:** Implemented

**Physical identity:**  
Crowded streets, layered districts, institutions, verticality, proximity, rumor networks, and hidden access boundaries.

**Common pressures:**

- social and institutional navigation;
- compressed danger;
- reputation;
- secrecy hidden in routine.

---

### Ruined Civilization

**Runtime ID:** `ruined_civilization`  
**Status:** Implemented

**Physical identity:**  
Broken monuments, collapsed systems, buried histories, failed infrastructure, and old ambitions still shaping the present.

**Common pressures:**

- interpretation of remnants;
- dangerous legacy systems;
- incomplete history;
- salvage and rediscovery.

---

### Coastal / Oceanic

**Runtime ID:** `coastal_oceanic`  
**Status:** Implemented

**Physical identity:**  
Storm-worn shores, tides, crossings, islands, exposed passages, distance, and unpredictable weather.

**Common pressures:**

- timing;
- separation;
- vulnerable travel;
- route uncertainty.

---

### Otherworld / Abstract

**Runtime ID:** `otherworld_abstract`  
**Status:** Implemented

**Physical identity:**  
Impossible geometry, unstable perception, symbolic terrain, altered logic, and spaces that behave more like ideas than geography.

**Common pressures:**

- interpretation;
- unreliable navigation;
- shifting rules;
- meaning embedded in place.

---

### Underground / Caverns

**Runtime ID:** `underground_caverns`  
**Status:** Implemented

**Physical identity:**  
Darkness, depth, enclosure, narrow passages, buried chambers, uncertain retreat, and the weight of too much stone overhead.

**Common pressures:**

- orientation;
- limited visibility;
- constrained movement;
- difficult withdrawal.

---

### Dense Jungle / Overgrowth

**Runtime ID:** `dense_jungle_overgrowth`  
**Status:** Implemented

**Physical identity:**  
Thick vegetation, swallowed ruins, humidity, concealment, living obstruction, and nature reclaiming what remains still.

**Common pressures:**

- limited visibility;
- slow movement;
- concealed paths;
- environmental encroachment.

---

### Frozen Expanse

**Runtime ID:** `frozen_expanse`  
**Status:** Implemented

**Physical identity:**  
Cold, exposure, scarce warmth, isolation, difficult travel, and long distances across unforgiving terrain.

**Common pressures:**

- endurance;
- shelter;
- preparation;
- limited margin for error.

---

### Volcanic / Firelands

**Runtime ID:** `volcanic_firelands`  
**Status:** Implemented

**Physical identity:**  
Heat, ash, eruption, unstable ground, fracture, and terrain where creation and destruction occur simultaneously.

**Common pressures:**

- unstable movement;
- sudden hazards;
- thermal exposure;
- timing and positioning.

---

### Mountain Highlands

**Runtime ID:** `mountain_highlands`  
**Status:** Implemented

**Physical identity:**  
Altitude, exposed ridges, high winds, narrow passes, steep ground, and difficult retreat.

**Common pressures:**

- bottlenecks;
- endurance;
- visibility;
- path commitment.

---

### Swamp / Marsh

**Runtime ID:** `swamp_marsh`  
**Status:** Implemented

**Physical identity:**  
Murky water, unstable footing, concealed routes, rot, fog, and terrain that hides danger while slowing movement.

**Common pressures:**

- obscured threats;
- attrition;
- poor footing;
- unreliable passage.

---

### Floating Islands

**Runtime ID:** `floating_islands`  
**Status:** Implemented

**Physical identity:**  
Suspended terrain, dangerous gaps, vertical travel, unstable crossings, altitude, and fragmented geography.

**Common pressures:**

- separation;
- exposed traversal;
- route disruption;
- precision and timing.

---

### Ancient Megastructure

**Runtime ID:** `ancient_megastructure`  
**Status:** Implemented

**Physical identity:**  
Colossal artificial spaces, overwhelming geometry, hidden purpose, ancient systems, and structures built at a scale that dwarfs ordinary assumptions.

**Common pressures:**

- orientation;
- interpretation;
- scale;
- systems not designed for the characters.

---

# Common Frame Pairings

These pairings are examples, not automatic selection rules.

## Mystery Direction

```text
Core: Hidden Truth + Investigator’s Burden
System: Clue Web + Hidden Information
```

Creates investigation in which discovering the answer also creates responsibility.

## Survival Direction

```text
Core: Survival Against Overwhelming Force + Entropy / Decay
System: Resource Scarcity + Attrition Combat
```

Creates sustained survival pressure inside a world already deteriorating.

## Transformative Power Direction

```text
Core: Becoming Something Else + Power Has a Cost
System: Corruption / Transformation Track + Upgrade Through Risk
```

Creates advancement through choices that visibly reshape the characters.

## Political Instability Direction

```text
Core: War of Ideologies + Power Vacuum
System: Faction Reputation + Influence / Social Leverage
```

Creates a faction-driven campaign in which every intervention strengthens one possible future.

## Responsive World Direction

```text
Core: The World Is Alive + Creation vs Destruction
System: Living World Reaction + Exploration Discovery Loop
```

Creates exploration in which the world reacts to what the characters alter, restore, or damage.

## Recurring Legacy Direction

```text
Core: Cycle / Recurrence + Fate vs Free Will
System: Legacy / Inheritance + Living World Reaction
```

Creates pressure around whether inherited patterns can actually be changed.

---

# Potentially Redundant Pairings

These combinations are not forbidden. They require clear differentiation.

## Hidden Truth + Lost Knowledge

Use both only when:

- some information was genuinely forgotten or destroyed;
- other information remains actively concealed;
- recovery and exposure create different kinds of play.

## Survival Against Overwhelming Force + Endless Siege

Use both only when:

- the threat is too large to defeat cleanly;
- and the recurring structure of pressure matters independently.

## Power Has a Cost + Becoming Something Else

Use both only when:

- the cost includes transformation;
- but other costs, obligations, or sacrifices remain important beyond transformation.

## Entropy / Decay + Endless Siege

Use both only when:

- systemic decline and recurring external pressure are separately visible;
- the campaign is not merely repeating “everything gets worse.”

## The World Is Alive + Living World Reaction

This is a valid core-system pairing, but the distinction must remain clear:

- Core: the world is an active participant;
- System: the world changes in response to player action.

---

# High-Contrast Pairings

## Heroic Tone + Entropy / Decay

Creates meaningful resistance inside a deteriorating world. The campaign should emphasize what action can still preserve rather than pretending collapse is absent.

## Hopeful Tone + Post-Apocalyptic Genre

Creates reconstruction rather than despair. The ruins remain real, but the campaign focuses on what can be rebuilt.

## Mythic Tone + Psychological Core

Creates intimate identity conflict with symbolic or legendary weight. Avoid allowing elevated language to obscure personal stakes.

## Lighthearted / Chaotic Tone + Hidden Truth

Creates energetic investigation and surprising discovery. Concealment should generate curiosity and complication rather than dread-heavy betrayal.

## Horror Tone + Heroic Fantasy

Creates capable characters confronting threats that still undermine certainty or control. Heroism should provide agency without eliminating vulnerability.

---

# Youth Experience Patterns

The youth-safe layer should primarily reinterpret existing canonical frames through audience guidance rather than automatically creating a parallel set of runtime Core Frames.

The patterns below remain useful for intake, campaign design, and AI guidance.

## Helping Those in Need

**Primary experience:**  
Someone or something needs assistance. The story centers empathy, understanding, and constructive action.

**Recommended frames:**

- Creation vs Destruction;
- The World Is Alive;
- Hidden Truth, lightly interpreted.

**Recommended systems:**

- Exploration Discovery Loop;
- Living World Reaction;
- Influence / Social Leverage.

---

## Something Is Lost or Missing

**Primary experience:**  
A person, object, creature, route, or piece of information is missing and must be found.

**Recommended frames:**

- Lost Knowledge;
- Hidden Truth, lightly interpreted.

**Recommended systems:**

- Clue Web;
- Exploration Discovery Loop.

---

## The Misunderstood Problem

**Primary experience:**  
What first appears dangerous or wrong is incomplete, misinterpreted, or in need of communication.

**Recommended frames:**

- Hidden Truth;
- The World Is Alive;
- What Is Humanity?, heavily softened and only when appropriate.

**Recommended systems:**

- Influence / Social Leverage;
- Clue Web;
- Living World Reaction.

---

## Fixing What Is Broken

**Primary experience:**  
Something important is damaged, unstable, or no longer working and must be repaired or restored.

**Recommended frames:**

- Creation vs Destruction;
- Lost Knowledge;
- Entropy / Decay, softened toward repair.

**Recommended systems:**

- Exploration Discovery Loop;
- Living World Reaction;
- Resource Scarcity, lightly applied.

---

## The World Reacts to Kindness

**Primary experience:**  
Helpful choices create visible positive consequences in the world.

**Recommended frames:**

- The World Is Alive;
- Creation vs Destruction.

**Recommended systems:**

- Living World Reaction;
- Faction Reputation.

---

## Teamwork Solves Everything

**Primary experience:**  
Challenges require collaboration and shared strengths rather than one dominant solution.

**Recommended frames:**

- Power Comes From Within;
- Creation vs Destruction.

**Recommended systems:**

- Modular Build System;
- Influence / Social Leverage;
- Environmental Combat, lightly interpreted.

---

## A Small Problem That Feels Big

**Primary experience:**  
The stakes are contained but emotionally important to the characters or community.

**Recommended frames:**

- Hidden Truth;
- Lost Knowledge;
- Creation vs Destruction.

**Guidance:**  
Keep danger manageable and resolution concrete. Emotional significance does not require world-scale threat.

---

## Curiosity Leads the Way

**Primary experience:**  
Wonder, exploration, and discovery are the reward rather than survival against danger.

**Recommended frames:**

- Lost Knowledge;
- The World Is Alive.

**Recommended systems:**

- Exploration Discovery Loop;
- Clue Web;
- Living World Reaction.

---

# Translator Signal Notes

Human-facing intake tags are signals, not canonical frames. One tag may influence multiple layers.

Examples:

```text
mystery
→ Core: Hidden Truth, Lost Knowledge
→ System: Clue Web, Hidden Information
```

```text
survival
→ Core: Survival Against Overwhelming Force
→ System: Resource Scarcity, Attrition Combat
```

```text
political
→ Tone: Political Intrigue
→ Core: War of Ideologies, Power Vacuum
→ System: Faction Reputation, Influence / Social Leverage
```

```text
heroic
→ Tone: Heroic
→ Core: Power Comes From Within
```

```text
tense
→ Tone: Tense
→ System: Time Pressure, Escalation Meter
```

```text
exploration
→ Core: Lost Knowledge, The World Is Alive
→ System: Exploration Discovery Loop
```

Avoidance signals should remove or downweight entries rather than becoming positive frames.

Examples:

```text
avoid grimdark
→ reduce Grimdark Tone
```

```text
avoid heavy politics
→ reduce War of Ideologies, Power Vacuum, Political Intrigue
```

```text
avoid rules overload
→ reduce complexity and avoid stacking systems
```

Complexity preferences should eventually become structured modifiers rather than content frames.

Examples:

- narrative-heavy;
- tactical-heavy;
- crunchy;
- light;
- beginner-friendly;
- medium complexity.

---

# Campaign Recipe Examples

Recipes demonstrate combinations. They are not canonical entries.

## Western Horror

```text
Core: Hidden Truth + Something Is Wrong
System: Hidden Information + Escalation Meter
Setting: variable
Aesthetic: Western
World Condition: Frontier
Tone: Horror + Psychological
Environment: Desert Wasteland + Frontier Wildlands
```

## Science-Fiction Noir

```text
Core: Hidden Truth + Investigator’s Burden
System: Clue Web + Influence / Social Leverage
Setting: Science Fiction
Aesthetic: Noir
World Condition: Corporate or Institutionally Controlled
Tone: Noir
Environment: Dense Urban Station or Ancient Megastructure
```

## Gothic Political Drama

```text
Core: War of Ideologies + Power Vacuum
System: Faction Reputation + Alliance vs Betrayal
Era: Victorian
Aesthetic: Gothic
World Condition: Industrializing and Institutionally Rigid
Tone: Political Intrigue + Psychological
Environment: Dense City
```

## Norse Mythic Frontier

```text
Core: Fate vs Free Will + Cycle / Recurrence
System: Legacy / Inheritance + Exploration Discovery Loop
Setting: Fantasy
Era or Social Frame: Feudal
Cultural Brush: Norse
World Condition: Frontier under growing instability
Tone: Mythic
Environment: Frozen Expanse + Mountain Highlands
```

## Eldritch Science-Fiction Collapse

```text
Core: Something Is Wrong + What Is Humanity?
System: Hidden Information + Escalation Meter
Setting: Science Fiction
Aesthetic: Eldritch
World Condition: Collapsing Infrastructure
Tone: Horror or Psychological
Environment: Ancient Megastructure
```

## Western Survival

```text
Core: Survival Against Overwhelming Force + Entropy / Decay
System: Resource Scarcity + Attrition Combat
Aesthetic: Western
World Condition: Frontier
Tone: Tense or Grimdark
Environment: Desert Wasteland + Frontier Wildlands
```

## Transformative Dark Fantasy

```text
Core: Becoming Something Else + Power Has a Cost
System: Corruption / Transformation Track + Upgrade Through Risk
Setting: Fantasy
Aesthetic: Dark Fantasy
World Condition: Decaying
Tone: Grimdark or Psychological
Environment: Ruined Civilization + Dense Jungle
```

---

# Deprecated, Experimental, and Unverified Concepts

## Preserve for Source Verification

The following concepts have clear design value but should not be called implemented until checked against the current data files:

### Core Frames

- `power_is_stolen_or_borrowed`
- `exploration_wonder`
- `found_family`
- `duty_vs_self`
- `moral_grayness`

### System Frames

- `death_respawn_loop`
- `time_pressure_system`
- `territory_control`
- `economy_and_trade`

### Genre, Setting, or Brush Concepts

- `mythological`
- Urban Modern
- Contemporary Supernatural
- explicit punk aesthetics
- specific cultural or mythological brushes

---

## Likely Modifier Concepts

These should probably not become Core or System Frames:

- serious world, chaotic players;
- narrative-heavy;
- tactical-heavy;
- crunchy;
- beginner-friendly;
- light complexity;
- intensity caps;
- softness or severity constraints.

These belong in a future modifier or constraint layer.

---

## Rejected Combined Concepts

Do not add bundled concepts when composition can create them:

- frontier horror;
- political intrigue system;
- dark survival mystery;
- cyberpunk rebellion;
- Victorian horror investigation.

Split them into their appropriate layers.

---

# Expansion Guidance

Before adding a new entry, confirm that it:

1. represents a specific experience, tension, or recurring player behavior;
2. works across multiple settings;
3. changes output in an identifiable way;
4. cannot already be created through composition;
5. does not duplicate an existing entry;
6. belongs to the correct layer;
7. has enough distinction to justify selection, mapping, voice, and testing support.

If an idea is useful but not yet proven, place it in the Entry Decisions Log under review rather than adding it directly to runtime data.

---

# Adding or Revising an Entry

Use the New Entry Review template before changing source data.

A complete accepted entry should eventually define:

- canonical ID;
- readable name;
- layer;
- concise meaning;
- player-facing `pitchText` where required;
- distinction from nearby entries;
- tags or mapping signals;
- pairing guidance;
- safety or youth interpretation notes where relevant;
- voice coverage;
- test coverage.

When an apparent new concept overlaps an existing one, prefer refining the existing entry rather than expanding the taxonomy.

---

# Final Doctrine

The Distillery works because it separates meaning, behavior, delivery, narrative framing, and physical context.

```text
Core Frames → what it is about
System Frames → how it plays
Setting / Genre Layers → what kind of fictional language frames it
Tone Skins → how it feels
Environment Skins → where it happens
Constraints and Modifiers → how strongly or safely those elements are expressed
```

The library should remain broad enough to support many campaigns, but disciplined enough that every entry has a distinct job.
