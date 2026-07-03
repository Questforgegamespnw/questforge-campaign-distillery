#!/usr/bin/env node

const assert = require("node:assert/strict");
const {
    TEEN_VOICE_RULES,
    KIDS_VOICE_RULES,
    applyYouthVoiceLayer,
    applyYouthVoiceLayerWithMetadata,
    normalizeProfile
} = require("../../../src/voice/youthVoiceLayer");

assert.equal(Array.isArray(TEEN_VOICE_RULES), true);
assert.equal(Array.isArray(KIDS_VOICE_RULES), true);
assert.equal(TEEN_VOICE_RULES.length > 0, true);
assert.equal(KIDS_VOICE_RULES.length > 0, true);

assert.equal(normalizeProfile("adult"), "standard");
assert.equal(normalizeProfile("standard"), "standard");
assert.equal(normalizeProfile("youth"), "youth");
assert.equal(normalizeProfile("kids"), "kids");

{
    const input = "The group faces no clean option as everything is falling apart.";
    assert.equal(
        applyYouthVoiceLayer(input, { experienceProfile: "standard" }),
        input,
        "Standard profile should not receive youth voice rewrites."
    );
}

{
    const input = "The group faces no clean option as everything is falling apart and the world is already in decline.";
    const result = applyYouthVoiceLayerWithMetadata(input, { experienceProfile: "youth" });

    assert.equal(/no clean option/i.test(result.text), false);
    assert.equal(/falling apart/i.test(result.text), false);
    assert.equal(/world is already in decline/i.test(result.text), false);
    assert.match(result.text, /no easy option/i);
    assert.match(result.text, /under real strain/i);
    assert.match(result.text, /world is already under strain/i);
    assert.equal(result.appliedRuleIds.includes("no_clean_options_to_no_easy_options"), true);
}

{
    const input = "The story says identity becomes unstable and personhood itself becomes unstable.";
    const output = applyYouthVoiceLayer(input, { experienceProfile: "youth" });

    assert.equal(/identity becomes unstable/i.test(output), false);
    assert.equal(/personhood itself becomes unstable/i.test(output), false);
    assert.match(output, /identity becomes uncertain/i);
    assert.match(output, /what makes someone who they are becomes uncertain/i);
}

{
    const input = "A dangerous monster leaves damage behind, but teamwork can help everyone survive the setback.";
    const result = applyYouthVoiceLayerWithMetadata(input, { experienceProfile: "kids" });

    assert.equal(/dangerous|monster|damage\b/i.test(result.text), false);
    assert.match(result.text, /challenging/i);
    assert.match(result.text, /creature/i);
    assert.match(result.text, /trouble/i);
    assert.equal(result.appliedRuleIds.includes("dangerous_to_challenging"), true);
    assert.equal(result.appliedRuleIds.includes("monster_to_creature"), true);
}

{
    const input = "The campaign uses fragmented_self and entropy_decay as core replacements.";
    const output = applyYouthVoiceLayer(input, { experienceProfile: "kids" });

    assert.equal(
        /fragmented_self|entropy_decay/.test(output),
        true,
        "Voice layer must not perform Core Frame substitution or ID cleanup."
    );
}

console.log("PASS youth voice layer");
