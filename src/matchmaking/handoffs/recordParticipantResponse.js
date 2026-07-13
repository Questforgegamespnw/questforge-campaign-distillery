const {
    INTRODUCTION_STATUSES,
    PARTICIPANT_RESPONSES
} = require("./introductionStatus");

const {
    isoNow,
    appendHistory
} = require("./introductionUtils");

function recordParticipantResponse(record = {}, playerId, response, options = {}) {
    if (
        record.status !== INTRODUCTION_STATUSES.AWAITING_PARTICIPANT_CONSENT
    ) {
        throw new Error(
            `Participant responses cannot be recorded from status ${record.status}.`
        );
    }

    if (!record.members?.includes(playerId)) {
        throw new Error(`Player ${playerId} is not a member of this introduction.`);
    }

    if (
        ![
            PARTICIPANT_RESPONSES.APPROVED,
            PARTICIPANT_RESPONSES.DECLINED
        ].includes(response)
    ) {
        throw new Error(`Unsupported participant response: ${response}`);
    }

    const timestamp = isoNow(options.now);
    const participantResponses = {
        ...(record.participantResponses || {}),
        [playerId]: {
            status: response,
            respondedAt: timestamp,
            note: String(options.note || "").trim()
        }
    };

    const responseValues = Object.values(participantResponses)
        .map((entry) => entry.status);

    let status = INTRODUCTION_STATUSES.AWAITING_PARTICIPANT_CONSENT;
    let event = "participant_response_recorded";

    if (responseValues.includes(PARTICIPANT_RESPONSES.DECLINED)) {
        status = INTRODUCTION_STATUSES.DECLINED;
        event = "introduction_declined";
    } else if (
        responseValues.length === record.members.length &&
        responseValues.every(
            (value) => value === PARTICIPANT_RESPONSES.APPROVED
        )
    ) {
        status = INTRODUCTION_STATUSES.APPROVED;
        event = "all_participants_approved";
    }

    const updated = {
        ...record,
        status,
        participantResponses,
        declinedAt: status === INTRODUCTION_STATUSES.DECLINED
            ? timestamp
            : record.declinedAt || ""
    };

    return appendHistory(updated, event, {
        now: timestamp,
        actor: playerId,
        note: options.note || response
    });
}

module.exports = {
    recordParticipantResponse
};
