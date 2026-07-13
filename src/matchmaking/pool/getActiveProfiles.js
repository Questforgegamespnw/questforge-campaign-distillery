const {
    listCompatibilityProfiles
} = require("../storage/listCompatibilityProfiles");

function isActiveProfile(profile = {}) {
    return (
        profile.status === "active" &&
        profile.consent?.matchmaking === true &&
        profile.consent?.profileRetention === true &&
        profile.consent?.operatorReview === true &&
        (profile.completeness?.missingRequiredFields || []).length === 0
    );
}

function getActiveProfiles(options = {}) {
    const { profiles, invalidProfiles } = listCompatibilityProfiles(options);

    const activeProfiles = [];
    const excludedProfiles = [];

    for (const profile of profiles) {
        if (isActiveProfile(profile)) {
            activeProfiles.push(profile);
        } else {
            excludedProfiles.push({
                playerId: profile.playerId,
                status: profile.status,
                reason: profile.status !== "active"
                    ? `Profile status is ${profile.status}.`
                    : "Profile does not meet active pool requirements."
            });
        }
    }

    activeProfiles.sort((a, b) => a.playerId.localeCompare(b.playerId));

    return {
        activeProfiles,
        excludedProfiles,
        invalidProfiles
    };
}

module.exports = {
    getActiveProfiles,
    isActiveProfile
};
