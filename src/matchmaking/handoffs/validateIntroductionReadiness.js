function validateIntroductionReadiness(profiles = [], sourceMatch = {}) {
    const errors = [];
    const warnings = [];

    if (!Array.isArray(profiles) || profiles.length < 2) {
        errors.push("At least two compatibility profiles are required.");
    }

    const memberIds = profiles.map((profile) => profile?.playerId).filter(Boolean);
    if (new Set(memberIds).size !== profiles.length) {
        errors.push("Introduction members must have unique player IDs.");
    }

    if (sourceMatch.eligibility?.eligible !== true) {
        errors.push("The source match is not eligible for introduction.");
    }

    if (
        ![
            "strong_match",
            "potential_match",
            "strong_group",
            "potential_group",
            "needs_session_zero_alignment",
            "low_confidence"
        ].includes(sourceMatch.classification)
    ) {
        errors.push(
            `Source classification "${sourceMatch.classification || "unknown"}" is not introduction-eligible.`
        );
    }

    for (const profile of profiles) {
        const name = profile.identity?.displayName || profile.playerId || "Applicant";

        if (profile.status !== "active") {
            errors.push(`${name} is not currently active.`);
        }
        if (profile.consent?.matchmaking !== true) {
            errors.push(`${name} has not consented to matchmaking.`);
        }
        if (profile.consent?.profileRetention !== true) {
            errors.push(`${name} has not consented to profile retention.`);
        }
        if (profile.consent?.operatorReview !== true) {
            errors.push(`${name} has not consented to operator review.`);
        }
        if (profile.consent?.shareableSummary !== true) {
            errors.push(`${name} has not consented to a shareable summary.`);
        }
        if (profile.consent?.contactForIntroduction !== true) {
            errors.push(`${name} has not consented to contact release for introductions.`);
        }

        if ((profile.completeness?.missingRequiredFields || []).length > 0) {
            errors.push(
                `${name} has missing required profile fields and must be reconfirmed before introduction.`
            );
        }
        if ((profile.completeness?.warnings || []).length > 0) {
            warnings.push(
                `${name} has profile warnings that should be reviewed before approval.`
            );
        }
    }

    if (["low", "insufficient"].includes(sourceMatch.score?.confidence)) {
        errors.push(
            "The source match has low confidence and must be reconfirmed before approval."
        );
    }

    return {
        ready: errors.length === 0,
        errors,
        warnings
    };
}

module.exports = {
    validateIntroductionReadiness
};
