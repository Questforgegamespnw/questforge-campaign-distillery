const fs = require("fs");
const path = require("path");

const {
    getActiveProfiles
} = require("./getActiveProfiles");

const {
    compareProfileAgainstPool
} = require("./compareProfileAgainstPool");

const {
    pairEvaluationsDirectory
} = require("../storage/storagePaths");

const {
    loadPairEvaluation
} = require("../storage/loadPairEvaluation");

const {
    isPairEvaluationStale
} = require("./isPairEvaluationStale");

function listStoredEvaluations(options = {}) {
    const directory = pairEvaluationsDirectory(options.storageRoot);

    if (!fs.existsSync(directory)) return [];

    return fs.readdirSync(directory)
        .filter((name) => name.endsWith(".json"))
        .sort()
        .map((name) => {
            const matchId = path.basename(name, ".json");
            return loadPairEvaluation(matchId, {
                ...options,
                allowInvalid: true
            });
        });
}

function reevaluateProfileMatches(targetProfile, options = {}) {
    const pool = getActiveProfiles(options);
    const profilesById = Object.fromEntries(
        pool.activeProfiles.map((profile) => [profile.playerId, profile])
    );

    profilesById[targetProfile.playerId] = targetProfile;

    const existing = listStoredEvaluations(options)
        .filter((entry) => entry.result.members.includes(targetProfile.playerId));

    const staleEvaluations = existing
        .map((entry) => ({
            matchId: entry.result.matchId,
            ...isPairEvaluationStale(entry.result, profilesById, options)
        }))
        .filter((entry) => entry.stale);

    const comparison = compareProfileAgainstPool(targetProfile, {
        ...options,
        activeProfiles: pool.activeProfiles
    });

    return {
        ...comparison,
        staleEvaluations
    };
}

module.exports = {
    reevaluateProfileMatches,
    listStoredEvaluations
};
