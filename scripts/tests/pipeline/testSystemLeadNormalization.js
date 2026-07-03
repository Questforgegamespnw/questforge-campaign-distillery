#!/usr/bin/env node

const assert = require("node:assert/strict");
const {
  normalizeSystemLead,
  applySystemLeadRules,
  SYSTEM_LEAD_RULES
} = require("../../../src/renderers/pitchCleanup");

const expectedCases = [
  [
    "Players assemble scattered clues into a larger understanding rather than following a single linear trail",
    "following scattered clues and slowly piecing them together"
  ],
  [
    "Players never have the full picture, and uncertainty becomes part of the tension.",
    "working with incomplete information and mounting uncertainty"
  ],
  [
    "The players never have enough time, safety, light, healing, or supplies, so every decision costs something",
    "making hard calls when time, safety, and supplies are always running short"
  ],
  [
    "The longer events continue or the more certain actions are taken, the worse outcomes become",
    "managing problems before they spiral"
  ],
  [
    "Movement, territory, chokepoints, and positioning become central to how encounters are won or lost",
    "managing movement, territory, chokepoints, and positioning"
  ],
  [
    "Power changes the characters over time, creating tradeoffs between strength, identity, and consequence",
    "power changing the characters over time"
  ],
  [
    "dealing with a world that keeps reacting to what the players do",
    "a world reacting to what the players do"
  ],
  [
    "watching choices and alliances reshape how the world responds",
    "choices and alliances reshaping how the world responds"
  ]
];

for (const [input, expected] of expectedCases) {
  assert.equal(normalizeSystemLead(input), expected, `Unexpected normalized system lead for: ${input}`);
}

assert.equal(
  normalizeSystemLead("  following scattered clues and slowly piecing them together.  "),
  "following scattered clues and slowly piecing them together",
  "Existing normalized text should only receive surface whitespace/period cleanup."
);

const ruleIds = SYSTEM_LEAD_RULES.map((rule) => rule.id);
assert.equal(
  new Set(ruleIds).size,
  ruleIds.length,
  "Every system lead cleanup rule should have a unique id."
);

const debugResult = applySystemLeadRules(
  "The world responds to player action over time, with areas, threats, and NPC behavior changing in reaction"
);

assert.equal(debugResult.text, "a world reacting to what the players do");
assert.deepEqual(debugResult.appliedRuleIds, ["living_world_reaction"]);

console.log("PASS system lead normalization rule pipeline");
