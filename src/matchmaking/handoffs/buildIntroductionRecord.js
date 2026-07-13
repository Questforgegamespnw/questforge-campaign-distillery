const {
    INTRODUCTION_STATUSES,
    PARTICIPANT_RESPONSES
} = require("./introductionStatus");

const {
    isoNow,
    stableMembers,
    introductionId,
    currentConsentSnapshot
} = require("./introductionUtils");

const {
    validateIntroductionReadiness
} = require("./validateIntroductionReadiness");

const {
    createIntroductionPreview
} = require("./createIntroductionPreview");

function buildIntroductionRecord(profiles = [], sourceMatch = {}, options = {}) {
    const timestamp = isoNow(options.now);
    const members = stableMembers(profiles);
    const readiness = validateIntroductionReadiness(profiles, sourceMatch);

    const consentSnapshots = Object.fromEntries(
        profiles.map((profile) => [
            profile.playerId,
            {
                ...currentConsentSnapshot(profile),
                capturedAt: timestamp
            }
        ])
    );

    const participantResponses = Object.fromEntries(
        members.map((playerId) => [
            playerId,
            {
                status: PARTICIPANT_RESPONSES.PENDING,
                respondedAt: "",
                note: ""
            }
        ])
    );

    return {
        schemaVersion: "1.0",
        introductionId: introductionId(sourceMatch.matchId, members),
        status: readiness.ready
            ? INTRODUCTION_STATUSES.AWAITING_OPERATOR_APPROVAL
            : INTRODUCTION_STATUSES.DRAFT,
        sourceMatch: {
            matchId: sourceMatch.matchId || "",
            matchType: sourceMatch.matchType || (
                profiles.length === 2 ? "pair" : "group"
            ),
            classification: sourceMatch.classification || "",
            score: sourceMatch.score?.overall ?? null,
            confidence: sourceMatch.score?.confidence || "insufficient",
            scoringModelVersion:
                sourceMatch.provenance?.scoringModelVersion || "1.0"
        },
        members,
        profileVersions: Object.fromEntries(
            profiles.map((profile) => [
                profile.playerId,
                Number(profile.provenance?.profileVersion || 1)
            ])
        ),
        readiness,
        preview: createIntroductionPreview(profiles, sourceMatch),
        operatorApproval: {
            approved: false,
            approvedBy: "",
            approvedAt: "",
            note: ""
        },
        participantResponses,
        consentSnapshots,
        releasedContacts: {},
        contactReleasedAt: "",
        completedAt: "",
        declinedAt: "",
        archivedAt: "",
        createdAt: timestamp,
        updatedAt: timestamp,
        history: [
            {
                event: "introduction_created",
                actor: String(options.actor || "operator"),
                note: readiness.ready
                    ? "Introduction draft created and ready for operator review."
                    : "Introduction draft created with readiness blockers.",
                timestamp
            }
        ]
    };
}

module.exports = {
    buildIntroductionRecord
};
