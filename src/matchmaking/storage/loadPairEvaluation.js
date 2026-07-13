const fs = require("fs");

const {
    validatePairMatchResult
} = require("../data/validators/validatePairMatchResult");

const {
    pairEvaluationFilePath
} = require("./storagePaths");

const { readJson } = require("./jsonStorage");

function loadPairEvaluation(matchId, options = {}) {
    const filePath = pairEvaluationFilePath(options.storageRoot, matchId);

    if (!fs.existsSync(filePath)) {
        if (options.allowMissing === true) return null;
        throw new Error(`Pair evaluation not found: ${filePath}`);
    }

    let result;

    try {
        result = readJson(filePath);
    } catch (error) {
        throw new Error(`Failed to read pair evaluation ${filePath}: ${error.message}`);
    }

    const validation = validatePairMatchResult(result);

    if (!validation.isValid && options.allowInvalid !== true) {
        const error = new Error(
            `Pair evaluation validation failed for ${matchId}:\n${validation.errors.join("\n")}`
        );
        error.validation = validation;
        throw error;
    }

    return {
        filePath,
        result,
        validation
    };
}

module.exports = {
    loadPairEvaluation
};
