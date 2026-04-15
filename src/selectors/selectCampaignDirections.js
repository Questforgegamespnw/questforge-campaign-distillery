const { selectTopWeighted } = require("./selectTopWeighted");
const systemFrameLibrary = require("../data/systemFrames");
const coreFrameLibrary = require("../data/coreFrames");

/**
 * Returns the first item in pool whose id is not already used.
 * Falls back to the first item in the pool if no unique item exists.
 *
 * @param {Array<{id: string, weight: number}>} pool
 * @param {Set<string>} usedIds
 * @returns {{id: string, weight: number} | null}
 */
function pickNextUnique(pool, usedIds = new Set()) {
  if (!Array.isArray(pool) || pool.length === 0) {
    return null;
  }

  const uniqueMatch = pool.find((item) => item && item.id && !usedIds.has(item.id));
  return uniqueMatch || pool[0] || null;
}

/**
 * Returns up to count items from a weighted pool, preferring unique IDs.
 * If the pool is too small, it returns as many as are available.
 *
 * @param {Array<{id: string, weight: number}>} pool
 * @param {number} count
 * @param {Set<string>} usedIds
 * @returns {Array<{id: string, weight: number}>}
 */
function pickManyUnique(pool, count, usedIds = new Set()) {
  if (!Array.isArray(pool) || pool.length === 0 || count <= 0) {
    return [];
  }

  const picks = [];

  for (const item of pool) {
    if (!item || !item.id || usedIds.has(item.id)) {
      continue;
    }

    picks.push(item);
    usedIds.add(item.id);

    if (picks.length >= count) {
      break;
    }
  }

  return picks;
}

/**
 * Returns one item from a weighted pool by rank with safe fallback.
 *
 * @param {Array<{id: string, weight: number}>} pool
 * @param {number} rank
 * @returns {{id: string, weight: number} | null}
 */
function pickByRank(pool, rank = 0) {
  if (!Array.isArray(pool) || pool.length === 0) {
    return null;
  }

  return pool[rank] || pool[pool.length - 1] || null;
}

/**
 * Returns true when two system selections share at least one compatible tag.
 *
 * @param {{tags?: string[]} | null} systemA
 * @param {{tags?: string[]} | null} systemB
 * @returns {boolean}
 */
function areSystemsCompatible(systemA, systemB) {
  if (!systemA || !systemB) {
    return false;
  }

  const tagsA = Array.isArray(systemA.tags) ? systemA.tags : [];
  const tagsB = Array.isArray(systemB.tags) ? systemB.tags : [];

  return tagsA.some((tag) => tagsB.includes(tag));
}

/**
 * Resolves a weighted system selection into its full library entry.
 *
 * @param {{id?: string} | null} selection
 * @returns {object | null}
 */
function resolveSystemFrame(selection) {
  if (!selection || !selection.id) {
    return null;
  }

  return systemFrameLibrary.find((entry) => entry.id === selection.id) || null;
}

/**
 * Resolves a weighted core selection into its full library entry.
 *
 * @param {{id?: string} | null} selection
 * @returns {object | null}
 */
function resolveCoreFrame(selection) {
  if (!selection || !selection.id) {
    return null;
  }

  return coreFrameLibrary.find((entry) => entry.id === selection.id) || null;
}

/**
 * Returns true when a system frame shares at least one tag with any resolved core frame.
 *
 * @param {{tags?: string[]} | null} system
 * @param {Array<{tags?: string[]}>} coreFrames
 * @returns {boolean}
 */
function systemMatchesCore(system, coreFrames = []) {
  if (!system) {
    return false;
  }

  const systemTags = Array.isArray(system.tags) ? system.tags : [];
  if (systemTags.length === 0) {
    return false;
  }

  return coreFrames.some((core) => {
    const coreTags = Array.isArray(core?.tags) ? core.tags : [];
    return coreTags.some((tag) => systemTags.includes(tag));
  });
}

