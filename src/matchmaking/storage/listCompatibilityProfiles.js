const fs = require("fs");
const path = require("path");

const {
    resolveStorageRoot
} = require("./storagePaths");

const {
    loadCompatibilityProfile
} = require("./loadCompatibilityProfile");

function listCompatibilityProfiles(options = {}) {
    const root = resolveStorageRoot(options.storageRoot);
    const profilesRoot = path.join(root, "profiles");
    const profiles = [];
    const invalidProfiles = [];

    if (!fs.existsSync(profilesRoot)) {
        return { profiles, invalidProfiles };
    }

    const playerIds = fs.readdirSync(profilesRoot)
        .filter((name) => {
            const candidate = path.join(profilesRoot, name);
            return fs.statSync(candidate).isDirectory();
        })
        .sort();

    for (const playerId of playerIds) {
        try {
            const loaded = loadCompatibilityProfile(playerId, {
                storageRoot: root,
                allowInvalid: true
            });

            if (loaded.validation.isValid) {
                profiles.push(loaded.profile);
            } else {
                invalidProfiles.push({
                    playerId,
                    filePath: loaded.filePath,
                    errors: loaded.validation.errors
                });
            }
        } catch (error) {
            invalidProfiles.push({
                playerId,
                filePath: "",
                errors: [error.message]
            });
        }
    }

    return {
        profiles,
        invalidProfiles
    };
}

module.exports = {
    listCompatibilityProfiles
};
