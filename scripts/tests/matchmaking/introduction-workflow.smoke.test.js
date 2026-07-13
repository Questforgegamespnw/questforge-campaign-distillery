const assert = require("assert");
const crypto = require("crypto");

const {
    buildIntroductionRecord
} = require("../../../src/matchmaking/handoffs/buildIntroductionRecord");
const {
    approveIntroduction
} = require("../../../src/matchmaking/handoffs/approveIntroduction");
const {
    recordParticipantResponse
} = require("../../../src/matchmaking/handoffs/recordParticipantResponse");
const {
    releaseContactDetails
} = require("../../../src/matchmaking/handoffs/releaseContactDetails");
const {
    completeIntroduction
} = require("../../../src/matchmaking/handoffs/completeIntroduction");
const {
    declineIntroduction
} = require("../../../src/matchmaking/handoffs/declineIntroduction");
const {
    archiveIntroduction
} = require("../../../src/matchmaking/handoffs/archiveIntroduction");
const {
    validateIntroductionRecord
} = require("../../../src/matchmaking/data/validators/validateIntroductionRecord");

const NOW = "2026-07-12T20:00:00.000Z";

function makeProfile(playerId) {
    return {
        schemaVersion: "1.0",
        playerId,
        submissionId: `submission-${playerId}`,
        status: "active",
        statusReason: "",
        consent: {
            matchmaking: true,
            profileRetention: true,
            operatorReview: true,
            contactForIntroduction: true,
            shareableSummary: true
        },
        identity: {
            displayName: playerId,
            contactRef: `contact-${playerId}`
        },
        logistics: {
            timezone: "America/Los_Angeles",
            playFormats: ["online"],
            availability: [{ day: "tuesday", start: "18:00", end: "22:00" }],
            frequencyPreferences: ["weekly"],
            sessionDuration: { minimumHours: 3, maximumHours: 4 },
            scheduleFlexibility: "moderate"
        },
        commitment: {
            campaignLengths: ["long"],
            attendanceExpectation: "consistent",
            startReadiness: "within_one_month"
        },
        systems: {
            preferred: ["dnd_5e"],
            acceptable: [],
            excluded: [],
            openness: "open_with_guidance"
        },
        campaignPreferences: {
            experiences: [],
            setups: [],
            tone: "heroic",
            choiceWeight: "",
            genres: ["fantasy"],
            eras: [],
            aesthetics: [],
            worldConditions: [],
            environments: [],
            gameplayInterests: [],
            playerFantasy: [],
            mustHaves: "",
            avoid: "",
            systemPreference: "D&D 5e"
        },
        tablePreferences: {
            roleplayIntensity: "moderate",
            tacticalIntensity: "moderate",
            rulesApproach: "balanced",
            characterCollaboration: "preferred",
            communicationStyles: ["direct"],
            voiceRequired: true,
            videoPreference: "optional"
        },
        experience: {
            overallLevel: "intermediate",
            systemsPlayed: [],
            gmExperience: false,
            mixedExperienceComfort: true
        },
        safety: {
            contentSafetyMode: "standard",
            boundaries: [],
            hardExclusions: [],
            operatorPrivateNotes: [],
            shareableGuidance: []
        },
        groupPreferences: {
            minimumPlayers: 2,
            preferredPlayers: 4,
            maximumPlayers: 5
        },
        requirements: {
            mustHaves: [],
            hardConstraints: {
                schedule: [],
                format: [],
                content: [],
                system: [],
                commitment: [],
                tableCulture: []
            },
            freeTextNotes: []
        },
        shareableSummary: {
            campaignInterests: ["fantasy"],
            availabilitySummary: "Tuesday evenings",
            systemSummary: "D&D 5e",
            tableStyleSummary: "Collaborative",
            commitmentSummary: "Long campaign",
            sessionZeroTopics: []
        },
        completeness: {
            percentage: 100,
            missingRequiredFields: [],
            warnings: [],
            contradictions: [],
            explicitFieldCount: 10,
            inferredFieldCount: 0
        },
        provenance: {
            profileVersion: 1,
            sourceCanonicalSchemaVersion: "1.0",
            sourceCanonicalHash: crypto
                .createHash("sha256")
                .update(playerId)
                .digest("hex"),
            sourceType: "main_intake",
            createdAt: NOW,
            updatedAt: NOW,
            lastConfirmedAt: NOW
        },
        lifecycle: {
            statusChangedAt: NOW,
            matchedReference: "",
            history: []
        }
    };
}

function makeMatch() {
    return {
        matchId: "pair-player-a-player-b",
        matchType: "pair",
        eligibility: { eligible: true },
        classification: "strong_match",
        score: {
            overall: 88,
            confidence: "high"
        },
        strongAlignment: ["Schedule aligns."],
        manageableDifferences: [],
        discussionPoints: [],
        provenance: { scoringModelVersion: "1.0" }
    };
}

