const coreFrames = require("../data/coreFrames");
const youthCoreFrames = require("../data/youthCoreFrames");
const systemFrames = require("../data/systemFrames");
const toneSkins = require("../data/toneSkins");
const genreSkins = require("../data/genreSkins");
const environmentSkins = require("../data/environmentSkins");
const { applyFrameCrosswalk } = require("./frameCrosswalk");

const EXPERIENCE_PROFILES = Object.freeze([
    "standard",
    "youth",
    "kids"
]);

function normalizeText(value) {
    return String(value || "").trim().toLowerCase();
}

function normalizeExperienceProfile(value) {
    const normalized = normalizeText(value);
    return EXPERIENCE_PROFILES.includes(normalized) ? normalized : "";
}

function toArray(value) {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (value === undefined || value === null || value === "") return [];
    return [value];
}

/**
 * Legacy fallback for records that predate canonical experienceProfile output.
 * New pipeline records should already contain standard, youth, or kids.
 * @param {object} rawAnswers
 * @returns {"standard" | "youth" | "kids"}
 */
function inferLegacyExperienceProfile(rawAnswers = {}) {
    const audience = normalizeText(rawAnswers.audience);
    const ageBand = normalizeText(rawAnswers.age_band || rawAnswers.ageBand);
    const system = normalizeText(rawAnswers.system);
    const youthModeValues = toArray(
        rawAnswers.youth_mode ?? rawAnswers.youthMode
    ).map(normalizeText);

    const explicitKidsMode =
        youthModeValues.includes("yes") ||
        youthModeValues.includes("kids") ||
        youthModeValues.includes("kid-safe") ||
        rawAnswers.youthMode === true;

    const kidsProfile =
        explicitKidsMode ||
        system === "hero_kids" ||
        [
            "kids (under 13)",
            "family-friendly / kid-safe experience"
        ].includes(audience) ||
        [
            "kids_11_13",
            "kids_8_10",
            "kids_5_7"
        ].includes(ageBand);

    if (kidsProfile) return "kids";

    const youthProfile =
        ["teens (13–17)", "mixed ages"].includes(audience) ||
        ["teens_14_17", "mixed_age"].includes(ageBand) ||
        youthModeValues.includes("youth") ||
        youthModeValues.includes("teen");

    return youthProfile ? "youth" : "standard";
}

/**
 * Resolves the final experience profile from available signals.
 * Canonical intake takes precedence over translated and legacy raw values.
 * @param {object} options
 * @param {object} [options.normalizedIntake]
 * @param {object} [options.translatedForm]
 * @param {object} [options.rawAnswers]
 * @returns {"standard" | "youth" | "kids"}
 */
function finalizeExperienceProfile({
    normalizedIntake = {},
    translatedForm = {},
    rawAnswers = {}
}) {
    const canonicalProfile = normalizeExperienceProfile(
        normalizedIntake?.experienceProfile
    );
    if (canonicalProfile) return canonicalProfile;

    const translatedProfile = normalizeExperienceProfile(
        translatedForm?.experienceProfile
    );
    if (translatedProfile) return translatedProfile;

    return inferLegacyExperienceProfile(rawAnswers);
}

/**
 * Returns profile-based rules for filtering candidate pools.
 * Youth currently preserves standard frame pools while later tickets define
 * explicit soften/downweight policy. Kids retains the former full-safe route.
 * @param {"standard" | "youth" | "kids"} experienceProfile
 * @returns {{
 *   profile: "standard" | "youth" | "kids",
 *   coreFramePool: Array<object>,
 *   excludedCoreFrameIds: string[],
 *   excludedSystemFrameIds: string[],
 *   excludedToneSkinIds: string[]
 * }}
 */
function getProfileRules(experienceProfile) {
    const profile = normalizeExperienceProfile(experienceProfile) || "standard";

    if (profile === "kids") {
        return {
            profile,
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

    // The interim youth bridge preserves the standard candidate pools.
    // Ticket #74 will define explicit preserve/soften/substitute/suppress rules.
    return {
        profile,
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
 *   experienceProfile: "standard" | "youth" | "kids",
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
    EXPERIENCE_PROFILES,
    normalizeExperienceProfile,
    inferLegacyExperienceProfile,
    finalizeExperienceProfile,
    getProfileRules,
    applyProfileRulesToBuckets,
    resolveCampaignContext
};
