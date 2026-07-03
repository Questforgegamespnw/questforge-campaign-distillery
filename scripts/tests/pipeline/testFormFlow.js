const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { PROJECT_ROOT } = require("../../shared/projectPaths");
const { requireFixture } = require("../testUtils");
const { runCampaignPipelineFromForm } = require(path.join(PROJECT_ROOT, "src"));

function resolveInput(argv = process.argv.slice(2)) {
  return argv[0]
    ? path.resolve(process.cwd(), argv[0])
    : requireFixture(
        [
          "scripts/fixtures/pipeline/example-form-submission.json",
          "misc/example-form-submission-youth.json",
          "misc/test-inputs/active-test.json"
        ],
        "a form-flow fixture"
      );
}

function main() {
  const inputFile = resolveInput();
  const answers = JSON.parse(fs.readFileSync(inputFile, "utf8"));
  const result = runCampaignPipelineFromForm(answers);

  assert.equal(Boolean(result.error), false, JSON.stringify(result.validation));
  assert.ok(result.clientPitch);

  for (const directionKey of ["primary", "adjacent", "wildcard"]) {
    const pitch = result.clientPitch[directionKey];
    assert.ok(pitch, `Missing ${directionKey} pitch`);

    for (const field of [
      "title",
      "pitch",
      "about",
      "playersDo",
      "distinctHook"
    ]) {
      assert.equal(
        typeof pitch[field],
        "string",
        `${directionKey}.${field} must be a string`
      );
      assert.ok(
        pitch[field].trim().length > 0,
        `${directionKey}.${field} must not be empty`
      );
    }
  }

  console.log(
    `✅ Public form-flow test passed using ${path.relative(
      PROJECT_ROOT,
      inputFile
    )}`
  );
}

try {
  main();
} catch (error) {
  console.error("❌ Public form-flow test failed");
  console.error(error);
  process.exitCode = 1;
}
