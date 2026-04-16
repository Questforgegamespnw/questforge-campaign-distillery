function ensureArray(value) {
    if (Array.isArray(value)) return value;
    if (value === undefined || value === null || value === "") return [];
    return [value];
}

function ensureString(value) {
    return String(value || "").trim();
}

function normalizeSubmission(mapped = {}) {
    return {
        ...mapped,

        groupInfo: {
            name: ensureString(mapped.groupInfo?.name),
            email: ensureString(mapped.groupInfo?.email),
            groupSize: ensureString(mapped.groupInfo?.groupSize),
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

        safetySignals: mapped.safetySignals || {},

        resolvedFlags: {
            youthSafeMode: Boolean(mapped.resolvedFlags?.youthSafeMode)
        },

        diagnostics: {
            hasMinimumViableSignal: Boolean(
                mapped.diagnostics?.hasMinimumViableSignal
            ),
            contradictionNotes: ensureArray(mapped.diagnostics?.contradictionNotes)
        }
    };
}

module.exports = {
    normalizeSubmission
};