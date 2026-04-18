const SIGNAL_TIERS = {
    HARD_CONSTRAINT: 1,
    EXPLICIT_FORM: 2,
    STRONG_INFERENCE: 3,
    MAPPED_REINFORCEMENT: 4,
    DEFAULT_FALLBACK: 5
};

function createSignalRecord(entry = {}, domain = "unknown") {
    return {
        id: entry.id,
        rawWeight: entry.weight || 0,
        adjustedWeight: entry.weight || 0,
        status: "active",
        priorityTier: SIGNAL_TIERS.MAPPED_REINFORCEMENT,
        domain,
        sources: [
            {
                sourceType: "mapped_translation",
                sourceField: domain,
                sourceValue: entry.id,
                weight: entry.weight || 0,
                tier: SIGNAL_TIERS.MAPPED_REINFORCEMENT
            }
        ],
        conflictsWith: [],
        suppressionReason: null,
        notes: []
    };
}

function normalizeSignalBucket(entries = [], domain = "unknown") {
    return entries.map((entry) => createSignalRecord(entry, domain));
}

function buildSafetyProfile(translated = {}, canonicalIntake = {}) {
    const safety = canonicalIntake.safety || {};
    const pipelineInput = canonicalIntake.pipelineInput || {};
    const excludeNotes = translated.excludeNotes || "";

    const horrorRestricted =
        /no horror|avoid horror|too scary/i.test(excludeNotes) ||
        safety.familyFriendlyBoundary === true ||
        safety.youthSafeMode === true;

    return {
        experienceProfile: translated.experienceProfile || "standard",
        youthSafeMode: translated.experienceProfile === "youth" || safety.youthSafeMode === true,
        familyFriendly:
            safety.familyFriendlyBoundary === true ||
            safety.audienceSuggestsYouth === true ||
            pipelineInput.youthMode === true,
        horrorRestricted
    };
}

function buildConstraints(translated = {}, canonicalIntake = {}) {
    const safetyProfile = buildSafetyProfile(translated, canonicalIntake);
    const hardBlocks = [];
    const softBlocks = [];

    if (safetyProfile.horrorRestricted) {
        hardBlocks.push({
            type: "tone",
            id: "horror",
            reason: "Explicit or inferred safety guidance restricts horror."
        });
    }

    if (safetyProfile.youthSafeMode) {
        softBlocks.push({
            type: "content",
            id: "intense_existential_distress",
            reason: "Youth-safe mode suggests softer handling of intense themes."
        });
    }

    return {
        safetyProfile,
        includeNotes: translated.includeNotes || "",
        excludeNotes: translated.excludeNotes || "",
        hardBlocks,
        softBlocks
    };
}

function applyStarterSuppression(adjudicated) {
    const { safetyProfile } = adjudicated.constraints;

    if (!safetyProfile?.youthSafeMode) {
        return adjudicated;
    }

    const softRiskIds = new Set([
        "fragmented_self",
        "becoming_something_else",
        "what_is_humanity",
        "hidden_information"
    ]);

    for (const domain of Object.keys(adjudicated.signals)) {
        adjudicated.signals[domain] = adjudicated.signals[domain].map((signal) => {
            if (!softRiskIds.has(signal.id)) {
                return signal;
            }

            const softened = {
                ...signal,
                adjustedWeight: Math.max(1, signal.adjustedWeight - 1),
                notes: [
                    ...signal.notes,
                    "Softened for youth-safe interpretation."
                ]
            };

            if (signal.id === "hidden_information") {
                softened.notes.push("Prefer mystery-through-curiosity, not fear-through-uncertainty.");
            }

            adjudicated.suppressed.push({
                domain,
                id: signal.id,
                rawWeight: signal.rawWeight,
                adjustedWeight: softened.adjustedWeight,
                status: "softened",
                reason: "Youth-safe mode reduces intensity of potentially scary or heavy framing."
            });

            return softened;
        });
    }

    return adjudicated;
}

function buildHandoffGuidance(adjudicated = {}) {
    const constraints = adjudicated.constraints || {};
    const safetyProfile = constraints.safetyProfile || {};

    const mustInclude = [];
    const avoid = [];
    const toneGuardrails = [];
    const audienceGuardrails = [];
    const notes = [];

    if (constraints.includeNotes) {
        mustInclude.push(constraints.includeNotes);
    }

    if (constraints.excludeNotes) {
        avoid.push(constraints.excludeNotes);
    }

    if (safetyProfile.youthSafeMode) {
        mustInclude.push("Keep the campaign kid-safe and approachable.");
        toneGuardrails.push("Favor wonder, curiosity, and adventure over fear.");
        audienceGuardrails.push("Keep themes appropriate for a youth-safe audience.");
    }

    if (safetyProfile.horrorRestricted) {
        avoid.push("Do not frame the campaign as horror.");
        toneGuardrails.push("Mystery is fine, but avoid dread-heavy or scary presentation.");
    }

    notes.push("Downstream writing should preserve the strongest structured signals without adding contradictory tone.");

    return {
        primaryIntent: [],
        secondaryIntent: [],
        mustInclude,
        avoid,
        toneGuardrails,
        audienceGuardrails,
        notes
    };
}

function buildConfidence(adjudicated = {}) {
    const domainScores = {};

    for (const [domain, signals] of Object.entries(adjudicated.signals || {})) {
        if (!signals.length) {
            domainScores[domain] = 0;
            continue;
        }

        const sorted = [...signals].sort((a, b) => b.adjustedWeight - a.adjustedWeight);
        const top = sorted[0]?.adjustedWeight || 0;
        const runnerUp = sorted[1]?.adjustedWeight || 0;
        const spread = Math.max(0, top - runnerUp);

        domainScores[domain] = Number(
            Math.min(1, 0.45 + top * 0.08 + spread * 0.05).toFixed(2)
        );
    }

    const values = Object.values(domainScores);
    const overall =
        values.length > 0
            ? Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2))
            : 0;

    return {
        overall,
        ...domainScores
    };
}

function adjudicateSignals(translated = {}, canonicalIntake = {}) {
    const adjudicated = {
        experienceProfile: translated.experienceProfile || "standard",
        signals: {
            coreFrames: normalizeSignalBucket(translated.coreFrames, "coreFrames"),
            systemFrames: normalizeSignalBucket(translated.systemFrames, "systemFrames"),
            genreSkins: normalizeSignalBucket(translated.genreSkins, "genreSkins"),
            toneSkins: normalizeSignalBucket(translated.toneSkins, "toneSkins"),
            environmentSkins: normalizeSignalBucket(translated.environmentSkins, "environmentSkins")
        },
        constraints: buildConstraints(translated, canonicalIntake),
        conflicts: [],
        suppressed: [],
        confidence: {},
        handoffGuidance: {},
        modifiers: translated.modifiers || {}
    };

    applyStarterSuppression(adjudicated);
    adjudicated.handoffGuidance = buildHandoffGuidance(adjudicated);
    adjudicated.confidence = buildConfidence(adjudicated);

    return adjudicated;
}

module.exports = {
    adjudicateSignals,
    SIGNAL_TIERS
};