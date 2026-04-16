const { mapFormSubmission } = require("./mapFormSubmission");
const { normalizeSubmission } = require("./normalizeSubmission");
const { toCanonicalIntake } = require("./toCanonicalIntake");

function processFormSubmission(rawSubmission = {}) {
    const mapped = mapFormSubmission(rawSubmission);
    const normalized = normalizeSubmission(mapped);
    const canonical = toCanonicalIntake(normalized);

    return {
        mapped,
        normalized,
        canonical
    };
}

module.exports = {
    processFormSubmission
};