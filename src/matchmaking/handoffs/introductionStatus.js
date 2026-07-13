const INTRODUCTION_STATUSES = Object.freeze({
    DRAFT: "draft",
    AWAITING_OPERATOR_APPROVAL: "awaiting_operator_approval",
    AWAITING_PARTICIPANT_CONSENT: "awaiting_participant_consent",
    APPROVED: "approved",
    CONTACT_RELEASED: "contact_released",
    INTRODUCED: "introduced",
    DECLINED: "declined",
    ARCHIVED: "archived"
});

const PARTICIPANT_RESPONSES = Object.freeze({
    PENDING: "pending",
    APPROVED: "approved",
    DECLINED: "declined"
});

const VALID_INTRODUCTION_STATUSES = new Set(
    Object.values(INTRODUCTION_STATUSES)
);

function assertIntroductionStatus(status) {
    if (!VALID_INTRODUCTION_STATUSES.has(status)) {
        throw new Error(`Unsupported introduction status: ${status}`);
    }
    return status;
}

module.exports = {
    INTRODUCTION_STATUSES,
    PARTICIPANT_RESPONSES,
    VALID_INTRODUCTION_STATUSES,
    assertIntroductionStatus
};
