const coreFrames = require("../data/coreFrames");
const youthCoreFrames = require("../data/youthCoreFrames");
const systemFrames = require("../data/systemFrames");
const toneSkins = require("../data/toneSkins");
const genreSkins = require("../data/genreSkins");
const environmentSkins = require("../data/environmentSkins");
const { applyFrameCrosswalk } = require("./frameCrosswalk");

/**
 * Resolves the final experience profile from available signals.
 * Intake/form signals should override looser inference when present.
 * @param {object} options
 * @param {object} [options.normalizedIntake]
 * @param {object} [options.translatedForm]
 * @param {object} [options.rawAnswers]
 * @returns {"standard" | "youth"}
 */
function finalizeExperienceProfile({
    normalizedIntake = {},
    translatedForm = {},
    rawAnswers = {}
}) {
    const explicitYouth =
        rawAnswers?.youth_mode ||
        rawAnswers?.youthMode === true ||
        (rawAnswers?.age_band && rawAnswers.age_band !== "adult") ||
        (rawAnswers?.ageBand && rawAnswers.ageBand !== "adult") ||
        rawAnswers?.system === "hero_kids" ||
        rawAnswers?.audience === "Kids (under 13)" ||
        rawAnswers?.audience === "Family-friendly / kid-safe experience";

    if (explicitYouth) {
        return "youth";
    }

    if (normalizedIntake?.experienceProfile === "youth") {
        return "youth";
    }

    if (translatedForm?.experienceProfile === "youth") {
        return "youth";
    }

    return "standard";
}

/**
 * Returns profile-based rules for filtering candidate pools.
 * @param {"standard" | "youth"} experienceProfile
 * @returns {{
 *   coreFramePool: Array<object>,
 *   excludedCoreFrameIds: string[],
 *   excludedSystemFrameIds: string[],
 *   excludedToneSkinIds: string[]
 * }}
 */
function getProfileRules(experienceProfile) {
    if (experienceProfile === "youth") {
        return {
            coreFramePool: youthCoreFrames,
            excludedCoreFrameIds: [
                "entropy_decay",
                "power_has_a_cost",
                "what_is_humanity",
                "the_endless_siege",
                "investigators_burden",
                "fall_from_grace"
            ],
            excludedSystemFrameIds: [
                "attrition_combat",
                "resource_scarcity",
                "corruption_transformation_track",
                "alliance_vs_betrayal"
            ],
            excludedToneSkinIds: [
                "grimdark",
                "horror",
                "melancholic",
                "psychological"
            ]
        };
    }

    return {
        coreFramePool: coreFrames,
        excludedCoreFrameIds: [],
        excludedSystemFrameIds: [],
        excludedToneSkinIds: []
    };
}

/**
 * Filters weighted candidate buckets using profile rules.
 * @param {object} buckets
 * @param {ReturnType<typeof getProfileRules>} rules
 * @returns {object}
 */
function applyProfileRulesToBuckets(buckets, rules) {
    return {
        ...buckets,
        coreFrames: (buckets.coreFrames || []).filter(
            (entry) => !rules.excludedCoreFrameIds.includes(entry.id)
        ),
        systemFrames: (buckets.systemFrames || []).filter(
            (entry) => !rules.excludedSystemFrameIds.includes(entry.id)
        ),
        toneSkins: (buckets.toneSkins || []).filter(
            (entry) => !rules.excludedToneSkinIds.includes(entry.id)
        )
    };
}

/**
 * Resolves a profile-aware campaign context before selection.
 * @param {object} options
 * @param {object} [options.normalizedIntake]
 * @param {object} [options.translatedForm]
 * @param {object} [options.rawAnswers]
 * @returns {{
 *   experienceProfile: "standard" | "youth",
 *   availablePools: {
 *     coreFrames: Array<object>,
 *     systemFrames: Array<object>,
 *     toneSkins: Array<object>,
 *     genreSkins: Array<object>,
 *     environmentSkins: Array<object>
 *   },
 *   candidateBuckets: object,
 *   rules: ReturnType<typeof getProfileRules>
 * }}
 */
function resolveCampaignContext({
    normalizedIntake = {},
    translatedForm = {},
    rawAnswers = {}
}) {
    const experienceProfile = finalizeExperienceProfile({
        normalizedIntake,
        translatedForm,
        rawAnswers
    });

    const rules = getProfileRules(experienceProfile);

    const profileFilteredBuckets = applyProfileRulesToBuckets(
        {
            coreFrames: translatedForm.coreFrames || [],
            systemFrames: translatedForm.systemFrames || [],
            toneSkins: translatedForm.toneSkins || [],
            genreSkins: translatedForm.genreSkins || [],
            environmentSkins: translatedForm.environmentSkins || [],
            modifiers: translatedForm.modifiers || {}
        },
        rules
    );

    const candidateBuckets = applyFrameCrosswalk({
        experienceProfile,
        candidateBuckets: profileFilteredBuckets
    });

    return {
        experienceProfile,
        availablePools: {
            coreFrames: rules.coreFramePool,
            systemFrames,
            toneSkins,
            genreSkins,
            environmentSkins
        },
        candidateBuckets,
        rules
    };
}

module.exports = {
    finalizeExperienceProfile,
    getProfileRules,
    applyProfileRulesToBuckets,
    resolveCampaignContext
};