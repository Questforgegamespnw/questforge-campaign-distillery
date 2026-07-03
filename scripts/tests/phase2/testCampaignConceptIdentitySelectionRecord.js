#!/usr/bin/env node

const assert = require("node:assert/strict");

const {
  isIdentitySelectionRecord,
  resolveIdentitySource,
  createDefaultHandoff,
  validateHandoffAgainstIdentity,
  buildInputFromHandoff,
  validateCampaignConceptInput
} = require("../../../scripts/shared/campaignConceptRoundTripUtils");

function samplePitch(title = "The Hidden Road") {
  return {
    title,
    pitch: "A focused identity pitch about mystery, teamwork, and discovery.",
    about: "The campaign is about uncovering a hidden truth while keeping the group moving forward together.",
    playersDo: "Players investigate strange places, make careful choices, and protect one another under pressure.",
    hook: "The first clue is already in their hands. The question is who else knows it exists."
  };
}

function sampleIdentitySelectionRecord() {
  const pitch = samplePitch();

  return {
    recordType: "identity_selection_record",
    schemaVersion: "0.1.0",
    submissionId: "submission-alpha",
    selectedIdentityDirection: "adjacent",
    selectedIdentityPitch: pitch,
    identitySummary: {
      identityTitle: pitch.title,
      identityPitch: pitch.pitch,
      corePromise: pitch.about,
      playEmphasis: [pitch.playersDo],
      hook: pitch.hook,
      tone: ["Hopeful mystery with manageable pressure"],
      genre: ["Fantasy adventure"],
      environment: ["Ruined civilization"],
      mustPreserve: ["teamwork", "mystery"],
      mustAvoid: ["heavy horror"]
    },
    selectionRecord: {
      selectedDirection: "adjacent",
      likedElements: ["the mystery angle"],
      elementsToAvoid: ["too much horror"],
      requestedChanges: "Make the exploration a little stronger.",
      additionalNotes: "Client preferred the adjacent option.",
      mustPreserve: ["teamwork"],
      flexible: ["exact setting details"],
      mustAvoid: ["heavy horror"]
    },
    clientResponse: {
      selectedBy: "Client",
      selectedAt: "2026-07-03T00:00:00.000Z",
      notes: "Client preferred the adjacent option.",
      liked: "the mystery angle",
      concerns: "too much horror",
      requestedAdjustments: "Make the exploration a little stronger."
    },
    preservationGuidance: {
      mustPreserve: ["teamwork"],
      flexible: ["exact setting details"],
      avoid: ["heavy horror"]
    },
    intakeSummary: {
      canonicalSummary: "A group wants hopeful mystery and adventure.",
      experienceProfile: "standard",
      audienceMode: "standard",
      campaignLength: "medium",
      playerCount: "4",
      additionalConstraints: []
    },
    safetyProfile: {
      youthSafeMode: false,
      familyFriendly: true,
      horrorRestricted: true,
      graphicContentRestricted: false,
      oppressiveToneRestricted: false,
      toneGuardrails: ["Mystery is fine; avoid dread-heavy framing."],
      audienceGuardrails: [],
      mustAvoid: ["heavy horror"]
    },
    systemContext: {
      status: "undecided",
      preferredSystem: "",
      systemsToAvoid: []
    },
    settingContext: {
      status: "undecided",
      preferredSetting: "",
      settingConstraints: []
    },
    source: {
      sourceFile: "04_VALIDATED_IDENTITY_PITCHES.json",
      sourceFingerprint: "sha256:test-fingerprint",
      contractVersion: "0.9.1",
      schemaVersion: ""
    },
    createdAt: "2026-07-03T00:00:00.000Z",
    validation: {
      isValid: true,
      errors: [],
      warnings: [],
      missingFields: []
    }
  };
}

{
  const record = sampleIdentitySelectionRecord();

  assert.equal(isIdentitySelectionRecord(record), true);

  const source = resolveIdentitySource(record);
  assert.equal(source.sourceType, "identity_selection_record");
  assert.equal(source.selectedIdentityDirection, "adjacent");
  assert.equal(source.selectedIdentityPitch.title, "The Hidden Road");

  assert.throws(
    () => resolveIdentitySource(record, "primary"),
    /already selects adjacent/i
  );
}

{
  const record = sampleIdentitySelectionRecord();
  const source = resolveIdentitySource(record);
  const handoff = createDefaultHandoff({
    identityFile: "exports/submissions/submission-alpha/phase-1/identity-selection-record.json",
    identitySelectionRecord: record,
    selectedIdentityDirection: source.selectedIdentityDirection,
    selectedIdentityPitch: source.selectedIdentityPitch
  });

  assert.equal(handoff.submissionId, "submission-alpha");
  assert.equal(handoff.selectedIdentityDirection, "adjacent");
  assert.equal(handoff.selectedIdentityPitch.title, "The Hidden Road");
  assert.deepEqual(handoff.identitySummary.mustPreserve, ["teamwork", "mystery"]);
  assert.deepEqual(handoff.identitySummary.mustAvoid, ["heavy horror"]);
  assert.deepEqual(handoff.selectionRecord.likedElements, ["the mystery angle"]);
  assert.deepEqual(handoff.selectionRecord.elementsToAvoid, ["too much horror"]);
  assert.equal(handoff.safetyProfile.horrorRestricted, true);
  assert.equal(handoff.sourceIdentitySelectionRecord.recordType, "identity_selection_record");

  assert.deepEqual(
    validateHandoffAgainstIdentity(
      handoff,
      source.selectedIdentityDirection,
      source.selectedIdentityPitch
    ),
    []
  );

  const input = buildInputFromHandoff(handoff);
  const validation = validateCampaignConceptInput(input);

  assert.equal(validation.isValid, true, validation.errors.join("\n"));
}

{
  const legacyIdentityPitches = {
    metadata: {
      sourceFingerprint: "sha256:test"
    },
    identityPitches: {
      primary: samplePitch("Primary Road"),
      adjacent: samplePitch("Adjacent Road"),
      wildcard: samplePitch("Wildcard Road")
    }
  };

  const source = resolveIdentitySource(legacyIdentityPitches, "wildcard");
  assert.equal(source.sourceType, "validated_identity_pitches");
  assert.equal(source.selectedIdentityDirection, "wildcard");
  assert.equal(source.selectedIdentityPitch.title, "Wildcard Road");

  assert.throws(
    () => resolveIdentitySource(legacyIdentityPitches),
    /--direction is required/i
  );
}

console.log("PASS campaign concept identity selection record bridge");
