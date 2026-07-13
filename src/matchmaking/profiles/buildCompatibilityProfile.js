const crypto = require("crypto");
const { validateMatchmakingIntake } = require("../data/validators/validateMatchmakingIntake");
const { normalizeCompatibilityProfile } = require("./normalizeCompatibilityProfile");
const { buildShareableProfileSummary } = require("./buildShareableProfileSummary");

const NON_OPERATIONAL_STATUSES = new Set([
    "not_eligible",
    "not_asked",
    "declined",
    "withdrawn"
]);

function stableStringify(value) {
    if (Array.isArray(value)) {
        return `[${value.map(stableStringify).join(",")}]`;
    }
    if (value && typeof value === "object") {
        return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
    }
    return JSON.stringify(value);
}

function hashCanonical(canonical) {
    return crypto
        .createHash("sha256")
        .update(stableStringify(canonical || {}))
        .digest("hex");
}

function slugify(value) {
    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "player";
}

function derivePlayerId(canonical, metadata = {}) {
    if (metadata.playerId) return String(metadata.playerId).trim();
    const seed = [
        canonical.matchmaking?.participation?.submissionReference,
        canonical.group?.email,
        canonical.group?.name
    ].filter(Boolean).join("|");
    const digest = crypto.createHash("sha256").update(seed || stableStringify(canonical)).digest("hex").slice(0, 10);
    return `${slugify(canonical.group?.name)}-${digest}`;
}

function splitFreeText(value) {
    return String(value || "")
        .split(/[;\n]+/)
        .map((item) => item.trim())
        .filter(Boolean);
}

function calculateCompleteness(matchmaking = {}, validation = {}) {
    const missing = [];
    const explicitChecks = [
        ["consent.matchmaking", matchmaking.consent?.matchmaking === true],
        ["consent.profileRetention", matchmaking.consent?.profileRetention === true],
        ["consent.operatorReview", matchmaking.consent?.operatorReview === true],
        ["logistics.timezone", Boolean(matchmaking.logistics?.timezone)],
        ["logistics.playFormats", Boolean(matchmaking.logistics?.playFormats?.length)],
        ["logistics.availability", Boolean(matchmaking.logistics?.availability?.length)],
        ["logistics.frequencyPreferences", Boolean(matchmaking.logistics?.frequencyPreferences?.length)],
        ["commitment.campaignLengths", Boolean(matchmaking.commitment?.campaignLengths?.length)],
        ["systems.preferenceOrOpenness", Boolean(
            matchmaking.systems?.preferred?.length ||
            matchmaking.systems?.acceptable?.length ||
            matchmaking.systems?.openness
        )],
        ["groupPreferences.minimumPlayers", matchmaking.groupPreferences?.minimumPlayers !== null],
        ["groupPreferences.preferredPlayers", matchmaking.groupPreferences?.preferredPlayers !== null],
        ["groupPreferences.maximumPlayers", matchmaking.groupPreferences?.maximumPlayers !== null]
    ];

    for (const [field, present] of explicitChecks) {
        if (!present) missing.push(field);
    }

    const percentage = Math.round(
        ((explicitChecks.length - missing.length) / explicitChecks.length) * 100
    );

    return {
        percentage,
        missingRequiredFields: missing,
        warnings: validation.warnings || [],
        contradictions: validation.errors || [],
        explicitFieldCount: explicitChecks.length - missing.length,
        inferredFieldCount: 0
    };
}

function chooseInitialStatus(participationStatus, completeness, validation) {
    if (participationStatus === "conditional") {
        return {
            status: "paused",
            reason: "Conditional opt-in requires operator review before activation."
        };
    }

    if (!validation.isValid || completeness.missingRequiredFields.length > 0) {
        return {
            status: "paused",
            reason: "Profile is incomplete or contains matchmaking validation issues."
        };
    }

    return {
        status: "active",
        reason: "Profile meets activation requirements."
    };
}

