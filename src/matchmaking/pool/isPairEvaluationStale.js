function isPairEvaluationStale(result = {}, profilesById = {}, options = {}) {
    const reasons = [];
    const expectedModelVersion = String(options.scoringModelVersion || "1.0");

    if (String(result.provenance?.scoringModelVersion || "") !== expectedModelVersion) {
        reasons.push(
            `Scoring model changed from ${result.provenance?.scoringModelVersion || "unknown"} to ${expectedModelVersion}.`
        );
    }

    for (const playerId of result.members || []) {
        const profile = profilesById[playerId];

        if (!profile) {
            reasons.push(`Profile ${playerId} is missing.`);
            continue;
        }

        const evaluatedVersion = Number(
            result.provenance?.profileVersions?.[playerId] || 0
        );
        const currentVersion = Number(profile.provenance?.profileVersion || 0);

        if (evaluatedVersion !== currentVersion) {
            reasons.push(
                `Profile ${playerId} changed from version ${evaluatedVersion} to ${currentVersion}.`
            );
        }

        if (profile.status !== "active") {
            reasons.push(`Profile ${playerId} is no longer active.`);
        }
    }

    return {
        stale: reasons.length > 0,
        reasons
    };
}

module.exports = {
    isPairEvaluationStale
};
