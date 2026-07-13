function toArray(value) {
    if (Array.isArray(value)) {
        return value
            .map((item) => String(item ?? "").trim())
            .filter(Boolean);
    }

    if (value === undefined || value === null || value === "") return [];
    return [String(value).trim()].filter(Boolean);
}

function toString(value) {
    return String(value ?? "").trim();
}

function toNullableBoolean(value) {
    if (value === undefined || value === null || value === "") return null;
    if (typeof value === "boolean") return value;

    const normalized = toString(value).toLowerCase();
    if (["yes", "true", "1", "on"].includes(normalized)) return true;
    if (["no", "false", "0", "off"].includes(normalized)) return false;
    return null;
}

function toNullableNumber(value) {
    if (value === undefined || value === null || value === "") return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
}

function unique(values) {
    return [...new Set(values)];
}

function normalizeParticipationStatus(value, respondentType = "") {
    const normalized = toString(value).toLowerCase();
    const aliases = {
        active_opt_in: "opted_in",
        opted_in: "opted_in",
        conditional_opt_in: "conditional",
        conditional: "conditional",
        declined: "declined",
        withdrawn: "withdrawn",
        not_asked: "not_asked",
        not_eligible: "not_eligible"
    };

    if (aliases[normalized]) return aliases[normalized];
    if (["individual", "partial_group"].includes(respondentType)) return "not_asked";
    return "not_eligible";
}

function buildAvailability(raw = {}) {
    const days = toArrayPreserveEmpty(raw.matchmaking_availability_day);
    const starts = toArrayPreserveEmpty(raw.matchmaking_availability_start);
    const ends = toArrayPreserveEmpty(raw.matchmaking_availability_end);
    const length = Math.max(days.length, starts.length, ends.length);
    const availability = [];

    for (let index = 0; index < length; index += 1) {
        const day = toString(days[index]);
        const start = toString(starts[index]);
        const end = toString(ends[index]);

        if (!day && !start && !end) continue;
        availability.push({ day, start, end });
    }

    return availability;
}

function toArrayPreserveEmpty(value) {
    if (Array.isArray(value)) {
        return value.map((item) => String(item ?? "").trim());
    }

    if (value === undefined || value === null) return [];
    return [String(value).trim()];
}

function mapMatchmakingFields(raw = {}, options = {}) {
    const respondentType = toString(options.respondentType || raw.respondent_type);
    const source = toString(raw.matchmaking_source || options.source || "main_intake");
    const status = normalizeParticipationStatus(raw.matchmaking_status, respondentType);

    return {
        participation: {
            requested: ["opted_in", "conditional"].includes(status),
            status,
            source,
            submissionReference: toString(raw.matchmaking_submission_reference)
        },

        consent: {
            matchmaking: toNullableBoolean(raw.matchmaking_consent_participation),
            profileRetention: toNullableBoolean(raw.matchmaking_consent_retention),
            operatorReview: toNullableBoolean(raw.matchmaking_consent_operator_review),
            contactForIntroduction: toNullableBoolean(raw.matchmaking_consent_contact),
            shareableSummary: toNullableBoolean(raw.matchmaking_consent_shareable_summary)
        },

        logistics: {
            timezone: toString(raw.matchmaking_timezone),
            playFormats: unique(toArray(raw.matchmaking_play_format)),
            availability: buildAvailability(raw),
            frequencyPreferences: unique(toArray(raw.matchmaking_frequency)),
            sessionDuration: {
                minimumHours: toNullableNumber(raw.matchmaking_session_min_hours),
                maximumHours: toNullableNumber(raw.matchmaking_session_max_hours)
            },
            scheduleFlexibility: toString(raw.matchmaking_schedule_flexibility)
        },

        commitment: {
            campaignLengths: unique(toArray(raw.matchmaking_campaign_length)),
            attendanceExpectation: toString(raw.matchmaking_attendance_expectation),
            startReadiness: toString(raw.matchmaking_start_readiness)
        },

        systems: {
            preferred: unique(toArray(raw.matchmaking_system_preferred)),
            acceptable: unique(toArray(raw.matchmaking_system_acceptable)),
            excluded: unique(toArray(raw.matchmaking_system_excluded)),
            openness: toString(raw.matchmaking_system_openness)
        },

        experience: {
            overallLevel: toString(raw.matchmaking_experience_level),
            systemsPlayed: unique(toArray(raw.matchmaking_systems_played)),
            gmExperience: toNullableBoolean(raw.matchmaking_gm_experience),
            mixedExperienceComfort: toNullableBoolean(raw.matchmaking_mixed_experience_comfort)
        },

        tablePreferences: {
            roleplayIntensity: toString(raw.matchmaking_roleplay_intensity),
            tacticalIntensity: toString(raw.matchmaking_tactical_intensity),
            rulesApproach: toString(raw.matchmaking_rules_approach),
            characterCollaboration: toString(raw.matchmaking_character_collaboration),
            communicationStyles: unique(toArray(raw.matchmaking_communication_style)),
            voiceRequired: toNullableBoolean(raw.matchmaking_voice_required),
            videoPreference: toString(raw.matchmaking_video_preference)
        },

        groupPreferences: {
            minimumPlayers: toNullableNumber(raw.matchmaking_min_players),
            preferredPlayers: toNullableNumber(raw.matchmaking_preferred_players),
            maximumPlayers: toNullableNumber(raw.matchmaking_max_players)
        },

        hardConstraints: {
            schedule: unique(toArray(raw.matchmaking_hard_schedule)),
            format: unique(toArray(raw.matchmaking_hard_format)),
            content: unique(toArray(raw.matchmaking_hard_content)),
            system: unique(toArray(raw.matchmaking_hard_system)),
            commitment: unique(toArray(raw.matchmaking_hard_commitment)),
            tableCulture: unique(toArray(raw.matchmaking_hard_table_culture)),
            freeText: toString(raw.matchmaking_hard_constraints)
        }
    };
}

module.exports = {
    mapMatchmakingFields,
    normalizeParticipationStatus,
    toNullableBoolean,
    toNullableNumber,
    buildAvailability
};
