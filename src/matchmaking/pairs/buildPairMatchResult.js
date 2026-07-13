const crypto = require("crypto");
const { evaluatePairEligibility } = require("./evaluatePairEligibility");
const { scorePairCompatibility } = require("./scorePairCompatibility");
const { calculateMatchConfidence } = require("./calculateMatchConfidence");
const { classifyPairMatch } = require("./classifyPairMatch");
const { explainPairCompatibility } = require("./explainPairCompatibility");

function stablePairMembers(profileA = {}, profileB = {}) {
    return [profileA.playerId, profileB.playerId]
        .filter(Boolean)
        .sort();
}

function pairId(profileA = {}, profileB = {}) {
    const members = stablePairMembers(profileA, profileB);
    if (members.length === 2) {
        return `pair-${members[0]}-${members[1]}`;
    }

    const digest = crypto
        .createHash("sha256")
        .update(JSON.stringify(members))
        .digest("hex")
        .slice(0, 12);

    return `pair-${digest}`;
}

function recommendationFor(classification, profileA, profileB) {
    const contactReady =
        profileA.consent?.contactForIntroduction === true &&
        profileB.consent?.contactForIntroduction === true &&
        profileA.consent?.shareableSummary === true &&
        profileB.consent?.shareableSummary === true;

    const actions = {
        strong_match: contactReady
            ? "review_for_introduction"
            : "confirm_introduction_consent",
        potential_match: "review_for_introduction",
        needs_session_zero_alignment: "review_discussion_points",
        low_confidence: "request_missing_information",
        not_currently_viable: "hold_for_better_match",
        blocked_by_schedule: "do_not_recommend",
        blocked_by_format: "do_not_recommend",
        blocked_by_commitment: "do_not_recommend",
        blocked_by_hard_conflict: "do_not_recommend"
    };

    return {
        recommendedAction: actions[classification] || "operator_review",
        requiresHumanApproval: true,
        introductionReady: contactReady &&
            ["strong_match", "potential_match"].includes(classification)
    };
}

function buildPairMatchResult(profileA = {}, profileB = {}, options = {}) {
    const evaluatedAt = options.now
        ? new Date(options.now).toISOString()
        : new Date().toISOString();

    const eligibility = evaluatePairEligibility(profileA, profileB, {
        referenceDate: evaluatedAt
    });

    const scoring = scorePairCompatibility(profileA, profileB, {
        eligibility,
        referenceDate: evaluatedAt
    });

    const confidence = calculateMatchConfidence(profileA, profileB, {
        now: evaluatedAt
    });

    const classification = classifyPairMatch(
        eligibility,
        scoring,
        confidence,
        options.thresholds
    );

    const explanations = explainPairCompatibility(
        eligibility,
        scoring,
        confidence
    );

    return {
        schemaVersion: "1.0",
        matchId: pairId(profileA, profileB),
        matchType: "pair",
        members: stablePairMembers(profileA, profileB),

        eligibility: {
            eligible: eligibility.eligible,
            status: eligibility.status,
            blockingConflicts: eligibility.blockingConflicts
        },

        score: {
            overall: scoring.overall,
            baseScore: scoring.baseScore,
            adaptabilityAdjustment: scoring.adaptabilityAdjustment,
            confidence: confidence.level,
            confidenceNumeric: confidence.numeric,
            confidenceReasons: confidence.reasons
        },

        dimensionScores: scoring.dimensions,
        classification,

        strongAlignment: explanations.strongAlignment,
        manageableDifferences: explanations.manageableDifferences,
        discussionPoints: explanations.discussionPoints,
        blockingConflicts: explanations.blockingConflicts,

        operatorRecommendation: recommendationFor(
            classification,
            profileA,
            profileB
        ),

        provenance: {
            scoringModelVersion: options.scoringModelVersion || "1.0",
            profileVersions: {
                [profileA.playerId]: Number(profileA.provenance?.profileVersion || 1),
                [profileB.playerId]: Number(profileB.provenance?.profileVersion || 1)
            },
            evaluatedAt
        }
    };
}

module.exports = {
    buildPairMatchResult,
    pairId,
    stablePairMembers
};
