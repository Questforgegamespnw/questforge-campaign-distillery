const CLASSIFICATION_RANK = Object.freeze({
    strong_match: 5,
    potential_match: 4,
    needs_session_zero_alignment: 3,
    low_confidence: 2,
    not_currently_viable: 1
});

const CONFIDENCE_RANK = Object.freeze({
    high: 4,
    moderate: 3,
    low: 2,
    insufficient: 1
});

function rankPairMatches(matches = []) {
    return [...matches].sort((a, b) => {
        const classificationDifference =
            (CLASSIFICATION_RANK[b.classification] || 0) -
            (CLASSIFICATION_RANK[a.classification] || 0);

        if (classificationDifference !== 0) return classificationDifference;

        const scoreDifference =
            Number(b.score?.overall || 0) -
            Number(a.score?.overall || 0);

        if (scoreDifference !== 0) return scoreDifference;

        const confidenceDifference =
            (CONFIDENCE_RANK[b.score?.confidence] || 0) -
            (CONFIDENCE_RANK[a.score?.confidence] || 0);

        if (confidenceDifference !== 0) return confidenceDifference;

        const evaluatedDifference =
            Date.parse(b.provenance?.evaluatedAt || 0) -
            Date.parse(a.provenance?.evaluatedAt || 0);

        if (evaluatedDifference !== 0) return evaluatedDifference;

        return String(a.matchId).localeCompare(String(b.matchId));
    });
}

module.exports = {
    rankPairMatches,
    CLASSIFICATION_RANK,
    CONFIDENCE_RANK
};
