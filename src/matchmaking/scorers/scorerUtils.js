const {
    intersection,
    jaccard,
    clamp,
    scoreStatus
} = require("../pairs/pairUtils");

function dimensionResult(score, maximum, evidence = [], details = {}) {
    const bounded = Number(clamp(score, 0, maximum).toFixed(2));
    return {
        score: bounded,
        maximum,
        status: scoreStatus(bounded, maximum),
        evidence: evidence.filter(Boolean),
        details
    };
}

function overlapScore(valuesA, valuesB, maximum, options = {}) {
    const exact = intersection(valuesA, valuesB);
    const ratio = jaccard(valuesA, valuesB);

    if (ratio === null) {
        return {
            score: options.emptyScore || 0,
            exact,
            ratio: null
        };
    }

    return {
        score: maximum * ratio,
        exact,
        ratio
    };
}

function scalarAgreement(valueA, valueB, maximum, adjacency = {}) {
    if (!valueA || !valueB) return 0;
    if (valueA === valueB) return maximum;

    const key = `${valueA}|${valueB}`;
    const reverse = `${valueB}|${valueA}`;

    if (adjacency[key] !== undefined) return maximum * adjacency[key];
    if (adjacency[reverse] !== undefined) return maximum * adjacency[reverse];

    return 0;
}

module.exports = {
    dimensionResult,
    overlapScore,
    scalarAgreement
};
