const fs = require("fs");
const path = require("path");
const Ajv2020 = require("ajv/dist/2020");
const addFormats = require("ajv-formats");

function loadSchema() {
    const schemaPath = path.resolve(
        __dirname,
        "../schemas/group-match-result.schema.json"
    );

    return JSON.parse(fs.readFileSync(schemaPath, "utf8"));
}

function createValidator() {
    const ajv = new Ajv2020({
        allErrors: true,
        strict: false
    });

    addFormats(ajv);
    return ajv.compile(loadSchema());
}

function formatErrors(errors) {
    if (!errors?.length) return [];

    return errors.map((error) => {
        const location = error.instancePath || "(root)";

        if (error.keyword === "required") {
            return `${location}: missing required property "${error.params.missingProperty}"`;
        }

        if (error.keyword === "additionalProperties") {
            return `${location}: unexpected property "${error.params.additionalProperty}"`;
        }

        return `${location}: ${error.message || "validation error"}`;
    });
}

function validateSemanticResult(result = {}) {
    const errors = [];

    if (result.eligibility?.eligible === false && result.score?.overall !== null) {
        errors.push(
            "/score/overall: blocked groups must not carry an overall compatibility score."
        );
    }

    if (
        result.eligibility?.eligible === true &&
        (result.score?.overall === null || result.score?.overall === undefined)
    ) {
        errors.push(
            "/score/overall: eligible groups require an overall compatibility score."
        );
    }

    const expectedPairCount =
        ((result.members?.length || 0) * ((result.members?.length || 0) - 1)) / 2;

    if (
        result.eligibility?.eligible === true &&
        result.pairResults?.length !== expectedPairCount
    ) {
        errors.push(
            `/pairResults: expected ${expectedPairCount} pair summaries for ${result.members?.length || 0} members.`
        );
    }

    if (
        result.operatorRecommendation?.introductionReady === true &&
        !["strong_group", "potential_group"].includes(result.classification)
    ) {
        errors.push(
            "/operatorRecommendation/introductionReady: only strong or potential groups can be introduction-ready."
        );
    }

    return errors;
}

function validateGroupMatchResult(result) {
    const validator = createValidator();
    const schemaValid = validator(result);

    const errors = [
        ...(schemaValid ? [] : formatErrors(validator.errors)),
        ...validateSemanticResult(result || {})
    ];

    return {
        isValid: errors.length === 0,
        errors,
        data: errors.length === 0 ? result : null
    };
}

module.exports = {
    validateGroupMatchResult,
    validateSemanticResult
};
