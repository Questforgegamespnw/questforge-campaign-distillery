const intakeMappings = require("../data/intakeMappings");

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
 * Translates structured form answers into weighted candidate pools.
 * @param {object} answers
 * @returns {{
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
function translateFormAnswers(answers) {
  const buckets = {
    coreFrames: new Map(),
    systemFrames: new Map(),
    genreSkins: new Map(),
    toneSkins: new Map(),
    environmentSkins: new Map(),
    modifiers: {}
  };

  applyMappedAnswer(intakeMappings.overallExperience, answers.overallExperience, buckets);
  applyMappedAnswer(intakeMappings.tone, answers.tone, buckets);
  applyMappedAnswer(intakeMappings.worldAesthetic, answers.worldAesthetic, buckets);
  applyMappedAnswer(intakeMappings.conflict, answers.conflict, buckets);
  applyMappedAnswer(intakeMappings.choiceWeight, answers.choiceWeight, buckets);
  applyMappedAnswer(intakeMappings.playerFantasy, answers.playerFantasy, buckets);

  const gameplayAnswers = Array.isArray(answers.gameplay) ? answers.gameplay : [];
  for (const gameplayAnswer of gameplayAnswers) {
    applyMappedAnswer(intakeMappings.gameplay, gameplayAnswer, buckets);
  }

  const environmentAnswers = Array.isArray(answers.environments) ? answers.environments : [];
  for (const environmentAnswer of environmentAnswers) {
    applyMappedAnswer(intakeMappings.environments, environmentAnswer, buckets);
  }

  return {
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