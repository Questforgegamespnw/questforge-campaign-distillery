const {
    average,
    standardDeviation
} = require("./groupUtils");

function calculateLogisticsScore(evidence = {}) {
    let score = 0;
    const explanations = [];

    const bestOverlap = evidence.availabilityOverlaps?.[0];
    if (bestOverlap) {
        score += Math.min(7, 3 + bestOverlap.durationHours);
        explanations.push(
            `All members share approximately ${bestOverlap.durationHours} recurring hours.`
        );
    }

    if (evidence.sharedFormats?.length) {
        score += 3;
        explanations.push(
            `Shared format: ${evidence.sharedFormats.join(", ")}.`
        );
    }

    if (evidence.sharedFrequencies?.length) {
        score += 2.5;
        explanations.push(
            `Shared frequency: ${evidence.sharedFrequencies.join(", ")}.`
        );
    }

    if (evidence.sharedCampaignLengths?.length) {
        score += 2.5;
        explanations.push(
            `Shared campaign length: ${evidence.sharedCampaignLengths.join(", ")}.`
        );
    }

    return {
        score: Number(Math.min(15, score).toFixed(2)),
        maximum: 15,
        evidence: explanations
    };
}

function scoreGroupCompatibility(eligibility = {}) {
    if (!eligibility.eligible) {
        return {
            overall: null,
            pairAverage: null,
            weakestPairScore: null,
            scoreSpread: null,
            cohesionScore: null,
            sharedLogisticsScore: null,
            pairScores: []
        };
    }

    const pairScores = eligibility.pairResults
        .map((result) => Number(result.score?.overall))
        .filter(Number.isFinite);

    const pairAverage = average(pairScores);
    const weakestPairScore = pairScores.length
        ? Math.min(...pairScores)
        : 0;
    const scoreSpread = standardDeviation(pairScores);

    // A standard deviation of 25 or more yields no cohesion credit.
    const cohesionScore = Math.max(0, 15 * (1 - scoreSpread / 25));
    const sharedLogistics = calculateLogisticsScore(eligibility.evidence);

    // The weakest relationship carries nearly as much influence as the average.
    // This prevents one poor pairing from disappearing inside a high mean.
    const overall =
        pairAverage * 0.40 +
        weakestPairScore * 0.30 +
        cohesionScore +
        sharedLogistics.score;

    return {
        overall: Number(Math.max(0, Math.min(100, overall)).toFixed(2)),
        pairAverage: Number(pairAverage.toFixed(2)),
        weakestPairScore: Number(weakestPairScore.toFixed(2)),
        scoreSpread: Number(scoreSpread.toFixed(2)),
        cohesionScore: Number(cohesionScore.toFixed(2)),
        sharedLogisticsScore: sharedLogistics,
        pairScores: eligibility.pairResults.map((result) => ({
            matchId: result.matchId,
            members: result.members,
            score: result.score.overall,
            confidence: result.score.confidence,
            classification: result.classification
        }))
    };
}

module.exports = {
    scoreGroupCompatibility,
    calculateLogisticsScore
};
