const assert = require("assert");
const fs = require("fs");
const path = require("path");

const { processFormSubmission } = require("../../../src/intake");
const { validateCanonicalIntake } = require("../../../src/parsers/validateCanonicalIntake");
const {
    mapMatchmakingAddendum
} = require("../../../src/matchmaking/data/parsers/mapMatchmakingAddendum");
const {
    mergeMatchmakingAddendum
} = require("../../../src/matchmaking/data/parsers/mergeMatchmakingAddendum");
const {
    validateMatchmakingIntake
} = require("../../../src/matchmaking/data/validators/validateMatchmakingIntake");

const { spawnSync } = require("child_process");
const FIXTURE_DIR = path.resolve(
    __dirname,
    "../../../src/matchmaking/data/fixtures"
);

function loadFixture(filename) {
    const filePath = path.join(FIXTURE_DIR, filename);

    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing matchmaking smoke-test fixture: ${filePath}`);
    }

    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function normalizeForComparison(value) {
    return JSON.parse(JSON.stringify(value));
}

const tests = [];

function test(name, fn) {
    tests.push({ name, fn });
}

function assertIncludes(haystack, expected, message) {
    assert.ok(
        haystack.some((entry) => String(entry).includes(expected)),
        message || `Expected one entry to include: ${expected}`
    );
}

test("opted-in main intake maps and validates matchmaking data", () => {
    const raw = loadFixture("main-intake-opted-in.json");
    const { canonical } = processFormSubmission(raw);

    assert.ok(canonical.matchmaking, "Canonical intake should include matchmaking.");
    assert.strictEqual(canonical.matchmaking.participation.status, "opted_in");
    assert.strictEqual(canonical.matchmaking.participation.requested, true);
    assert.strictEqual(canonical.matchmaking.consent.matchmaking, true);
    assert.strictEqual(canonical.matchmaking.consent.profileRetention, true);
    assert.strictEqual(canonical.matchmaking.logistics.timezone, "America/Los_Angeles");
    assert.strictEqual(canonical.matchmaking.logistics.availability.length, 2);
    assert.deepStrictEqual(
        canonical.matchmaking.logistics.frequencyPreferences,
        ["weekly", "biweekly"]
    );
    assert.deepStrictEqual(canonical.matchmaking.logistics.sessionDuration, {
        minimumHours: 3,
        maximumHours: 4
    });
    assert.strictEqual(canonical.matchmaking.systems.openness, "open_with_guidance");
    assert.deepStrictEqual(canonical.matchmaking.groupPreferences, {
        minimumPlayers: 3,
        preferredPlayers: 4,
        maximumPlayers: 5
    });

    const canonicalValidation = validateCanonicalIntake(canonical);
    assert.strictEqual(
        canonicalValidation.isValid,
        true,
        canonicalValidation.errors.join("\n")
    );

    const matchmakingValidation = validateMatchmakingIntake(canonical.matchmaking);
    assert.strictEqual(
        matchmakingValidation.isValid,
        true,
        matchmakingValidation.errors.join("\n")
    );
});

test("declined main intake remains valid and does not require activation data", () => {
    const raw = loadFixture("main-intake-declined.json");
    const { canonical } = processFormSubmission(raw);

    assert.strictEqual(canonical.matchmaking.participation.status, "declined");
    assert.strictEqual(canonical.matchmaking.participation.requested, false);

    const canonicalValidation = validateCanonicalIntake(canonical);
    assert.strictEqual(
        canonicalValidation.isValid,
        true,
        canonicalValidation.errors.join("\n")
    );

    const matchmakingValidation = validateMatchmakingIntake(canonical.matchmaking);
    assert.strictEqual(
        matchmakingValidation.isValid,
        true,
        matchmakingValidation.errors.join("\n")
    );
});

test("valid addendum merges without changing campaign-domain data", () => {
    const baseRaw = loadFixture("main-intake-declined.json");
    const addendumRaw = loadFixture("addendum-opted-in.json");
    const { canonical: baseCanonical } = processFormSubmission(baseRaw);

    const preservedBefore = normalizeForComparison({
        preferences: baseCanonical.preferences,
        notes: baseCanonical.notes,
        boundaries: baseCanonical.boundaries,
        safety: baseCanonical.safety
    });

    const mappedAddendum = mapMatchmakingAddendum(addendumRaw);
    const merged = mergeMatchmakingAddendum(baseCanonical, mappedAddendum);

    const preservedAfter = normalizeForComparison({
        preferences: merged.preferences,
        notes: merged.notes,
        boundaries: merged.boundaries,
        safety: merged.safety
    });

    assert.deepStrictEqual(
        preservedAfter,
        preservedBefore,
        "Applying an addendum must not change campaign-domain data."
    );

    assert.strictEqual(merged.matchmaking.participation.status, "opted_in");
    assert.strictEqual(merged.matchmaking.participation.source, "addendum_form");
    assert.strictEqual(
        merged.matchmaking.participation.submissionReference,
        "existing-applicant"
    );
    assert.strictEqual(merged.matchmaking.logistics.availability.length, 2);

    const canonicalValidation = validateCanonicalIntake(merged);
    assert.strictEqual(
        canonicalValidation.isValid,
        true,
        canonicalValidation.errors.join("\n")
    );

    const matchmakingValidation = validateMatchmakingIntake(merged.matchmaking);
    assert.strictEqual(
        matchmakingValidation.isValid,
        true,
        matchmakingValidation.errors.join("\n")
    );
});

test("incomplete addendum returns semantic errors without mutating the source canonical intake", () => {
    const baseRaw = loadFixture("main-intake-declined.json");
    const addendumRaw = loadFixture("addendum-incomplete.json");
    const { canonical: baseCanonical } = processFormSubmission(baseRaw);
    const sourceSnapshot = clone(baseCanonical);

    const mappedAddendum = mapMatchmakingAddendum(addendumRaw);
    const merged = mergeMatchmakingAddendum(baseCanonical, mappedAddendum);
    const matchmakingValidation = validateMatchmakingIntake(merged.matchmaking);

    assert.deepStrictEqual(
        baseCanonical,
        sourceSnapshot,
        "Merging must not mutate the original canonical intake."
    );
    assert.strictEqual(matchmakingValidation.isValid, false);
    assertIncludes(
        matchmakingValidation.errors,
        "logistics.availability[0].end: expected HH:MM time."
    );
    assertIncludes(
        matchmakingValidation.warnings,
        "profile cannot become active without retention consent"
    );

    const canonicalValidation = validateCanonicalIntake(merged);
    assert.strictEqual(
        canonicalValidation.isValid,
        true,
        "Semantic matchmaking incompleteness should not invalidate canonical structure.\n" +
            canonicalValidation.errors.join("\n")
    );
});

test("legacy canonical intake without matchmaking still validates", () => {
    const raw = loadFixture("main-intake-declined.json");
    const { canonical } = processFormSubmission(raw);
    const legacyCanonical = clone(canonical);

    delete legacyCanonical.matchmaking;

    const validation = validateCanonicalIntake(legacyCanonical);
    assert.strictEqual(validation.isValid, true, validation.errors.join("\n"));
});

test("matchmaking data does not interfere with campaign selection", () => {
    const {
        buildTranslatorInput
    } = require("../../../src/intake/buildTranslatorInput");

    const {
        translateFormAnswers
    } = require("../../../src/parsers/translateFormAnswers");

    const {
        resolveCampaignContext
    } = require("../../../src/resolvers/resolveCampaignContext");

    const {
        selectCampaignDirections
    } = require("../../../src/selectors/selectCampaignDirections");

    const fixtures = [
        loadFixture("main-intake-opted-in.json"),
        loadFixture("main-intake-declined.json")
    ];

    for (const rawSubmission of fixtures) {
        const { canonical } = processFormSubmission(rawSubmission);

        const canonicalValidation =
            validateCanonicalIntake(canonical);

        assert.strictEqual(
            canonicalValidation.isValid,
            true,
            canonicalValidation.errors.join("\n")
        );

        const translatorInput =
            buildTranslatorInput(canonical);

        const translated =
            translateFormAnswers(translatorInput);

        const campaignContext =
            resolveCampaignContext({
                normalizedIntake: canonical,
                translatedForm: translated,
                rawAnswers: rawSubmission
            });

        const selected =
            selectCampaignDirections(
                campaignContext.candidateBuckets,
                canonical
            );

        assert.ok(
            selected.primary,
            "Primary campaign direction should be produced."
        );

        assert.ok(
            selected.adjacent,
            "Adjacent campaign direction should be produced."
        );

        assert.ok(
            selected.wildcard,
            "Wildcard campaign direction should be produced."
        );
    }
});

function run() {
    let passed = 0;
    const failures = [];

    for (const { name, fn } of tests) {
        try {
            fn();
            passed += 1;
            console.log(`✅ ${name}`);
        } catch (error) {
            failures.push({ name, error });
            console.error(`❌ ${name}`);
            console.error(error.stack || error.message || error);
        }
    }

    console.log(`\nMatchmaking intake smoke tests: ${passed}/${tests.length} passed.`);

    if (failures.length > 0) {
        const error = new Error(`${failures.length} matchmaking smoke test(s) failed.`);
        error.failures = failures;
        throw error;
    }

    return {
        passed,
        total: tests.length
    };
}

if (require.main === module) {
    try {
        run();
    } catch (error) {
        process.exitCode = 1;
    }
}

module.exports = {
    run
};
