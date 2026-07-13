const assert = require("assert");
const crypto = require("crypto");

const {
    buildGroupMatchResult
} = require("../../../src/matchmaking/groups/buildGroupMatchResult");

const {
    validateGroupMatchResult
} = require("../../../src/matchmaking/data/validators/validateGroupMatchResult");

function clone(value) {
    return JSON.parse(JSON.stringify(value));
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

function makeProfile(playerId, overrides = {}) {
    const now = "2026-07-12T20:00:00.000Z";

    const base = {
        schemaVersion: "1.0",
        playerId,
        submissionId: `submission-${playerId}`,
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
            displayName: playerId,
            contactRef: `contact-${playerId}`
        },
        logistics: {
            timezone: "America/Los_Angeles",
            playFormats: ["online"],
            availability: [
                { day: "tuesday", start: "18:00", end: "22:00" }
            ],
            frequencyPreferences: ["weekly"],
            sessionDuration: {
                minimumHours: 3,
                maximumHours: 4
            },
            scheduleFlexibility: "moderate"
        },
        commitment: {
            campaignLengths: ["long"],
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
            sourceCanonicalHash: crypto
                .createHash("sha256")
                .update(playerId)
                .digest("hex"),
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

const tests = [];

function test(name, fn) {
    tests.push({ name, fn });
}

test("three strongly aligned profiles produce a valid strong group", () => {
    const profiles = [
        makeProfile("player-a"),
        makeProfile("player-b"),
        makeProfile("player-c")
    ];

    const result = buildGroupMatchResult(profiles, {
        now: "2026-07-12T20:00:00.000Z"
    });

    const validation = validateGroupMatchResult(result);

    assert.strictEqual(validation.isValid, true, validation.errors.join("\n"));
    assert.strictEqual(result.eligibility.eligible, true);
    assert.strictEqual(result.pairResults.length, 3);
    assert.ok(result.score.overall >= 80);
    assert.strictEqual(result.classification, "strong_group");
});

test("a single blocked pair blocks the entire group", () => {
    const profiles = [
        makeProfile("player-a", {
            requirements: {
                hardConstraints: {
                    system: ["dnd_5e"]
                }
            }
        }),
        makeProfile("player-b"),
        makeProfile("player-c", {
            systems: {
                preferred: ["pathfinder_2e"],
                acceptable: [],
                excluded: ["dnd_5e"],
                openness: "preferred_only"
            }
        })
    ];

    const result = buildGroupMatchResult(profiles, {
        now: "2026-07-12T20:00:00.000Z"
    });

    assert.strictEqual(result.eligibility.eligible, false);
    assert.strictEqual(result.classification, "blocked_by_hard_conflict");
    assert.strictEqual(result.score.overall, null);
});

test("pairwise schedule overlap does not replace whole-group overlap", () => {
    const profiles = [
        makeProfile("player-a", {
            logistics: {
                availability: [
                    { day: "tuesday", start: "18:00", end: "20:00" },
                    { day: "wednesday", start: "18:00", end: "20:00" }
                ]
            }
        }),
        makeProfile("player-b", {
            logistics: {
                availability: [
                    { day: "tuesday", start: "18:00", end: "20:00" },
                    { day: "thursday", start: "18:00", end: "20:00" }
                ]
            }
        }),
        makeProfile("player-c", {
            logistics: {
                availability: [
                    { day: "wednesday", start: "18:00", end: "20:00" },
                    { day: "thursday", start: "18:00", end: "20:00" }
                ]
            }
        })
    ];

    const result = buildGroupMatchResult(profiles, {
        now: "2026-07-12T20:00:00.000Z"
    });

    assert.strictEqual(result.eligibility.eligible, false);
    assert.strictEqual(result.classification, "blocked_by_schedule");
    assert.ok(
        result.eligibility.blockingConflicts.some(
            (conflict) =>
                conflict.reason.includes("shared by every member")
        )
    );
});

test("candidate group size must satisfy every member", () => {
    const profiles = [
        makeProfile("player-a"),
        makeProfile("player-b"),
        makeProfile("player-c", {
            groupPreferences: {
                minimumPlayers: 4,
                preferredPlayers: 5,
                maximumPlayers: 6
            }
        })
    ];

    const result = buildGroupMatchResult(profiles, {
        now: "2026-07-12T20:00:00.000Z"
    });

    assert.strictEqual(result.eligibility.eligible, false);
    assert.strictEqual(result.classification, "blocked_by_group_size");
});

test("a weak eligible pair prevents a strong group classification", () => {
    const profiles = [
        makeProfile("player-a"),
        makeProfile("player-b"),
        makeProfile("player-c", {
            campaignPreferences: {
                experiences: ["investigation"],
                setups: ["political_intrigue"],
                tone: "horror",
                genres: ["cosmic_horror"],
                eras: ["modern"],
                aesthetics: ["gothic"],
                worldConditions: ["collapse"],
                environments: ["isolated_city"],
                gameplayInterests: ["investigation"],
                playerFantasy: ["survival"]
            },
            tablePreferences: {
                roleplayIntensity: "low",
                tacticalIntensity: "low",
                rulesApproach: "rules_light",
                communicationStyles: ["indirect"],
                voiceRequired: true,
                videoPreference: "required"
            },
            systems: {
                preferred: ["call_of_cthulhu"],
                acceptable: ["dnd_5e"],
                excluded: [],
                openness: "open_with_guidance"
            }
        })
    ];

    const result = buildGroupMatchResult(profiles, {
        now: "2026-07-12T20:00:00.000Z"
    });

    assert.strictEqual(result.eligibility.eligible, true);
    assert.notStrictEqual(result.classification, "strong_group");
    assert.ok(result.score.weakestPairScore < result.score.pairAverage);
});

test("group IDs and scores are deterministic regardless of member order", () => {
    const a = makeProfile("player-a");
    const b = makeProfile("player-b");
    const c = makeProfile("player-c");

    const resultABC = buildGroupMatchResult([a, b, c], {
        now: "2026-07-12T20:00:00.000Z"
    });

    const resultCAB = buildGroupMatchResult([c, a, b], {
        now: "2026-07-12T20:00:00.000Z"
    });

    assert.strictEqual(resultABC.matchId, resultCAB.matchId);
    assert.deepStrictEqual(resultABC.members, resultCAB.members);
    assert.strictEqual(resultABC.score.overall, resultCAB.score.overall);
    assert.strictEqual(resultABC.classification, resultCAB.classification);
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

    console.log(`\nGroup compatibility smoke tests: ${passed}/${tests.length} passed.`);

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
