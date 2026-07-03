const assert = require("node:assert/strict");
const path = require("node:path");
const { PROJECT_ROOT } = require("../../shared/projectPaths");

const schema = require(path.join(
  PROJECT_ROOT,
  "src",
  "ai",
  "phase2",
  "campaignConcept.schema.json"
));
void schema;

const {
  buildCampaignConceptInput,
  validateCampaignConceptInput,
  buildCampaignConceptPrompt,
  validateCampaignConceptOutput,
  evaluateCampaignConceptResponse
} = require(path.join(PROJECT_ROOT, "src", "ai", "phase2"));

const candidate = require("../../fixtures/phase2/campaignConcept.example.json");

function buildInput() {
  return buildCampaignConceptInput({
    submissionId: "example_submission_001",
    selectedIdentityDirection: "primary",
    generationMode: "three_variants",
    selectedIdentityPitch: {
      title: "Power Awakened Within",
      pitch:
        "A campaign about inner power, disciplined growth, and the responsibility of deciding what that power should become.",
      about:
        "Power begins within the characters, but its meaning is defined by how they choose to shape and use it."
    },
    identitySummary: {
      identityTitle: "Power Awakened Within",
      identityPitch:
        "A campaign about inner power, disciplined growth, and the responsibility of deciding what that power should become.",
      corePromise:
        "Power begins within the characters, but its meaning is defined by how they choose to shape and use it.",
      playEmphasis: [
        "tactical positioning",
        "team coordination",
        "character growth"
      ],
      tone: ["heroic", "hopeful"],
      genre: ["fantasy"],
      environment: ["underground ruins"],
      mustPreserve: [
        "inner awakening",
        "teamwork",
        "meaningful control of power"
      ],
      mustAvoid: [
        "grimdark inevitability",
        "mandatory corruption"
      ]
    },
    systemContext: {
      status: "open",
      preferredSystem: "",
      systemsToAvoid: []
    },
    settingContext: {
      status: "open",
      preferredSetting: "",
      settingConstraints: []
    }
  });
}

function main() {
  const input = buildInput();
  const inputValidation = validateCampaignConceptInput(input);
  assert.equal(
    inputValidation.isValid,
    true,
    inputValidation.errors.join("\n")
  );

  const prompt = buildCampaignConceptPrompt(input);
  assert.match(prompt, /Phase 1 has already determined/);
  assert.match(prompt, /three concrete, playable campaign premises/);
  assert.match(prompt, /meaningful player choices/i);

  const outputValidation = validateCampaignConceptOutput(candidate, {
    sourceInput: input
  });
  assert.equal(
    outputValidation.isValid,
    true,
    outputValidation.errors.join("\n")
  );

  const evaluated = evaluateCampaignConceptResponse(
    input,
    `\n\`\`\`json\n${JSON.stringify(candidate)}\n\`\`\``
  );
  assert.equal(
    evaluated.accepted,
    true,
    evaluated.errors.join("\n")
  );

  const bad = JSON.parse(JSON.stringify(candidate));
  bad.concepts[0].meaningfulChoices = [];

  const rejected = evaluateCampaignConceptResponse(
    input,
    JSON.stringify(bad)
  );
  assert.equal(rejected.accepted, false);
  assert.match(rejected.errors.join(" "), /meaningfulChoices/);

  console.log("✅ Phase 2 Campaign Concept source tests passed");
}

try {
  main();
} catch (error) {
  console.error(
    "❌ Phase 2 Campaign Concept source tests failed"
  );
  console.error(error);
  process.exitCode = 1;
}
