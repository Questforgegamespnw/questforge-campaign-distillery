const intakeMappings = require("../data/intakeMappings");

const toneIdMap = {
  chaotic_lighthearted: "lighthearted_chaotic",
  lighthearted_chaotic: "lighthearted_chaotic"
};

function toArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (value === undefined || value === null || value === "") return [];
  return [value];
}

/**
 * Adds weighted entries into a score map.
 * @param {Map<string, number>} bucket
 * @param {Array<{id: string, weight: number}>} entries
 */
function addWeightedEntries(bucket, entries = []) {
  for (const entry of entries || []) {
    if (!entry || !entry.id) continue;
    const weight = Number(entry.weight || 0);
    const current = bucket.get(entry.id) || 0;
    bucket.set(entry.id, current + weight);
  }
}

function addDirectSelections(bucket, ids = [], weight = 5) {
  for (const id of toArray(ids)) {
    if (!id) continue;
    addWeightedEntries(bucket, [{ id, weight }]);
  }
}

/**
 * Merges numeric modifier values into an object.
 * @param {object} target
 * @param {object} source
 */
function mergeModifiers(target, source = {}) {
  for (const [key, value] of Object.entries(source || {})) {
    const current = target[key] || 0;
    target[key] = current + value;
  }
}

/**
 * Converts a Map into a sorted array of weighted objects.
 * @param {Map<string, number>} bucket
 * @returns {Array<{id: string, weight: number}>}
 */
function finalizeBucket(bucket) {
  return Array.from(bucket.entries())
    .map(([id, weight]) => ({ id, weight }))
    .sort((a, b) => b.weight - a.weight);
}

function firstMappingGroup(...names) {
  for (const name of names) {
    if (intakeMappings[name]) return intakeMappings[name];
  }
  return null;
}

/**
 * Safely applies one mapped answer into the output buckets.
 * @param {object} mappingGroup
 * @param {string} answerId
 * @param {object} buckets
 */
function applyMappedAnswer(mappingGroup, answerId, buckets) {
  if (!answerId || !mappingGroup || !mappingGroup[answerId]) {
    return;
  }

  const mapping = mappingGroup[answerId];

  addWeightedEntries(buckets.coreFrames, mapping.coreFrames);
  addWeightedEntries(buckets.systemFrames, mapping.systemFrames);
  addWeightedEntries(buckets.genreSkins, mapping.genreSkins);
  addWeightedEntries(buckets.eraFrames, mapping.eraFrames);
  addWeightedEntries(buckets.aestheticSkins, mapping.aestheticSkins);
  addWeightedEntries(buckets.worldConditions, mapping.worldConditions);
  addWeightedEntries(buckets.toneSkins, mapping.toneSkins);
  addWeightedEntries(buckets.environmentSkins, mapping.environmentSkins);
  mergeModifiers(buckets.modifiers, mapping.modifiers);
}

function applyMappedAnswers(mappingGroup, answerIds, buckets) {
  for (const answerId of toArray(answerIds)) {
    applyMappedAnswer(mappingGroup, answerId, buckets);
  }
}

/**
 * Infers the experience profile from explicit form answers.
 * Canonical intake should provide experienceProfile directly.
 * Legacy fallback still handles older translator inputs safely.
 * @param {object} answers
 * @returns {"standard" | "youth" | "kids"}
 */
function inferExperienceProfile(answers = {}) {
  const direct = String(answers.experienceProfile || "").trim().toLowerCase();
  if (["standard", "youth", "kids"].includes(direct)) {
    return direct;
  }

  const ageBand = String(answers.ageBand || "").trim().toLowerCase();
  const system = String(answers.system || "").trim().toLowerCase();

  if (
    answers?.fullSafeMode === true ||
    answers?.youthSafeMode === true ||
    system === "hero_kids" ||
    ["kids_11_13", "kids_8_10", "kids_5_7"].includes(ageBand)
  ) {
    return "kids";
  }

  if (
    answers?.softerThemesMode === true ||
    answers?.youthMode === true ||
    ["teens_14_17", "mixed_age"].includes(ageBand)
  ) {
    return "youth";
  }

  return "standard";
}

