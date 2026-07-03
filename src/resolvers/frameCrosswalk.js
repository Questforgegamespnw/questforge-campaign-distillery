/**
 * Profile-aware Core Frame crosswalk.
 *
 * Standard preserves standard Core Frame candidates.
 * Youth applies explicit preserve/soften/downweight policy while keeping
 * meaningful teen-facing themes in the standard pool.
 * Kids substitutes adult Core Frame candidates into kids-safe Core Frames.
 */

const {
    CORE_FRAME_AUDIENCE_POLICY,
    applyCoreFrameAudiencePolicyToCandidates
} = require("./coreFrameAudiencePolicy");

const youthCoreFrameCrosswalk = Object.fromEntries(
    Object.entries(CORE_FRAME_AUDIENCE_POLICY)
        .map(([id, policy]) => [id, policy.kids?.substitutes || []])
        .filter(([, substitutes]) => substitutes.length)
);

// Compatibility alias while the older export name remains in use.
const kidsCoreFrameCrosswalk = youthCoreFrameCrosswalk;

/**
 * Converts adult Core Frame candidates into kids-safe equivalents.
 * @param {Array<{id: string, weight: number}>} coreFrameCandidates
 * @returns {Array<{id: string, weight: number}>}
 */
function applyKidsCoreFrameCrosswalk(coreFrameCandidates = []) {
    return applyCoreFrameAudiencePolicyToCandidates(
        coreFrameCandidates,
        "kids"
    ).coreFrames;
}

// Compatibility wrapper for callers using the old function name.
function applyYouthCoreFrameCrosswalk(coreFrameCandidates = []) {
    return applyKidsCoreFrameCrosswalk(coreFrameCandidates);
}

/**
 * Applies profile-aware frame crosswalk rules.
 * Standard preserves candidates. Youth applies policy-aware preservation,
 * softening, and downweighting. Kids substitutes into kids-safe equivalents.
 * @param {object} options
 * @param {"standard" | "youth" | "kids"} options.experienceProfile
 * @param {object} options.candidateBuckets
 * @returns {object}
 */
function applyFrameCrosswalk({ experienceProfile, candidateBuckets }) {
    const policyResult = applyCoreFrameAudiencePolicyToCandidates(
        candidateBuckets.coreFrames || [],
        experienceProfile
    );

    return {
        ...candidateBuckets,
        coreFrames: policyResult.coreFrames
    };
}

module.exports = {
    youthCoreFrameCrosswalk,
    kidsCoreFrameCrosswalk,
    applyKidsCoreFrameCrosswalk,
    applyYouthCoreFrameCrosswalk,
    applyFrameCrosswalk
};
