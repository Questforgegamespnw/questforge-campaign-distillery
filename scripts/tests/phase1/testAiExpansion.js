const assert = require("node:assert/strict");
const path = require("node:path");
const { PROJECT_ROOT } = require("../../shared/projectPaths");

const {
  buildExpansionInput
} = require(path.join(PROJECT_ROOT, "src", "ai", "buildExpansionInput"));
const {
  buildExpansionPrompt,
  parseExpansionResponse,
  expandPitchWithAI
} = require(path.join(PROJECT_ROOT, "src", "ai", "expandPitch"));
const {
  validateExpansionOutput
} = require(path.join(
  PROJECT_ROOT,
  "src",
  "ai",
  "validateExpansionOutput"
));

const directionBundle = {
  label: "primary",
  coreFrames: [{ name: "Hidden Truth" }],
  systemFrames: [{ name: "Clue Web" }],
  genreSkin: [{ name: "Victorian / Gothic" }],
  toneSkin: [{ name: "Psychological" }],
  environmentSkins: [{ name: "Dense City / Urban" }],
  includeNotes: "Keep the mystery grounded.",
  excludeNotes: "Do not add graphic horror.",
  adjudication: {
    experienceProfile: "standard",
    constraints: {
      safetyProfile: {
        audienceMode: "standard",
        youthSafeMode: false,
        familyFriendly: false,
        horrorRestricted: false
      }
    },
    handoffGuidance: {
      toneGuardrails: [],
      audienceGuardrails: []
    }
  }
};

const source = {
  title: "The Buried Pattern",
  pitch:
    "The campaign begins from the truth that the world is hiding more than it first reveals.",
  about:
    "The deeper the group looks, the more ordinary explanations stop holding together.",
  playersDo:
    "Players follow clues, compare accounts, and decide which sources can still be trusted.",
  hook: "The first answer creates a larger contradiction."
};

const validCandidate = {
  pitch:
    "A hidden truth sits beneath the campaign's familiar surface. Each discovery makes the larger pattern harder to dismiss.",
  about:
    "What first looks like an isolated inconsistency gradually reveals a deeper distortion. Understanding the truth may be as dangerous as ignoring it.",
  playersDo:
    "Players follow scattered clues, compare conflicting accounts, and decide which sources deserve their trust. Progress comes from interpretation rather than simple discovery.",
  hook:
    "The first answer does not solve the mystery. It proves the mystery is larger than anyone expected."
};

async function main() {
  const input = buildExpansionInput(directionBundle, source);

  assert.equal(input.contractVersion, "0.9.1");
  assert.equal(input.direction.key, "primary");
  assert.equal(input.source.title, source.title);
  assert.deepEqual(input.context.coreNames, ["Hidden Truth"]);
  assert.deepEqual(input.context.systemNames, ["Clue Web"]);
  assert.deepEqual(input.constraints.mustInclude, [
    "Keep the mystery grounded."
  ]);
  assert.deepEqual(input.constraints.avoid, [
    "Do not add graphic horror."
  ]);

  const prompt = buildExpansionPrompt(input);
  assert.match(prompt, /Return exactly these four keys and no others/);
  assert.match(prompt, /Do not include the title/);

  const validation = validateExpansionOutput(validCandidate);
  assert.equal(validation.isValid, true);
  assert.deepEqual(validation.value, validCandidate);

  const parsed = parseExpansionResponse(JSON.stringify(validCandidate));
  assert.equal(parsed.isValid, true);
  assert.deepEqual(parsed.output, validCandidate);

  const accepted = await expandPitchWithAI(input, {
    generateText: async () => JSON.stringify(validCandidate)
  });

  assert.equal(accepted.accepted, true);
  assert.equal(accepted.fallbackUsed, false);

  const invalidJson = await expandPitchWithAI(input, {
    generateText: async () => "not valid json"
  });

  assert.equal(invalidJson.accepted, false);
  assert.equal(invalidJson.fallbackUsed, true);

  const missingField = await expandPitchWithAI(input, {
    generateText: async () =>
      JSON.stringify({
        pitch: validCandidate.pitch,
        about: validCandidate.about,
        playersDo: validCandidate.playersDo
      })
  });

  assert.equal(missingField.accepted, false);
  assert.match(
    missingField.errors.join(" "),
    /Missing required output keys: hook/
  );

  console.log("✅ Phase 1 AI expansion tests passed");
}

main().catch((error) => {
  console.error("❌ Phase 1 AI expansion tests failed");
  console.error(error);
  process.exitCode = 1;
});
