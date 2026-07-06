function toCanonicalIntake(normalized = {}) {
    const source = normalized.source || {};
    const groupInfo = normalized.groupInfo || {};
    const selections = normalized.selections || {};
    const freeText = normalized.freeText || {};
    const boundaries = normalized.boundaries || {};
    const rawSignals = normalized.rawSignals || {};
    const safetySignals = normalized.safetySignals || {};
    const resolvedFlags = normalized.resolvedFlags || {};
    const diagnostics = normalized.diagnostics || {};

    const experienceProfile =
        resolvedFlags.experienceProfile ||
        safetySignals.experienceProfile ||
        "standard";

    const contentSafetyMode =
        resolvedFlags.contentSafetyMode ||
        safetySignals.contentSafetyMode ||
        "standard";

    const contradictionNotes =
        diagnostics.contradictionNotes ||
        safetySignals.contradictionNotes ||
        [];

    return {
        schemaVersion: "1.0",

        source: {
            type: source.type || "unknown",
            formId: source.formId || "",
            subject: source.subject || ""
        },

        group: {
            name: groupInfo.name || "",
            email: groupInfo.email || "",
            respondentType: groupInfo.respondentType || "",
            groupSize: groupInfo.groupSize || "",
            currentGroupSize: groupInfo.currentGroupSize || "",
            desiredGroupSize: groupInfo.desiredGroupSize || "",
            systemPreference: groupInfo.systemPreference || "",
            audience: groupInfo.audience || "",
            ageBand: groupInfo.ageBand || ""
        },

        preferences: {
            experiences: selections.experiences || [],
            setups: selections.setups || [],
            tone: selections.tone || "",
            choiceWeight: selections.choiceWeight || "",

            // Legacy broad genre field retained for light Phase 1 flavor.
            genres: selections.genres || [],

            // Decomposed genre-context fields retained for audit and Phase 2 handoff.
            eras: selections.eras || [],
            aesthetics: selections.aesthetics || [],
            worldConditions: selections.worldConditions || [],

            environments: selections.environments || [],
            gameplayInterests: selections.gameplayInterests || [],
            playerFantasy: selections.playerFantasy || []
        },

        notes: {
            mustHaves: freeText.mustHaves || "",
            avoid: freeText.avoid || "",
            campaignSummary: freeText.campaignSummary || ""
        },

        boundaries: {
            contentBoundaries: boundaries.contentBoundaries || []
        },

        safety: {
            experienceProfile,
            contentSafetyMode,
            explicitYouthMode: Boolean(safetySignals.explicitYouthMode),
            audienceSuggestsYouth: Boolean(safetySignals.audienceSuggestsYouth),
            audienceSuggestsKids: Boolean(safetySignals.audienceSuggestsKids),
            audienceRequestsFamilyFriendly: Boolean(safetySignals.audienceRequestsFamilyFriendly),
            ageBandSuggestsYouth: Boolean(safetySignals.ageBandSuggestsYouth),
            ageBandSuggestsKids: Boolean(safetySignals.ageBandSuggestsKids),
            familyFriendlyBoundary: Boolean(safetySignals.familyFriendlyBoundary),
            textSuggestsYouth: Boolean(safetySignals.textSuggestsYouth),
            textSuggestsKids: Boolean(safetySignals.textSuggestsKids),
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
            ),
            horrorRestricted: Boolean(safetySignals.horrorRestricted),
            graphicContentRestricted: Boolean(safetySignals.graphicContentRestricted),
            oppressiveToneRestricted: Boolean(safetySignals.oppressiveToneRestricted),
            softYouthCueCount: Number(safetySignals.softYouthCueCount || 0),
            contradictionNotes
        },

        rawSignals: {
            youthMode: rawSignals.youthMode || [],
            audience: rawSignals.audience || "",
            ageBand: rawSignals.ageBand || "",
            contentBoundaries: rawSignals.contentBoundaries || [],
            mustHaves: rawSignals.mustHaves || "",
            avoid: rawSignals.avoid || ""
        },

        diagnostics: {
            hasMinimumViableSignal: Boolean(diagnostics.hasMinimumViableSignal),
            contradictionNotes
        }
    };
}

module.exports = {
    toCanonicalIntake
};
