const intakeMappings = require("../data/intakeMappings");
const toneIdMap = {
  chaotic_lighthearted: "lighthearted_chaotic",
  lighthearted_chaotic: "lighthearted_chaotic"
};

/**
 * Adds weighted entries into a score map.
 * @param {Map<string, number>} bucket
 * @param {Array<{id: string, weight: number}>} entries
 */
function addWeightedEntries(bucket, entries = []) {
  for (const entry of entries) {
    const current = bucket.get(entry.id) || 0;
    bucket.set(entry.id, current + entry.weight);
  }
}

/**
 * Merges numeric modifier values into an object.
 * @param {object} target
 * @param {object} source
 */
function mergeModifiers(target, source = {}) {
  for (const [key, value] of Object.entries(source)) {
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
  addWeightedEntries(buckets.toneSkins, mapping.toneSkins);
  addWeightedEntries(buckets.environmentSkins, mapping.environmentSkins);
  mergeModifiers(buckets.modifiers, mapping.modifiers);
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

/**
 * Translates structured form answers into weighted candidate pools.
 * @param {object} answers
 * @returns {{
 *   experienceProfile: "standard" | "youth" | "kids",
 *   coreFrames: Array<{id: string, weight: number}>,
 *   systemFrames: Array<{id: string, weight: number}>,
 *   genreSkins: Array<{id: string, weight: number}>,
 *   toneSkins: Array<{id: string, weight: number}>,
 *   environmentSkins: Array<{id: string, weight: number}>,
 *   modifiers: Record<string, number>,
 *   includeNotes: string,
 *   excludeNotes: string
 * }}
 */

function normalizeAnswers(answers = {}) {
  const tone = String(answers.tone || "").trim();

  return {
    ...answers,
    tone: toneIdMap[tone] || tone
  };
}

function translateFormAnswers(answers = {}) {
  const normalizedAnswers = normalizeAnswers(answers);

  const buckets = {
    coreFrames: new Map(),
    systemFrames: new Map(),
    genreSkins: new Map(),
    toneSkins: new Map(),
    environmentSkins: new Map(),
    modifiers: {}
  };

  applyMappedAnswer(intakeMappings.overallExperience, normalizedAnswers.overallExperience, buckets);
  applyMappedAnswer(intakeMappings.tone, normalizedAnswers.tone, buckets);
  applyMappedAnswer(intakeMappings.worldAesthetic, normalizedAnswers.worldAesthetic, buckets);
  applyMappedAnswer(intakeMappings.conflict, normalizedAnswers.conflict, buckets);
  applyMappedAnswer(intakeMappings.choiceWeight, normalizedAnswers.choiceWeight, buckets);
  applyMappedAnswer(intakeMappings.playerFantasy, normalizedAnswers.playerFantasy, buckets);

  const gameplayAnswers = Array.isArray(normalizedAnswers.gameplay) ? normalizedAnswers.gameplay : [];
  for (const gameplayAnswer of gameplayAnswers) {
    applyMappedAnswer(intakeMappings.gameplay, gameplayAnswer, buckets);
  }

  const environmentAnswers = Array.isArray(normalizedAnswers.environments) ? normalizedAnswers.environments : [];
  for (const environmentAnswer of environmentAnswers) {
    applyMappedAnswer(intakeMappings.environments, environmentAnswer, buckets);
  }

  return {
    experienceProfile: inferExperienceProfile(normalizedAnswers),
    coreFrames: finalizeBucket(buckets.coreFrames),
    systemFrames: finalizeBucket(buckets.systemFrames),
    genreSkins: finalizeBucket(buckets.genreSkins),
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