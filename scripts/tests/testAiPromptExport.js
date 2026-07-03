// scripts/testAiPromptExport.js

const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const util = require("util");

const { runCampaignPipelineFromForm } = require("../../src");
const {
  DIRECTIONS,
  exportPitchExpansionPrompts
} = require("../../src/ai/exportPitchExpansionPrompts");

const DEFAULT_INPUT_FILE = path.resolve(
  __dirname,
  "../misc/test-inputs/active-test.json"
);

const OUTPUT_FILE = path.resolve(
  __dirname,
  "../misc/ai-prompt-export-output.txt"
);

function installOutputTee(outputFile) {
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, "", "utf8");

  const originalLog = console.log.bind(console);
  const originalError = console.error.bind(console);
  const originalDir = console.dir.bind(console);

  function appendText(text) {
    fs.appendFileSync(outputFile, `${text}\n`, "utf8");
  }

  console.log = (...args) => {
    originalLog(...args);
    appendText(util.format(...args));
  };

  console.error = (...args) => {
    originalError(...args);
    appendText(util.format(...args));
  };

  console.dir = (value, options = {}) => {
    originalDir(value, options);
    appendText(util.inspect(value, options));
  };
}

installOutputTee(OUTPUT_FILE);

function printPromptBlock(label, block = {}) {
  console.log("\n==================================================");
  console.log(`🧭 ${label.toUpperCase()} EXPANSION PROMPT`);
  console.log("==================================================\n");

  console.log(`TITLE: ${block.title || "Untitled"}\n`);
  console.log("STRUCTURED SOURCE:");
  console.dir(block.expansionInput?.source || {}, { depth: null });
  console.log("\nCONSTRAINTS:");
  console.dir(block.expansionInput?.constraints || {}, { depth: null });

  console.log("\n----- COPY INTO GPT -----\n");
  console.log(block.prompt || "");
  console.log("\n----- END PROMPT -----\n");
}

function validateExportBlock(directionKey, block = {}, pipelineOutput = {}) {
  assert.equal(block.expansionInput?.contractVersion, "0.9.1");
  assert.equal(block.expansionInput?.direction?.key, directionKey);
  assert.equal(typeof block.title, "string");
  assert.equal(typeof block.prompt, "string");
  assert.ok(block.prompt.length > 0);

  const source = block.expansionInput?.source || {};
  for (const field of ["title", "pitch", "about", "playersDo", "hook"]) {
    assert.equal(typeof source[field], "string", `${directionKey}.${field} must be a string`);
  }

  assert.equal(source.title, block.title);
  assert.match(block.prompt, /Return exactly these four keys and no others/);
  assert.match(block.prompt, /Do not include the title/);
  assert.match(block.prompt, new RegExp(`Current direction: ${directionKey}`, "i"));

  const expectedProfile = pipelineOutput.translated?.experienceProfile;
  if (expectedProfile) {
    assert.equal(
      block.expansionInput?.constraints?.experienceProfile,
      expectedProfile,
      `${directionKey} expansion profile must match final pipeline profile`
    );
  }
}

function isPipelineResult(value) {
  return Boolean(
    value &&
    typeof value === "object" &&
    value.clientPitch &&
    (value.resolved || value.selected)
  );
}

function resolvePipelineOutput(inputValue) {
  return isPipelineResult(inputValue)
    ? inputValue
    : runCampaignPipelineFromForm(inputValue);
}

function parseInputFile(argv = process.argv.slice(2)) {
  const inputArg = argv[0];
  return inputArg
    ? path.resolve(process.cwd(), inputArg)
    : DEFAULT_INPUT_FILE;
}

function main() {
  const inputFile = parseInputFile();

  if (!fs.existsSync(inputFile)) {
    throw new Error(`Missing input file: ${inputFile}`);
  }

  console.log(`\n🧪 USING INPUT FILE: ${inputFile}\n`);

  const raw = fs.readFileSync(inputFile, "utf8");
  const inputValue = JSON.parse(raw);

  const pipelineOutput = resolvePipelineOutput(inputValue);
  const promptExport = exportPitchExpansionPrompts(pipelineOutput);

  for (const directionKey of DIRECTIONS) {
    const block = promptExport[directionKey];
    validateExportBlock(directionKey, block, pipelineOutput);
    printPromptBlock(directionKey, block);
  }

  console.log("✅ AI prompt export test passed for primary, adjacent, and wildcard");
  console.log(`📄 Full output written to: ${OUTPUT_FILE}`);
}

try {
  main();
} catch (error) {
  console.error("❌ AI prompt export test failed");
  console.error(error);
  process.exitCode = 1;
}
