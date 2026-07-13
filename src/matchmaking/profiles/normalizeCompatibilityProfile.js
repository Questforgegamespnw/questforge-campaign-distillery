function ensureString(value) {
    return String(value ?? "").trim();
}

function ensureArray(value) {
    if (Array.isArray(value)) {
        return value
            .map((item) => ensureString(item))
            .filter(Boolean);
    }
    if (value === undefined || value === null || value === "") return [];
    return [ensureString(value)].filter(Boolean);
}

function ensureNullableBoolean(value) {
    return typeof value === "boolean" ? value : null;
}

function ensureNullableNumber(value) {
    if (value === undefined || value === null || value === "") return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
}

function unique(values) {
    return [...new Set(ensureArray(values))];
}

function normalizeAvailability(value) {
    if (!Array.isArray(value)) return [];
    return value
        .map((window) => ({
            day: ensureString(window?.day).toLowerCase(),
            start: ensureString(window?.start),
            end: ensureString(window?.end)
        }))
        .filter((window) => window.day || window.start || window.end);
}

function normalizeCompatibilityProfile(profile = {}) {
    const normalized = {
        schemaVersion: "1.0",
        playerId: ensureString(profile.playerId),
        submissionId: ensureString(profile.submissionId),
        status: ensureString(profile.status) || "paused",
        statusReason: ensureString(profile.statusReason),

        consent: {
            matchmaking: ensureNullableBoolean(profile.consent?.matchmaking),
            profileRetention: ensureNullableBoolean(profile.consent?.profileRetention),
            operatorReview: ensureNullableBoolean(profile.consent?.operatorReview),
            contactForIntroduction: ensureNullableBoolean(profile.consent?.contactForIntroduction),
            shareableSummary: ensureNullableBoolean(profile.consent?.shareableSummary)
        },

        identity: {
            displayName: ensureString(profile.identity?.displayName),
            contactRef: ensureString(profile.identity?.contactRef)
        },

        logistics: {
            timezone: ensureString(profile.logistics?.timezone),
            playFormats: unique(profile.logistics?.playFormats),
            availability: normalizeAvailability(profile.logistics?.availability),
            frequencyPreferences: unique(profile.logistics?.frequencyPreferences),
            sessionDuration: {
                minimumHours: ensureNullableNumber(profile.logistics?.sessionDuration?.minimumHours),
                maximumHours: ensureNullableNumber(profile.logistics?.sessionDuration?.maximumHours)
            },
            scheduleFlexibility: ensureString(profile.logistics?.scheduleFlexibility)
        },

        commitment: {
            campaignLengths: unique(profile.commitment?.campaignLengths),
            attendanceExpectation: ensureString(profile.commitment?.attendanceExpectation),
            startReadiness: ensureString(profile.commitment?.startReadiness)
        },

        systems: {
            preferred: unique(profile.systems?.preferred),
            acceptable: unique(profile.systems?.acceptable),
            excluded: unique(profile.systems?.excluded),
            openness: ensureString(profile.systems?.openness)
        },

        campaignPreferences: {
            experiences: unique(profile.campaignPreferences?.experiences),
            setups: unique(profile.campaignPreferences?.setups),
            tone: ensureString(profile.campaignPreferences?.tone),
            choiceWeight: ensureString(profile.campaignPreferences?.choiceWeight),
            genres: unique(profile.campaignPreferences?.genres),
            eras: unique(profile.campaignPreferences?.eras),
            aesthetics: unique(profile.campaignPreferences?.aesthetics),
            worldConditions: unique(profile.campaignPreferences?.worldConditions),
            environments: unique(profile.campaignPreferences?.environments),
            gameplayInterests: unique(profile.campaignPreferences?.gameplayInterests),
            playerFantasy: unique(profile.campaignPreferences?.playerFantasy),
            mustHaves: ensureString(profile.campaignPreferences?.mustHaves),
            avoid: ensureString(profile.campaignPreferences?.avoid),
            systemPreference: ensureString(profile.campaignPreferences?.systemPreference)
        },

        tablePreferences: {
            roleplayIntensity: ensureString(profile.tablePreferences?.roleplayIntensity),
            tacticalIntensity: ensureString(profile.tablePreferences?.tacticalIntensity),
            rulesApproach: ensureString(profile.tablePreferences?.rulesApproach),
            characterCollaboration: ensureString(profile.tablePreferences?.characterCollaboration),
            communicationStyles: unique(profile.tablePreferences?.communicationStyles),
            voiceRequired: ensureNullableBoolean(profile.tablePreferences?.voiceRequired),
            videoPreference: ensureString(profile.tablePreferences?.videoPreference)
        },

        experience: {
            overallLevel: ensureString(profile.experience?.overallLevel),
            systemsPlayed: unique(profile.experience?.systemsPlayed),
            gmExperience: ensureNullableBoolean(profile.experience?.gmExperience),
            mixedExperienceComfort: ensureNullableBoolean(profile.experience?.mixedExperienceComfort)
        },

        safety: {
            contentSafetyMode: ensureString(profile.safety?.contentSafetyMode) || "standard",
            boundaries: unique(profile.safety?.boundaries),
            hardExclusions: unique(profile.safety?.hardExclusions),
            operatorPrivateNotes: unique(profile.safety?.operatorPrivateNotes),
            shareableGuidance: unique(profile.safety?.shareableGuidance)
        },

        groupPreferences: {
            minimumPlayers: ensureNullableNumber(profile.groupPreferences?.minimumPlayers),
            preferredPlayers: ensureNullableNumber(profile.groupPreferences?.preferredPlayers),
            maximumPlayers: ensureNullableNumber(profile.groupPreferences?.maximumPlayers)
        },

        requirements: {
            mustHaves: unique(profile.requirements?.mustHaves),
            hardConstraints: {
                schedule: unique(profile.requirements?.hardConstraints?.schedule),
                format: unique(profile.requirements?.hardConstraints?.format),
                content: unique(profile.requirements?.hardConstraints?.content),
                system: unique(profile.requirements?.hardConstraints?.system),
                commitment: unique(profile.requirements?.hardConstraints?.commitment),
                tableCulture: unique(profile.requirements?.hardConstraints?.tableCulture)
            },
            freeTextNotes: unique(profile.requirements?.freeTextNotes)
        },

        shareableSummary: {
            campaignInterests: unique(profile.shareableSummary?.campaignInterests),
            availabilitySummary: ensureString(profile.shareableSummary?.availabilitySummary),
            systemSummary: ensureString(profile.shareableSummary?.systemSummary),
            tableStyleSummary: ensureString(profile.shareableSummary?.tableStyleSummary),
            commitmentSummary: ensureString(profile.shareableSummary?.commitmentSummary),
            sessionZeroTopics: unique(profile.shareableSummary?.sessionZeroTopics)
        },

        completeness: {
            percentage: Math.max(0, Math.min(100, Number(profile.completeness?.percentage || 0))),
            missingRequiredFields: unique(profile.completeness?.missingRequiredFields),
            warnings: unique(profile.completeness?.warnings),
            contradictions: unique(profile.completeness?.contradictions),
            explicitFieldCount: Math.max(0, Number(profile.completeness?.explicitFieldCount || 0)),
            inferredFieldCount: Math.max(0, Number(profile.completeness?.inferredFieldCount || 0))
        },

        provenance: {
            profileVersion: Math.max(1, Number(profile.provenance?.profileVersion || 1)),
            sourceCanonicalSchemaVersion: ensureString(profile.provenance?.sourceCanonicalSchemaVersion),
            sourceCanonicalHash: ensureString(profile.provenance?.sourceCanonicalHash),
            sourceType: ensureString(profile.provenance?.sourceType),
            createdAt: ensureString(profile.provenance?.createdAt),
            updatedAt: ensureString(profile.provenance?.updatedAt),
            lastConfirmedAt: ensureString(profile.provenance?.lastConfirmedAt)
        },

        lifecycle: {
            statusChangedAt: ensureString(profile.lifecycle?.statusChangedAt),
            matchedReference: ensureString(profile.lifecycle?.matchedReference),
            history: Array.isArray(profile.lifecycle?.history)
                ? profile.lifecycle.history.map((entry) => ({
                    status: ensureString(entry?.status),
                    reason: ensureString(entry?.reason),
                    timestamp: ensureString(entry?.timestamp)
                })).filter((entry) => entry.status && entry.timestamp)
                : []
        }
    };

    return normalized;
}

module.exports = {
    normalizeCompatibilityProfile
};