function buildCompatibilityProfile(canonicalIntake = {}, metadata = {}) {
    const matchmaking = canonicalIntake.matchmaking || {};
    const participationStatus = matchmaking.participation?.status || "not_asked";

    if (NON_OPERATIONAL_STATUSES.has(participationStatus)) {
        return null;
    }

    const validation = validateMatchmakingIntake(matchmaking);
    const completeness = calculateCompleteness(matchmaking, validation);
    const initialState = chooseInitialStatus(participationStatus, completeness, validation);
    const timestamp = metadata.now ? new Date(metadata.now).toISOString() : new Date().toISOString();
    const playerId = derivePlayerId(canonicalIntake, metadata);
    const submissionId = String(
        metadata.submissionId ||
        matchmaking.participation?.submissionReference ||
        canonicalIntake.source?.subject ||
        ""
    ).trim();

    let profile = normalizeCompatibilityProfile({
        schemaVersion: "1.0",
        playerId,
        submissionId,
        status: initialState.status,
        statusReason: initialState.reason,

        consent: matchmaking.consent,
        identity: {
            displayName: metadata.displayName || canonicalIntake.group?.name || "",
            contactRef: metadata.contactRef || `contact-${playerId}`
        },

        logistics: matchmaking.logistics,
        commitment: matchmaking.commitment,
        systems: matchmaking.systems,

        campaignPreferences: {
            experiences: canonicalIntake.preferences?.experiences || [],
            setups: canonicalIntake.preferences?.setups || [],
            tone: canonicalIntake.preferences?.tone || "",
            choiceWeight: canonicalIntake.preferences?.choiceWeight || "",
            genres: canonicalIntake.preferences?.genres || [],
            eras: canonicalIntake.preferences?.eras || [],
            aesthetics: canonicalIntake.preferences?.aesthetics || [],
            worldConditions: canonicalIntake.preferences?.worldConditions || [],
            environments: canonicalIntake.preferences?.environments || [],
            gameplayInterests: canonicalIntake.preferences?.gameplayInterests || [],
            playerFantasy: canonicalIntake.preferences?.playerFantasy || [],
            mustHaves: canonicalIntake.notes?.mustHaves || "",
            avoid: canonicalIntake.notes?.avoid || "",
            systemPreference: canonicalIntake.group?.systemPreference || ""
        },

        tablePreferences: matchmaking.tablePreferences,
        experience: matchmaking.experience,
        safety: {
            contentSafetyMode: canonicalIntake.safety?.contentSafetyMode || "standard",
            boundaries: canonicalIntake.boundaries?.contentBoundaries || [],
            hardExclusions: matchmaking.hardConstraints?.content || [],
            operatorPrivateNotes: splitFreeText(canonicalIntake.notes?.avoid),
            shareableGuidance: []
        },
        groupPreferences: matchmaking.groupPreferences,
        requirements: {
            mustHaves: splitFreeText(canonicalIntake.notes?.mustHaves),
            hardConstraints: {
                schedule: matchmaking.hardConstraints?.schedule || [],
                format: matchmaking.hardConstraints?.format || [],
                content: matchmaking.hardConstraints?.content || [],
                system: matchmaking.hardConstraints?.system || [],
                commitment: matchmaking.hardConstraints?.commitment || [],
                tableCulture: matchmaking.hardConstraints?.tableCulture || []
            },
            freeTextNotes: splitFreeText(matchmaking.hardConstraints?.freeText)
        },
        shareableSummary: {},
        completeness,
        provenance: {
            profileVersion: 1,
            sourceCanonicalSchemaVersion: canonicalIntake.schemaVersion || "",
            sourceCanonicalHash: hashCanonical(canonicalIntake),
            sourceType: matchmaking.participation?.source || canonicalIntake.source?.type || "",
            createdAt: timestamp,
            updatedAt: timestamp,
            lastConfirmedAt: metadata.lastConfirmedAt
                ? new Date(metadata.lastConfirmedAt).toISOString()
                : timestamp
        },
        lifecycle: {
            statusChangedAt: timestamp,
            matchedReference: "",
            history: [
                {
                    status: initialState.status,
                    reason: initialState.reason,
                    timestamp
                }
            ]
        }
    });

    profile = {
        ...profile,
        shareableSummary: matchmaking.consent?.shareableSummary === true
            ? buildShareableProfileSummary(profile)
            : profile.shareableSummary
    };

    return profile;
}

module.exports = {
    buildCompatibilityProfile,
    calculateCompleteness,
    hashCanonical,
    derivePlayerId
};
