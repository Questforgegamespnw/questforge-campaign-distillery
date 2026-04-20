// src/config/intakeEnums.js

const TONES = [
    "lighthearted_and_fun",
    "adventurous_with_some_serious_moments",
    "dramatic_and_emotionally_weighty",
    "dark_and_dangerous",
    "bleak_brutal_and_high_stakes",
    "chaotic_lighthearted"
];

const TONE_ALIASES = {
    // canonical/internal values
    "lighthearted_and_fun": "lighthearted_and_fun",
    "adventurous_with_some_serious_moments": "adventurous_with_some_serious_moments",
    "dramatic_and_emotionally_weighty": "dramatic_and_emotionally_weighty",
    "dark_and_dangerous": "dark_and_dangerous",
    "bleak_brutal_and_high_stakes": "bleak_brutal_and_high_stakes",
    "chaotic_lighthearted": "chaotic_lighthearted",

    // legacy/internal alias
    "lighthearted_chaotic": "chaotic_lighthearted",

    // normalized human-readable labels
    "lighthearted and fun": "lighthearted_and_fun",
    "adventurous with some serious moments": "adventurous_with_some_serious_moments",
    "dramatic and emotionally weighty": "dramatic_and_emotionally_weighty",
    "dark and dangerous": "dark_and_dangerous",
    "bleak brutal and high stakes": "bleak_brutal_and_high_stakes",
    "chaotic lighthearted": "chaotic_lighthearted"
};

const GENRES = [
    "classic_fantasy",
    "dark_fantasy",
    "gothic_victorian",
    "western_frontier",
    "feudal_eastern",
    "sci_fi_spacefaring",
    "post_apocalyptic",
    "mythic_divine",
    "weird_surreal_otherworldly"
];

const GENRE_ALIASES = {
    // canonical/internal values
    "classic_fantasy": "classic_fantasy",
    "dark_fantasy": "dark_fantasy",
    "gothic_victorian": "gothic_victorian",
    "western_frontier": "western_frontier",
    "feudal_eastern": "feudal_eastern",
    "sci_fi_spacefaring": "sci_fi_spacefaring",
    "post_apocalyptic": "post_apocalyptic",
    "mythic_divine": "mythic_divine",
    "weird_surreal_otherworldly": "weird_surreal_otherworldly",

    // normalized human-readable labels
    "classic fantasy": "classic_fantasy",
    "dark fantasy": "dark_fantasy",
    "gothic victorian": "gothic_victorian",
    "western frontier": "western_frontier",
    "feudal eastern": "feudal_eastern",
    "sci fi spacefaring": "sci_fi_spacefaring",
    "post apocalyptic": "post_apocalyptic",
    "mythic divine": "mythic_divine",
    "weird surreal otherworldly": "weird_surreal_otherworldly"
};

const ENVIRONMENTS = [
    "cities_and_urban_intrigue",
    "jungles_and_overgrown_ruins",
    "frozen_wastes",
    "deserts_and_wastelands",
    "coastlines_islands_and_oceans",
    "mountains_and_wild_frontiers",
    "underground_caverns_and_deep_places",
    "ancient_ruins_and_fallen_civilizations",
    "strange_dreamlike_or_reality_warped_places"
];

const ENVIRONMENT_ALIASES = {
    // canonical/internal values
    "cities_and_urban_intrigue": "cities_and_urban_intrigue",
    "jungles_and_overgrown_ruins": "jungles_and_overgrown_ruins",
    "frozen_wastes": "frozen_wastes",
    "deserts_and_wastelands": "deserts_and_wastelands",
    "coastlines_islands_and_oceans": "coastlines_islands_and_oceans",
    "mountains_and_wild_frontiers": "mountains_and_wild_frontiers",
    "underground_caverns_and_deep_places": "underground_caverns_and_deep_places",
    "ancient_ruins_and_fallen_civilizations": "ancient_ruins_and_fallen_civilizations",
    "strange_dreamlike_or_reality_warped_places": "strange_dreamlike_or_reality_warped_places",

    // normalized human-readable labels
    "cities and urban intrigue": "cities_and_urban_intrigue",
    "jungles and overgrown ruins": "jungles_and_overgrown_ruins",
    "frozen wastes": "frozen_wastes",
    "deserts and wastelands": "deserts_and_wastelands",
    "coastlines islands and oceans": "coastlines_islands_and_oceans",
    "mountains and wild frontiers": "mountains_and_wild_frontiers",
    "underground caverns and deep places": "underground_caverns_and_deep_places",
    "ancient ruins and fallen civilizations": "ancient_ruins_and_fallen_civilizations",
    "strange dreamlike or reality warped places": "strange_dreamlike_or_reality_warped_places"
};

module.exports = {
    TONES,
    TONE_ALIASES,
    GENRES,
    GENRE_ALIASES,
    ENVIRONMENTS,
    ENVIRONMENT_ALIASES
};