const {
    INTRODUCTION_STATUSES
} = require("./introductionStatus");
const {
    isoNow,
    appendHistory
} = require("./introductionUtils");

function approveIntroduction(record = {}, options = {}) {
    if (
        ![
            INTRODUCTION_STATUSES.DRAFT,
            INTRODUCTION_STATUSES.AWAITING_OPERATOR_APPROVAL
        ].includes(record.status)
    ) {
        throw new Error(
            `Introduction cannot be operator-approved from status ${record.status}.`
        );
    }

    if (record.readiness?.ready !== true) {
        throw new Error(
            "Introduction cannot be approved while readiness blockers remain."
        );
    }

    const timestamp = isoNow(options.now);
    const approved = {
        ...record,
        status: INTRODUCTION_STATUSES.AWAITING_PARTICIPANT_CONSENT,
        operatorApproval: {
            approved: true,
            approvedBy: String(options.approvedBy || "operator"),
            approvedAt: timestamp,
            note: String(options.note || "").trim()
        }
    };

    return appendHistory(approved, "operator_approved", {
        now: timestamp,
        actor: options.approvedBy || "operator",
        note: options.note || ""
    });
}

module.exports = {
    approveIntroduction
};
