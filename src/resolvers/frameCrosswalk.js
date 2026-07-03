/**
 * Crosswalk mappings for adapting adult Core Frame intent into kids-safe
 * equivalents. The youth profile intentionally preserves adult Core Frames
 * until the explicit preserve/soften/substitute/suppress policy is completed.
 */

const youthCoreFrameCrosswalk = {
    hidden_truth: [
        { id: "something_is_lost_or_missing", weight: 3 },
        { id: "the_misunderstood_problem", weight: 2 }
    ],

    lost_knowledge: [
        { id: "curiosity_leads_the_way", weight: 3 },
        { id: "fixing_whats_broken", weight: 1 }
    ],

    fate_vs_free_will: [
        { id: "a_small_problem_that_feels_big", weight: 2 },
        { id: "teamwork_solves_everything", weight: 1 }
    ],

    fragmented_self: [
        { id: "the_misunderstood_problem", weight: 3 },
        { id: "a_small_problem_that_feels_big", weight: 2 }
    ],

    becoming_something_else: [
        { id: "the_misunderstood_problem", weight: 3 },
        { id: "fixing_whats_broken", weight: 2 }
    ],

    investigators_burden: [
        { id: "curiosity_leads_the_way", weight: 2 },
        { id: "teamwork_solves_everything", weight: 1 }
    ],

    survival_against_overwhelming_force: [
        { id: "helping_those_in_need", weight: 2 },
        { id: "teamwork_solves_everything", weight: 3 }
    ],

    power_has_a_cost: [
        { id: "fixing_whats_broken", weight: 2 },
        { id: "helping_those_in_need", weight: 1 }
    ],

    what_is_humanity: [
        { id: "the_misunderstood_problem", weight: 3 },
        { id: "helping_those_in_need", weight: 2 }
    ],

    entropy_decay: [
        { id: "fixing_whats_broken", weight: 3 },
        { id: "helping_those_in_need", weight: 1 }
    ],

    the_endless_siege: [
        { id: "teamwork_solves_everything", weight: 3 },
        { id: "helping_those_in_need", weight: 2 }
    ],

    war_of_ideologies: [
        { id: "teamwork_solves_everything", weight: 2 },
        { id: "the_misunderstood_problem", weight: 2 }
    ],

    power_vacuum: [
        { id: "fixing_whats_broken", weight: 2 },
        { id: "teamwork_solves_everything", weight: 1 }
    ]
};

// Compatibility alias while the older export name remains in use.
const kidsCoreFrameCrosswalk = youthCoreFrameCrosswalk;

/**
 * Adds weighted entries into a map.
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
 * Converts adult Core Frame candidates into kids-safe equivalents.
 * @param {Array<{id: string, weight: number}>} coreFrameCandidates
 * @returns {Array<{id: string, weight: number}>}
 */
function applyKidsCoreFrameCrosswalk(coreFrameCandidates = []) {
    const bucket = new Map();

    for (const candidate of coreFrameCandidates) {
        const mapped = kidsCoreFrameCrosswalk[candidate.id];
        if (!mapped) continue;

        const scaled = mapped.map((entry) => ({
            id: entry.id,
            weight: entry.weight * candidate.weight
        }));
        addWeightedEntries(bucket, scaled);
    }

    return Array.from(bucket.entries())
        .map(([id, weight]) => ({ id, weight }))
        .sort((a, b) => b.weight - a.weight);
}

// Compatibility wrapper for callers using the old function name.
function applyYouthCoreFrameCrosswalk(coreFrameCandidates = []) {
    return applyKidsCoreFrameCrosswalk(coreFrameCandidates);
}

/**
 * Applies profile-aware frame crosswalk rules.
 * Standard and youth preserve their current candidate buckets.
 * Kids uses the full-safe substitution crosswalk.
 * @param {object} options
 * @param {"standard" | "youth" | "kids"} options.experienceProfile
 * @param {object} options.candidateBuckets
 * @returns {object}
 */
function applyFrameCrosswalk({ experienceProfile, candidateBuckets }) {
    if (experienceProfile !== "kids") {
        return candidateBuckets;
    }

    return {
        ...candidateBuckets,
        coreFrames: applyKidsCoreFrameCrosswalk(
            candidateBuckets.coreFrames || []
        )
    };
}

module.exports = {
    youthCoreFrameCrosswalk,
    kidsCoreFrameCrosswalk,
    applyKidsCoreFrameCrosswalk,
    applyYouthCoreFrameCrosswalk,
    applyFrameCrosswalk
};
