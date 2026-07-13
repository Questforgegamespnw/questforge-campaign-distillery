function classifyGroupMatch(eligibility = {}, scoring = {}, confidence = {}, config = {}) {
    if (!eligibility.eligible) {
        return eligibility.status || "not_currently_viable";
    }

    const thresholds = {
        strong: Number(config.strongThreshold ?? 80),
        potential: Number(config.potentialThreshold ?? 68),
        alignment: Number(config.alignmentThreshold ?? 55),
        weakestPairFloor: Number(config.weakestPairFloor ?? 55)
    };

    if (
        ["low", "insufficient"].includes(confidence.level) &&
        scoring.overall >= thresholds.potential
    ) {
        return "low_confidence";
    }

    if (
        scoring.weakestPairScore < thresholds.weakestPairFloor ||
        scoring.scoreSpread >= 18
    ) {
        return "needs_session_zero_alignment";
    }

    if (
        scoring.overall >= thresholds.strong &&
        ["high", "moderate"].includes(confidence.level)
    ) {
        return "strong_group";
    }

    if (scoring.overall >= thresholds.potential) {
        return "potential_group";
    }

    if (scoring.overall >= thresholds.alignment) {
        return "needs_session_zero_alignment";
    }

    return "not_currently_viable";
}

module.exports = {
    classifyGroupMatch
};
