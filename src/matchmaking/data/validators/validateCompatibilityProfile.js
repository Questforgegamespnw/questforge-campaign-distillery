const fs = require("fs");
const path = require("path");
const Ajv2020 = require("ajv/dist/2020");
const addFormats = require("ajv-formats");


function loadSchema() {
    const schemaPath = path.resolve(
        __dirname,
        "../schemas/compatibility-profile.schema.json"
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

function validateSemanticProfile(profile = {}) {
    const errors = [];
    const warnings = [];

    if (profile.status === "active") {
        if (profile.consent?.matchmaking !== true) {
            errors.push("/consent/matchmaking: active profile requires matchmaking consent.");
        }
        if (profile.consent?.profileRetention !== true) {
            errors.push("/consent/profileRetention: active profile requires retention consent.");
        }
        if ((profile.completeness?.missingRequiredFields || []).length > 0) {
            errors.push("/completeness/missingRequiredFields: active profile cannot have missing required fields.");
        }
    }

    if (profile.status === "matched" && !profile.lifecycle?.matchedReference) {
        warnings.push("/lifecycle/matchedReference: matched profile has no match reference.");
    }

    if (profile.identity?.contactRef && profile.identity.contactRef.includes("@")) {
        warnings.push("/identity/contactRef: contactRef appears to contain an email address.");
    }

    return { errors, warnings };
}

function validateCompatibilityProfile(profile) {
    const validator = createValidator();
    const schemaValid = validator(profile);
    const semantic = validateSemanticProfile(profile || {});
    const errors = [
        ...(schemaValid ? [] : formatErrors(validator.errors)),
        ...semantic.errors
    ];

    return {
        isValid: errors.length === 0,
        errors,
        warnings: semantic.warnings,
        data: errors.length === 0 ? profile : null
    };
}

module.exports = {
    validateCompatibilityProfile,
    validateSemanticProfile
};
