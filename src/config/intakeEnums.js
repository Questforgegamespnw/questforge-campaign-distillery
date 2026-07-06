// src/config/intakeEnums.js

const eraFrames = require("../data/eraFrames");
const aestheticSkins = require("../data/aestheticSkins");
const worldConditions = require("../data/worldConditions");
const genreSkins = require("../data/genreSkins");

function normalizeAliasKey(value) {
    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/[’']/g, "")
        .replace(/&/g, " and ")
        .replace(/[()]/g, " ")
        .replace(/[\/]/g, " ")
        .replace(/[_-]+/g, " ")
        .replace(/[^a-z0-9]+/g, " ")
        .trim()
        .replace(/\s+/g, " ");
}

function idsFrom(entries = []) {
    return entries.map((entry) => entry.id).filter(Boolean);
}

function buildAliasMap(entries = [], extras = {}) {
    const aliases = {};

    for (const entry of entries) {
        if (!entry || !entry.id) continue;
        aliases[entry.id] = entry.id;

        const normalizedId = normalizeAliasKey(entry.id);
        if (normalizedId) aliases[normalizedId] = entry.id;

        const normalizedName = normalizeAliasKey(entry.name);
        if (normalizedName) aliases[normalizedName] = entry.id;
    }

    for (const [alias, canonical] of Object.entries(extras)) {
        aliases[alias] = canonical;
        const normalizedAlias = normalizeAliasKey(alias);
        if (normalizedAlias) aliases[normalizedAlias] = canonical;
    }

    return aliases;
}

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
    "chaotic lighthearted": "chaotic_lighthearted",
    "heroic": "adventurous_with_some_serious_moments"
};

// Legacy broad genre stays as the Phase 1 flavor bridge, but the canonical
// enum should now match src/data/genreSkins so compatibility expansion can
// reliably percolate into era/aesthetic/world-condition context.
const GENRES = idsFrom(genreSkins);

const GENRE_ALIASES = buildAliasMap(genreSkins, {
    // legacy/internal aliases from older intake values
    "gothic_victorian": "victorian_gothic",
    "sci_fi_spacefaring": "sci_fi",
    "mythic_divine": "mythological",
    "weird_surreal_otherworldly": "cosmic_eldritch",

    // normalized human-readable labels and common variants
    "classic fantasy": "classic_fantasy",
    "dark fantasy": "dark_fantasy",
    "heroic fantasy": "heroic_fantasy",
    "heroic mythic fantasy": "heroic_fantasy",
    "gothic victorian": "victorian_gothic",
    "victorian gothic": "victorian_gothic",
    "western frontier": "western_frontier",
    "feudal eastern": "feudal_eastern",
    "urban modern": "urban_modern",
    "sci fi": "sci_fi",
    "sci fi spacefaring": "sci_fi",
    "science fiction": "sci_fi",
    "spacefaring sci fi": "sci_fi",
    "post apocalyptic": "post_apocalyptic",
    "cosmic eldritch": "cosmic_eldritch",
    "weird surreal otherworldly": "cosmic_eldritch",
    "arcane academia": "arcane_academia",
    "nautical age of sail": "nautical_age_of_sail",
    "industrial revolution": "industrial_revolution",
    "mythic divine": "mythological",
    "mythological": "mythological"
});

const ERAS = idsFrom(eraFrames);
const ERA_ALIASES = buildAliasMap(eraFrames, {
    "bronze age": "bronze_age",
    "classical age": "classical_age",
    "late antiquity": "late_antiquity",
    "early medieval": "early_medieval",
    "high medieval": "high_medieval",
    "late medieval": "late_medieval",
    "age of sail": "age_of_sail",
    "gilded age": "gilded_age",
    "great war": "great_war",
    "world war one": "great_war",
    "wwi": "great_war",
    "interwar": "interwar_1920s_1930s",
    "interwar 1920s 1930s": "interwar_1920s_1930s",
    "1920s 1930s": "interwar_1920s_1930s",
    "wartime 1940s": "wartime_1940s",
    "1940s": "wartime_1940s",
    "world war two": "wartime_1940s",
    "wwii": "wartime_1940s",
    "atomic 1950s": "atomic_1950s",
    "1950s": "atomic_1950s",
    "cold war": "cold_war",
    "late 20th century": "late_20th_century",
    "near future": "near_future",
    "cybernetic future": "cybernetic_future",
    "spacefaring future": "spacefaring_future",
    "far future": "far_future",
    "post collapse": "post_collapse",
    "post-collapse": "post_collapse",
    "timeless mythic": "timeless_mythic"
});

