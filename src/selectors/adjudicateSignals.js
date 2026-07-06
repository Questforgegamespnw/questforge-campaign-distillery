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
    const group = canonicalIntake.group || {};
    const excludeNotes = translated.excludeNotes || "";

    const experienceProfile =
        safety.experienceProfile || translated.experienceProfile || "standard";

    const softerThemesMode =
        safety.softerThemesMode === true || experienceProfile === "youth";

    const fullSafeMode =
        safety.fullSafeMode === true || experienceProfile === "kids";

    const horrorRestricted =
        /no horror|avoid horror|too scary/i.test(excludeNotes) ||
        safety.horrorRestricted === true;

    return {
        experienceProfile,
        audienceMode: experienceProfile,
        softerThemesMode,
        fullSafeMode,
        heroKidsMode: safety.heroKidsMode === true || fullSafeMode,
        // Legacy field: preserve the old full-safe switch for compatibility.
        youthSafeMode: fullSafeMode,
        familyFriendly:
            safety.familyFriendlyBoundary === true ||
            safety.audienceSuggestsKids === true ||
            safety.audienceSuggestsYouth === true ||
            group.ageBand !== "adult",
        horrorRestricted,
        graphicContentRestricted: safety.graphicContentRestricted === true,
        oppressiveToneRestricted: safety.oppressiveToneRestricted === true
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

    if (safetyProfile.softerThemesMode || safetyProfile.fullSafeMode) {
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

    if (!safetyProfile?.softerThemesMode && !safetyProfile?.fullSafeMode) {
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

    if (safetyProfile.softerThemesMode) {
        toneGuardrails.push("Keep meaningful danger and emotional weight manageable rather than oppressive.");
        audienceGuardrails.push("Write for teens or mixed ages without making the language childish.");
        audienceGuardrails.push("Favor agency, resilience, teamwork, and recoverable stakes.");
    }

    if (safetyProfile.fullSafeMode) {
        mustInclude.push("Keep the campaign fully kid-safe and approachable.");
        toneGuardrails.push("Favor wonder, curiosity, teamwork, and adventure over fear.");
        audienceGuardrails.push("Use clear, energetic language appropriate for younger players.");
        audienceGuardrails.push("Frame challenges as exciting problems to solve and let success feel frequent and rewarding.");
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
// Intent profile: represents the campaign style inferred from translated inputs.
// This is distinct from safety/audience enforcement.

function adjudicateSignals(translated = {}, canonicalIntake = {}) {
    const adjudicated = {
        experienceProfile: canonicalIntake.safety?.experienceProfile || translated.experienceProfile || "standard",
        signals: {
            coreFrames: normalizeSignalBucket(translated.coreFrames, "coreFrames"),
            systemFrames: normalizeSignalBucket(translated.systemFrames, "systemFrames"),
            genreSkins: normalizeSignalBucket(translated.genreSkins, "genreSkins"),
            eraFrames: normalizeSignalBucket(translated.eraFrames, "eraFrames"),
            aestheticSkins: normalizeSignalBucket(translated.aestheticSkins, "aestheticSkins"),
            worldConditions: normalizeSignalBucket(translated.worldConditions, "worldConditions"),
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