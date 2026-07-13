const fs = require("fs");
const path = require("path");
const {
    introductionsDirectory
} = require("./introductionStoragePaths");
const {
    loadIntroductionRecord
} = require("./loadIntroductionRecord");

function listIntroductionRecords(options = {}) {
    const directory = introductionsDirectory(options.storageRoot);
    const records = [];
    const invalidRecords = [];

    if (!fs.existsSync(directory)) {
        return { records, invalidRecords };
    }

    for (const name of fs.readdirSync(directory).filter(
        (entry) => entry.endsWith(".json")
    ).sort()) {
        const introductionId = path.basename(name, ".json");
        try {
            const loaded = loadIntroductionRecord(introductionId, {
                ...options,
                allowInvalid: true
            });
            if (loaded.validation.isValid) {
                records.push(loaded.record);
            } else {
                invalidRecords.push({
                    introductionId,
                    errors: loaded.validation.errors
                });
            }
        } catch (error) {
            invalidRecords.push({
                introductionId,
                errors: [error.message]
            });
        }
    }

    records.sort(
        (a, b) =>
            Date.parse(b.updatedAt || 0) -
            Date.parse(a.updatedAt || 0)
    );

    return { records, invalidRecords };
}

module.exports = {
    listIntroductionRecords
};