const tests = [];
function test(name, fn) { tests.push({ name, fn }); }

test("draft contains sanitized preview and no released contact details", () => {
    const profiles = [makeProfile("player-a"), makeProfile("player-b")];
    const record = buildIntroductionRecord(profiles, makeMatch(), { now: NOW });

    assert.strictEqual(record.status, "awaiting_operator_approval");
    assert.deepStrictEqual(record.releasedContacts, {});
    assert.ok(!JSON.stringify(record.preview).includes("contact-player-a"));
    assert.strictEqual(validateIntroductionRecord(record).isValid, true);
});

test("operator approval moves record to participant consent", () => {
    const record = approveIntroduction(
        buildIntroductionRecord(
            [makeProfile("player-a"), makeProfile("player-b")],
            makeMatch(),
            { now: NOW }
        ),
        { approvedBy: "operator", now: NOW }
    );

    assert.strictEqual(record.status, "awaiting_participant_consent");
    assert.strictEqual(record.operatorApproval.approved, true);
});

test("all participants must approve before contact release", () => {
    let record = buildIntroductionRecord(
        [makeProfile("player-a"), makeProfile("player-b")],
        makeMatch(),
        { now: NOW }
    );
    record = approveIntroduction(record, { now: NOW });
    record = recordParticipantResponse(
        record,
        "player-a",
        "approved",
        { now: NOW }
    );

    assert.strictEqual(record.status, "awaiting_participant_consent");
    assert.throws(() =>
        releaseContactDetails(
            record,
            [makeProfile("player-a"), makeProfile("player-b")],
            (contactRef) => `${contactRef}@example.test`,
            { now: NOW }
        )
    );
});

test("declined participant closes the introduction without contacts", () => {
    let record = buildIntroductionRecord(
        [makeProfile("player-a"), makeProfile("player-b")],
        makeMatch(),
        { now: NOW }
    );
    record = approveIntroduction(record, { now: NOW });
    record = recordParticipantResponse(
        record,
        "player-a",
        "declined",
        { now: NOW }
    );

    assert.strictEqual(record.status, "declined");
    assert.deepStrictEqual(record.releasedContacts, {});
});

test("current consent and profile version are rechecked at release", () => {
    const profiles = [makeProfile("player-a"), makeProfile("player-b")];
    let record = buildIntroductionRecord(profiles, makeMatch(), { now: NOW });
    record = approveIntroduction(record, { now: NOW });
    record = recordParticipantResponse(record, "player-a", "approved", { now: NOW });
    record = recordParticipantResponse(record, "player-b", "approved", { now: NOW });

    const changed = [
        { ...profiles[0], provenance: { ...profiles[0].provenance, profileVersion: 2 } },
        profiles[1]
    ];

    assert.throws(() =>
        releaseContactDetails(
            record,
            changed,
            () => "contact@example.test",
            { now: NOW }
        ),
        /Current consent check failed/
    );
});

test("approved introduction releases contacts and completes profiles", () => {
    const profiles = [makeProfile("player-a"), makeProfile("player-b")];
    let record = buildIntroductionRecord(profiles, makeMatch(), { now: NOW });
    record = approveIntroduction(record, { now: NOW });
    record = recordParticipantResponse(record, "player-a", "approved", { now: NOW });
    record = recordParticipantResponse(record, "player-b", "approved", { now: NOW });
    record = releaseContactDetails(
        record,
        profiles,
        (contactRef) => `${contactRef}@example.test`,
        { now: NOW }
    );

    assert.strictEqual(record.status, "contact_released");
    assert.strictEqual(Object.keys(record.releasedContacts).length, 2);

    const completed = completeIntroduction(record, profiles, { now: NOW });
    assert.strictEqual(completed.record.status, "introduced");
    assert.ok(completed.profiles.every((profile) => profile.status === "matched"));
    assert.ok(
        completed.profiles.every(
            (profile) =>
                profile.lifecycle.matchedReference === record.introductionId
        )
    );
});

test("introduced and declined records can be archived", () => {
    let record = buildIntroductionRecord(
        [makeProfile("player-a"), makeProfile("player-b")],
        makeMatch(),
        { now: NOW }
    );
    record = declineIntroduction(record, {
        now: NOW,
        reason: "Operator stopped the introduction."
    });
    record = archiveIntroduction(record, { now: NOW });

    assert.strictEqual(record.status, "archived");
    assert.strictEqual(validateIntroductionRecord(record).isValid, true);
});

async function run() {
    let passed = 0;
    for (const entry of tests) {
        try {
            await entry.fn();
            passed += 1;
            console.log(`✅ ${entry.name}`);
        } catch (error) {
            console.error(`❌ ${entry.name}`);
            console.error(error.stack || error);
        }
    }

    console.log(`\nIntroduction workflow smoke tests: ${passed}/${tests.length} passed.`);
    if (passed !== tests.length) process.exitCode = 1;
}

if (require.main === module) run();
module.exports = { run };
