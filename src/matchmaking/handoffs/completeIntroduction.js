const {
    INTRODUCTION_STATUSES
} = require("./introductionStatus");
const {
    isoNow,
    appendHistory
} = require("./introductionUtils");
const {
    markProfileMatched
} = require("../profiles/profileStatus");

function completeIntroduction(record = {}, profiles = [], options = {}) {
    if (record.status !== INTRODUCTION_STATUSES.CONTACT_RELEASED) {
        throw new Error(
            `Introduction cannot be completed from status ${record.status}.`
        );
    }

    const timestamp = isoNow(options.now);
    const completed = appendHistory(
        {
            ...record,
            status: INTRODUCTION_STATUSES.INTRODUCED,
            completedAt: timestamp
        },
        "introduction_completed",
        {
            now: timestamp,
            actor: options.actor || "operator",
            note: options.note || "Participants were introduced."
        }
    );

    const updatedProfiles = profiles.map((profile) =>
        markProfileMatched(profile, record.introductionId, {
            now: timestamp,
            reason: "Applicant completed a matchmaking introduction."
        })
    );

    return {
        record: completed,
        profiles: updatedProfiles
    };
}

module.exports = {
    completeIntroduction
};
