const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { PROJECT_ROOT } = require("../../shared/projectPaths");
const {
  requireFixture
} = require("../testUtils");

const { runCampaignPipelineFromForm } = require(path.join(PROJECT_ROOT, "src"));
const {
  DIRECTIONS,
  exportPitchExpansionPrompts
} = require(path.join(
  PROJECT_ROOT,
  "src",
  "ai",
  "exportPitchExpansionPrompts"
));

function resolveInput(argv = process.argv.slice(2)) {
  return argv[0]
    ? path.resolve(process.cwd(), argv[0])
    : requireFixture(
        [
          "scripts/fixtures/pipeline/example-form-submission.json",
          "misc/test-inputs/active-test.json",
          "misc/example-form-submission-youth.json"
        ],
        "a Phase 1 form fixture"
      );
}

function main() {
  const inputFile = resolveInput();
  const input = JSON.parse(fs.readFileSync(inputFile, "utf8"));
  const pipelineOutput =
    input.clientPitch && (input.resolved || input.selected)
      ? input
      : runCampaignPipelineFromForm(input);

  const promptExport = exportPitchExpansionPrompts(pipelineOutput);

  for (const directionKey of DIRECTIONS) {
    const block = promptExport[directionKey];

    assert.equal(block.expansionInput.contractVersion, "0.9.1");
    assert.equal(block.expansionInput.direction.key, directionKey);
    assert.equal(typeof block.title, "string");
    assert.ok(block.title.length > 0);
    assert.equal(typeof block.prompt, "string");
    assert.match(
      block.prompt,
      /Return exactly these four keys and no others/
    );
    assert.match(block.prompt, /Do not include the title/);

    for (const field of [
      "title",
      "pitch",
      "about",
      "playersDo",
      "hook"
    ]) {
      assert.equal(
        typeof block.expansionInput.source[field],
        "string",
        `${directionKey}.${field} must be a string`
      );
    }
  }

  console.log(
    `✅ Phase 1 prompt export tests passed using ${path.relative(
      PROJECT_ROOT,
      inputFile
    )}`
  );
}

try {
  main();
} catch (error) {
  console.error("❌ Phase 1 prompt export tests failed");
  console.error(error);
  process.exitCode = 1;
}
