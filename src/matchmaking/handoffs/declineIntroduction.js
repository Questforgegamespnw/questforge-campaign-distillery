const {
    INTRODUCTION_STATUSES
} = require("./introductionStatus");
const {
    isoNow,
    appendHistory
} = require("./introductionUtils");

function declineIntroduction(record = {}, options = {}) {
    if (
        [
            INTRODUCTION_STATUSES.INTRODUCED,
            INTRODUCTION_STATUSES.ARCHIVED
        ].includes(record.status)
    ) {
        throw new Error(
            `Introduction cannot be declined from status ${record.status}.`
        );
    }

    const timestamp = isoNow(options.now);

    return appendHistory(
        {
            ...record,
            status: INTRODUCTION_STATUSES.DECLINED,
            declinedAt: timestamp
        },
        "introduction_declined",
        {
            now: timestamp,
            actor: options.actor || "operator",
            note: options.reason || "Introduction declined."
        }
    );
}

module.exports = {
    declineIntroduction
};
