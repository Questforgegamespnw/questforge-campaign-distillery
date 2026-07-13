const { intersection } = require("../pairs/pairUtils");
const { dimensionResult, scalarAgreement } = require("./scorerUtils");

const INTENSITY_ADJACENCY = {
    "low|moderate": 0.6,
    "moderate|high": 0.75,
    "low|high": 0.2,
    "flexible|low": 0.8,
    "flexible|moderate": 0.9,
    "flexible|high": 0.8
};

const RULES_ADJACENCY = {
    "balanced|flexible": 0.85,
    "rules_as_written|balanced": 0.6,
    "rules_light|flexible": 0.8,
    "rules_as_written|rules_light": 0.2
};

function scoreTableCultureCompatibility(profileA = {}, profileB = {}) {
    const a = profileA.tablePreferences || {};
    const b = profileB.tablePreferences || {};
    const evidence = [];
    let score = 0;

    const roleplay = scalarAgreement(
        a.roleplayIntensity,
        b.roleplayIntensity,
        3,
        INTENSITY_ADJACENCY
    );
    score += roleplay;

    const tactical = scalarAgreement(
        a.tacticalIntensity,
        b.tacticalIntensity,
        3,
        INTENSITY_ADJACENCY
    );
    score += tactical;

    const rules = scalarAgreement(
        a.rulesApproach,
        b.rulesApproach,
        3,
        RULES_ADJACENCY
    );
    score += rules;

    const communication = intersection(
        a.communicationStyles,
        b.communicationStyles
    );
    if (communication.length > 0) {
        score += 3;
        evidence.push(`Shared communication style: ${communication.join(", ")}.`);
    }

    if (a.voiceRequired === b.voiceRequired && a.voiceRequired !== null) {
        score += 1.5;
        evidence.push("Voice-chat expectations align.");
    } else if (a.voiceRequired === true || b.voiceRequired === true) {
        evidence.push("Voice-chat expectations should be confirmed.");
    }

    if (a.videoPreference && a.videoPreference === b.videoPreference) {
        score += 1.5;
        evidence.push("Video preferences align.");
    } else if (a.videoPreference && b.videoPreference) {
        score += 0.75;
        evidence.push("Video preferences differ but may be manageable.");
    }

    if (roleplay >= 2.25) evidence.push("Roleplay-intensity preferences are compatible.");
    if (tactical >= 2.25) evidence.push("Tactical-intensity preferences are compatible.");
    if (rules >= 2.25) evidence.push("Rules approaches are compatible.");

    return dimensionResult(score, 15, evidence, {
        roleplayScore: roleplay,
        tacticalScore: tactical,
        rulesScore: rules,
        communicationOverlap: communication
    });
}

module.exports = {
    scoreTableCultureCompatibility
};
