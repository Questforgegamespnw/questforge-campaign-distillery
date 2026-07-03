function ensureArray(value) {
    if (Array.isArray(value)) return value;
    if (value === undefined || value === null || value === "") return [];
    return [value];
}

function ensureString(value) {
    return String(value || "").trim();
}

function ensureExperienceProfile(value) {
    const normalized = ensureString(value).toLowerCase();
    return ["standard", "youth", "kids"].includes(normalized)
        ? normalized
        : "standard";
}

function ensureContentSafetyMode(value) {
    const normalized = ensureString(value).toLowerCase();
    return ["standard", "restricted", "family_friendly", "full_kid_safe"].includes(normalized)
        ? normalized
        : "standard";
}

function normalizeSubmission(mapped = {}) {
    const safetySignals = mapped.safetySignals || {};
    const resolvedFlags = mapped.resolvedFlags || {};

    return {
        ...mapped,

        groupInfo: {
            name: ensureString(mapped.groupInfo?.name),
            email: ensureString(mapped.groupInfo?.email),
            respondentType: ensureString(mapped.groupInfo?.respondentType),
            groupSize: ensureString(mapped.groupInfo?.groupSize),
            currentGroupSize: ensureString(mapped.groupInfo?.currentGroupSize),
            desiredGroupSize: ensureString(mapped.groupInfo?.desiredGroupSize),
            systemPreference: ensureString(mapped.groupInfo?.systemPreference),
            audience: ensureString(mapped.groupInfo?.audience),
            ageBand: ensureString(mapped.groupInfo?.ageBand)
        },

        selections: {
            experiences: ensureArray(mapped.selections?.experiences),
            setups: ensureArray(mapped.selections?.setups),
            tone: ensureString(mapped.selections?.tone),
            choiceWeight: ensureString(mapped.selections?.choiceWeight),
            genres: ensureArray(mapped.selections?.genres),
            environments: ensureArray(mapped.selections?.environments),
            gameplayInterests: ensureArray(mapped.selections?.gameplayInterests),
            playerFantasy: ensureArray(mapped.selections?.playerFantasy)
        },

        freeText: {
            mustHaves: ensureString(mapped.freeText?.mustHaves),
            avoid: ensureString(mapped.freeText?.avoid),
            campaignSummary: ensureString(mapped.freeText?.campaignSummary)
        },

        boundaries: {
            contentBoundaries: ensureArray(mapped.boundaries?.contentBoundaries)
        },

        rawSignals: {
            youthMode: ensureArray(mapped.rawSignals?.youthMode),
            audience: ensureString(mapped.rawSignals?.audience),
            ageBand: ensureString(mapped.rawSignals?.ageBand),
            contentBoundaries: ensureArray(mapped.rawSignals?.contentBoundaries),
            mustHaves: ensureString(mapped.rawSignals?.mustHaves),
            avoid: ensureString(mapped.rawSignals?.avoid)
        },

        safetySignals,

        resolvedFlags: {
            experienceProfile: ensureExperienceProfile(
                resolvedFlags.experienceProfile || safetySignals.experienceProfile
            ),
            contentSafetyMode: ensureContentSafetyMode(
                resolvedFlags.contentSafetyMode || safetySignals.contentSafetyMode
            ),
            inferredYouthSafe: Boolean(
                resolvedFlags.inferredYouthSafe || safetySignals.inferredYouthSafe
            ),
            youthSafeMode: Boolean(
                resolvedFlags.youthSafeMode || safetySignals.youthSafeMode
            ),
            softerThemesMode: Boolean(
                resolvedFlags.softerThemesMode || safetySignals.softerThemesMode
            ),
            fullSafeMode: Boolean(
                resolvedFlags.fullSafeMode || safetySignals.fullSafeMode
            ),
            heroKidsMode: Boolean(
                resolvedFlags.heroKidsMode || safetySignals.heroKidsMode
            )
        },

        diagnostics: {
            hasMinimumViableSignal: Boolean(
                mapped.diagnostics?.hasMinimumViableSignal
            ),
            contradictionNotes: ensureArray(
                mapped.diagnostics?.contradictionNotes || safetySignals.contradictionNotes
            )
        }
    };
}

module.exports = {
    normalizeSubmission
};
