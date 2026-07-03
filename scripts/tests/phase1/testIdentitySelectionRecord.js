#!/usr/bin/env node

const assert = require("node:assert/strict");

const {
  buildIdentitySelectionRecord,
  resolveIdentityPitches
} = require("../../../src/builders/buildIdentitySelectionRecord");
const {
  validateIdentitySelectionRecord
} = require("../../../src/validators/validateIdentitySelectionRecord");

const validatedIdentityDocument = {
  metadata: {
    contractVersion: "0.9.1",
    sourceFile: "submission-alpha.json",
    sourceFingerprint: "sha256:test-fingerprint"
  },
  identityPitches: {
    primary: {
      title: "The Hidden Lantern",
      pitch: "A mystery-forward fantasy campaign about uncovering a buried truth.",
      about: "The campaign centers on hidden truth, trust, and discovery.",
      playersDo: "Players follow clues, explore strange places, and decide who to trust.",
      hook: "The first lantern lights by itself, pointing toward a door that was never there."
    },
    adjacent: {
      title: "The Broken Map",
      pitch: "An exploration-forward campaign about fixing a fractured route home.",
      about: "The campaign centers on repair, teamwork, and difficult discoveries.",
      playersDo: "Players explore lost routes, solve practical problems, and protect one another.",
      hook: "Every repaired landmark reveals one more piece of the road ahead."
    },
    wildcard: {
      title: "The Clockwork Orchard",
      pitch: "A stranger version about a living world that reacts to every choice.",
      about: "The campaign centers on consequence, discovery, and a world that will not sit still.",
      playersDo: "Players make alliances, investigate changes, and adapt to shifting ground.",
      hook: "The trees remember every promise made beneath them."
    }
  }
};

{
  const pitches = resolveIdentityPitches(validatedIdentityDocument);
  assert.equal(pitches.primary.title, "The Hidden Lantern");
  assert.equal(pitches.wildcard.hook, "The trees remember every promise made beneath them.");
}

{
  const record = buildIdentitySelectionRecord({
    identityDocument: validatedIdentityDocument,
    selectedDirection: "adjacent",
    submissionId: "submission-alpha",
    clientResponse: {
      selectedBy: "Client Team",
      liked: "exploration, repair, teamwork",
      concerns: "avoid heavy horror",
      requestedAdjustments: "make the setting feel a little more adventurous",
      notes: "They preferred adjacent because it felt the most playable."
    },
    preservationGuidance: {
      mustPreserve: ["repair-forward exploration", "teamwork"],
      flexible: ["exact setting details"],
      avoid: ["heavy horror"]
    },
    createdAt: "2026-07-03T20:00:00.000Z"
  });

  assert.equal(record.recordType, "identity_selection_record");
  assert.equal(record.schemaVersion, "0.1.0");
  assert.equal(record.submissionId, "submission-alpha");
  assert.equal(record.selectedIdentityDirection, "adjacent");
  assert.equal(record.selectedIdentityPitch.title, "The Broken Map");
  assert.equal(record.identitySummary.identityTitle, "The Broken Map");
  assert.deepEqual(record.identitySummary.mustPreserve, [
    "repair-forward exploration",
    "teamwork"
  ]);
  assert.deepEqual(record.identitySummary.mustAvoid, ["heavy horror"]);
  assert.equal(record.selectionRecord.selectedDirection, "adjacent");
  assert.deepEqual(record.selectionRecord.likedElements, [
    "exploration, repair, teamwork"
  ]);
  assert.equal(record.clientResponse.selectedBy, "Client Team");
  assert.equal(record.clientResponse.selectedAt, "2026-07-03T20:00:00.000Z");
  assert.equal(record.source.sourceFingerprint, "sha256:test-fingerprint");
  assert.equal(record.validation.isValid, true);
  assert.deepEqual(record.validation.errors, []);
}

{
  const record = buildIdentitySelectionRecord({
    identityDocument: validatedIdentityDocument,
    selectedDirection: "side-route",
    submissionId: "submission-alpha",
    createdAt: "2026-07-03T20:00:00.000Z"
  });

  assert.equal(record.validation.isValid, false);
  assert.match(
    record.validation.errors.join("\n"),
    /selectedIdentityDirection must be one of/i
  );
  assert.match(
    record.validation.errors.join("\n"),
    /selectedIdentityPitch.title/i
  );
}

{
  const invalid = {
    recordType: "identity_selection_record",
    schemaVersion: "0.1.0",
    submissionId: "submission-alpha",
    selectedIdentityDirection: "primary",
    selectedIdentityPitch: {
      title: "Title only"
    },
    identitySummary: {},
    selectionRecord: {
      selectedDirection: "wildcard",
      likedElements: [],
      elementsToAvoid: []
    },
    clientResponse: {},
    preservationGuidance: {
      mustPreserve: [],
      flexible: [],
      avoid: []
    },
    source: {}
  };

  const validation = validateIdentitySelectionRecord(invalid);
  assert.equal(validation.isValid, false);
  assert.match(validation.errors.join("\n"), /selectionRecord.selectedDirection must match/i);
  assert.match(validation.errors.join("\n"), /selectedIdentityPitch.pitch/i);
  assert.equal(validation.warnings.length >= 1, true);
}

console.log("PASS identity selection record");
