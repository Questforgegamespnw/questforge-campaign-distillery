const assert = require("node:assert/strict");

const {
  createFingerprint,
  resolveIdentityPitches,
  assertDirection,
  createDefaultHandoff,
  buildInputFromHandoff,
  validateHandoffAgainstIdentity,
  buildRoundTripPrompt,
  buildWorkspaceStatus,
  validateCampaignConceptInput
} = require("../../shared/campaignConceptRoundTripUtils");

const selectedPitch = {
  title: "The Power Awakening",
  pitch:
    "A heroic campaign about awakening inner power and shaping it together.",
  about:
    "Power emerges through discovery, mastery, and choices about what the group becomes.",
  playersDo:
    "Players adapt to powerful enemies, take meaningful risks, and coordinate their growth.",
  hook:
    "Danger is closing in, and the answer is beginning to awaken within."
};

function main() {
  const pitches = resolveIdentityPitches({
    identityPitches: {
      primary: selectedPitch,
      adjacent: { ...selectedPitch, title: "Adjacent" },
      wildcard: { ...selectedPitch, title: "Wildcard" }
    }
  });

  assert.equal(
    assertDirection("primary", pitches).title,
    selectedPitch.title
  );

  const handoff = createDefaultHandoff({
    identityFile: "04_VALIDATED_IDENTITY_PITCHES.json",
    submissionId: "submission-001",
    selectedIdentityDirection: "primary",
    selectedIdentityPitch: selectedPitch
  });

  assert.deepEqual(
    validateHandoffAgainstIdentity(
      handoff,
      "primary",
      selectedPitch
    ),
    []
  );

  const altered = JSON.parse(JSON.stringify(handoff));
  altered.selectedIdentityPitch.pitch = "Changed";

  assert.match(
    validateHandoffAgainstIdentity(
      altered,
      "primary",
      selectedPitch
    ).join(" "),
    /no longer matches/
  );

  const input = buildInputFromHandoff(handoff);
  const validation = validateCampaignConceptInput(input);

  assert.equal(
    validation.isValid,
    true,
    validation.errors.join("\n")
  );

  const fingerprint = createFingerprint(input);
  assert.match(fingerprint, /^sha256:[a-f0-9]{64}$/);

  const prompt = buildRoundTripPrompt(input, fingerprint);
  assert.match(prompt, /source fingerprint/i);
  assert.match(prompt, new RegExp(fingerprint));

  const status = buildWorkspaceStatus({
    input,
    fingerprint,
    sourceIdentityFile:
      "exports/submissions/submission-001/phase-1/round-trip/04_VALIDATED_IDENTITY_PITCHES.json",
    handoffFile:
      "exports/submissions/submission-001/phase-2/primary/round-trip/00_PHASE2_HANDOFF.json",
    workspace:
      "exports/submissions/submission-001/phase-2/primary/round-trip"
  });

  assert.equal(status.stage, "awaiting_chatgpt_response");
  assert.equal(status.completed, false);
  assert.equal(
    status.files.validatedConcepts,
    "04_VALIDATED_CAMPAIGN_CONCEPTS.json"
  );

  console.log("✅ Phase 2 round-trip regression tests passed");
}

try {
  main();
} catch (error) {
  console.error("❌ Phase 2 round-trip regression tests failed");
  console.error(error);
  process.exitCode = 1;
}
