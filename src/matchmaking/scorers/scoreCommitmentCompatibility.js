const { intersection } = require("../pairs/pairUtils");
const { dimensionResult, scalarAgreement } = require("./scorerUtils");

const ATTENDANCE_ADJACENCY = {
    "highly_consistent|consistent": 0.75,
    "consistent|flexible": 0.5,
    "highly_consistent|flexible": 0.25
};

const READINESS_ADJACENCY = {
    "immediate|within_one_month": 0.8,
    "within_one_month|within_three_months": 0.7,
    "within_three_months|future": 0.5
};

function scoreCommitmentCompatibility(profileA = {}, profileB = {}) {
    const evidence = [];
    let score = 0;

    const lengths = intersection(
        profileA.commitment?.campaignLengths,
        profileB.commitment?.campaignLengths
    );
    if (lengths.length > 0) {
        score += 6;
        evidence.push(`Shared campaign-length preference: ${lengths.join(", ")}.`);
    }

    const attendanceScore = scalarAgreement(
        profileA.commitment?.attendanceExpectation,
        profileB.commitment?.attendanceExpectation,
        5,
        ATTENDANCE_ADJACENCY
    );
    score += attendanceScore;
    if (attendanceScore >= 3.5) {
        evidence.push("Attendance expectations are closely aligned.");
    } else if (attendanceScore > 0) {
        evidence.push("Attendance expectations differ but may be negotiable.");
    }

    const readinessScore = scalarAgreement(
        profileA.commitment?.startReadiness,
        profileB.commitment?.startReadiness,
        4,
        READINESS_ADJACENCY
    );
    score += readinessScore;
    if (readinessScore >= 2.8) {
        evidence.push("Campaign start readiness is compatible.");
    } else if (readinessScore > 0) {
        evidence.push("Start timing should be confirmed.");
    }

    return dimensionResult(score, 15, evidence, {
        campaignLengthOverlap: lengths
    });
}

module.exports = {
    scoreCommitmentCompatibility
};
