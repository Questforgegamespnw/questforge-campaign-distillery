// scripts/testAiExpansion.js

const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const util = require("util");

const OUTPUT_FILE = path.resolve(
  __dirname,
  "../misc/ai-expansion-foundation-test-output.txt"
);

function installOutputTee(outputFile) {
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, "", "utf8");

  const originalLog = console.log.bind(console);
  const originalError = console.error.bind(console);

  function append(args) {
    fs.appendFileSync(outputFile, `${util.format(...args)}\n`, "utf8");
  }

  console.log = (...args) => {
    originalLog(...args);
    append(args);
  };

  console.error = (...args) => {
    originalError(...args);
    append(args);
  };
}

installOutputTee(OUTPUT_FILE);

const { buildExpansionInput } = require("../../src/ai/buildExpansionInput");
const {
  buildExpansionPrompt,
  parseExpansionResponse,
  expandPitchWithAI
} = require("../../src/ai/expandPitch");
const { validateExpansionOutput } = require("../../src/ai/validateExpansionOutput");

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

async function run() {
  const input = buildExpansionInput(directionBundle, source);

  assert.equal(input.contractVersion, "0.9.1");
  assert.equal(input.direction.key, "primary");
  assert.equal(input.source.title, source.title);
  assert.equal(input.source.pitch, source.pitch);
  assert.equal(input.source.about, source.about);
  assert.equal(input.source.playersDo, source.playersDo);
  assert.equal(input.source.hook, source.hook);
  assert.deepEqual(input.context.coreNames, ["Hidden Truth"]);
  assert.deepEqual(input.context.systemNames, ["Clue Web"]);
  assert.deepEqual(input.constraints.mustInclude, ["Keep the mystery grounded."]);
  assert.deepEqual(input.constraints.avoid, ["Do not add graphic horror."]);

  const youthInput = buildExpansionInput(directionBundle, source, {
    experienceProfile: "youth",
    safety: { familyFriendly: true }
  });

  assert.equal(youthInput.constraints.experienceProfile, "youth");
  assert.equal(youthInput.constraints.audienceMode, "standard");
  assert.equal(youthInput.constraints.softerThemesMode, true);
  assert.equal(youthInput.constraints.fullSafeMode, false);
  assert.equal(youthInput.constraints.heroKidsMode, false);
  assert.equal(youthInput.constraints.youthSafeMode, false);
  assert.equal(youthInput.constraints.familyFriendly, true);

  const kidsInput = buildExpansionInput(directionBundle, source, {
    experienceProfile: "kids",
    safety: { familyFriendly: true }
  });

  assert.equal(kidsInput.constraints.experienceProfile, "kids");
  assert.equal(kidsInput.constraints.softerThemesMode, false);
  assert.equal(kidsInput.constraints.fullSafeMode, true);
  assert.equal(kidsInput.constraints.heroKidsMode, true);
  assert.equal(kidsInput.constraints.youthSafeMode, true);
  assert.equal(kidsInput.constraints.familyFriendly, true);

  const prompt = buildExpansionPrompt(input);

  assert.match(prompt, /Return exactly these four keys and no others/);
  assert.match(prompt, /"pitch"/);
  assert.match(prompt, /"about"/);
  assert.match(prompt, /"playersDo"/);
  assert.match(prompt, /"hook"/);
  assert.match(prompt, /The Buried Pattern/);
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

  assert.equal(accepted.attempted, true);
  assert.equal(accepted.accepted, true);
  assert.equal(accepted.fallbackUsed, false);
  assert.deepEqual(accepted.output, validCandidate);

  const invalidJson = await expandPitchWithAI(input, {
    generateText: async () => "not valid json"
  });

  assert.equal(invalidJson.attempted, true);
  assert.equal(invalidJson.accepted, false);
  assert.equal(invalidJson.fallbackUsed, true);
  assert.deepEqual(invalidJson.output, {
    pitch: source.pitch,
    about: source.about,
    playersDo: source.playersDo,
    hook: source.hook
  });
  assert.match(invalidJson.errors.join(" "), /not valid JSON/i);

  const missingField = await expandPitchWithAI(input, {
    generateText: async () =>
      JSON.stringify({
        pitch: validCandidate.pitch,
        about: validCandidate.about,
        playersDo: validCandidate.playersDo
      })
  });

  assert.equal(missingField.accepted, false);
  assert.equal(missingField.fallbackUsed, true);
  assert.match(missingField.errors.join(" "), /Missing required output keys: hook/);

  const unexpectedField = await expandPitchWithAI(input, {
    generateText: async () =>
      JSON.stringify({
        ...validCandidate,
        title: "AI should not edit this"
      })
  });

  assert.equal(unexpectedField.accepted, false);
  assert.equal(unexpectedField.fallbackUsed, true);
  assert.match(unexpectedField.errors.join(" "), /Unexpected output keys: title/);

  const emptyField = await expandPitchWithAI(input, {
    generateText: async () =>
      JSON.stringify({
        ...validCandidate,
        hook: "   "
      })
  });

  assert.equal(emptyField.accepted, false);
  assert.equal(emptyField.fallbackUsed, true);
  assert.match(emptyField.errors.join(" "), /hook must not be empty/);

  const providerFailure = await expandPitchWithAI(input, {
    generateText: async () => {
      throw new Error("Mock provider unavailable");
    }
  });

  assert.equal(providerFailure.attempted, true);
  assert.equal(providerFailure.accepted, false);
  assert.equal(providerFailure.fallbackUsed, true);
  assert.match(providerFailure.errors.join(" "), /Mock provider unavailable/);

  const noProvider = await expandPitchWithAI(input);

  assert.equal(noProvider.attempted, false);
  assert.equal(noProvider.accepted, false);
  assert.equal(noProvider.fallbackUsed, true);
  assert.deepEqual(noProvider.output, {
    pitch: source.pitch,
    about: source.about,
    playersDo: source.playersDo,
    hook: source.hook
  });

  console.log("✅ AI expansion foundation tests passed");
  console.log(`📄 Full output written to: ${OUTPUT_FILE}`);
}

run().catch((error) => {
  console.error("❌ AI expansion foundation tests failed");
  console.error(error);
  process.exitCode = 1;
});