const AESTHETICS = idsFrom(aestheticSkins);
const AESTHETIC_ALIASES = buildAliasMap(aestheticSkins, {
    "classic fantasy": "classic_fantasy",
    "heroic fantasy": "heroic_fantasy",
    "dark fantasy": "dark_fantasy",
    "romantic gothic": "romantic_gothic",
    "folk horror": "folk_horror",
    "fairy tale": "fairy_tale",
    "cosmic eldritch": "cosmic_eldritch",
    "weird surreal": "weird_surreal",
    "arcane academia": "arcane_academia",
    "martial heroic": "martial_heroic",
    "nautical adventure": "nautical_adventure",
    "urban hidden world": "urban_hidden_world",
    "political intrigue": "political_intrigue",
    "space opera": "space_opera",
    "hard sci fi": "hard_sci_fi",
    "science fantasy": "space_opera",
    "post apocalyptic": "post_apocalyptic"
});

const WORLD_CONDITIONS = idsFrom(worldConditions);
const WORLD_CONDITION_ALIASES = buildAliasMap(worldConditions, {
    "hidden world": "hidden_world",
    "sealed world": "sealed_world",
    "expanding empire": "expanding_empire",
    "declining empire": "declining_empire",
    "fallen empire": "fallen_empire",
    "contested borderland": "contested_borderland",
    "war torn": "war_torn",
    "war-torn": "war_torn",
    "post war recovery": "post_war_recovery",
    "scarcity driven": "scarcity_driven",
    "post collapse": "post_collapse",
    "post-collapse": "post_collapse",
    "oppressive order": "oppressive_order",
    "revolutionary pressure": "revolutionary_pressure",
    "fractured realms": "fractured_realms",
    "city states": "city_states",
    "city-states": "city_states",
    "gold rush": "gold_rush",
    "resource boom": "resource_boom",
    "haunted past": "haunted_past",
    "living world": "living_world",
    "dying world": "dying_world",
    "wandering world": "wandering_world",
    "corporate controlled": "corporate_controlled",
    "surveillance state": "surveillance_state",
    "ecological recovery": "ecological_recovery",
    "ecological collapse": "ecological_collapse",
    "technological runaway": "technological_runaway",
    "lost golden age": "lost_golden_age",
    "maritime routes": "maritime_routes",
    "social upheaval": "social_upheaval"
});

const ENVIRONMENTS = [
    "cities_and_urban_intrigue",
    "jungles_and_overgrown_ruins",
    "frozen_wastes",
    "deserts_and_wastelands",
    "coastlines_islands_and_oceans",
    "mountains_and_wild_frontiers",
    "underground_caverns_and_deep_places",
    "ancient_ruins_and_fallen_civilizations",
    "strange_dreamlike_or_reality_warped_places",
    "volcanic_lands_and_fire_scarred_regions"
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
    "volcanic_lands_and_fire_scarred_regions": "volcanic_lands_and_fire_scarred_regions",

    // normalized human-readable labels
    "cities and urban intrigue": "cities_and_urban_intrigue",
    "dense cities and urban intrigue": "cities_and_urban_intrigue",
    "jungles and overgrown ruins": "jungles_and_overgrown_ruins",
    "frozen wastes": "frozen_wastes",
    "deserts and wastelands": "deserts_and_wastelands",
    "coastlines islands and oceans": "coastlines_islands_and_oceans",
    "mountains and wild frontiers": "mountains_and_wild_frontiers",
    "underground caverns and deep places": "underground_caverns_and_deep_places",
    "ancient ruins and fallen civilizations": "ancient_ruins_and_fallen_civilizations",
    "strange dreamlike or reality warped places": "strange_dreamlike_or_reality_warped_places",
    "dreamlike or reality warped places": "strange_dreamlike_or_reality_warped_places",
    "volcanic lands and fire scarred regions": "volcanic_lands_and_fire_scarred_regions"
};

module.exports = {
    normalizeAliasKey,
    TONES,
    TONE_ALIASES,
    GENRES,
    GENRE_ALIASES,
    ERAS,
    ERA_ALIASES,
    AESTHETICS,
    AESTHETIC_ALIASES,
    WORLD_CONDITIONS,
    WORLD_CONDITION_ALIASES,
    ENVIRONMENTS,
    ENVIRONMENT_ALIASES
};
