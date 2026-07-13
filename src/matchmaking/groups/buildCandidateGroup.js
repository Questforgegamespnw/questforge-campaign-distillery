const {
    stableMembers,
    groupId
} = require("./groupUtils");

function buildCandidateGroup(profiles = [], options = {}) {
    const uniqueProfiles = [];
    const seen = new Set();

    for (const profile of profiles) {
        if (!profile?.playerId || seen.has(profile.playerId)) continue;
        seen.add(profile.playerId);
        uniqueProfiles.push(profile);
    }

    uniqueProfiles.sort((a, b) => a.playerId.localeCompare(b.playerId));

    return {
        candidateId: groupId(uniqueProfiles),
        members: stableMembers(uniqueProfiles),
        profiles: uniqueProfiles,
        createdAt: options.now
            ? new Date(options.now).toISOString()
            : new Date().toISOString()
    };
}

module.exports = {
    buildCandidateGroup
};
