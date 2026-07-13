const {
    validateCompatibilityProfile
} = require("../data/validators/validateCompatibilityProfile");

const {
    buildPairMatchResult
} = require("../pairs/buildPairMatchResult");

const {
    savePairEvaluation
} = require("../storage/savePairEvaluation");

const {
    getActiveProfiles
} = require("./getActiveProfiles");

const {
    rankPairMatches
} = require("./rankPairMatches");

function compareProfileAgainstPool(targetProfile, options = {}) {
    const targetValidation = validateCompatibilityProfile(targetProfile);

    if (!targetValidation.isValid) {
        const error = new Error(
            `Target compatibility profile is invalid:\n${targetValidation.errors.join("\n")}`
        );
        error.validation = targetValidation;
        throw error;
    }

    if (targetProfile.status !== "active") {
        throw new Error("Target compatibility profile must be active.");
    }

    const pool = options.activeProfiles
        ? {
            activeProfiles: options.activeProfiles,
            excludedProfiles: [],
            invalidProfiles: []
        }
        : getActiveProfiles(options);

    const viableMatches = [];
    const blockedComparisons = [];
    const persistedEvaluations = [];

    const candidates = [...pool.activeProfiles]
        .filter((profile) => profile.playerId !== targetProfile.playerId)
        .sort((a, b) => a.playerId.localeCompare(b.playerId));

    for (const candidate of candidates) {
        const result = buildPairMatchResult(targetProfile, candidate, {
            now: options.now,
            scoringModelVersion: options.scoringModelVersion || "1.0",
            thresholds: options.thresholds
        });

        if (options.persist !== false) {
            persistedEvaluations.push(
                savePairEvaluation(result, options)
            );
        }

        if (result.eligibility.eligible) {
            viableMatches.push(result);
        } else {
            blockedComparisons.push(result);
        }
    }

    return {
        playerId: targetProfile.playerId,
        evaluatedAt: options.now
            ? new Date(options.now).toISOString()
            : new Date().toISOString(),
        viableMatches: rankPairMatches(viableMatches),
        blockedComparisons: blockedComparisons.sort(
            (a, b) => a.matchId.localeCompare(b.matchId)
        ),
        invalidProfiles: pool.invalidProfiles,
        excludedProfiles: pool.excludedProfiles,
        persistedEvaluations: persistedEvaluations.map((entry) => entry.filePath),
        poolStats: {
            activeProfiles: pool.activeProfiles.length,
            evaluated: candidates.length,
            viable: viableMatches.length,
            blocked: blockedComparisons.length,
            invalid: pool.invalidProfiles.length,
            excluded: pool.excludedProfiles.length
        }
    };
}

module.exports = {
    compareProfileAgainstPool
};
