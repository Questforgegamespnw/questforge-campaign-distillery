const {
    validateCompatibilityProfile
} = require("../data/validators/validateCompatibilityProfile");

const {
    profileFilePath,
    profileStatusFilePath
} = require("./storagePaths");

const { writeJsonAtomic } = require("./jsonStorage");

function buildStatusRecord(profile = {}) {
    return {
        schemaVersion: "1.0",
        playerId: profile.playerId,
        status: profile.status,
        statusReason: profile.statusReason || "",
        profileVersion: Number(profile.provenance?.profileVersion || 1),
        updatedAt: profile.provenance?.updatedAt || "",
        lastConfirmedAt: profile.provenance?.lastConfirmedAt || ""
    };
}

function saveCompatibilityProfile(profile, options = {}) {
    const validation = validateCompatibilityProfile(profile);

    if (!validation.isValid) {
        const error = new Error(
            `Compatibility profile validation failed:\n${validation.errors.join("\n")}`
        );
        error.validation = validation;
        throw error;
    }

    const profilePath = profileFilePath(options.storageRoot, profile.playerId);
    const statusPath = profileStatusFilePath(options.storageRoot, profile.playerId);

    writeJsonAtomic(profilePath, profile);
    writeJsonAtomic(statusPath, buildStatusRecord(profile));

    return {
        profilePath,
        statusPath,
        profile,
        status: buildStatusRecord(profile)
    };
}

module.exports = {
    saveCompatibilityProfile,
    buildStatusRecord
};
