module.exports = [
  {
    id: "ancient",
    name: "Ancient",
    description: "A very old-world frame shaped by early kingdoms, oral tradition, monument building, and fragile institutions.",
    techLevel: "ancient",
    commonTech: ["stonework", "bronze_or_early_iron", "sailing", "chariots", "early_coinage"],
    socialFrame: ["city_states", "temples", "dynasties", "oral_tradition"],
    tags: ["ancient", "monuments", "early_kingdoms", "mythic"]
  },
  {
    id: "bronze_age",
    name: "Bronze Age",
    description: "A heroic early-civilization frame of palace economies, bronze arms, trade routes, gods, and fragile regional powers.",
    techLevel: "bronze_age",
    commonTech: ["bronze_weapons", "chariots", "sailing", "scribal_records"],
    socialFrame: ["palace_economies", "priesthoods", "heroic_lineages", "trade_routes"],
    tags: ["bronze_age", "palaces", "gods", "trade"]
  },
  {
    id: "classical_age",
    name: "Classical Age",
    description: "A classical frame shaped by city-states, empires, philosophy, legions, civic life, and public institutions.",
    techLevel: "classical",
    commonTech: ["iron_weapons", "roads", "aqueducts", "galleys", "written_law"],
    socialFrame: ["city_states", "republics", "empires", "public_forums"],
    tags: ["classical", "empire", "city_states", "civic"]
  },
  {
    id: "late_antiquity",
    name: "Late Antiquity",
    description: "A transitional frame of old empires, religious transformation, border pressure, and institutions trying to outlast decline.",
    techLevel: "late_ancient",
    commonTech: ["roads", "fortified_borders", "manuscripts", "late_imperial_armies"],
    socialFrame: ["declining_empires", "religious_institutions", "frontier_commands"],
    tags: ["late_antiquity", "transition", "declining_empire", "faith"]
  },
  {
    id: "early_medieval",
    name: "Early Medieval",
    description: "A post-imperial frame of small kingdoms, scattered authority, monastic knowledge, raiding pressure, and local survival.",
    techLevel: "early_medieval",
    commonTech: ["iron_weapons", "longships", "fortified_halls", "manuscripts"],
    socialFrame: ["local_lords", "monasteries", "kinship_networks", "fragmented_realms"],
    tags: ["early_medieval", "fragmented", "raids", "local_power"]
  },
  {
    id: "high_medieval",
    name: "High Medieval",
    description: "A medieval adventure frame shaped by castles, guilds, kingdoms, church power, courtly politics, and dangerous roads.",
    techLevel: "medieval",
    commonTech: ["castles", "steel_weapons", "crossbows", "guild_craft", "manuscripts"],
    socialFrame: ["kingdoms", "noble_houses", "guilds", "churches"],
    tags: ["medieval", "castles", "kingdoms", "guilds", "fantasy"]
  },
  {
    id: "late_medieval",
    name: "Late Medieval",
    description: "A late-medieval frame of plague memory, mercenary warfare, unstable crowns, growing cities, and social strain.",
    techLevel: "late_medieval",
    commonTech: ["plate_armor", "early_gunpowder", "crossbows", "printing_precursors"],
    socialFrame: ["cities", "mercenary_companies", "weakening_feudal_orders", "merchant_power"],
    tags: ["late_medieval", "plague", "mercenaries", "cities"]
  },
  {
    id: "feudal",
    name: "Feudal",
    description: "A hierarchical social frame shaped by houses, duty, landholding, inherited obligation, and martial order.",
    techLevel: "pre_modern",
    commonTech: ["fortified_estates", "blades", "bows", "horseback_travel", "scribal_records"],
    socialFrame: ["lineage", "vassalage", "ritual_order", "landholding"],
    tags: ["feudal", "hierarchy", "duty", "lineage"]
  },
  {
    id: "renaissance",
    name: "Renaissance",
    description: "A renaissance frame of city-states, art, science, patronage, intrigue, early gunpowder, and rediscovered knowledge.",
    techLevel: "renaissance",
    commonTech: ["printing_press", "early_firearms", "navigation", "banking", "workshops"],
    socialFrame: ["city_states", "patronage", "merchant_houses", "courts"],
    tags: ["renaissance", "city_states", "art", "science", "intrigue"]
  },
  {
    id: "elizabethan",
    name: "Elizabethan",
    description: "A late renaissance frame of theaters, spies, sea raiders, succession anxiety, religious tension, and courtly intrigue.",
    techLevel: "late_renaissance",
    commonTech: ["printing_press", "muskets", "sailing_ships", "theaters", "coded_letters"],
    socialFrame: ["royal_court", "spies", "privateers", "religious_factions"],
    tags: ["elizabethan", "spies", "theater", "privateers", "court"]
  },
  {
    id: "early_modern",
    name: "Early Modern",
    description: "An early-modern frame of state power, gunpowder, exploration, bureaucracy, religious conflict, and expanding commerce.",
    techLevel: "early_modern",
    commonTech: ["muskets", "printing", "sailing_ships", "bureaucratic_records", "maps"],
    socialFrame: ["centralizing_states", "colonial_charters", "religious_conflict", "merchant_power"],
    tags: ["early_modern", "gunpowder", "states", "commerce"]
  },
  {
    id: "age_of_sail",
    name: "Age of Sail",
    description: "A maritime period shaped by ships, crews, ports, trade routes, ocean crossings, naval power, and wind-driven exploration.",
    techLevel: "sail_and_black_powder",
    commonTech: ["sailing_ships", "cannons", "charts", "sextants", "muskets"],
    socialFrame: ["navies", "ports", "trade_companies", "privateers", "colonial_outposts"],
    tags: ["sail", "ships", "sea", "trade", "exploration"]
  },
  {
    id: "regency",
    name: "Regency",
    description: "A refined social frame of manners, inheritance, salons, scandals, early industrial change, and class expectation.",
    techLevel: "early_industrial",
    commonTech: ["coaches", "letters", "newspapers", "early_factories", "gaslight_precursors"],
    socialFrame: ["aristocracy", "marriage_markets", "salons", "inheritance_law"],
    tags: ["regency", "manners", "class", "scandal"]
  },
  {
    id: "victorian",
    name: "Victorian",
    description: "An industrializing social frame of old institutions, class pressure, public reputation, imperial reach, and modernizing systems.",
    techLevel: "industrial",
    commonTech: ["railroads", "telegraph", "gaslight", "factories", "photography"],
    socialFrame: ["class_hierarchy", "empires", "public_reputation", "scientific_societies"],
    tags: ["victorian", "industrial", "class", "institutions", "empire"]
  },
  {
    id: "edwardian",
    name: "Edwardian",
    description: "A turn-of-the-century frame of fading old orders, modern confidence, social polish, empire, and visible cracks beneath refinement.",
    techLevel: "late_industrial",
    commonTech: ["automobiles", "telephones", "electric_light", "ocean_liners", "early_aircraft"],
    socialFrame: ["high_society", "imperial_confidence", "reform_movements", "class_pressure"],
    tags: ["edwardian", "turn_of_century", "modernity", "class"]
  },
  {
    id: "industrial_revolution",
    name: "Industrial Revolution",
    description: "A period of rapid machinery, urban expansion, labor pressure, exploitation, social upheaval, and technological acceleration.",
    techLevel: "industrializing",
    commonTech: ["steam_engines", "factories", "railroads", "telegraph", "mass_production"],
    socialFrame: ["factory_labor", "urban_poverty", "capitalists", "reformers"],
    tags: ["industry", "machinery", "progress", "upheaval", "labor"]
  },
  {
    id: "gilded_age",
    name: "Gilded Age",
    description: "A late industrial frame of robber barons, rail empires, labor conflict, spectacle wealth, and buried inequality.",
    techLevel: "late_industrial",
    commonTech: ["railroads", "electricity", "telephones", "steel", "industrial_finance"],
    socialFrame: ["tycoons", "labor_unions", "immigration", "political_machines"],
    tags: ["gilded_age", "wealth", "labor", "railroads", "inequality"]
  },
  {
    id: "great_war",
    name: "Great War",
    description: "An early twentieth-century frame of mass armies, trench logic, failing empires, mechanized horror, and shattered certainty.",
    techLevel: "early_mechanized_warfare",
    commonTech: ["machine_guns", "artillery", "trains", "telephones", "early_tanks", "biplanes"],
    socialFrame: ["mass_mobilization", "empires", "war_governments", "field_commands"],
    tags: ["great_war", "trenches", "empires", "mechanized_war"]
  },
  {
    id: "interwar_1920s_1930s",
    name: "Interwar 1920s / 1930s",
    description: "An interwar frame of jazz-age cities, fragile peace, organized crime, radio, early aviation, ideological struggle, and modern anxiety.",
    techLevel: "early_mass_industrial",
    commonTech: ["radio", "automobiles", "trains", "early_aircraft", "telephones", "firearms"],
    socialFrame: ["organized_crime", "mass_media", "fragile_democracies", "ideological_movements"],
    tags: ["interwar", "1920s", "1930s", "radio", "crime", "pulp"]
  },
  {
    id: "wartime_1940s",
    name: "Wartime 1940s",
    description: "A total-war frame of mobilization, espionage, rationing, mechanized conflict, resistance cells, and global stakes.",
    techLevel: "mass_industrial_warfare",
    commonTech: ["radar", "tanks", "submarines", "propeller_aircraft", "radio", "codebreaking"],
    socialFrame: ["wartime_states", "resistance_cells", "intelligence_services", "rationing"],
    tags: ["1940s", "wartime", "espionage", "mobilization", "resistance"]
  },
  {
    id: "atomic_1950s",
    name: "Atomic 1950s",
    description: "A postwar atomic frame of nuclear anxiety, consumer optimism, laboratories, suburbs, rockets, and clean-lined futurism.",
    techLevel: "atomic_analog",
    commonTech: ["nuclear_power", "rockets", "television", "mainframes", "jet_aircraft", "radar"],
    socialFrame: ["suburbs", "laboratories", "civil_defense", "corporate_research"],
    tags: ["1950s", "atomic", "rockets", "suburbs", "cold_war"]
  },
  {
    id: "cold_war",
    name: "Cold War",
    description: "A geopolitical frame of proxy conflict, espionage, ideology, surveillance, space-race ambition, and mutually assured danger.",
    techLevel: "analog_modern",
    commonTech: ["satellites", "mainframes", "jets", "missiles", "spycraft", "television"],
    socialFrame: ["superpowers", "intelligence_agencies", "proxy_states", "classified_programs"],
    tags: ["cold_war", "spies", "ideology", "surveillance", "space_race"]
  },
  {
    id: "late_20th_century",
    name: "Late 20th Century",
    description: "An analog-to-digital frame of malls, videotape, personal computers, corporate media, street culture, and institutional distrust.",
    techLevel: "analog_digital_transition",
    commonTech: ["cassette_media", "television", "personal_computers", "arcades", "landlines", "early_networks"],
    socialFrame: ["corporate_media", "subcultures", "bureaucracies", "consumer_culture"],
    tags: ["late_20th", "analog", "cassette", "media", "corporate"]
  },
  {
    id: "modern",
    name: "Modern",
    description: "A contemporary frame shaped by cities, institutions, public systems, hidden networks, smartphones, and ordinary life under pressure.",
    techLevel: "networked_modern",
    commonTech: ["internet", "smartphones", "surveillance_cameras", "social_media", "global_logistics"],
    socialFrame: ["cities", "states", "corporations", "online_networks", "public_systems"],
    tags: ["modern", "urban", "institutions", "street_level", "networked"]
  },
  {
    id: "near_future",
    name: "Near Future",
    description: "A near-future frame where recognizable life is strained by emerging systems, climate pressure, automation, and fragile institutions.",
    techLevel: "near_future",
    commonTech: ["drones", "advanced_ai", "augmented_reality", "automation", "bioengineering", "climate_infrastructure"],
    socialFrame: ["corporate_states", "strained_cities", "platform_labor", "climate_migration"],
    tags: ["near_future", "automation", "climate", "ai", "corporate"]
  },
  {
    id: "cybernetic_future",
    name: "Cybernetic Future",
    description: "A cybernetic future shaped by networks, augmentation, synthetic life, corporate systems, and blurred boundaries between body and machine.",
    techLevel: "cybernetic",
    commonTech: ["cybernetics", "neural_interfaces", "megacorp_networks", "synthetics", "ubiquitous_surveillance"],
    socialFrame: ["megacorporations", "networked_underclasses", "security_states", "data_markets"],
    tags: ["cybernetic", "augmentation", "networks", "megacorp", "future"]
  },
  {
    id: "spacefaring_future",
    name: "Spacefaring Future",
    description: "A future frame shaped by ships, stations, colonies, orbital infrastructure, vast distance, and life beyond one world.",
    techLevel: "spacefaring",
    commonTech: ["spacecraft", "stations", "habitats", "terraforming_tools", "advanced_sensors", "fusion_or_equivalent_power"],
    socialFrame: ["colonies", "fleets", "station_societies", "interstellar_powers"],
    tags: ["space", "stations", "colonies", "ships", "frontier"]
  },
  {
    id: "far_future",
    name: "Far Future",
    description: "A remote future frame of post-human scale, deep time, strange civilizations, lost technologies, and transformed assumptions.",
    techLevel: "far_future",
    commonTech: ["post_scarcity_systems", "megastructures", "synthetic_ecologies", "deep_time_archives"],
    socialFrame: ["post_human_societies", "ancient_futures", "machine_cultures", "successor_civilizations"],
    tags: ["far_future", "deep_time", "post_human", "megastructure"]
  },
  {
    id: "post_collapse",
    name: "Post-Collapse",
    description: "A post-collapse frame where old systems have already failed and surviving communities rebuild with salvage, memory, and scarcity.",
    techLevel: "salvage_variable",
    commonTech: ["salvage", "improvised_tools", "broken_infrastructure", "reclaimed_machines"],
    socialFrame: ["survivor_enclaves", "scavenger_routes", "new_orders", "ruin_settlements"],
    tags: ["post_collapse", "salvage", "ruins", "rebuilding", "scarcity"]
  },
  {
    id: "timeless_mythic",
    name: "Timeless Mythic",
    description: "A legendary frame where gods, spirits, heroic deeds, symbolic geography, and mythic history stand close to ordinary life.",
    techLevel: "mythic_variable",
    commonTech: ["ritual_tools", "sacred_sites", "heroic_arms", "omens", "oral_law"],
    socialFrame: ["tribes", "kingdoms", "temples", "legendary_lineages"],
    tags: ["myth", "legend", "gods", "heroic", "timeless"]
  }
];

