const {
    stableMembers,
    groupId
} = require("./groupUtils");

const {
    evaluateGroupEligibility
} = require("./evaluateGroupEligibility");

const {
    scoreGroupCompatibility
} = require("./scoreGroupCompatibility");

const {
    calculateGroupConfidence
} = require("./calculateGroupConfidence");

const {
    classifyGroupMatch
} = require("./classifyGroupMatch");

const {
    explainGroupCompatibility
} = require("./explainGroupCompatibility");

function recommendationFor(classification, profiles = []) {
    const introductionReady = profiles.every((profile) =>
        profile.consent?.contactForIntroduction === true &&
        profile.consent?.shareableSummary === true
    ) && ["strong_group", "potential_group"].includes(classification);

    const actions = {
        strong_group: introductionReady
            ? "review_group_for_introduction"
            : "confirm_introduction_consent",
        potential_group: "operator_review",
        needs_session_zero_alignment: "review_group_alignment",
        low_confidence: "request_missing_information",
        not_currently_viable: "hold_for_better_group",
        blocked_by_schedule: "do_not_recommend",
        blocked_by_format: "do_not_recommend",
        blocked_by_commitment: "do_not_recommend",
        blocked_by_group_size: "do_not_recommend",
        blocked_by_hard_conflict: "do_not_recommend"
    };

    return {
        recommendedAction: actions[classification] || "operator_review",
        requiresHumanApproval: true,
        introductionReady
    };
}

function buildGroupMatchResult(profiles = [], options = {}) {
    const evaluatedAt = options.now
        ? new Date(options.now).toISOString()
        : new Date().toISOString();

    const orderedProfiles = [...profiles]
        .filter(Boolean)
        .sort((a, b) => String(a.playerId).localeCompare(String(b.playerId)));

    const eligibility = evaluateGroupEligibility(orderedProfiles, {
        now: evaluatedAt,
        scoringModelVersion: options.scoringModelVersion || "1.0",
        pairThresholds: options.pairThresholds
    });

    const scoring = scoreGroupCompatibility(eligibility);

    const confidence = calculateGroupConfidence(
        orderedProfiles,
        eligibility.pairResults
    );

    const classification = classifyGroupMatch(
        eligibility,
        scoring,
        confidence,
        options.thresholds
    );

    const explanations = explainGroupCompatibility(
        eligibility,
        scoring,
        confidence
    );

    return {
        schemaVersion: "1.0",
        matchId: groupId(orderedProfiles),
        matchType: "group",
        members: stableMembers(orderedProfiles),

        eligibility: {
            eligible: eligibility.eligible,
            status: eligibility.status,
            blockingConflicts: eligibility.blockingConflicts
        },

        score: {
            overall: scoring.overall,
            pairAverage: scoring.pairAverage,
            weakestPairScore: scoring.weakestPairScore,
            scoreSpread: scoring.scoreSpread,
            cohesionScore: scoring.cohesionScore,
            sharedLogisticsScore: scoring.sharedLogisticsScore,
            confidence: confidence.level,
            confidenceNumeric: confidence.numeric,
            confidenceReasons: confidence.reasons
        },

        pairResults: scoring.pairScores,
        classification,

        strongAlignment: explanations.strongAlignment,
        manageableDifferences: explanations.manageableDifferences,
        discussionPoints: explanations.discussionPoints,
        blockingConflicts: explanations.blockingConflicts,

        operatorRecommendation: recommendationFor(
            classification,
            orderedProfiles
        ),

        provenance: {
            scoringModelVersion: options.scoringModelVersion || "1.0",
            profileVersions: Object.fromEntries(
                orderedProfiles.map((profile) => [
                    profile.playerId,
                    Number(profile.provenance?.profileVersion || 1)
                ])
            ),
            evaluatedAt
        }
    };
}

module.exports = {
    buildGroupMatchResult
};
