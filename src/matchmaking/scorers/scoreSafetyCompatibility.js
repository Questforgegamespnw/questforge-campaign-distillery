const { intersection } = require("../pairs/pairUtils");
const { dimensionResult } = require("./scorerUtils");

function scoreSafetyCompatibility(profileA = {}, profileB = {}) {
    const evidence = [];
    let score = 12;

    if (
        profileA.safety?.contentSafetyMode &&
        profileA.safety?.contentSafetyMode === profileB.safety?.contentSafetyMode
    ) {
        score += 4;
        evidence.push(
            `Both applicants use the ${profileA.safety.contentSafetyMode} content-safety mode.`
        );
    } else {
        score += 2;
        evidence.push("Content-safety expectations appear compatible but should be confirmed.");
    }

    const sharedBoundaries = intersection(
        profileA.safety?.boundaries,
        profileB.safety?.boundaries
    );
    if (sharedBoundaries.length > 0) {
        score += 2;
        evidence.push(`Shared boundary expectations: ${sharedBoundaries.join(", ")}.`);
    }

    const sharedHardExclusions = intersection(
        profileA.safety?.hardExclusions,
        profileB.safety?.hardExclusions
    );
    if (sharedHardExclusions.length > 0) {
        score += 2;
        evidence.push(`Shared hard exclusions: ${sharedHardExclusions.join(", ")}.`);
    }

    if (evidence.length === 0) {
        evidence.push("No blocking safety conflict was identified.");
    }

    return dimensionResult(score, 20, evidence, {
        sharedBoundaries,
        sharedHardExclusions
    });
}

module.exports = {
    scoreSafetyCompatibility
};
