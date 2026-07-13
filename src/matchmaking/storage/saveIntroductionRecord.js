const {
    validateIntroductionRecord
} = require("../data/validators/validateIntroductionRecord");
const {
    introductionFilePath
} = require("./introductionStoragePaths");
const { writeJsonAtomic } = require("./jsonStorage");

function saveIntroductionRecord(record, options = {}) {
    const validation = validateIntroductionRecord(record);

    if (!validation.isValid) {
        const error = new Error(
            `Introduction record validation failed:\n${validation.errors.join("\n")}`
        );
        error.validation = validation;
        throw error;
    }

    const filePath = introductionFilePath(
        options.storageRoot,
        record.introductionId
    );
    writeJsonAtomic(filePath, record);

    return { filePath, record };
}

module.exports = {
    saveIntroductionRecord
};
