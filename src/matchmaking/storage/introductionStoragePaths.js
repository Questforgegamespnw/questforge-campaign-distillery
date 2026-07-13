const path = require("path");
const { resolveStorageRoot } = require("./storagePaths");

function introductionsDirectory(storageRoot) {
    return path.join(resolveStorageRoot(storageRoot), "introductions");
}

function introductionFilePath(storageRoot, introductionId) {
    return path.join(
        introductionsDirectory(storageRoot),
        `${introductionId}.json`
    );
}

module.exports = {
    introductionsDirectory,
    introductionFilePath
};
