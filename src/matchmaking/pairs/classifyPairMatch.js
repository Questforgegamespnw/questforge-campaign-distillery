function classifyPairMatch(eligibility = {}, scoring = {}, confidence = {}, config = {}) {
    if (!eligibility.eligible) {
        return eligibility.status || "not_currently_viable";
    }

    const thresholds = {
        strong: Number(config.strongThreshold ?? 80),
        potential: Number(config.potentialThreshold ?? 65),
        alignment: Number(config.alignmentThreshold ?? 50)
    };

    const score = Number(scoring.overall || 0);

    if (
        ["low", "insufficient"].includes(confidence.level) &&
        score >= thresholds.potential
    ) {
        return "low_confidence";
    }

    if (
        score >= thresholds.strong &&
        ["high", "moderate"].includes(confidence.level)
    ) {
        return "strong_match";
    }

    if (score >= thresholds.potential) {
        return "potential_match";
    }

    if (score >= thresholds.alignment) {
        return "needs_session_zero_alignment";
    }

    return "not_currently_viable";
}

module.exports = {
    classifyPairMatch
};