function scoreSystemCandidate(candidate, primarySystem, resolvedCoreFrames, toneSelection, usedSystemIds) {
  const resolvedCandidate = resolveSystemFrame(candidate);
  const resolvedPrimary = resolveSystemFrame(primarySystem);

  if (!resolvedCandidate) return -Infinity;

  let score = 0;

  if (systemMatchesCore(resolvedCandidate, resolvedCoreFrames)) {
    score += 3;
  }

  if (areSystemsCompatible(resolvedPrimary, resolvedCandidate)) {
    score += 2;
  }

  if (usedSystemIds?.has(candidate.id)) {
    score -= 2;
  }

  score += getToneSystemBonus(candidate, toneSelection);
  score += candidate.weight || 0;

  return score;
}

function scoreAdjacentSystemCandidate(candidate, primarySystem, resolvedCoreFrames, toneSelection, usedSystemIds) {
  const resolvedCandidate = resolveSystemFrame(candidate);
  const resolvedPrimary = resolveSystemFrame(primarySystem);

  if (!resolvedCandidate) return -Infinity;

  let score = 0;

  if (systemMatchesCore(resolvedCandidate, resolvedCoreFrames)) {
    score += 2;
  }

  if (areSystemsCompatible(resolvedPrimary, resolvedCandidate)) {
    score += 2;
  }

    if (usedSystemIds?.has(candidate.id)) {
    score -= 2;
  }
  74
  score += getToneSystemBonus(candidate, toneSelection);
  score += candidate.weight || 0;

  return score;
}

function getToneSystemBonus(system, toneSelection) {
  const resolvedSystem = resolveSystemFrame(system);

  if (!resolvedSystem || !toneSelection?.id) {
    return 0;
  }

  const systemId = resolvedSystem.id;
  const toneId = toneSelection.id;

  const toneBonuses = {
    grimdark: {
      resource_scarcity: 2,
      attrition_combat: 2,
      faction_reputation: 1,
      alliance_vs_betrayal: 1,
      escalation_meter: 1
    },
    horror: {
      hidden_information: 2,
      escalation_meter: 2,
      resource_scarcity: 1,
      corruption_transformation_track: 1,
      time_pressure_system: 1
    },
    heroic: {
      asymmetrical_boss_design: 2,
      exploration_discovery_loop: 1,
      mission_based_play: 1
    },
    psychological: {
      hidden_information: 2,
      corruption_transformation_track: 2,
      escalation_meter: 1
    },
    noir: {
      clue_web: 2,
      hidden_information: 2,
      influence_social_leverage: 1,
      faction_reputation: 1
    },
    political_intrigue: {
      influence_social_leverage: 2,
      faction_reputation: 2,
      alliance_vs_betrayal: 2,
      hidden_information: 1
    },
    mythic: {
      exploration_discovery_loop: 1,
      asymmetrical_boss_design: 1,
      legacy_inheritance_system: 1
    },
    lighthearted_chaotic: {
      mission_based_play: 1,
      modular_build_system: 1
    }
  };

  return toneBonuses[toneId]?.[systemId] || 0;
}


/**
 * Ensures a direction has at least one item in key slots.
 *
 * @param {object} direction
 * @param {object} pools
 * @returns {object}
 */
function backfillDirection(direction, pools) {
  const safeDirection = {
    label: direction.label,
    emphasis: direction.emphasis,
    coreFrames: Array.isArray(direction.coreFrames) ? direction.coreFrames.filter(Boolean) : [],
    systemFrames: Array.isArray(direction.systemFrames) ? direction.systemFrames.filter(Boolean) : [],
    genreSkin: Array.isArray(direction.genreSkin) ? direction.genreSkin.filter(Boolean) : [],
    toneSkin: Array.isArray(direction.toneSkin) ? direction.toneSkin.filter(Boolean) : [],
    environmentSkins: Array.isArray(direction.environmentSkins) ? direction.environmentSkins.filter(Boolean) : [],
    includeNotes: direction.includeNotes || "",
    excludeNotes: direction.excludeNotes || "",
    modifiers: direction.modifiers || {}
  };

  if (safeDirection.coreFrames.length === 0) {
    const fallback = pickByRank(pools.coreFrames, 0);
    if (fallback) safeDirection.coreFrames.push(fallback);
  }

  if (safeDirection.systemFrames.length === 0) {
    const fallback = pickByRank(pools.systemFrames, 0);
    if (fallback) safeDirection.systemFrames.push(fallback);
  }

  if (safeDirection.genreSkin.length === 0) {
    const fallback = pickByRank(pools.genreSkins, 0);
    if (fallback) safeDirection.genreSkin.push(fallback);
  }

  if (safeDirection.toneSkin.length === 0) {
    const fallback = pickByRank(pools.toneSkins, 0);
    if (fallback) safeDirection.toneSkin.push(fallback);
  }

  if (safeDirection.environmentSkins.length === 0) {
    const fallback = pickByRank(pools.environmentSkins, 0);
    if (fallback) safeDirection.environmentSkins.push(fallback);
  }

  return safeDirection;
}

