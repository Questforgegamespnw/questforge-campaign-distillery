#!/usr/bin/env node

const assert = require("node:assert/strict");

const { mapFormSubmission } = require("../../../src/intake/mapFormSubmission");
const { normalizeSubmission } = require("../../../src/intake/normalizeSubmission");
const { toCanonicalIntake } = require("../../../src/intake/toCanonicalIntake");
const { buildTranslatorInput } = require("../../../src/intake/buildTranslatorInput");
const { translateFormAnswers } = require("../../../src/parsers/translateFormAnswers");

function run(raw) {
  const mapped = mapFormSubmission(raw);
  const normalized = normalizeSubmission(mapped);
  const canonical = toCanonicalIntake(normalized);
  const translatorInput = buildTranslatorInput(canonical);
  const translated = translateFormAnswers(translatorInput);

  return { mapped, normalized, canonical, translatorInput, translated };
}

{
  const result = run({
    name: "Adult Clean",
    email: "adult@example.com",
    respondent_type: "individual",
    current_group_size: "1",
    desired_group_size: "5",
    audience: "Adults",
    youth_mode: "Yes",
    experience: ["Solving mysteries and uncovering secrets"]
  });

  assert.equal(result.canonical.group.respondentType, "individual");
  assert.equal(result.canonical.group.currentGroupSize, "1");
  assert.equal(result.canonical.group.desiredGroupSize, "5");
  assert.equal(result.canonical.group.groupSize, "Current: 1 | Desired: 5");
  assert.equal(result.canonical.safety.experienceProfile, "standard");
  assert.equal(result.canonical.safety.contentSafetyMode, "family_friendly");
  assert.equal(result.translated.experienceProfile, "standard");
}

{
  const result = run({
    name: "Teen Table",
    email: "teen@example.com",
    respondent_type: "existing_group",
    current_group_size: "4",
    desired_group_size: "4",
    audience: "Teens (13–17)",
    age_band: "teens_14_17",
    experience: ["Big heroic action and epic moments"]
  });

  assert.equal(result.canonical.group.respondentType, "existing_group");
  assert.equal(result.canonical.safety.experienceProfile, "youth");
  assert.equal(result.canonical.safety.contentSafetyMode, "standard");
  assert.equal(result.translated.experienceProfile, "youth");
}

{
  const result = run({
    name: "Kids Table",
    email: "kids@example.com",
    respondent_type: "group_organizer",
    current_group_size: "3",
    desired_group_size: "5",
    audience: "Kids (under 13)",
    age_band: "kids_8_10",
    experience: ["Exploration and discovering strange places"]
  });

  assert.equal(result.canonical.group.respondentType, "group_organizer");
  assert.equal(result.canonical.safety.experienceProfile, "kids");
  assert.equal(result.canonical.safety.contentSafetyMode, "full_kid_safe");
  assert.equal(result.translated.experienceProfile, "kids");
}

{
  const result = run({
    name: "Legacy",
    email: "legacy@example.com",
    group_size: "4–6 players",
    audience: "Adults",
    youth_mode: "No",
    experience: ["Political tension, factions, and tough choices"]
  });

  assert.equal(result.canonical.group.respondentType, "");
  assert.equal(result.canonical.group.groupSize, "4–6 players");
  assert.equal(result.canonical.safety.experienceProfile, "standard");
  assert.equal(result.canonical.safety.contentSafetyMode, "standard");
  assert.equal(result.translated.experienceProfile, "standard");
}

console.log("PASS testIntakeGroupContextAndProfile");
