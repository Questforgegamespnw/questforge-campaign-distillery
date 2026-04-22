module.exports = [
  {
    id: "death_respawn_loop",
    name: "Death / Respawn Loop",
    family: "loop_progression",
    archetype: "iterative_failure",
    description: "Failure is expected, and progress comes through repetition, return, and learning from previous attempts.",
    pitchText: "failing forward, learning from each attempt, and coming back with a better sense of what it will take",
    tags: ["loop", "failure", "iteration", "learning", "pressure"]
  },
  {
    id: "escalation_meter",
    name: "Escalation Meter",
    family: "loop_progression",
    archetype: "rising_pressure",
    description: "The longer events continue or the more certain actions are taken, the worse consequences become.",
    pitchText: "managing problems before they spiral out of control",
    tags: ["pressure", "madness", "corruption", "heat", "countdown"]
  },
  {
    id: "resource_scarcity",
    name: "Resource Scarcity",
    family: "loop_progression",
    archetype: "hard_choices",
    description: "The players never have enough time, safety, light, healing, or supplies, so every decision costs something.",
    pitchText: "making hard calls when time, safety, and supplies are always running short",
    tags: ["survival", "scarcity", "pressure", "attrition", "endurance"]
  },
  {
    id: "upgrade_through_risk",
    name: "Upgrade Through Risk",
    family: "loop_progression",
    archetype: "high_risk_growth",
    description: "The best rewards come from the most dangerous opportunities, tying advancement directly to risk-taking.",
    pitchText: "taking bigger risks in order to earn the rewards worth chasing",
    tags: ["risk_reward", "growth", "danger", "optional_challenge", "power"]
  },
  {
    id: "clue_web",
    name: "Clue Web",
    family: "information_investigation",
    archetype: "fragmented_truth",
    description: "Players assemble scattered clues into a larger understanding rather than following a single linear trail.",
    pitchText: "following scattered clues and slowly piecing together the bigger picture",
    tags: ["investigation", "clues", "mystery", "discovery", "deduction"]
  },
  {
    id: "hidden_information",
    name: "Hidden Information",
    family: "information_investigation",
    archetype: "partial_knowledge",
    description: "Players never have the full picture, and uncertainty becomes part of the tension.",
    pitchText: "working with incomplete information and uncovering what others keep hidden",
    tags: ["mystery", "uncertainty", "partial_knowledge", "lies", "paranoia"]
  },
  {
    id: "time_pressure_system",
    name: "Time Pressure System",
    family: "information_investigation",
    archetype: "cost_of_delay",
    description: "The players cannot do everything, and delays allow threats, events, or rivals to advance without them.",
    pitchText: "deciding what to pursue before delays make the situation worse",
    tags: ["urgency", "countdown", "pressure", "consequences", "timing"]
  },
  {
    id: "asymmetrical_boss_design",
    name: "Asymmetrical Boss Design",
    family: "combat_encounter",
    archetype: "setpiece_enemy",
    description: "Enemies break normal expectations and create memorable multi-phase setpiece encounters.",
    pitchText: "facing enemies that force new tactics instead of routine fights",
    tags: ["boss_fights", "setpiece", "combat", "special_mechanics", "phases"]
  },
  {
    id: "environmental_combat",
    name: "Environmental Combat",
    family: "combat_encounter",
    archetype: "terrain_matters",
    description: "The battlefield matters as much as the enemies, with hazards, terrain, and interaction shaping the fight.",
    pitchText: "surviving fights where hazards and terrain matter as much as the enemies",
    tags: ["terrain", "hazards", "positioning", "combat", "interaction"]
  },
  {
    id: "attrition_combat",
    name: "Attrition Combat",
    family: "combat_encounter",
    archetype: "endurance_conflict",
    description: "Victory is about lasting through repeated pressure, with multiple encounters wearing the players down over time.",
    pitchText: "pushing through repeated pressure and feeling every fight take something out of the group",
    tags: ["attrition", "combat", "survival", "pressure", "endurance"]
  },
  {
    id: "tactical_positioning_zone_control",
    name: "Tactical Positioning / Zone Control",
    family: "combat_encounter",
    archetype: "movement_dominance",
    description: "Movement, territory, chokepoints, and positioning become central to how encounters are won or lost.",
    pitchText: "managing movement, chokepoints, and battlefield control under pressure",
    tags: ["movement", "positioning", "zones", "territory", "tactics"]
  },
  {
    id: "faction_reputation",
    name: "Faction Reputation",
    family: "faction_social",
    archetype: "dynamic_standing",
    description: "Player actions shift their standing with factions, unlocking opportunities or closing doors over time.",
    pitchText: "dealing with alliances and rivalries that shift based on what the group does",
    tags: ["social", "political", "reputation", "consequence", "factions"]
  },
  {
    id: "alliance_vs_betrayal",
    name: "Alliance vs Betrayal",
    family: "faction_social",
    archetype: "unclean_choice",
    description: "No alliance is simple, and choosing sides carries long-term consequences, tension, and compromise.",
    pitchText: "choosing who to trust when every alliance comes with tension and compromise",
    tags: ["alliances", "betrayal", "factions", "consequences", "choice"]
  },
  {
    id: "influence_social_leverage",
    name: "Influence / Social Leverage",
    family: "faction_social",
    archetype: "social_pressure",
    description: "Words, alliances, leverage, and negotiation shape the campaign as much as combat does.",
    pitchText: "using pressure, negotiation, and leverage to move people and situations",
    tags: ["social", "intrigue", "negotiation", "factions", "influence"]
  },
  {
    id: "living_world_reaction",
    name: "Living World Reaction",
    family: "world_interaction",
    archetype: "dynamic_response",
    description: "The world responds to player action over time, with areas, threats, and NPC behavior changing in reaction.",
    pitchText: "seeing the world change in response to the group’s actions",
    tags: ["living_world", "reaction", "change", "npc_response", "consequence"]
  },
  {
    id: "territory_control",
    name: "Territory Control",
    family: "world_interaction",
    archetype: "map_pressure",
    description: "Players shape the map by capturing, defending, or losing meaningful locations over the course of play.",
    pitchText: "capturing, defending, and losing ground that changes the wider situation",
    tags: ["territory", "map", "strategy", "control", "war"]
  },
  {
    id: "exploration_discovery_loop",
    name: "Exploration Discovery Loop",
    family: "world_interaction",
    archetype: "uncovering_space",
    description: "Progress comes from uncovering new places, secrets, paths, and environmental story buried in the world.",
    pitchText: "exploring strange places and uncovering what they reveal",
    tags: ["exploration", "discovery", "secrets", "travel", "environment"]
  },
  {
    id: "corruption_transformation_track",
    name: "Corruption / Transformation Track",
    family: "player_evolution",
    archetype: "power_changes_you",
    description: "Power changes the characters over time, creating tradeoffs between strength, identity, and consequence.",
    pitchText: "dealing with power that changes the characters over time",
    tags: ["corruption", "transformation", "power", "tradeoff", "identity"]
  },
  {
    id: "modular_build_system",
    name: "Modular Build System",
    family: "player_evolution",
    archetype: "constructed_identity",
    description: "Players build their identity through flexible components, allowing highly customized growth and expression.",
    pitchText: "shaping identity through modular growth and highly customized choices",
    tags: ["buildcraft", "customization", "identity", "components", "growth"]
  },
  {
    id: "legacy_inheritance_system",
    name: "Legacy / Inheritance System",
    family: "player_evolution",
    archetype: "past_lives_present_impact",
    description: "Previous characters, past selves, or inherited consequences continue shaping the current campaign.",
    pitchText: "dealing with past lives, inherited consequences, or old choices that still shape the present",
    tags: ["legacy", "inheritance", "history", "continuity", "recurrence"]
  },
  {
    id: "heist_structure",
    name: "Heist Structure",
    description: "Planning, execution, and improvisation define high-stakes operations with layered objectives.",
    pitchText: "planning bold operations, adapting when they go sideways, and chasing layered objectives",
    tags: ["planning", "execution", "risk", "strategy"]
  },
  {
    id: "mission_based_play",
    name: "Mission-Based Play",
    description: "The campaign is structured around discrete objectives or contracts, each with clear stakes.",
    pitchText: "moving from one high-stakes objective to the next as each mission shifts the situation",
    tags: ["missions", "objectives", "structure", "progression"]
  },
  {
    id: "downtime_development",
    name: "Downtime Development",
    description: "What happens between missions matters, allowing players to build relationships, resources, and influence.",
    pitchText: "using the space between major conflicts to build relationships, resources, and influence",
    tags: ["downtime", "growth", "social", "recovery"]
  },
  {
    id: "economy_and_trade",
    name: "Economy / Trade System",
    description: "Resources, goods, and trade networks shape player decisions and opportunities.",
    pitchText: "navigating resources, trade, and opportunity as part of the campaign’s momentum",
    tags: ["economy", "resources", "trade", "management"]
  },
  {
    id: "escort_or_protection",
    name: "Escort / Protection System",
    description: "Players must defend or guide something vulnerable through dangerous conditions.",
    pitchText: "protecting something vulnerable while danger keeps closing in",
    tags: ["defense", "escort", "risk", "pressure"]
  }
];