const assert = require("assert");
const fs = require("fs");
const path = require("path");

const { processFormSubmission } = require("../../../src/intake");
const { buildCompatibilityProfile } = require("../../../src/matchmaking/profiles/buildCompatibilityProfile");
const { updateCompatibilityProfile } = require("../../../src/matchmaking/profiles/updateCompatibilityProfile");
const {
    pauseProfile,
    activateProfile,
    markProfileMatched,
    archiveProfile,
    expireProfile,
    reconfirmProfile
} = require("../../../src/matchmaking/profiles/profileStatus");
const { validateCompatibilityProfile } = require("../../../src/matchmaking/data/validators/validateCompatibilityProfile");

const FIXTURE_DIR = path.resolve(
    __dirname,
    "../../../src/matchmaking/data/fixtures"
);

function loadFixture(name) {
    return JSON.parse(fs.readFileSync(path.join(FIXTURE_DIR, name), "utf8"));
}

const tests = [];
function test(name, fn) { tests.push({ name, fn }); }

const NOW = "2026-07-12T12:00:00.000Z";

test("opted-in complete intake builds a valid active profile", () => {
    const { canonical } = processFormSubmission(loadFixture("main-intake-opted-in.json"));
    const profile = buildCompatibilityProfile(canonical, {
        playerId: "player-test-001",
        submissionId: "submission-test-001",
        contactRef: "contact-player-test-001",
        now: NOW
    });

    assert.ok(profile);
    assert.strictEqual(profile.status, "active");
    assert.strictEqual(profile.provenance.profileVersion, 1);
    assert.ok(profile.provenance.sourceCanonicalHash);
    assert.ok(profile.shareableSummary.availabilitySummary);
    assert.strictEqual(profile.identity.contactRef.includes("@"), false);

    const validation = validateCompatibilityProfile(profile);
    assert.strictEqual(validation.isValid, true, validation.errors.join("\n"));
});

test("declined intake does not create an operational profile", () => {
    const { canonical } = processFormSubmission(loadFixture("main-intake-declined.json"));
    const profile = buildCompatibilityProfile(canonical, { now: NOW });
    assert.strictEqual(profile, null);
});

test("incomplete opted-in intake creates a paused profile", () => {
    const raw = loadFixture("main-intake-opted-in.json");
    delete raw.matchmaking_timezone;
    delete raw.matchmaking_availability_day;
    delete raw.matchmaking_availability_start;
    delete raw.matchmaking_availability_end;

    const { canonical } = processFormSubmission(raw);
    const profile = buildCompatibilityProfile(canonical, {
        playerId: "player-test-incomplete",
        now: NOW
    });

    assert.ok(profile);
    assert.strictEqual(profile.status, "paused");
    assert.ok(profile.completeness.missingRequiredFields.includes("logistics.timezone"));
    assert.ok(profile.completeness.missingRequiredFields.includes("logistics.availability"));
});

test("lifecycle operations increment profile version", () => {
    const { canonical } = processFormSubmission(loadFixture("main-intake-opted-in.json"));
    const original = buildCompatibilityProfile(canonical, {
        playerId: "player-lifecycle",
        now: NOW
    });

    const paused = pauseProfile(original, "Temporary pause.", { now: "2026-07-13T12:00:00.000Z" });
    assert.strictEqual(paused.status, "paused");
    assert.strictEqual(paused.provenance.profileVersion, 2);

    const active = activateProfile(paused, { now: "2026-07-14T12:00:00.000Z" });
    assert.strictEqual(active.status, "active");
    assert.strictEqual(active.provenance.profileVersion, 3);

    const matched = markProfileMatched(active, "match-001", { now: "2026-07-15T12:00:00.000Z" });
    assert.strictEqual(matched.status, "matched");
    assert.strictEqual(matched.lifecycle.matchedReference, "match-001");

    const archived = archiveProfile(matched, "Closed record.", { now: "2026-07-16T12:00:00.000Z" });
    assert.strictEqual(archived.status, "archived");

    const expired = expireProfile(active, undefined, { now: "2026-07-17T12:00:00.000Z" });
    assert.strictEqual(expired.status, "expired");

    const reconfirmed = reconfirmProfile(expired, { now: "2026-07-18T12:00:00.000Z" });
    assert.strictEqual(reconfirmed.provenance.lastConfirmedAt, "2026-07-18T12:00:00.000Z");
});

test("updated canonical intake rebuilds the profile and increments version", () => {
    const raw = loadFixture("main-intake-opted-in.json");
    const { canonical } = processFormSubmission(raw);
    const original = buildCompatibilityProfile(canonical, {
        playerId: "player-update",
        now: NOW
    });

    const updatedCanonical = JSON.parse(JSON.stringify(canonical));
    updatedCanonical.matchmaking.logistics.timezone = "America/Denver";

    const updated = updateCompatibilityProfile(original, updatedCanonical, {
        now: "2026-07-13T12:00:00.000Z"
    });

    assert.strictEqual(updated.playerId, original.playerId);
    assert.strictEqual(updated.provenance.profileVersion, 2);
    assert.strictEqual(updated.provenance.createdAt, original.provenance.createdAt);
    assert.strictEqual(updated.logistics.timezone, "America/Denver");
    assert.notStrictEqual(updated.provenance.sourceCanonicalHash, original.provenance.sourceCanonicalHash);
});

test("shareable summary does not expose private contact or raw avoid text", () => {
    const raw = loadFixture("main-intake-opted-in.json");
    raw.avoid = "Private safety wording that should stay operator-only";
    const { canonical } = processFormSubmission(raw);
    const profile = buildCompatibilityProfile(canonical, {
        playerId: "player-privacy",
        contactRef: "contact-player-privacy",
        now: NOW
    });

    const rendered = JSON.stringify(profile.shareableSummary);
    assert.strictEqual(rendered.includes("contact-player-privacy"), false);
    assert.strictEqual(rendered.includes("Private safety wording"), false);
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

    console.log(`\nCompatibility profile smoke tests: ${passed}/${tests.length} passed.`);
    if (passed !== tests.length) process.exitCode = 1;
}

if (require.main === module) run();

module.exports = { run };
