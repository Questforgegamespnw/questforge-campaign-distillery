function firstItem(array) {
    return Array.isArray(array) && array.length > 0 ? array[0] : "";
}

function joinNotes(...parts) {
    return parts
        .map((value) => String(value || "").trim())
        .filter(Boolean)
        .join("; ");
}

function normalizeValue(value) {
    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
}

function toCanonicalIntake(normalized = {}) {
    const groupInfo = normalized.groupInfo || {};
    const selections = normalized.selections || {};
    const freeText = normalized.freeText || {};
    const boundaries = normalized.boundaries || {};
    const rawSignals = normalized.rawSignals || {};
    const safetySignals = normalized.safetySignals || {};
    const resolvedFlags = normalized.resolvedFlags || {};
    const diagnostics = normalized.diagnostics || {};
    const source = normalized.source || {};

    return {
        source: {
            type: source.type || "unknown",
            formId: source.formId || "",
            subject: source.subject || ""
        },

        groupInfo: {
            name: groupInfo.name || "",
            email: groupInfo.email || "",
            groupSize: groupInfo.groupSize || "",
            systemPreference: groupInfo.systemPreference || "",
            audience: groupInfo.audience || "",
            ageBand: groupInfo.ageBand || ""
        },

        preferences: {
            experiences: selections.experiences || [],
            setups: selections.setups || [],
            tone: selections.tone || "",
            choiceWeight: selections.choiceWeight || "",
            genres: selections.genres || [],
            environments: selections.environments || [],
            gameplayInterests: selections.gameplayInterests || [],
            playerFantasy: selections.playerFantasy || []
        },

        freeText: {
            mustHaves: freeText.mustHaves || "",
            avoid: freeText.avoid || "",
            campaignSummary: freeText.campaignSummary || ""
        },

        boundaries: {
            contentBoundaries: boundaries.contentBoundaries || []
        },

        safety: {
            explicitYouthMode: Boolean(safetySignals.explicitYouthMode),
            audienceSuggestsYouth: Boolean(safetySignals.audienceSuggestsYouth),
            ageBandSuggestsYouth: Boolean(safetySignals.ageBandSuggestsYouth),
            familyFriendlyBoundary: Boolean(safetySignals.familyFriendlyBoundary),
            textSuggestsYouth: Boolean(safetySignals.textSuggestsYouth),
            inferredYouthSafe: Boolean(safetySignals.inferredYouthSafe),
            youthSafeMode: Boolean(resolvedFlags.youthSafeMode),
            softYouthCueCount: Number(safetySignals.softYouthCueCount || 0),
            contradictionNotes: diagnostics.contradictionNotes || []
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
            hasMinimumViableSignal: Boolean(diagnostics.hasMinimumViableSignal)
        },

        pipelineInput: {
            youthMode: Boolean(resolvedFlags.youthSafeMode),
            ageBand: groupInfo.ageBand || "",
            system: groupInfo.systemPreference || "",

            overallExperience: normalizeValue(firstItem(selections.experiences)),
            tone: normalizeValue(selections.tone),
            worldAesthetic: normalizeValue(firstItem(selections.genres)),
            conflict: normalizeValue(firstItem(selections.setups)),
            choiceWeight: normalizeValue(selections.choiceWeight),
            playerFantasy: normalizeValue(firstItem(selections.playerFantasy)),

            gameplay: (selections.gameplayInterests || []).map(normalizeValue),
            environments: (selections.environments || []).map(normalizeValue),

            includeNotes: joinNotes(
                freeText.mustHaves,
                ...(boundaries.contentBoundaries || [])
            ),

            excludeNotes: joinNotes(freeText.avoid)
    }       
};
}
module.exports = {
    toCanonicalIntake
};