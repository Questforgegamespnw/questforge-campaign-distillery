const LEGACY_GENRE_LAYER_MAP = Object.freeze({
  classic_fantasy: {
    eraFrames: [{ id: "high_medieval", weight: 3 }, { id: "timeless_mythic", weight: 1 }],
    aestheticSkins: [{ id: "classic_fantasy", weight: 5 }],
    worldConditions: []
  },
  dark_fantasy: {
    eraFrames: [{ id: "late_medieval", weight: 2 }, { id: "high_medieval", weight: 1 }],
    aestheticSkins: [{ id: "dark_fantasy", weight: 5 }, { id: "grimdark", weight: 1 }],
    worldConditions: [{ id: "collapsing", weight: 2 }, { id: "haunted_past", weight: 1 }]
  },
  heroic_fantasy: {
    eraFrames: [{ id: "high_medieval", weight: 2 }, { id: "timeless_mythic", weight: 2 }],
    aestheticSkins: [{ id: "heroic_fantasy", weight: 5 }, { id: "noblebright", weight: 1 }],
    worldConditions: []
  },
  western_frontier: {
    eraFrames: [{ id: "gilded_age", weight: 2 }, { id: "industrial_revolution", weight: 1 }],
    aestheticSkins: [{ id: "western", weight: 5 }],
    worldConditions: [
      { id: "frontier", weight: 5 },
      { id: "lawless", weight: 3 },
      { id: "isolated", weight: 2 }
    ]
  },
  victorian_gothic: {
    eraFrames: [{ id: "victorian", weight: 5 }, { id: "industrial_revolution", weight: 1 }],
    aestheticSkins: [{ id: "gothic", weight: 5 }, { id: "romantic_gothic", weight: 1 }],
    worldConditions: [{ id: "urbanized", weight: 3 }, { id: "haunted_past", weight: 2 }]
  },
  feudal_eastern: {
    eraFrames: [{ id: "feudal", weight: 5 }],
    aestheticSkins: [{ id: "martial_heroic", weight: 4 }, { id: "mythological", weight: 2 }],
    worldConditions: [{ id: "institutional", weight: 2 }, { id: "contested_borderland", weight: 1 }]
  },
  urban_modern: {
    eraFrames: [{ id: "modern", weight: 5 }],
    aestheticSkins: [{ id: "urban_hidden_world", weight: 4 }, { id: "noir", weight: 1 }],
    worldConditions: [{ id: "urbanized", weight: 5 }, { id: "hidden_world", weight: 2 }]
  },
  sci_fi: {
    eraFrames: [{ id: "spacefaring_future", weight: 4 }, { id: "near_future", weight: 1 }],
    aestheticSkins: [{ id: "hard_sci_fi", weight: 3 }, { id: "space_opera", weight: 2 }],
    worldConditions: [{ id: "technological_runaway", weight: 1 }, { id: "frontier", weight: 1 }]
  },
  post_apocalyptic: {
    eraFrames: [{ id: "post_collapse", weight: 5 }],
    aestheticSkins: [{ id: "post_apocalyptic", weight: 5 }],
    worldConditions: [
      { id: "post_collapse", weight: 5 },
      { id: "scarcity_driven", weight: 3 },
      { id: "collapsing", weight: 1 }
    ]
  },
  cosmic_eldritch: {
    eraFrames: [],
    aestheticSkins: [{ id: "cosmic_eldritch", weight: 5 }, { id: "weird_surreal", weight: 1 }],
    worldConditions: [{ id: "isolated", weight: 2 }, { id: "hidden_world", weight: 2 }]
  },
  arcane_academia: {
    eraFrames: [{ id: "high_medieval", weight: 1 }, { id: "modern", weight: 1 }],
    aestheticSkins: [{ id: "arcane_academia", weight: 5 }],
    worldConditions: [{ id: "institutional", weight: 4 }, { id: "hidden_world", weight: 1 }]
  },
  nautical_age_of_sail: {
    eraFrames: [{ id: "age_of_sail", weight: 5 }, { id: "early_modern", weight: 1 }],
    aestheticSkins: [{ id: "nautical_adventure", weight: 4 }, { id: "swashbuckling", weight: 2 }],
    worldConditions: [
      { id: "maritime_routes", weight: 5 },
      { id: "frontier", weight: 2 },
      { id: "contested_borderland", weight: 1 }
    ]
  },
  industrial_revolution: {
    eraFrames: [{ id: "industrial_revolution", weight: 5 }, { id: "victorian", weight: 2 }],
    aestheticSkins: [{ id: "steampunk", weight: 2 }, { id: "political_intrigue", weight: 1 }],
    worldConditions: [
      { id: "social_upheaval", weight: 5 },
      { id: "urbanized", weight: 3 },
      { id: "oppressive_order", weight: 2 },
      { id: "resource_boom", weight: 1 }
    ]
  },
  mythological: {
    eraFrames: [{ id: "timeless_mythic", weight: 4 }, { id: "ancient", weight: 1 }],
    aestheticSkins: [{ id: "mythological", weight: 5 }],
    worldConditions: [{ id: "living_world", weight: 1 }]
  }
});

function cleanWeight(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

function mergeWeightedEntries(existing = [], additions = []) {
  const byId = new Map();

  for (const entry of [...existing, ...additions]) {
    if (!entry || !entry.id) continue;
    const current = byId.get(entry.id) || { id: entry.id, weight: 0 };
    current.weight += cleanWeight(entry.weight);
    byId.set(entry.id, current);
  }

  return [...byId.values()].sort((a, b) => b.weight - a.weight);
}

function scaleEntries(entries = [], sourceWeight = 1) {
  const source = cleanWeight(sourceWeight) || 1;
  return entries.map((entry) => ({
    id: entry.id,
    weight: cleanWeight(entry.weight) * source
  }));
}

function expandLegacyGenreSelection(selection = {}) {
  const mapping = LEGACY_GENRE_LAYER_MAP[selection.id] || {};

  return {
    eraFrames: scaleEntries(mapping.eraFrames || [], selection.weight),
    aestheticSkins: scaleEntries(mapping.aestheticSkins || [], selection.weight),
    worldConditions: scaleEntries(mapping.worldConditions || [], selection.weight)
  };
}

function expandLegacyGenreSelections(genreSelections = []) {
  const result = {
    eraFrames: [],
    aestheticSkins: [],
    worldConditions: []
  };

  for (const selection of genreSelections || []) {
    const expanded = expandLegacyGenreSelection(selection);
    result.eraFrames = mergeWeightedEntries(result.eraFrames, expanded.eraFrames);
    result.aestheticSkins = mergeWeightedEntries(result.aestheticSkins, expanded.aestheticSkins);
    result.worldConditions = mergeWeightedEntries(result.worldConditions, expanded.worldConditions);
  }

  return result;
}

function addGenreLayerCompatibilityBuckets(buckets = {}) {
  const expanded = expandLegacyGenreSelections(buckets.genreSkins || []);

  return {
    ...buckets,
    eraFrames: mergeWeightedEntries(buckets.eraFrames || [], expanded.eraFrames),
    aestheticSkins: mergeWeightedEntries(buckets.aestheticSkins || [], expanded.aestheticSkins),
    worldConditions: mergeWeightedEntries(buckets.worldConditions || [], expanded.worldConditions)
  };
}

module.exports = {
  LEGACY_GENRE_LAYER_MAP,
  mergeWeightedEntries,
  expandLegacyGenreSelection,
  expandLegacyGenreSelections,
  addGenreLayerCompatibilityBuckets
};

