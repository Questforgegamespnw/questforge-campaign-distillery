const { inferSafetySignals } = require("./inferSafetySignals");

const {
    TONE_ALIASES,
    GENRE_ALIASES,
    ENVIRONMENT_ALIASES
} = require("../config/intakeEnums");

function toArray(value) {
    if (Array.isArray(value)) {
        return value
            .map((item) => String(item || "").trim())
            .filter(Boolean);
    }

    if (value === undefined || value === null) return [];

    const trimmed = String(value).trim();
    return trimmed ? [trimmed] : [];
}

function toString(value) {
    return String(value || "").trim();
}

function normalizeLabelText(value) {
    return toString(value)
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/[\/,()-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function normalizeTone(value) {
    const normalized = normalizeLabelText(value);
    return TONE_ALIASES[normalized] || normalized;
}

function normalizeGenre(value) {
    const normalized = normalizeLabelText(value);
    return GENRE_ALIASES[normalized] || normalized;
}

function normalizeEnvironment(value) {
    const normalized = normalizeLabelText(value);
    return ENVIRONMENT_ALIASES[normalized] || normalized;
}

function normalizeRespondentType(value) {
    const normalized = normalizeLabelText(value)
        .replace(/^just_/, "")
        .replace(/_+/g, "_");

    const aliases = {
        individual: "individual",
        i_am_looking_for_a_group: "individual",
        myself_i_am_looking_for_a_group: "individual",
        partial_group: "partial_group",
        myself_and_one_or_more_other_players: "partial_group",
        we_are_looking_to_join_or_form_a_larger_group: "partial_group",
        existing_group: "existing_group",
        an_existing_group_we_already_have_the_players_together: "existing_group",
        group_organizer: "group_organizer",
        i_am_organizing_on_behalf_of_a_group: "group_organizer"
    };

    return aliases[normalized] || normalized || "";
}

function buildLegacyGroupSize({ legacyGroupSize = "", currentGroupSize = "", desiredGroupSize = "" }) {
    const legacy = toString(legacyGroupSize);
    if (legacy) return legacy;

    const current = toString(currentGroupSize);
    const desired = toString(desiredGroupSize);

    if (current && desired) return `Current: ${current} | Desired: ${desired}`;
    if (current) return `Current: ${current}`;
    if (desired) return `Desired: ${desired}`;

    return "";
}

function unique(values) {
    return [...new Set(values)];
}

function mapFormSubmission(raw = {}) {
    const respondentType = normalizeRespondentType(raw.respondent_type);
    const currentGroupSize = toString(raw.current_group_size);
    const desiredGroupSize = toString(raw.desired_group_size);
    const groupSize = buildLegacyGroupSize({
        legacyGroupSize: raw.group_size,
        currentGroupSize,
        desiredGroupSize
    });

    const mapped = {
        source: {
            type: "website_form",
            formId: "qf-intake-form-v4",
            subject: toString(raw._subject)
        },

        groupInfo: {
            name: toString(raw.name),
            email: toString(raw.email),
            respondentType,
            groupSize,
            currentGroupSize,
            desiredGroupSize,
            systemPreference: toString(raw.system),
            audience: toString(raw.audience),
            ageBand: toString(raw.age_band)
        },

        selections: {
            experiences: unique(toArray(raw.experience || raw["experience[]"])),
            setups: unique(toArray(raw.setup || raw["setup[]"])),
            tone: normalizeTone(raw.tone),
            choiceWeight: toString(raw.choice_weight),
            genres: unique(toArray(raw.genre || raw["genre[]"]).map(normalizeGenre)),
            environments: unique(
                toArray(raw.environment || raw["environment[]"]).map(normalizeEnvironment)
            ),
            gameplayInterests: unique(toArray(raw.gameplay || raw["gameplay[]"])),
            playerFantasy: unique(toArray(raw.fantasy || raw["fantasy[]"]))
        },

        freeText: {
            mustHaves: toString(raw.must_haves),
            avoid: toString(raw.avoid),
            campaignSummary: toString(raw.campaign_summary)
        },

        boundaries: {
            contentBoundaries: unique(
                toArray(raw.content_boundaries || raw["content_boundaries[]"])
            )
        },

        rawSignals: {
            youthMode: unique(toArray(raw.youth_mode)),
            audience: toString(raw.audience),
            ageBand: toString(raw.age_band),
            contentBoundaries: unique(
                toArray(raw.content_boundaries || raw["content_boundaries[]"])
            ),
            mustHaves: toString(raw.must_haves),
            avoid: toString(raw.avoid)
        }
    };

    const safetySignals = inferSafetySignals({
        audience: mapped.groupInfo.audience,
        age_band: mapped.groupInfo.ageBand,
        system: mapped.groupInfo.systemPreference,
        youth_mode: mapped.rawSignals.youthMode,
        content_boundaries: mapped.boundaries.contentBoundaries,
        must_haves: mapped.freeText.mustHaves,
        avoid: mapped.freeText.avoid
    });

    return {
        ...mapped,
        safetySignals,
        resolvedFlags: {
            experienceProfile: safetySignals.experienceProfile,
            contentSafetyMode: safetySignals.contentSafetyMode,
            inferredYouthSafe: safetySignals.inferredYouthSafe,
            youthSafeMode: safetySignals.youthSafeMode,
            softerThemesMode: safetySignals.softerThemesMode,
            fullSafeMode: safetySignals.fullSafeMode,
            heroKidsMode: safetySignals.heroKidsMode
        },
        diagnostics: {
            hasMinimumViableSignal:
                mapped.selections.experiences.length > 0 ||
                mapped.selections.setups.length > 0 ||
                mapped.selections.genres.length > 0 ||
                mapped.selections.environments.length > 0 ||
                mapped.selections.gameplayInterests.length > 0 ||
                mapped.selections.playerFantasy.length > 0,
            contradictionNotes: safetySignals.contradictionNotes || []
        }
    };
}

module.exports = {
    mapFormSubmission,
    normalizeRespondentType,
    buildLegacyGroupSize
};
