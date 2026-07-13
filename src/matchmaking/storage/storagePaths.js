const path = require("path");

function resolveStorageRoot(storageRoot) {
    return path.resolve(storageRoot || path.join(process.cwd(), "matchmaking"));
}

function profileDirectory(storageRoot, playerId) {
    return path.join(resolveStorageRoot(storageRoot), "profiles", playerId);
}

function profileFilePath(storageRoot, playerId) {
    return path.join(profileDirectory(storageRoot, playerId), "compatibility-profile.json");
}

function profileStatusFilePath(storageRoot, playerId) {
    return path.join(profileDirectory(storageRoot, playerId), "profile-status.json");
}

function poolIndexFilePath(storageRoot) {
    return path.join(resolveStorageRoot(storageRoot), "pool-index.json");
}

function pairEvaluationsDirectory(storageRoot) {
    return path.join(resolveStorageRoot(storageRoot), "evaluations", "pairs");
}

function pairEvaluationFilePath(storageRoot, matchId) {
    return path.join(pairEvaluationsDirectory(storageRoot), `${matchId}.json`);
}

module.exports = {
    resolveStorageRoot,
    profileDirectory,
    profileFilePath,
    profileStatusFilePath,
    poolIndexFilePath,
    pairEvaluationsDirectory,
    pairEvaluationFilePath
};
