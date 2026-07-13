const { mapMatchmakingFields } = require("./mapMatchmakingFields");

function toString(value) {
    return String(value ?? "").trim();
}

function mapMatchmakingAddendum(raw = {}) {
    return {
        source: {
            type: "website_form",
            formId: "qf-matchmaking-addendum-v1",
            subject: toString(raw._subject)
        },
        applicant: {
            name: toString(raw.name),
            email: toString(raw.email),
            submissionReference: toString(raw.matchmaking_submission_reference)
        },
        matchmaking: mapMatchmakingFields(raw, {
            source: "addendum_form"
        })
    };
}

module.exports = {
    mapMatchmakingAddendum
};
