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

function unique(values) {
    return [...new Set(values)];
}

function mapFormSubmission(raw = {}) {
    const mapped = {
        source: {
            type: "website_form",
            formId: "qf-intake-form-v4",
            subject: toString(raw._subject)
        },

        groupInfo: {
            name: toString(raw.name),
            email: toString(raw.email),
            groupSize: toString(raw.group_size),
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
        youth_mode: mapped.rawSignals.youthMode,
        content_boundaries: mapped.boundaries.contentBoundaries,
        must_haves: mapped.freeText.mustHaves,
        avoid: mapped.freeText.avoid
    });

    return {
        ...mapped,
        safetySignals,
        resolvedFlags: {
            youthSafeMode: safetySignals.youthSafeMode
        },
        diagnostics: {
            hasMinimumViableSignal:
                mapped.selections.experiences.length > 0 ||
                mapped.selections.setups.length > 0 ||
                mapped.selections.genres.length > 0 ||
                mapped.selections.environments.length > 0 ||
                mapped.selections.gameplayInterests.length > 0 ||
                mapped.selections.playerFantasy.length > 0
        }
    };
}

module.exports = {
    mapFormSubmission
};