const {
    validatePairMatchResult
} = require("../data/validators/validatePairMatchResult");

const {
    pairEvaluationFilePath
} = require("./storagePaths");

const { writeJsonAtomic } = require("./jsonStorage");

function savePairEvaluation(result, options = {}) {
    const validation = validatePairMatchResult(result);

    if (!validation.isValid) {
        const error = new Error(
            `Pair evaluation validation failed:\n${validation.errors.join("\n")}`
        );
        error.validation = validation;
        throw error;
    }

    const filePath = pairEvaluationFilePath(options.storageRoot, result.matchId);
    writeJsonAtomic(filePath, result);

    return {
        filePath,
        result
    };
}

module.exports = {
    savePairEvaluation
};
