const { clamp } = require("./pairUtils");
const { scoreScheduleCompatibility } = require("../scorers/scoreScheduleCompatibility");
const { scoreSafetyCompatibility } = require("../scorers/scoreSafetyCompatibility");
const { scoreCommitmentCompatibility } = require("../scorers/scoreCommitmentCompatibility");
const { scoreTableCultureCompatibility } = require("../scorers/scoreTableCultureCompatibility");
const { scoreGameplayCompatibility } = require("../scorers/scoreGameplayCompatibility");
const { scoreSystemCompatibility } = require("../scorers/scoreSystemCompatibility");
const { scoreToneCompatibility } = require("../scorers/scoreToneCompatibility");
const { scoreGenreCompatibility } = require("../scorers/scoreGenreCompatibility");

function calculateAdaptability(profileA = {}, profileB = {}) {
    let adjustment = 0;
    const evidence = [];

    const opennessValues = [
        profileA.systems?.openness,
        profileB.systems?.openness
    ];
    if (opennessValues.includes("very_open")) {
        adjustment += 1.5;
        evidence.push("At least one applicant is very open to alternative systems.");
    } else if (opennessValues.includes("open_with_guidance")) {
        adjustment += 1;
        evidence.push("At least one applicant is open to learning with guidance.");
    }

    const flexibilityValues = [
        profileA.logistics?.scheduleFlexibility,
        profileB.logistics?.scheduleFlexibility
    ];
    if (flexibilityValues.includes("high")) {
        adjustment += 1.5;
        evidence.push("At least one applicant has high scheduling flexibility.");
    } else if (flexibilityValues.includes("moderate")) {
        adjustment += 1;
        evidence.push("At least one applicant has moderate scheduling flexibility.");
    }

    if (
        profileA.experience?.mixedExperienceComfort === true &&
        profileB.experience?.mixedExperienceComfort === true
    ) {
        adjustment += 1;
        evidence.push("Both applicants are comfortable with mixed-experience groups.");
    }

    return {
        score: Number(clamp(adjustment, 0, 5).toFixed(2)),
        maximum: 5,
        evidence
    };
}

function scorePairCompatibility(profileA = {}, profileB = {}, context = {}) {
    if (context.eligibility && !context.eligibility.eligible) {
        return {
            overall: null,
            baseScore: null,
            adaptabilityAdjustment: {
                score: 0,
                maximum: 5,
                evidence: []
            },
            dimensions: {}
        };
    }

    const dimensions = {
        schedule: scoreScheduleCompatibility(profileA, profileB, context),
        safety: scoreSafetyCompatibility(profileA, profileB, context),
        commitment: scoreCommitmentCompatibility(profileA, profileB, context),
        tableCulture: scoreTableCultureCompatibility(profileA, profileB, context),
        gameplay: scoreGameplayCompatibility(profileA, profileB, context),
        systems: scoreSystemCompatibility(profileA, profileB, context),
        tone: scoreToneCompatibility(profileA, profileB, context),
        genre: scoreGenreCompatibility(profileA, profileB, context)
    };

    const baseScore = Object.values(dimensions)
        .reduce((sum, result) => sum + result.score, 0);

    const adaptabilityAdjustment = calculateAdaptability(profileA, profileB);
    const overall = Number(clamp(
        baseScore + adaptabilityAdjustment.score,
        0,
        100
    ).toFixed(2));

    return {
        overall,
        baseScore: Number(baseScore.toFixed(2)),
        adaptabilityAdjustment,
        dimensions
    };
}

module.exports = {
    scorePairCompatibility,
    calculateAdaptability
};
