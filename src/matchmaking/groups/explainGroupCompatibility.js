const {
    uniqueStrings
} = require("./groupUtils");

function explainGroupCompatibility(eligibility = {}, scoring = {}, confidence = {}) {
    if (!eligibility.eligible) {
        return {
            strongAlignment: [],
            manageableDifferences: [],
            discussionPoints: [],
            blockingConflicts: eligibility.blockingConflicts || []
        };
    }

    const strongAlignment = [];
    const manageableDifferences = [];
    const discussionPoints = [];

    strongAlignment.push(
        ...(scoring.sharedLogisticsScore?.evidence || [])
    );

    for (const pair of eligibility.pairResults) {
        if (pair.classification === "strong_match") {
            strongAlignment.push(
                `${pair.members.join(" / ")} form a strong pairwise match.`
            );
        }

        manageableDifferences.push(...(pair.manageableDifferences || []));

        if (
            ["needs_session_zero_alignment", "potential_match"].includes(
                pair.classification
            )
        ) {
            discussionPoints.push(
                `${pair.members.join(" / ")} should review their pairwise discussion points.`
            );
        }

        discussionPoints.push(...(pair.discussionPoints || []));
    }

    if (scoring.weakestPairScore < 65) {
        discussionPoints.push(
            `The weakest pair score is ${scoring.weakestPairScore}; do not let the group average obscure that relationship.`
        );
    }

    if (scoring.scoreSpread >= 15) {
        discussionPoints.push(
            "Pair compatibility varies meaningfully across the group, indicating uneven cohesion."
        );
    }

    if (confidence.level === "low" || confidence.level === "insufficient") {
        discussionPoints.push(
            "Collect or reconfirm profile information before making introductions."
        );
    }

    return {
        strongAlignment: uniqueStrings(strongAlignment),
        manageableDifferences: uniqueStrings(manageableDifferences),
        discussionPoints: uniqueStrings(discussionPoints),
        blockingConflicts: []
    };
}

module.exports = {
    explainGroupCompatibility
};
