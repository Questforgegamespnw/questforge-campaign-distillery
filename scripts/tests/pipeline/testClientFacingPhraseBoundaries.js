#!/usr/bin/env node

const assert = require("node:assert/strict");

const {
  cleanClientFacingText,
  applyClientFacingBoundaryRules,
  CLIENT_FACING_BOUNDARY_RULES
} = require("../../../src/renderers/pitchCleanup");

assert.equal(Array.isArray(CLIENT_FACING_BOUNDARY_RULES), true);
assert.equal(CLIENT_FACING_BOUNDARY_RULES.length > 0, true);

{
  const result = applyClientFacingBoundaryRules(
    "The adjacent direction shifts play toward hidden_truth. The wildcard follows entropy_decay."
  );

  assert.equal(result.appliedRuleIds.includes("adjacent_direction_to_version"), true);
  assert.equal(result.appliedRuleIds.includes("wildcard_as_label"), true);
  assert.equal(result.appliedRuleIds.includes("frame_id_snake_case_cleanup"), true);
  assert.match(result.text, /this version shifts play toward hidden truth/i);
  assert.match(result.text, /the bolder version follows entropy decay/i);
}

{
  const cleaned = cleanClientFacingText(
    "The primary selection combines core frame entropy_decay with system frame clue_web."
  );

  assert.equal(/primary selection/i.test(cleaned), false);
  assert.equal(/core frame/i.test(cleaned), false);
  assert.equal(/system frame/i.test(cleaned), false);
  assert.equal(/entropy_decay|clue_web/.test(cleaned), false);
  assert.match(cleaned, /the campaign combines/i);
  assert.match(cleaned, /entropy decay/i);
  assert.match(cleaned, /clue web/i);
}

{
  const cleaned = cleanClientFacingText(
    "This output reflects renderer adjudication, candidate buckets, suppressed signals, and confidence score."
  );

  assert.equal(/output reflects/i.test(cleaned), false);
  assert.equal(/renderer|adjudication|candidate buckets|suppressed signals|confidence score/i.test(cleaned), false);
  assert.match(cleaned, /this campaign emphasizes/i);
}

{
  const safePhrase = cleanClientFacingText(
    "The group uncovers a hidden pattern while pressure builds around every choice."
  );

  assert.equal(
    safePhrase,
    "The group uncovers a hidden pattern while pressure builds around every choice."
  );
}

console.log("PASS client-facing phrase boundaries");
