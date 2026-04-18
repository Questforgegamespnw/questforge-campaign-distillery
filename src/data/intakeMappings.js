module.exports = {
  overallExperience: {
    surviving_against_dangerous_odds: {
      coreFrames: [
        { id: "survival_against_overwhelming_force", weight: 5 },
        { id: "entropy_decay", weight: 4 },
        { id: "the_endless_siege", weight: 3 }
      ],
      systemFrames: [
        { id: "resource_scarcity", weight: 5 },
        { id: "attrition_combat", weight: 4 },
        { id: "escalation_meter", weight: 3 }
      ]
    },

    solving_mysteries_and_uncovering_secrets: {
      coreFrames: [
        { id: "hidden_truth", weight: 5 },
        { id: "lost_knowledge", weight: 4 },
        { id: "investigators_burden", weight: 3 }
      ],
      systemFrames: [
        { id: "clue_web", weight: 5 },
        { id: "hidden_information", weight: 4 }
      ]
    },

    big_heroic_action_and_epic_moments: {
      coreFrames: [
        { id: "creation_vs_destruction", weight: 4 },
        { id: "power_comes_from_within", weight: 5 }
      ],
      systemFrames: [
        { id: "asymmetrical_boss_design", weight: 5 },
        { id: "upgrade_through_risk", weight: 4 }
      ]
    },

    political_tension_factions_and_tough_choices: {
      coreFrames: [
        { id: "war_of_ideologies", weight: 5 },
        { id: "power_vacuum", weight: 4 }
      ],
      systemFrames: [
        { id: "faction_reputation", weight: 5 },
        { id: "alliance_vs_betrayal", weight: 4 },
        { id: "influence_social_leverage", weight: 3 }
      ]
    },

    exploration_and_discovering_strange_places: {
      coreFrames: [
        { id: "lost_knowledge", weight: 5 },
        { id: "the_world_is_alive", weight: 4 }
      ],
      systemFrames: [
        { id: "exploration_discovery_loop", weight: 5 },
        { id: "environmental_combat", weight: 3 }
      ]
    },

    horror_tension_and_unsettling_threats: {
      coreFrames: [
        { id: "something_is_wrong", weight: 5 },
        { id: "power_has_a_cost", weight: 4 },
        { id: "what_is_humanity", weight: 3 }
      ],
      systemFrames: [
        { id: "escalation_meter", weight: 5 },
        { id: "hidden_information", weight: 4 },
        { id: "resource_scarcity", weight: 3 }
      ]
    },

    character_driven_drama_and_meaningful_personal_arcs: {
      coreFrames: [
        { id: "fate_vs_free_will", weight: 4 },
        { id: "fragmented_self", weight: 5 },
        { id: "becoming_something_else", weight: 4 }
      ],
      systemFrames: [
        { id: "corruption_transformation_track", weight: 4 },
        { id: "legacy_inheritance_system", weight: 3 },
        { id: "modular_build_system", weight: 3 }
      ]
    }
  },

  tone: {
    lighthearted_and_fun: {
      toneSkins: [
        { id: "lighthearted_chaotic", weight: 5 }
      ]
    },

    adventurous_with_some_serious_moments: {
      toneSkins: [
        { id: "heroic", weight: 5 }
      ]
    },

    dramatic_and_emotionally_weighty: {
      toneSkins: [
        { id: "psychological", weight: 4 },
        { id: "mythic", weight: 3 }
      ]
    },

    dark_and_dangerous: {
      toneSkins: [
        { id: "grimdark", weight: 4 },
        { id: "horror", weight: 3 }
      ]
    },

    bleak_brutal_and_high_stakes: {
      toneSkins: [
        { id: "grimdark", weight: 5 }
      ]
    },
    chaotic_lighthearted: {
      toneSkins: [
        { id: "lighthearted_chaotic", weight: 5 }
      ]
    },
  },

  worldAesthetic: {
    classic_fantasy: {
      genreSkins: [
        { id: "classic_fantasy", weight: 5 }
      ]
    },

    dark_fantasy: {
      genreSkins: [
        { id: "dark_fantasy", weight: 5 }
      ]
    },

    gothic_victorian: {
      genreSkins: [
        { id: "victorian_gothic", weight: 5 }
      ]
    },

    western_frontier: {
      genreSkins: [
        { id: "western_frontier", weight: 5 }
      ]
    },

    feudal_eastern: {
      genreSkins: [
        { id: "feudal_eastern", weight: 5 }
      ]
    },

    sci_fi_spacefaring: {
      genreSkins: [
        { id: "sci_fi", weight: 5 }
      ]
    },

    post_apocalyptic: {
      genreSkins: [
        { id: "post_apocalyptic", weight: 5 }
      ]
    },

    mythic_divine: {
      genreSkins: [
        { id: "heroic_fantasy", weight: 4 }
      ],
      toneSkins: [
        { id: "mythic", weight: 3 }
      ]
    },

    weird_surreal_otherworldly: {
      genreSkins: [
        { id: "cosmic_eldritch", weight: 4 }
      ],
      environmentSkins: [
        { id: "otherworld_abstract", weight: 3 }
      ]
    }
  },

  environments: {
    cities_and_urban_intrigue: {
      environmentSkins: [
        { id: "dense_city_urban", weight: 5 }
      ]
    },

    jungles_and_overgrown_ruins: {
      environmentSkins: [
        { id: "dense_jungle_overgrowth", weight: 5 },
        { id: "ruined_civilization", weight: 3 }
      ]
    },

    frozen_wastes: {
      environmentSkins: [
        { id: "frozen_expanse", weight: 5 }
      ]
    },

    deserts_and_wastelands: {
      environmentSkins: [
        { id: "desert_wasteland", weight: 5 }
      ]
    },

    coastlines_islands_and_oceans: {
      environmentSkins: [
        { id: "coastal_oceanic", weight: 5 }
      ]
    },

    mountains_and_wild_frontiers: {
      environmentSkins: [
        { id: "frontier_wildlands", weight: 4 }
      ]
    },

    underground_caverns_and_deep_places: {
      environmentSkins: [
        { id: "underground_caverns", weight: 5 }
      ]
    },

    ancient_ruins_and_fallen_civilizations: {
      environmentSkins: [
        { id: "ruined_civilization", weight: 5 }
      ]
    },

    strange_dreamlike_or_reality_warped_places: {
      environmentSkins: [
        { id: "otherworld_abstract", weight: 5 }
      ]
    }
  },

  conflict: {
    a_dying_or_collapsing_world: {
      coreFrames: [
        { id: "entropy_decay", weight: 5 }
      ]
    },

    war_between_major_factions: {
      coreFrames: [
        { id: "war_of_ideologies", weight: 5 },
        { id: "power_vacuum", weight: 4 }
      ]
    },

    a_hidden_truth_that_must_be_uncovered: {
      coreFrames: [
        { id: "hidden_truth", weight: 5 }
      ]
    },

    dangerous_powers_with_a_heavy_cost: {
      coreFrames: [
        { id: "power_has_a_cost", weight: 5 }
      ]
    },

    survival_against_overwhelming_enemies: {
      coreFrames: [
        { id: "survival_against_overwhelming_force", weight: 5 },
        { id: "the_endless_siege", weight: 4 }
      ]
    },

    a_struggle_over_who_controls_the_future: {
      coreFrames: [
        { id: "power_vacuum", weight: 5 },
        { id: "fate_vs_free_will", weight: 3 }
      ]
    },

    a_curse_corruption_or_spreading_madness: {
      coreFrames: [
        { id: "becoming_something_else", weight: 4 },
        { id: "what_is_humanity", weight: 4 },
        { id: "something_is_wrong", weight: 5 }
      ]
    },

    ancient_forces_returning: {
      coreFrames: [
        { id: "lost_knowledge", weight: 4 },
        { id: "cycle_recurrence", weight: 3 }
      ]
    }
  },

  choiceWeight: {
    mostly_along_for_the_ride: {
      modifiers: {
        choiceIntensity: 1,
        branchingWeight: 1,
        factionPressure: -1
      }
    },

    some_meaningful_choices: {
      modifiers: {
        choiceIntensity: 2,
        branchingWeight: 2
      }
    },

    strong_choices_with_lasting_consequences: {
      systemFrames: [
        { id: "faction_reputation", weight: 3 },
        { id: "alliance_vs_betrayal", weight: 3 },
        { id: "living_world_reaction", weight: 3 }
      ],
      modifiers: {
        choiceIntensity: 4,
        branchingWeight: 4
      }
    },

    we_want_our_decisions_to_define_the_campaign: {
      coreFrames: [
        { id: "war_of_ideologies", weight: 3 },
        { id: "power_vacuum", weight: 3 }
      ],
      systemFrames: [
        { id: "legacy_inheritance_system", weight: 3 },
        { id: "living_world_reaction", weight: 4 }
      ],
      modifiers: {
        choiceIntensity: 5,
        branchingWeight: 5
      }
    }
  },

  gameplay: {
    tactical_combat: {
      systemFrames: [
        { id: "tactical_positioning_zone_control", weight: 5 }
      ]
    },

    dangerous_boss_fights: {
      systemFrames: [
        { id: "asymmetrical_boss_design", weight: 5 }
      ]
    },

    investigation_and_clue_solving: {
      systemFrames: [
        { id: "clue_web", weight: 5 }
      ]
    },

    exploration_and_discovery: {
      systemFrames: [
        { id: "exploration_discovery_loop", weight: 5 }
      ]
    },

    social_intrigue_and_negotiations: {
      systemFrames: [
        { id: "influence_social_leverage", weight: 5 }
      ]
    },

    resource_management_and_survival_pressure: {
      systemFrames: [
        { id: "resource_scarcity", weight: 5 }
      ]
    },

    building_alliances_or_choosing_factions: {
      systemFrames: [
        { id: "faction_reputation", weight: 4 },
        { id: "alliance_vs_betrayal", weight: 5 }
      ]
    },

    character_growth_and_transformation: {
      systemFrames: [
        { id: "corruption_transformation_track", weight: 4 },
        { id: "modular_build_system", weight: 4 }
      ]
    }
  },

  playerFantasy: {
    becoming_heroes: {
      coreFrames: [
        { id: "power_comes_from_within", weight: 5 }
      ],
      toneSkins: [
        { id: "heroic", weight: 4 }
      ]
    },

    surviving_impossible_odds: {
      coreFrames: [
        { id: "survival_against_overwhelming_force", weight: 5 },
        { id: "the_endless_siege", weight: 4 }
      ]
    },

    mastering_dangerous_power: {
      coreFrames: [
        { id: "power_has_a_cost", weight: 4 },
        { id: "power_must_be_controlled", weight: 5 }
      ]
    },

    uncovering_forbidden_truth: {
      coreFrames: [
        { id: "hidden_truth", weight: 5 },
        { id: "investigators_burden", weight: 4 }
      ]
    },

    changing_the_world: {
      coreFrames: [
        { id: "creation_vs_destruction", weight: 4 },
        { id: "power_vacuum", weight: 4 }
      ]
    },

    holding_the_line_against_disaster: {
      coreFrames: [
        { id: "the_endless_siege", weight: 5 },
        { id: "war_of_ideologies", weight: 3 }
      ]
    },

    deciding_who_to_trust_and_betray: {
      coreFrames: [
        { id: "power_vacuum", weight: 4 },
        { id: "war_of_ideologies", weight: 4 }
      ],
      systemFrames: [
        { id: "alliance_vs_betrayal", weight: 5 }
      ]
    },

    discovering_who_we_really_are: {
      coreFrames: [
        { id: "fragmented_self", weight: 5 },
        { id: "fate_vs_free_will", weight: 4 },
        { id: "becoming_something_else", weight: 4 }
      ]
    }
  }
};