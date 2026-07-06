#!/usr/bin/env node

const assert = require("node:assert/strict");

const eraFrames = require("../../../src/data/eraFrames");
const aestheticSkins = require("../../../src/data/aestheticSkins");
const worldConditions = require("../../../src/data/worldConditions");
const genreSkins = require("../../../src/data/genreSkins");
const { resolveSelections } = require("../../../src/utils/lookupById");
const {
  LEGACY_GENRE_LAYER_MAP,
  expandLegacyGenreSelection,
  expandLegacyGenreSelections,
  addGenreLayerCompatibilityBuckets
} = require("../../../src/data/genreLayerCompatibility");
const { adjudicateSignals } = require("../../../src/selectors/adjudicateSignals");
const { resolveCampaignContext } = require("../../../src/resolvers/resolveCampaignContext");
const { selectCampaignDirections } = require("../../../src/selectors/selectCampaignDirections");

function ids(entries = []) {
  return entries.map((entry) => entry.id);
}

for (const legacy of genreSkins) {
  assert.ok(
    LEGACY_GENRE_LAYER_MAP[legacy.id],
    `Legacy genreSkin ${legacy.id} must have an explicit genre-layer compatibility map.`
  );

  const expanded = expandLegacyGenreSelection({ id: legacy.id, weight: 1 });
  assert.ok(
    expanded.eraFrames.length + expanded.aestheticSkins.length + expanded.worldConditions.length > 0,
    `Legacy genreSkin ${legacy.id} must map to at least one new genre-layer bucket.`
  );
}

{
  const eraIds = ids(eraFrames);
  for (const required of [
    "renaissance",
    "elizabethan",
    "victorian",
    "edwardian",
    "industrial_revolution",
    "interwar_1920s_1930s",
    "wartime_1940s",
    "atomic_1950s",
    "cold_war",
    "late_20th_century",
    "near_future",
    "cybernetic_future",
    "spacefaring_future"
  ]) {
    assert.equal(eraIds.includes(required), true, `Missing expanded eraFrame ${required}`);
  }
}

{
  const aestheticIds = ids(aestheticSkins);
  for (const required of [
    "steampunk",
    "clockpunk",
    "dieselpunk",
    "atompunk",
    "cassette_futurism",
    "cyberpunk",
    "biopunk",
    "nanopunk",
    "solarpunk",
    "raygun_gothic",
    "retrofuturism"
  ]) {
    assert.equal(aestheticIds.includes(required), true, `Missing punk/retrofuture aesthetic ${required}`);
  }
}

{
  const conditionIds = ids(worldConditions);
  for (const required of [
    "frontier",
    "lawless",
    "occupied",
    "expanding_empire",
    "post_war_recovery",
    "corporate_controlled",
    "surveillance_state",
    "ecological_recovery",
    "technological_runaway",
    "lost_golden_age"
  ]) {
    assert.equal(conditionIds.includes(required), true, `Missing expanded worldCondition ${required}`);
  }
}

{
  const expanded = expandLegacyGenreSelection({
    id: "western_frontier",
    weight: 2
  });

  assert.deepEqual(expanded.eraFrames, [
    { id: "gilded_age", weight: 4 },
    { id: "industrial_revolution", weight: 2 }
  ]);
  assert.deepEqual(expanded.aestheticSkins, [
    { id: "western", weight: 10 }
  ]);
  assert.deepEqual(expanded.worldConditions, [
    { id: "frontier", weight: 10 },
    { id: "lawless", weight: 6 },
    { id: "isolated", weight: 4 }
  ]);
}

{
  const expanded = expandLegacyGenreSelections([
    { id: "victorian_gothic", weight: 1 },
    { id: "industrial_revolution", weight: 1 }
  ]);

  assert.equal(ids(expanded.eraFrames).includes("victorian"), true);
  assert.equal(ids(expanded.eraFrames).includes("industrial_revolution"), true);
  assert.equal(ids(expanded.aestheticSkins).includes("gothic"), true);
  assert.equal(ids(expanded.aestheticSkins).includes("steampunk"), true);
  assert.equal(ids(expanded.worldConditions).includes("haunted_past"), true);
  assert.equal(ids(expanded.worldConditions).includes("social_upheaval"), true);
  assert.equal(ids(expanded.worldConditions).includes("oppressive_order"), true);
}

