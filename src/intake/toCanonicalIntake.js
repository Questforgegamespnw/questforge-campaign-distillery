function toCanonicalIntake(normalized = {}) {
    const source = normalized.source || {};
    const groupInfo = normalized.groupInfo || {};
    const selections = normalized.selections || {};
    const freeText = normalized.freeText || {};
    const boundaries = normalized.boundaries || {};
    const rawSignals = normalized.rawSignals || {};
    const matchmaking = normalized.matchmaking || {};
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

        matchmaking: {
            participation: {
                requested: Boolean(matchmaking.participation?.requested),
                status: matchmaking.participation?.status || "not_asked",
                source: matchmaking.participation?.source || "",
                submissionReference: matchmaking.participation?.submissionReference || ""
            },
            consent: {
                matchmaking: matchmaking.consent?.matchmaking ?? null,
                profileRetention: matchmaking.consent?.profileRetention ?? null,
                operatorReview: matchmaking.consent?.operatorReview ?? null,
                contactForIntroduction: matchmaking.consent?.contactForIntroduction ?? null,
                shareableSummary: matchmaking.consent?.shareableSummary ?? null
            },
            logistics: {
                timezone: matchmaking.logistics?.timezone || "",
                playFormats: matchmaking.logistics?.playFormats || [],
                availability: matchmaking.logistics?.availability || [],
                frequencyPreferences: matchmaking.logistics?.frequencyPreferences || [],
                sessionDuration: {
                    minimumHours: matchmaking.logistics?.sessionDuration?.minimumHours ?? null,
                    maximumHours: matchmaking.logistics?.sessionDuration?.maximumHours ?? null
                },
                scheduleFlexibility: matchmaking.logistics?.scheduleFlexibility || ""
            },
            commitment: {
                campaignLengths: matchmaking.commitment?.campaignLengths || [],
                attendanceExpectation: matchmaking.commitment?.attendanceExpectation || "",
                startReadiness: matchmaking.commitment?.startReadiness || ""
            },
            systems: {
                preferred: matchmaking.systems?.preferred || [],
                acceptable: matchmaking.systems?.acceptable || [],
                excluded: matchmaking.systems?.excluded || [],
                openness: matchmaking.systems?.openness || ""
            },
            experience: {
                overallLevel: matchmaking.experience?.overallLevel || "",
                systemsPlayed: matchmaking.experience?.systemsPlayed || [],
                gmExperience: matchmaking.experience?.gmExperience ?? null,
                mixedExperienceComfort: matchmaking.experience?.mixedExperienceComfort ?? null
            },
            tablePreferences: {
                roleplayIntensity: matchmaking.tablePreferences?.roleplayIntensity || "",
                tacticalIntensity: matchmaking.tablePreferences?.tacticalIntensity || "",
                rulesApproach: matchmaking.tablePreferences?.rulesApproach || "",
                characterCollaboration: matchmaking.tablePreferences?.characterCollaboration || "",
                communicationStyles: matchmaking.tablePreferences?.communicationStyles || [],
                voiceRequired: matchmaking.tablePreferences?.voiceRequired ?? null,
                videoPreference: matchmaking.tablePreferences?.videoPreference || ""
            },
            groupPreferences: {
                minimumPlayers: matchmaking.groupPreferences?.minimumPlayers ?? null,
                preferredPlayers: matchmaking.groupPreferences?.preferredPlayers ?? null,
                maximumPlayers: matchmaking.groupPreferences?.maximumPlayers ?? null
            },
            hardConstraints: {
                schedule: matchmaking.hardConstraints?.schedule || [],
                format: matchmaking.hardConstraints?.format || [],
                content: matchmaking.hardConstraints?.content || [],
                system: matchmaking.hardConstraints?.system || [],
                commitment: matchmaking.hardConstraints?.commitment || [],
                tableCulture: matchmaking.hardConstraints?.tableCulture || [],
                freeText: matchmaking.hardConstraints?.freeText || ""
            }
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