/**
 * Builds three curated campaign directions from weighted candidate pools.
 *
 * Input shape is expected to match the output of translateFormAnswers():
 * {
 *   coreFrames: Array<{id, weight}>,
 *   systemFrames: Array<{id, weight}>,
 *   genreSkins: Array<{id, weight}>,
 *   toneSkins: Array<{id, weight}>,
 *   environmentSkins: Array<{id, weight}>,
 *   modifiers: Record<string, number>,
 *   includeNotes: string,
 *   excludeNotes: string
 * }
 *
 * @param {object} weightedPools
 * @returns {{
 *   primary: object,
 *   adjacent: object,
 *   wildcard: object
 * }}
 */
function selectCampaignDirections(weightedPools = {}) {
  const usedSystemIds = new Set();
  const pools = {
    coreFrames: selectTopWeighted(weightedPools.coreFrames || [], 5),
    systemFrames: selectTopWeighted(weightedPools.systemFrames || [], 5),
    genreSkins: selectTopWeighted(weightedPools.genreSkins || [], 3),
    toneSkins: selectTopWeighted(weightedPools.toneSkins || [], 3),
    environmentSkins: selectTopWeighted(weightedPools.environmentSkins || [], 5)
  };

  const includeNotes = weightedPools.includeNotes || "";
  const excludeNotes = weightedPools.excludeNotes || "";
  const modifiers = weightedPools.modifiers || {};

  const primary = backfillDirection(
    {
      label: "primary",
      emphasis: "Best-fit expression of the strongest signals in the intake.",
      coreFrames: [
        pickByRank(pools.coreFrames, 0),
        pickByRank(pools.coreFrames, 1)
      ].filter(Boolean),
      systemFrames: (() => {
    const primarySystem = pickByRank(pools.systemFrames, 0);
const primaryTone = pickByRank(pools.toneSkins, 0);

const resolvedPrimary = resolveSystemFrame(primarySystem);
const resolvedCoreFrames = [
  pickByRank(pools.coreFrames, 0),
  pickByRank(pools.coreFrames, 1)
]
  .filter(Boolean)
  .map(resolveCoreFrame)
  .filter(Boolean);

const secondarySystem = pools.systemFrames
  .filter((candidate) => candidate && candidate.id !== primarySystem?.id)
  .sort((a, b) => {
    return (
      scoreSystemCandidate(b, primarySystem, resolvedCoreFrames, primaryTone, usedSystemIds) -
      scoreSystemCandidate(a, primarySystem, resolvedCoreFrames, primaryTone, usedSystemIds)
    );
  })[0];

  return [primarySystem, secondarySystem].filter(Boolean);
})(),
      genreSkin: [pickByRank(pools.genreSkins, 0)].filter(Boolean),
      toneSkin: [pickByRank(pools.toneSkins, 0)].filter(Boolean),
      environmentSkins: (() => {
  const envA = pickByRank(pools.environmentSkins, 0);
const envB = pickByRank(pools.environmentSkins, 1) || pickByRank(pools.environmentSkins, 0);

  const uniqueEnvs = [];
  if (envA) uniqueEnvs.push(envA);
  if (envB && envB.id !== envA?.id) uniqueEnvs.push(envB);

  return uniqueEnvs;
})(),
      includeNotes,
      excludeNotes,
      modifiers
    },
    pools
  );

  const adjacentCoreA = pickByRank(pools.coreFrames, 0);
  const adjacentCoreB = pickByRank(pools.coreFrames, 2) || pickByRank(pools.coreFrames, 1);

  const adjacent = backfillDirection(
    {
      label: "adjacent",
      emphasis: "Keeps the same core promise, but shifts how the campaign plays at the table.",
      coreFrames: [adjacentCoreA, adjacentCoreB].filter(Boolean),
      systemFrames: (() => {
  const primarySystem = pickByRank(pools.systemFrames, 1) || pickByRank(pools.systemFrames, 0);
const adjacentTone = pickByRank(pools.toneSkins, 1) || pickByRank(pools.toneSkins, 0);

const resolvedCoreFrames = [
  pickByRank(pools.coreFrames, 0),
  pickByRank(pools.coreFrames, 2) || pickByRank(pools.coreFrames, 1)
]
  .filter(Boolean)
  .map(resolveCoreFrame)
  .filter(Boolean);

const secondarySystem = pools.systemFrames
  .filter((candidate) => candidate && candidate.id !== primarySystem?.id)
  .sort((a, b) => {
    return (
      scoreAdjacentSystemCandidate(b, primarySystem, resolvedCoreFrames, adjacentTone, usedSystemIds) -
      scoreAdjacentSystemCandidate(a, primarySystem, resolvedCoreFrames, adjacentTone, usedSystemIds)
    );
  })[0];

  usedSystemIds.add(primarySystem?.id);
  usedSystemIds.add(secondarySystem?.id);

  return [primarySystem, secondarySystem].filter(Boolean);
})(),

      genreSkin: [pickByRank(pools.genreSkins, 0)].filter(Boolean),
      toneSkin: [pickByRank(pools.toneSkins, 1) || pickByRank(pools.toneSkins, 0)].filter(Boolean),
      environmentSkins: (() => {
  const envA = pickByRank(pools.environmentSkins, 1) || pickByRank(pools.environmentSkins, 0);
  const envB = pickByRank(pools.environmentSkins, 2) || pickByRank(pools.environmentSkins, 1);

  const uniqueEnvs = [];
  if (envA) uniqueEnvs.push(envA);
  if (envB && envB.id !== envA?.id) uniqueEnvs.push(envB);

  return uniqueEnvs;
})(),
      includeNotes,
      excludeNotes,
      modifiers
    },
    pools
  );

  const wildcardUsedCoreIds = new Set(primary.coreFrames.map((item) => item.id));
  const wildcardUsedSystemIds = new Set(primary.systemFrames.map((item) => item.id));
  const wildcardUsedEnvIds = new Set(primary.environmentSkins.map((item) => item.id));

  const wildcardCoreFrames = pickManyUnique(pools.coreFrames, 2, wildcardUsedCoreIds);
  const wildcardSystemFrames = pickManyUnique(pools.systemFrames, 2, wildcardUsedSystemIds);
  const wildcardEnvironmentSkins = pickManyUnique(pools.environmentSkins, 2, wildcardUsedEnvIds);

  const wildcard = backfillDirection(
    {
      label: "wildcard",
      emphasis: "A bolder interpretation that still fits the intake, but leans into secondary signals.",
      coreFrames: wildcardCoreFrames,
      systemFrames: wildcardSystemFrames,
      genreSkin: [pickByRank(pools.genreSkins, 1) || pickByRank(pools.genreSkins, 0)].filter(Boolean),
      toneSkin: [pickByRank(pools.toneSkins, 2) || pickByRank(pools.toneSkins, 1) || pickByRank(pools.toneSkins, 0)].filter(Boolean),
      environmentSkins: wildcardEnvironmentSkins,
      includeNotes,
      excludeNotes,
      modifiers
    },
    pools
  );

  return {
    primary,
    adjacent,
    wildcard
  };
}

module.exports = {
  selectCampaignDirections
};