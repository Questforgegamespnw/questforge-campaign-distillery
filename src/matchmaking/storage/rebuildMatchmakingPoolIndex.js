const {
    listCompatibilityProfiles
} = require("./listCompatibilityProfiles");

const {
    poolIndexFilePath
} = require("./storagePaths");

const { writeJsonAtomic } = require("./jsonStorage");

function toIndexRecord(profile = {}) {
    return {
        playerId: profile.playerId,
        displayName: profile.identity?.displayName || profile.playerId,
        status: profile.status,
        profileVersion: Number(profile.provenance?.profileVersion || 1),
        updatedAt: profile.provenance?.updatedAt || "",
        lastConfirmedAt: profile.provenance?.lastConfirmedAt || "",
        completeness: Number(profile.completeness?.percentage || 0),
        playFormats: [...(profile.logistics?.playFormats || [])],
        timezone: profile.logistics?.timezone || ""
    };
}

function rebuildMatchmakingPoolIndex(options = {}) {
    const { profiles, invalidProfiles } = listCompatibilityProfiles(options);
    const updatedAt = options.now
        ? new Date(options.now).toISOString()
        : new Date().toISOString();

    const index = {
        schemaVersion: "1.0",
        updatedAt,
        profiles: profiles
            .map(toIndexRecord)
            .sort((a, b) => a.playerId.localeCompare(b.playerId)),
        invalidProfiles
    };

    const filePath = poolIndexFilePath(options.storageRoot);
    writeJsonAtomic(filePath, index);

    return {
        filePath,
        index
    };
}

module.exports = {
    rebuildMatchmakingPoolIndex,
    toIndexRecord
};
