const assert = require("assert");

const {
    buildPairMatchResult
} = require("../../../src/matchmaking/pairs/buildPairMatchResult");

const {
    validatePairMatchResult
} = require("../../../src/matchmaking/data/validators/validatePairMatchResult");

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function makeProfile(overrides = {}) {
    const now = "2026-07-12T20:00:00.000Z";

    const base = {
        schemaVersion: "1.0",
        playerId: "player-a",
        submissionId: "submission-a",
        status: "active",
        statusReason: "Profile meets activation requirements.",
        consent: {
            matchmaking: true,
            profileRetention: true,
            operatorReview: true,
            contactForIntroduction: true,
            shareableSummary: true
        },
        identity: {
            displayName: "Player A",
            contactRef: "contact-player-a"
        },
        logistics: {
            timezone: "America/Los_Angeles",
            playFormats: ["online"],
            availability: [
                { day: "tuesday", start: "18:00", end: "22:00" }
            ],
            frequencyPreferences: ["weekly", "biweekly"],
            sessionDuration: {
                minimumHours: 3,
                maximumHours: 4
            },
            scheduleFlexibility: "moderate"
        },
        commitment: {
            campaignLengths: ["medium", "long"],
            attendanceExpectation: "consistent",
            startReadiness: "within_one_month"
        },
        systems: {
            preferred: ["dnd_5e"],
            acceptable: ["pathfinder_2e"],
            excluded: [],
            openness: "open_with_guidance"
        },
        campaignPreferences: {
            experiences: ["character_driven_drama", "tactical_challenges"],
            setups: ["expedition_team"],
            tone: "heroic",
            choiceWeight: "strong_choices",
            genres: ["fantasy"],
            eras: ["medieval"],
            aesthetics: ["heroic_fantasy"],
            worldConditions: ["frontier"],
            environments: ["ancient_ruins"],
            gameplayInterests: ["tactical_combat", "exploration"],
            playerFantasy: ["becoming_heroes"],
            mustHaves: "",
            avoid: "",
            systemPreference: "D&D 5e"
        },
        tablePreferences: {
            roleplayIntensity: "high",
            tacticalIntensity: "moderate",
            rulesApproach: "balanced",
            characterCollaboration: "preferred",
            communicationStyles: ["direct", "collaborative"],
            voiceRequired: true,
            videoPreference: "optional"
        },
        experience: {
            overallLevel: "intermediate",
            systemsPlayed: ["dnd_5e"],
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
            minimumPlayers: 3,
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
            campaignInterests: [],
            availabilitySummary: "",
            systemSummary: "",
            tableStyleSummary: "",
            commitmentSummary: "",
            sessionZeroTopics: []
        },
        completeness: {
            percentage: 100,
            missingRequiredFields: [],
            warnings: [],
            contradictions: [],
            explicitFieldCount: 12,
            inferredFieldCount: 0
        },
        provenance: {
            profileVersion: 1,
            sourceCanonicalSchemaVersion: "1.0",
            sourceCanonicalHash: "a".repeat(64),
            sourceType: "main_intake",
            createdAt: now,
            updatedAt: now,
            lastConfirmedAt: now
        },
        lifecycle: {
            statusChangedAt: now,
            matchedReference: "",
            history: [
                {
                    status: "active",
                    reason: "Profile meets activation requirements.",
                    timestamp: now
                }
            ]
        }
    };

    return deepMerge(base, overrides);
}

function deepMerge(target, source) {
    if (!source || typeof source !== "object" || Array.isArray(source)) {
        return source === undefined ? clone(target) : clone(source);
    }

    const result = clone(target);

    for (const [key, value] of Object.entries(source)) {
        if (
            value &&
            typeof value === "object" &&
            !Array.isArray(value) &&
            result[key] &&
            typeof result[key] === "object" &&
            !Array.isArray(result[key])
        ) {
            result[key] = deepMerge(result[key], value);
        } else {
            result[key] = clone(value);
        }
    }

    return result;
}

const tests = [];

function test(name, fn) {
    tests.push({ name, fn });
}

test("strong compatible profiles produce a valid scored result", () => {
    const profileA = makeProfile();
    const profileB = makeProfile({
        playerId: "player-b",
        submissionId: "submission-b",
        identity: {
            displayName: "Player B",
            contactRef: "contact-player-b"
        },
        provenance: {
            sourceCanonicalHash: "b".repeat(64)
        }
    });

    const result = buildPairMatchResult(profileA, profileB, {
        now: "2026-07-12T20:00:00.000Z"
    });

    const validation = validatePairMatchResult(result);

    assert.strictEqual(validation.isValid, true, validation.errors.join("\n"));
    assert.strictEqual(result.eligibility.eligible, true);
    assert.ok(result.score.overall >= 80);
    assert.strictEqual(result.classification, "strong_match");
    assert.ok(result.strongAlignment.length > 0);
});

