function ensureArray(value) {
    if (Array.isArray(value)) return value;
    if (value === undefined || value === null || value === "") return [];
    return [value];
}

function ensureString(value) {
    return String(value || "").trim();
}


function ensureNullableBoolean(value) {
    return typeof value === "boolean" ? value : null;
}

function ensureNullableNumber(value) {
    if (value === null || value === undefined || value === "") return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
}

function normalizeMatchmaking(matchmaking = {}) {
    return {
        participation: {
            requested: Boolean(matchmaking.participation?.requested),
            status: ensureString(matchmaking.participation?.status) || "not_asked",
            source: ensureString(matchmaking.participation?.source),
            submissionReference: ensureString(matchmaking.participation?.submissionReference)
        },
        consent: {
            matchmaking: ensureNullableBoolean(matchmaking.consent?.matchmaking),
            profileRetention: ensureNullableBoolean(matchmaking.consent?.profileRetention),
            operatorReview: ensureNullableBoolean(matchmaking.consent?.operatorReview),
            contactForIntroduction: ensureNullableBoolean(matchmaking.consent?.contactForIntroduction),
            shareableSummary: ensureNullableBoolean(matchmaking.consent?.shareableSummary)
        },
        logistics: {
            timezone: ensureString(matchmaking.logistics?.timezone),
            playFormats: ensureArray(matchmaking.logistics?.playFormats),
            availability: ensureArray(matchmaking.logistics?.availability).map((window) => ({
                day: ensureString(window?.day),
                start: ensureString(window?.start),
                end: ensureString(window?.end)
            })),
            frequencyPreferences: ensureArray(matchmaking.logistics?.frequencyPreferences),
            sessionDuration: {
                minimumHours: ensureNullableNumber(matchmaking.logistics?.sessionDuration?.minimumHours),
                maximumHours: ensureNullableNumber(matchmaking.logistics?.sessionDuration?.maximumHours)
            },
            scheduleFlexibility: ensureString(matchmaking.logistics?.scheduleFlexibility)
        },
        commitment: {
            campaignLengths: ensureArray(matchmaking.commitment?.campaignLengths),
            attendanceExpectation: ensureString(matchmaking.commitment?.attendanceExpectation),
            startReadiness: ensureString(matchmaking.commitment?.startReadiness)
        },
        systems: {
            preferred: ensureArray(matchmaking.systems?.preferred),
            acceptable: ensureArray(matchmaking.systems?.acceptable),
            excluded: ensureArray(matchmaking.systems?.excluded),
            openness: ensureString(matchmaking.systems?.openness)
        },
        experience: {
            overallLevel: ensureString(matchmaking.experience?.overallLevel),
            systemsPlayed: ensureArray(matchmaking.experience?.systemsPlayed),
            gmExperience: ensureNullableBoolean(matchmaking.experience?.gmExperience),
            mixedExperienceComfort: ensureNullableBoolean(matchmaking.experience?.mixedExperienceComfort)
        },
        tablePreferences: {
            roleplayIntensity: ensureString(matchmaking.tablePreferences?.roleplayIntensity),
            tacticalIntensity: ensureString(matchmaking.tablePreferences?.tacticalIntensity),
            rulesApproach: ensureString(matchmaking.tablePreferences?.rulesApproach),
            characterCollaboration: ensureString(matchmaking.tablePreferences?.characterCollaboration),
            communicationStyles: ensureArray(matchmaking.tablePreferences?.communicationStyles),
            voiceRequired: ensureNullableBoolean(matchmaking.tablePreferences?.voiceRequired),
            videoPreference: ensureString(matchmaking.tablePreferences?.videoPreference)
        },
        groupPreferences: {
            minimumPlayers: ensureNullableNumber(matchmaking.groupPreferences?.minimumPlayers),
            preferredPlayers: ensureNullableNumber(matchmaking.groupPreferences?.preferredPlayers),
            maximumPlayers: ensureNullableNumber(matchmaking.groupPreferences?.maximumPlayers)
        },
        hardConstraints: {
            schedule: ensureArray(matchmaking.hardConstraints?.schedule),
            format: ensureArray(matchmaking.hardConstraints?.format),
            content: ensureArray(matchmaking.hardConstraints?.content),
            system: ensureArray(matchmaking.hardConstraints?.system),
            commitment: ensureArray(matchmaking.hardConstraints?.commitment),
            tableCulture: ensureArray(matchmaking.hardConstraints?.tableCulture),
            freeText: ensureString(matchmaking.hardConstraints?.freeText)
        }
    };
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
            eras: ensureArray(mapped.selections?.eras),
            aesthetics: ensureArray(mapped.selections?.aesthetics),
            worldConditions: ensureArray(mapped.selections?.worldConditions),
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

        matchmaking: normalizeMatchmaking(mapped.matchmaking),

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
    normalizeSubmission,
    normalizeMatchmaking
};
