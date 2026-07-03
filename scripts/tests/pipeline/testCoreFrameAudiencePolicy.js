#!/usr/bin/env node

const assert = require("node:assert/strict");
const coreFrames = require("../../../src/data/coreFrames");
const {
    CORE_FRAME_AUDIENCE_POLICY,
    getMissingCoreFrameAudiencePolicies,
    hasCompleteCoreFrameAudiencePolicy,
    getCoreFrameAudiencePolicy,
    applyCoreFrameAudiencePolicyToCandidates
} = require("../../../src/resolvers/coreFrameAudiencePolicy");
const { applyFrameCrosswalk } = require("../../../src/resolvers/frameCrosswalk");

const coreFrameIds = coreFrames.map((entry) => entry.id);

assert.equal(
    hasCompleteCoreFrameAudiencePolicy(coreFrameIds),
    true,
    "Every standard Core Frame must have youth and kids policy entries."
);

assert.deepEqual(
    getMissingCoreFrameAudiencePolicies(coreFrameIds),
    [],
    "No standard Core Frame should be missing audience policy."
);

for (const id of coreFrameIds) {
    assert.ok(CORE_FRAME_AUDIENCE_POLICY[id], `${id} must have a policy object`);
    assert.ok(CORE_FRAME_AUDIENCE_POLICY[id].youth, `${id} must have youth policy`);
    assert.ok(CORE_FRAME_AUDIENCE_POLICY[id].kids, `${id} must have kids policy`);
}

assert.equal(
    getCoreFrameAudiencePolicy("hidden_truth", "youth").action,
    "preserve",
    "Youth should preserve Hidden Truth as a meaningful mystery frame."
);

{
    const result = applyCoreFrameAudiencePolicyToCandidates(
        [{ id: "hidden_truth", weight: 2 }],
        "youth"
    );

    assert.deepEqual(result.coreFrames, [
        { id: "hidden_truth", weight: 2 }
    ]);
}

{
    const result = applyCoreFrameAudiencePolicyToCandidates(
        [{ id: "fragmented_self", weight: 10 }],
        "youth"
    );

    assert.deepEqual(result.coreFrames, [
        { id: "fragmented_self", weight: 5.5 }
    ]);
    assert.equal(result.appliedPolicies[0].action, "downweight");
}

{
    const result = applyCoreFrameAudiencePolicyToCandidates(
        [
            { id: "fragmented_self", weight: 10 },
            { id: "what_is_humanity", weight: 10 }
        ],
        "youth"
    );

    assert.ok(
        result.appliedCombinationRuleIds.includes("youth_identity_destabilization_stack"),
        "Youth identity destabilization stack should trigger a combination rule."
    );

    assert.deepEqual(result.coreFrames, [
        { id: "what_is_humanity", weight: 3 },
        { id: "fragmented_self", weight: 2.75 }
    ]);
}

{
    const result = applyCoreFrameAudiencePolicyToCandidates(
        [{ id: "hidden_truth", weight: 2 }],
        "kids"
    );

    assert.deepEqual(result.coreFrames, [
        { id: "something_is_lost_or_missing", weight: 6 },
        { id: "the_misunderstood_problem", weight: 4 }
    ]);
}

{
    const result = applyFrameCrosswalk({
        experienceProfile: "kids",
        candidateBuckets: {
            coreFrames: [{ id: "entropy_decay", weight: 3 }],
            systemFrames: [],
            toneSkins: []
        }
    });

    assert.deepEqual(result.coreFrames, [
        { id: "fixing_whats_broken", weight: 9 },
        { id: "helping_those_in_need", weight: 3 }
    ]);
}

console.log("PASS core frame audience policy");
