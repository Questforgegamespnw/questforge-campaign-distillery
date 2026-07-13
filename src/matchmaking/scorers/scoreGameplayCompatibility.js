const { intersection, jaccard } = require("../pairs/pairUtils");
const { dimensionResult } = require("./scorerUtils");

function scoreGameplayCompatibility(profileA = {}, profileB = {}) {
    const a = profileA.campaignPreferences || {};
    const b = profileB.campaignPreferences || {};
    const evidence = [];

    const categories = [
        ["gameplay interests", a.gameplayInterests, b.gameplayInterests, 4],
        ["overall experiences", a.experiences, b.experiences, 3],
        ["story setups", a.setups, b.setups, 1.5],
        ["player fantasies", a.playerFantasy, b.playerFantasy, 1.5]
    ];

    let score = 0;
    const details = {};

    for (const [label, valuesA, valuesB, maximum] of categories) {
        const overlap = intersection(valuesA, valuesB);
        const ratio = jaccard(valuesA, valuesB);
        const categoryScore = ratio === null ? 0 : maximum * ratio;
        score += categoryScore;
        details[label] = { overlap, ratio };

        if (overlap.length > 0) {
            evidence.push(`Shared ${label}: ${overlap.join(", ")}.`);
        }
    }

    return dimensionResult(score, 10, evidence, details);
}

module.exports = {
    scoreGameplayCompatibility
};
