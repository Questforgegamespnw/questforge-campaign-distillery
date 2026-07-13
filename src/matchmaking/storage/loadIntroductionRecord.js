const fs = require("fs");
const {
    introductionFilePath
} = require("./introductionStoragePaths");
const { readJson } = require("./jsonStorage");
const {
    validateIntroductionRecord
} = require("../data/validators/validateIntroductionRecord");

function loadIntroductionRecord(introductionId, options = {}) {
    const filePath = introductionFilePath(
        options.storageRoot,
        introductionId
    );

    if (!fs.existsSync(filePath)) {
        if (options.allowMissing === true) return null;
        throw new Error(`Introduction record not found: ${filePath}`);
    }

    const record = readJson(filePath);
    const validation = validateIntroductionRecord(record);

    if (!validation.isValid && options.allowInvalid !== true) {
        const error = new Error(
            `Introduction record validation failed:\n${validation.errors.join("\n")}`
        );
        error.validation = validation;
        throw error;
    }

    return { filePath, record, validation };
}

module.exports = {
    loadIntroductionRecord
};