{
  const buckets = addGenreLayerCompatibilityBuckets({
    genreSkins: [{ id: "cosmic_eldritch", weight: 3 }],
    aestheticSkins: [{ id: "gothic", weight: 2 }]
  });

  assert.equal(buckets.genreSkins[0].id, "cosmic_eldritch");
  assert.equal(ids(buckets.aestheticSkins).includes("cosmic_eldritch"), true);
  assert.equal(ids(buckets.aestheticSkins).includes("gothic"), true);
  assert.equal(ids(buckets.worldConditions).includes("hidden_world"), true);
}

{
  const adjudicated = adjudicateSignals({
    coreFrames: [{ id: "hidden_truth", weight: 5 }],
    systemFrames: [{ id: "clue_web", weight: 5 }],
    genreSkins: [{ id: "western_frontier", weight: 5 }],
    toneSkins: [{ id: "heroic", weight: 3 }],
    environmentSkins: [{ id: "frontier_wildlands", weight: 3 }]
  });

  const context = resolveCampaignContext({
    normalizedIntake: { safety: { experienceProfile: "standard" } },
    translatedForm: {
      coreFrames: [{ id: "hidden_truth", weight: 5 }],
      systemFrames: [{ id: "clue_web", weight: 5 }],
      genreSkins: [{ id: "western_frontier", weight: 5 }],
      toneSkins: [{ id: "heroic", weight: 3 }],
      environmentSkins: [{ id: "frontier_wildlands", weight: 3 }]
    }
  });

  assert.equal(adjudicated.signals.eraFrames.length, 0);
  assert.equal(ids(context.candidateBuckets.eraFrames).includes("gilded_age"), true);
  assert.equal(ids(context.candidateBuckets.worldConditions).includes("frontier"), true);
  assert.equal(ids(context.candidateBuckets.worldConditions).includes("lawless"), true);
}

{
  const selected = selectCampaignDirections({
    coreFrames: [{ id: "hidden_truth", weight: 5 }],
    systemFrames: [{ id: "clue_web", weight: 5 }],
    genreSkins: [{ id: "victorian_gothic", weight: 5 }],
    toneSkins: [{ id: "noir", weight: 3 }],
    environmentSkins: [{ id: "dense_city_urban", weight: 3 }]
  });

  assert.equal(selected.primary.genreSkin[0].id, "victorian_gothic");
  assert.equal(selected.primary.eraFrames[0].id, "victorian");
  assert.equal(selected.primary.aestheticSkins[0].id, "gothic");
  assert.equal(ids(selected.primary.worldConditions).includes("urbanized"), true);
  assert.equal(ids(selected.primary.contextMetadata.worldConditions).includes("urbanized"), true);
  assert.equal(ids(selected.primary.contextMetadata.worldConditions).includes("haunted_past"), true);
}

{
  const selected = selectCampaignDirections({
    coreFrames: [{ id: "power_has_a_cost", weight: 5 }],
    systemFrames: [{ id: "resource_scarcity", weight: 5 }],
    genreSkins: [],
    eraFrames: [{ id: "near_future", weight: 4 }],
    aestheticSkins: [{ id: "solarpunk", weight: 5 }],
    worldConditions: [{ id: "ecological_recovery", weight: 5 }],
    toneSkins: [{ id: "hopeful", weight: 3 }],
    environmentSkins: []
  });

  assert.equal(selected.primary.eraFrames[0].id, "near_future");
  assert.equal(selected.primary.aestheticSkins[0].id, "solarpunk");
  assert.equal(selected.primary.worldConditions[0].id, "ecological_recovery");
  assert.equal(selected.primary.contextMetadata.eraFrames[0].id, "near_future");
  assert.equal(selected.primary.contextMetadata.aestheticSkins[0].id, "solarpunk");
  assert.equal(selected.primary.contextMetadata.worldConditions[0].id, "ecological_recovery");
}

{
  const resolved = resolveSelections([{ id: "interwar_1920s_1930s", weight: 4 }], eraFrames);
  assert.equal(resolved[0].techLevel, "early_mass_industrial");
  assert.equal(Array.isArray(resolved[0].commonTech), true);
  assert.equal(resolved[0].commonTech.includes("radio"), true);
}

console.log("PASS genre layer compatibility");

