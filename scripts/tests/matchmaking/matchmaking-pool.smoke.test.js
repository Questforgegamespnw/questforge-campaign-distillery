const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");

const {
    saveCompatibilityProfile
} = require("../../../src/matchmaking/storage/saveCompatibilityProfile");

const {
    loadCompatibilityProfile
} = require("../../../src/matchmaking/storage/loadCompatibilityProfile");

const {
    rebuildMatchmakingPoolIndex
} = require("../../../src/matchmaking/storage/rebuildMatchmakingPoolIndex");

const {
    getActiveProfiles
} = require("../../../src/matchmaking/pool/getActiveProfiles");

const {
    compareProfileAgainstPool
} = require("../../../src/matchmaking/pool/compareProfileAgainstPool");

const {
    isPairEvaluationStale
} = require("../../../src/matchmaking/pool/isPairEvaluationStale");

const {
    loadPairEvaluation
} = require("../../../src/matchmaking/storage/loadPairEvaluation");

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

function withTempStorage(fn) {
    const storageRoot = fs.mkdtempSync(
        path.join(os.tmpdir(), "qf-matchmaking-pool-")
    );

    try {
        return fn(storageRoot);
    } finally {
        fs.rmSync(storageRoot, { recursive: true, force: true });
    }
}

const tests = [];

function test(name, fn) {
    tests.push({ name, fn });
}

test("profiles save, load, and rebuild a privacy-safe pool index", () =>
    withTempStorage((storageRoot) => {
        const profile = makeProfile("player-a");
        saveCompatibilityProfile(profile, { storageRoot });

        const loaded = loadCompatibilityProfile("player-a", { storageRoot });
        assert.strictEqual(loaded.profile.playerId, "player-a");

        const rebuilt = rebuildMatchmakingPoolIndex({
            storageRoot,
            now: "2026-07-12T20:00:00.000Z"
        });

        assert.strictEqual(rebuilt.index.profiles.length, 1);

        const serialized = JSON.stringify(rebuilt.index);
        assert.ok(!serialized.includes("contact-player-a"));
        assert.ok(!serialized.includes("operatorPrivateNotes"));
    })
);

test("active pool excludes paused profiles", () =>
    withTempStorage((storageRoot) => {
        saveCompatibilityProfile(makeProfile("player-a"), { storageRoot });
        saveCompatibilityProfile(makeProfile("player-b", {
            status: "paused",
            statusReason: "Applicant requested pause."
        }), { storageRoot });

        const pool = getActiveProfiles({ storageRoot });

        assert.deepStrictEqual(
            pool.activeProfiles.map((profile) => profile.playerId),
            ["player-a"]
        );
        assert.strictEqual(pool.excludedProfiles.length, 1);
    })
);

test("pool comparison excludes self and separates viable from blocked results", () =>
    withTempStorage((storageRoot) => {
        const target = makeProfile("player-a");
        const viable = makeProfile("player-b");
        const blocked = makeProfile("player-c", {
            logistics: {
                availability: [
                    { day: "friday", start: "18:00", end: "22:00" }
                ]
            }
        });

        for (const profile of [target, viable, blocked]) {
            saveCompatibilityProfile(profile, { storageRoot });
        }

        const result = compareProfileAgainstPool(target, {
            storageRoot,
            now: "2026-07-12T20:00:00.000Z"
        });

        assert.strictEqual(result.poolStats.evaluated, 2);
        assert.strictEqual(result.viableMatches.length, 1);
        assert.strictEqual(result.blockedComparisons.length, 1);

        assert.ok(
            result.viableMatches.every(
                (match) => !match.members.every((id) => id === "player-a")
            )
        );
    })
);

test("pair evaluations use stable IDs and are persisted once", () =>
    withTempStorage((storageRoot) => {
        const a = makeProfile("player-a");
        const b = makeProfile("player-b");

        saveCompatibilityProfile(a, { storageRoot });
        saveCompatibilityProfile(b, { storageRoot });

        const first = compareProfileAgainstPool(a, {
            storageRoot,
            now: "2026-07-12T20:00:00.000Z"
        });

        const second = compareProfileAgainstPool(b, {
            storageRoot,
            now: "2026-07-12T20:00:00.000Z"
        });

        assert.strictEqual(
            first.viableMatches[0].matchId,
            second.viableMatches[0].matchId
        );

        const evaluationDirectory = path.join(
            storageRoot,
            "evaluations",
            "pairs"
        );

        const files = fs.readdirSync(evaluationDirectory)
            .filter((name) => name.endsWith(".json"));

        assert.strictEqual(files.length, 1);

        const loaded = loadPairEvaluation(
            first.viableMatches[0].matchId,
            { storageRoot }
        );

        assert.strictEqual(loaded.validation.isValid, true);
    })
);

test("profile and scoring-model changes mark evaluations stale", () =>
    withTempStorage((storageRoot) => {
        const a = makeProfile("player-a");
        const b = makeProfile("player-b");

        saveCompatibilityProfile(a, { storageRoot });
        saveCompatibilityProfile(b, { storageRoot });

        const comparison = compareProfileAgainstPool(a, {
            storageRoot,
            now: "2026-07-12T20:00:00.000Z",
            scoringModelVersion: "1.0"
        });

        const evaluation = comparison.viableMatches[0];

        const currentProfiles = {
            "player-a": makeProfile("player-a", {
                provenance: { profileVersion: 2 }
            }),
            "player-b": b
        };

        const stale = isPairEvaluationStale(
            evaluation,
            currentProfiles,
            { scoringModelVersion: "2.0" }
        );

        assert.strictEqual(stale.stale, true);
        assert.ok(stale.reasons.length >= 2);
    })
);

test("viable results are ranked deterministically", () =>
    withTempStorage((storageRoot) => {
        const target = makeProfile("player-a");
        const strong = makeProfile("player-b");
        const weaker = makeProfile("player-c", {
            campaignPreferences: {
                tone: "horror",
                gameplayInterests: ["investigation"],
                aesthetics: ["gothic"]
            },
            tablePreferences: {
                roleplayIntensity: "moderate",
                tacticalIntensity: "low",
                rulesApproach: "flexible",
                communicationStyles: ["collaborative"]
            }
        });

        for (const profile of [target, strong, weaker]) {
            saveCompatibilityProfile(profile, { storageRoot });
        }

        const result = compareProfileAgainstPool(target, {
            storageRoot,
            now: "2026-07-12T20:00:00.000Z"
        });

        assert.strictEqual(result.viableMatches.length, 2);
        assert.ok(
            result.viableMatches[0].score.overall >=
            result.viableMatches[1].score.overall
        );
        assert.strictEqual(
            result.viableMatches[0].members.includes("player-b"),
            true
        );
    })
);

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

    console.log(`\nMatchmaking pool smoke tests: ${passed}/${tests.length} passed.`);

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
