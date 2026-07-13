const fs = require("fs");
const path = require("path");
const Ajv2020 = require("ajv/dist/2020");
const addFormats = require("ajv-formats");

function loadSchema() {
    return JSON.parse(
        fs.readFileSync(
            path.resolve(
                __dirname,
                "../schemas/introduction-record.schema.json"
            ),
            "utf8"
        )
    );
}

function createValidator() {
    const ajv = new Ajv2020({
        allErrors: true,
        strict: false
    });
    addFormats(ajv);
    return ajv.compile(loadSchema());
}

function formatErrors(errors = []) {
    return errors.map((error) => {
        const location = error.instancePath || "(root)";
        if (error.keyword === "required") {
            return `${location}: missing required property "${error.params.missingProperty}"`;
        }
        return `${location}: ${error.message || "validation error"}`;
    });
}

function semanticErrors(record = {}) {
    const errors = [];
    const allApproved = Object.values(
        record.participantResponses || {}
    ).every((response) => response.status === "approved");

    if (
        ["approved", "contact_released", "introduced"].includes(record.status) &&
        !allApproved
    ) {
        errors.push(
            "/participantResponses: approved or later status requires every participant to approve."
        );
    }

    if (
        ["contact_released", "introduced"].includes(record.status) &&
        Object.keys(record.releasedContacts || {}).length !==
            (record.members || []).length
    ) {
        errors.push(
            "/releasedContacts: contact-released or introduced status requires contact details for every member."
        );
    }

    if (
        record.status === "introduced" &&
        !record.completedAt
    ) {
        errors.push("/completedAt: introduced status requires completion time.");
    }

    return errors;
}

function validateIntroductionRecord(record) {
    const validator = createValidator();
    const valid = validator(record);
    const errors = [
        ...(valid ? [] : formatErrors(validator.errors)),
        ...semanticErrors(record || {})
    ];

    return {
        isValid: errors.length === 0,
        errors,
        data: errors.length === 0 ? record : null
    };
}

module.exports = {
    validateIntroductionRecord,
    semanticErrors
};
