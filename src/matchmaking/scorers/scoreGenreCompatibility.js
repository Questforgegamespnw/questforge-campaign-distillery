const { intersection, jaccard } = require("../pairs/pairUtils");
const { dimensionResult } = require("./scorerUtils");

function scoreGenreCompatibility(profileA = {}, profileB = {}) {
    const a = profileA.campaignPreferences || {};
    const b = profileB.campaignPreferences || {};
    const evidence = [];

    const valuesA = [
        ...(a.genres || []),
        ...(a.eras || []),
        ...(a.aesthetics || []),
        ...(a.worldConditions || []),
        ...(a.environments || [])
    ];

    const valuesB = [
        ...(b.genres || []),
        ...(b.eras || []),
        ...(b.aesthetics || []),
        ...(b.worldConditions || []),
        ...(b.environments || [])
    ];

    const shared = intersection(valuesA, valuesB);
    const ratio = jaccard(valuesA, valuesB);
    const score = ratio === null ? 0 : 3 * ratio;

    if (shared.length > 0) {
        evidence.push(`Shared setting or aesthetic interests: ${shared.slice(0, 6).join(", ")}.`);
    } else if (valuesA.length > 0 && valuesB.length > 0) {
        evidence.push("Setting and aesthetic interests differ, but this is a low-weight dimension.");
    }

    return dimensionResult(score, 3, evidence, {
        shared,
        ratio
    });
}

module.exports = {
    scoreGenreCompatibility
};
