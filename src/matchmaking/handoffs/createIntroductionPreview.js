function summarizeProfile(profile = {}) {
    const summary = profile.shareableSummary || {};

    return {
        playerId: profile.playerId,
        displayName: profile.identity?.displayName || profile.playerId,
        campaignInterests: [...(summary.campaignInterests || [])],
        availabilitySummary: summary.availabilitySummary || "",
        systemSummary: summary.systemSummary || "",
        tableStyleSummary: summary.tableStyleSummary || "",
        commitmentSummary: summary.commitmentSummary || "",
        sessionZeroTopics: [...(summary.sessionZeroTopics || [])]
    };
}

function createIntroductionPreview(profiles = [], sourceMatch = {}) {
    return {
        title: profiles.length === 2
            ? "Potential Player Match"
            : "Potential Campaign Group",
        memberCount: profiles.length,
        members: profiles.map(summarizeProfile),
        matchSummary: {
            classification: sourceMatch.classification || "",
            compatibility: sourceMatch.score?.overall ?? null,
            confidence: sourceMatch.score?.confidence || "insufficient",
            strongAlignment: [...(sourceMatch.strongAlignment || [])],
            manageableDifferences: [...(sourceMatch.manageableDifferences || [])],
            discussionPoints: [...(sourceMatch.discussionPoints || [])]
        },
        privacyNotice:
            "Contact details are withheld until the operator and every participant approve the introduction."
    };
}

module.exports = {
    createIntroductionPreview,
    summarizeProfile
};
