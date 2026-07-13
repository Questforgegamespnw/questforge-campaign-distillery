const fs = require("fs");

const {
    validateCompatibilityProfile
} = require("../data/validators/validateCompatibilityProfile");

const { profileFilePath } = require("./storagePaths");
const { readJson } = require("./jsonStorage");

function loadCompatibilityProfile(playerId, options = {}) {
    const filePath = profileFilePath(options.storageRoot, playerId);

    if (!fs.existsSync(filePath)) {
        if (options.allowMissing === true) return null;
        throw new Error(`Compatibility profile not found: ${filePath}`);
    }

    let profile;

    try {
        profile = readJson(filePath);
    } catch (error) {
        throw new Error(`Failed to read compatibility profile ${filePath}: ${error.message}`);
    }

    const validation = validateCompatibilityProfile(profile);

    if (!validation.isValid && options.allowInvalid !== true) {
        const error = new Error(
            `Compatibility profile validation failed for ${playerId}:\n${validation.errors.join("\n")}`
        );
        error.validation = validation;
        throw error;
    }

    return {
        filePath,
        profile,
        validation
    };
}

module.exports = {
    loadCompatibilityProfile
};
