const { intersection, normalizeSet } = require("../pairs/pairUtils");
const { dimensionResult } = require("./scorerUtils");

const OPENNESS_BONUS = Object.freeze({
    preferred_only: 0,
    open_to_similar: 0.5,
    open_with_guidance: 1,
    very_open: 1.5
});

function scoreSystemCompatibility(profileA = {}, profileB = {}) {
    const a = profileA.systems || {};
    const b = profileB.systems || {};
    const evidence = [];
    let score = 0;

    const sharedPreferred = intersection(a.preferred, b.preferred);
    const preferredAcceptable = [
        ...intersection(a.preferred, b.acceptable),
        ...intersection(b.preferred, a.acceptable)
    ];
    const sharedAcceptable = intersection(a.acceptable, b.acceptable);

    if (sharedPreferred.length > 0) {
        score += 5;
        evidence.push(`Shared preferred system: ${sharedPreferred.join(", ")}.`);
    } else if (preferredAcceptable.length > 0) {
        score += 4;
        evidence.push(
            `One applicant's preferred system is acceptable to the other: ${[...new Set(preferredAcceptable)].join(", ")}.`
        );
    } else if (sharedAcceptable.length > 0) {
        score += 3;
        evidence.push(`Shared acceptable system: ${sharedAcceptable.join(", ")}.`);
    }

    score += Math.min(
        2,
        (OPENNESS_BONUS[a.openness] || 0) + (OPENNESS_BONUS[b.openness] || 0)
    );

    if (score < 3 && (a.openness || b.openness)) {
        evidence.push("System openness may allow the applicants to find a mutually acceptable option.");
    }

    return dimensionResult(score, 7, evidence, {
        sharedPreferred,
        preferredAcceptable: [...new Set(preferredAcceptable)],
        sharedAcceptable
    });
}

module.exports = {
    scoreSystemCompatibility
};
