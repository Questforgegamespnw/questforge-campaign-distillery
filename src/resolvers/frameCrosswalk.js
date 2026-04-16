/**
 * Crosswalk mappings for adapting frame intent into allowed equivalents.
 * This first pass focuses on youth-safe remapping.
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
 * Applies youth-safe crosswalk mappings to core frame candidates.
 * Original candidates are preserved and youth-safe equivalents are added.
 * @param {Array<{id: string, weight: number}>} coreFrameCandidates
 * @returns {Array<{id: string, weight: number}>}
 */
function applyYouthCoreFrameCrosswalk(coreFrameCandidates = []) {
    const bucket = new Map();

    for (const candidate of coreFrameCandidates) {
        const mapped = youthCoreFrameCrosswalk[candidate.id];
        if (mapped) {
            const scaled = mapped.map((entry) => ({
                id: entry.id,
                weight: entry.weight * candidate.weight
            }));
            addWeightedEntries(bucket, scaled);
        }
    }

    return Array.from(bucket.entries())
        .map(([id, weight]) => ({ id, weight }))
        .sort((a, b) => b.weight - a.weight);
} function applyYouthCoreFrameCrosswalk(coreFrameCandidates = []) {
    const bucket = new Map();

    for (const candidate of coreFrameCandidates) {
        const mapped = youthCoreFrameCrosswalk[candidate.id];
        if (mapped) {
            const scaled = mapped.map((entry) => ({
                id: entry.id,
                weight: entry.weight * candidate.weight
            }));
            addWeightedEntries(bucket, scaled);
        }
    }

    return Array.from(bucket.entries())
        .map(([id, weight]) => ({ id, weight }))
        .sort((a, b) => b.weight - a.weight);
}

/**
 * Applies profile-aware frame crosswalk rules.
 * @param {object} options
 * @param {"standard" | "youth"} options.experienceProfile
 * @param {object} options.candidateBuckets
 * @returns {object}
 */
function applyFrameCrosswalk({ experienceProfile, candidateBuckets }) {
    if (experienceProfile !== "youth") {
        return candidateBuckets;
    }

    return {
        ...candidateBuckets,
        coreFrames: applyYouthCoreFrameCrosswalk(candidateBuckets.coreFrames || [])
    };
}

module.exports = {
    youthCoreFrameCrosswalk,
    applyYouthCoreFrameCrosswalk,
    applyFrameCrosswalk
};