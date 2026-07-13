const {
    INTRODUCTION_STATUSES
} = require("./introductionStatus");
const {
    isoNow,
    appendHistory
} = require("./introductionUtils");

function archiveIntroduction(record = {}, options = {}) {
    if (
        ![
            INTRODUCTION_STATUSES.INTRODUCED,
            INTRODUCTION_STATUSES.DECLINED
        ].includes(record.status)
    ) {
        throw new Error(
            "Only introduced or declined records can be archived."
        );
    }

    const timestamp = isoNow(options.now);

    return appendHistory(
        {
            ...record,
            status: INTRODUCTION_STATUSES.ARCHIVED,
            archivedAt: timestamp
        },
        "introduction_archived",
        {
            now: timestamp,
            actor: options.actor || "operator",
            note: options.note || ""
        }
    );
}

module.exports = {
    archiveIntroduction
};
