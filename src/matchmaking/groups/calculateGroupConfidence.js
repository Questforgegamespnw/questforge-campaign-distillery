const {
    average,
    standardDeviation,
    uniqueStrings
} = require("./groupUtils");

function calculateGroupConfidence(profiles = [], pairResults = []) {
    const pairConfidenceValues = pairResults
        .map((result) => Number(result.score?.confidenceNumeric))
        .filter(Number.isFinite);

    const completenessValues = profiles
        .map((profile) => Number(profile.completeness?.percentage))
        .filter(Number.isFinite);

    const pairAverage = average(pairConfidenceValues);
    const completenessAverage = average(completenessValues);
    const completenessSpread = standardDeviation(completenessValues);

    const reasons = [];
    let numeric =
        pairAverage * 0.65 +
        completenessAverage * 0.35 -
        Math.min(15, completenessSpread * 0.5);

    const warnings = profiles.flatMap(
        (profile) => profile.completeness?.warnings || []
    );
    const contradictions = profiles.flatMap(
        (profile) => profile.completeness?.contradictions || []
    );

    numeric -= Math.min(10, warnings.length);
    numeric -= Math.min(20, contradictions.length * 4);
    numeric = Number(Math.max(0, Math.min(100, numeric)).toFixed(2));

    reasons.push(
        `Average member profile completeness is ${Math.round(completenessAverage)}%.`
    );
    reasons.push(
        `Average pair-evaluation confidence is ${Math.round(pairAverage)}%.`
    );

    if (completenessSpread > 15) {
        reasons.push("Profile completeness varies substantially across members.");
    }

    if (warnings.length > 0) {
        reasons.push(`${warnings.length} profile warning(s) reduce group confidence.`);
    }

    if (contradictions.length > 0) {
        reasons.push(
            `${contradictions.length} profile contradiction(s) reduce group confidence.`
        );
    }

    let level = "insufficient";
    if (numeric >= 85) level = "high";
    else if (numeric >= 65) level = "moderate";
    else if (numeric >= 40) level = "low";

    return {
        level,
        numeric,
        reasons: uniqueStrings(reasons),
        factors: {
            averagePairConfidence: Number(pairAverage.toFixed(2)),
            averageProfileCompleteness: Number(completenessAverage.toFixed(2)),
            profileCompletenessSpread: Number(completenessSpread.toFixed(2)),
            warningCount: warnings.length,
            contradictionCount: contradictions.length
        }
    };
}

module.exports = {
    calculateGroupConfidence
};