test("no recurring schedule overlap blocks the pair", () => {
    const profileA = makeProfile();
    const profileB = makeProfile({
        playerId: "player-b",
        identity: {
            displayName: "Player B",
            contactRef: "contact-player-b"
        },
        logistics: {
            availability: [
                { day: "friday", start: "18:00", end: "22:00" }
            ]
        },
        provenance: {
            sourceCanonicalHash: "b".repeat(64)
        }
    });

    const result = buildPairMatchResult(profileA, profileB, {
        now: "2026-07-12T20:00:00.000Z"
    });

    assert.strictEqual(result.eligibility.eligible, false);
    assert.strictEqual(result.classification, "blocked_by_schedule");
    assert.strictEqual(result.score.overall, null);
});

test("incompatible play formats block the pair", () => {
    const profileA = makeProfile();
    const profileB = makeProfile({
        playerId: "player-b",
        identity: {
            displayName: "Player B",
            contactRef: "contact-player-b"
        },
        logistics: {
            playFormats: ["in_person"]
        },
        provenance: {
            sourceCanonicalHash: "b".repeat(64)
        }
    });

    const result = buildPairMatchResult(profileA, profileB, {
        now: "2026-07-12T20:00:00.000Z"
    });

    assert.strictEqual(result.eligibility.eligible, false);
    assert.strictEqual(result.classification, "blocked_by_format");
});

test("required versus excluded systems produce a hard blocker", () => {
    const profileA = makeProfile({
        requirements: {
            hardConstraints: {
                system: ["dnd_5e"]
            }
        }
    });

    const profileB = makeProfile({
        playerId: "player-b",
        identity: {
            displayName: "Player B",
            contactRef: "contact-player-b"
        },
        systems: {
            preferred: ["pathfinder_2e"],
            acceptable: [],
            excluded: ["dnd_5e"],
            openness: "preferred_only"
        },
        provenance: {
            sourceCanonicalHash: "b".repeat(64)
        }
    });

    const result = buildPairMatchResult(profileA, profileB, {
        now: "2026-07-12T20:00:00.000Z"
    });

    assert.strictEqual(result.eligibility.eligible, false);
    assert.strictEqual(result.classification, "blocked_by_hard_conflict");
});

test("high compatibility with incomplete data is classified low confidence", () => {
    const profileA = makeProfile();
    const profileB = makeProfile({
        playerId: "player-b",
        identity: {
            displayName: "Player B",
            contactRef: "contact-player-b"
        },
        completeness: {
            percentage: 45,
            missingRequiredFields: ["tablePreferences.communicationStyles"],
            warnings: ["Communication preferences are incomplete."],
            explicitFieldCount: 6
        },
        provenance: {
            sourceCanonicalHash: "b".repeat(64),
            lastConfirmedAt: "2025-01-01T00:00:00.000Z"
        }
    });

    const result = buildPairMatchResult(profileA, profileB, {
        now: "2026-07-12T20:00:00.000Z"
    });

    assert.strictEqual(result.eligibility.eligible, true);
    assert.ok(result.score.overall >= 65);
    assert.strictEqual(result.classification, "low_confidence");
    assert.ok(["low", "insufficient"].includes(result.score.confidence));
});

test("pair comparison is symmetric and uses a stable ID", () => {
    const profileA = makeProfile();
    const profileB = makeProfile({
        playerId: "player-b",
        submissionId: "submission-b",
        identity: {
            displayName: "Player B",
            contactRef: "contact-player-b"
        },
        provenance: {
            sourceCanonicalHash: "b".repeat(64)
        }
    });

    const resultAB = buildPairMatchResult(profileA, profileB, {
        now: "2026-07-12T20:00:00.000Z"
    });
    const resultBA = buildPairMatchResult(profileB, profileA, {
        now: "2026-07-12T20:00:00.000Z"
    });

    assert.strictEqual(resultAB.matchId, resultBA.matchId);
    assert.deepStrictEqual(resultAB.members, resultBA.members);
    assert.strictEqual(resultAB.score.overall, resultBA.score.overall);
    assert.strictEqual(resultAB.classification, resultBA.classification);
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

    console.log(`\nPair compatibility smoke tests: ${passed}/${tests.length} passed.`);

    if (passed !== tests.length) {
        process.exitCode = 1;
    }
}

if (require.main === module) {
    run();
}

module.exports = {
    run
};
