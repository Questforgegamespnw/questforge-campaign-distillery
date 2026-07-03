const assert = require("node:assert/strict");

const {
    finalizeExperienceProfile,
    getProfileRules
} = require("../../../src/resolvers/resolveCampaignContext");

const {
    applyFrameCrosswalk
} = require("../../../src/resolvers/frameCrosswalk");

function run() {
    assert.equal(
        finalizeExperienceProfile({
            normalizedIntake: { experienceProfile: "standard" },
            rawAnswers: { youth_mode: "yes" }
        }),
        "standard",
        "Canonical profile must override legacy raw inference."
    );

    assert.equal(
        finalizeExperienceProfile({
            normalizedIntake: { experienceProfile: "youth" }
        }),
        "youth"
    );

    assert.equal(
        finalizeExperienceProfile({
            normalizedIntake: { experienceProfile: "kids" }
        }),
        "kids"
    );

    assert.equal(
        finalizeExperienceProfile({
            rawAnswers: { youth_mode: "no", audience: "Adults" }
        }),
        "standard",
        'The string "no" must not activate a youth-safe profile.'
    );

    assert.equal(
        finalizeExperienceProfile({
            rawAnswers: { audience: "Teens (13–17)" }
        }),
        "youth"
    );

    assert.equal(
        finalizeExperienceProfile({
            rawAnswers: { audience: "Kids (under 13)" }
        }),
        "kids"
    );

    assert.equal(getProfileRules("youth").coreFramePool.length > 0, true);
    assert.equal(getProfileRules("kids").profile, "kids");

    const candidates = {
        coreFrames: [{ id: "hidden_truth", weight: 2 }],
        systemFrames: [],
        toneSkins: []
    };

    assert.deepEqual(
        applyFrameCrosswalk({
            experienceProfile: "youth",
            candidateBuckets: candidates
        }),
        candidates,
        "Youth should preserve adult candidates during the interim bridge."
    );

    const kids = applyFrameCrosswalk({
        experienceProfile: "kids",
        candidateBuckets: candidates
    });

    assert.deepEqual(kids.coreFrames, [
        { id: "something_is_lost_or_missing", weight: 6 },
        { id: "the_misunderstood_problem", weight: 4 }
    ]);

    console.log("PASS three-way experience profile bridge");
}

run();
