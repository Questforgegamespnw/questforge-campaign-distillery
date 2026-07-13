function unique(values = []) {
    return [...new Set(values.filter(Boolean))];
}

function explainPairCompatibility(eligibility = {}, scoring = {}, confidence = {}) {
    if (!eligibility.eligible) {
        return {
            strongAlignment: [],
            manageableDifferences: [],
            discussionPoints: [],
            blockingConflicts: eligibility.blockingConflicts || [],
            confidenceReasons: confidence.reasons || []
        };
    }

    const strongAlignment = [];
    const manageableDifferences = [];
    const discussionPoints = [];

    for (const [dimension, result] of Object.entries(scoring.dimensions || {})) {
        const evidence = result.evidence || [];

        if (["strong_alignment", "aligned"].includes(result.status)) {
            strongAlignment.push(...evidence);
        } else if (result.status === "mostly_aligned") {
            manageableDifferences.push(...evidence);
        } else {
            discussionPoints.push(...evidence);
            if (evidence.length === 0) {
                discussionPoints.push(
                    `Confirm ${dimension} expectations during Session Zero.`
                );
            }
        }
    }

    if (scoring.adaptabilityAdjustment?.evidence?.length) {
        manageableDifferences.push(...scoring.adaptabilityAdjustment.evidence);
    }

    if (confidence.level === "low" || confidence.level === "insufficient") {
        discussionPoints.push("Collect or reconfirm missing profile information before introduction.");
    }

    return {
        strongAlignment: unique(strongAlignment),
        manageableDifferences: unique(manageableDifferences),
        discussionPoints: unique(discussionPoints),
        blockingConflicts: [],
        confidenceReasons: unique(confidence.reasons || [])
    };
}

module.exports = {
    explainPairCompatibility
};