function normalizeAnswers(answers = {}) {
  const tone = String(answers.tone || "").trim();

  return {
    ...answers,
    tone: toneIdMap[tone] || tone,
    overallExperiences: toArray(answers.overallExperiences || answers.overallExperience),
    conflicts: toArray(answers.conflicts || answers.conflict),
    legacyGenres: toArray(answers.legacyGenres || answers.worldAesthetic),
    eras: toArray(answers.eras),
    aesthetics: toArray(answers.aesthetics || answers.activeAesthetics),
    worldConditions: toArray(answers.worldConditions),
    playerFantasies: toArray(answers.playerFantasies || answers.playerFantasy),
    gameplay: toArray(answers.gameplay),
    environments: toArray(answers.environments)
  };
}

/**
 * Translates structured form answers into weighted candidate pools.
 * Core/system/tone/environment and legacy genre remain the Phase 1-facing
 * signal shape. Era/aesthetic/world-condition are decomposed genre context for
 * audit and Phase 2 handoff.
 */
function translateFormAnswers(answers = {}) {
  const normalizedAnswers = normalizeAnswers(answers);

  const buckets = {
    coreFrames: new Map(),
    systemFrames: new Map(),
    genreSkins: new Map(),
    eraFrames: new Map(),
    aestheticSkins: new Map(),
    worldConditions: new Map(),
    toneSkins: new Map(),
    environmentSkins: new Map(),
    modifiers: {}
  };

  applyMappedAnswers(intakeMappings.overallExperience, normalizedAnswers.overallExperiences, buckets);
  applyMappedAnswer(intakeMappings.tone, normalizedAnswers.tone, buckets);
  applyMappedAnswers(intakeMappings.worldAesthetic, normalizedAnswers.legacyGenres, buckets);
  applyMappedAnswers(intakeMappings.conflict, normalizedAnswers.conflicts, buckets);
  applyMappedAnswer(intakeMappings.choiceWeight, normalizedAnswers.choiceWeight, buckets);
  applyMappedAnswers(intakeMappings.playerFantasy, normalizedAnswers.playerFantasies, buckets);

  for (const gameplayAnswer of normalizedAnswers.gameplay) {
    applyMappedAnswer(intakeMappings.gameplay, gameplayAnswer, buckets);
  }

  for (const environmentAnswer of normalizedAnswers.environments) {
    applyMappedAnswer(intakeMappings.environments, environmentAnswer, buckets);
  }

  // Optional future mapping groups. These allow richer mapping later without
  // requiring this translator to change again.
  applyMappedAnswers(firstMappingGroup("era", "eras", "eraFrames"), normalizedAnswers.eras, buckets);
  applyMappedAnswers(firstMappingGroup("aesthetic", "aesthetics", "aestheticSkins"), normalizedAnswers.aesthetics, buckets);
  applyMappedAnswers(firstMappingGroup("worldCondition", "worldConditions"), normalizedAnswers.worldConditions, buckets);

  // Direct structured selections. These preserve new form fields even before
  // dedicated mapping groups exist in intakeMappings.js.
  addDirectSelections(buckets.eraFrames, normalizedAnswers.eras, 5);
  addDirectSelections(buckets.aestheticSkins, normalizedAnswers.aesthetics, 5);
  addDirectSelections(buckets.worldConditions, normalizedAnswers.worldConditions, 5);

  return {
    experienceProfile: inferExperienceProfile(normalizedAnswers),
    coreFrames: finalizeBucket(buckets.coreFrames),
    systemFrames: finalizeBucket(buckets.systemFrames),
    genreSkins: finalizeBucket(buckets.genreSkins),
    eraFrames: finalizeBucket(buckets.eraFrames),
    aestheticSkins: finalizeBucket(buckets.aestheticSkins),
    worldConditions: finalizeBucket(buckets.worldConditions),
    toneSkins: finalizeBucket(buckets.toneSkins),
    environmentSkins: finalizeBucket(buckets.environmentSkins),
    modifiers: buckets.modifiers,
    includeNotes: answers.includeNotes || "",
    excludeNotes: answers.excludeNotes || ""
  };
}

module.exports = {
  translateFormAnswers
};
