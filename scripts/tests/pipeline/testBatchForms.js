const fs = require("node:fs");
const path = require("node:path");

const { PROJECT_ROOT } = require("../../shared/projectPaths");
const {
  findExistingPath,
  collectJsonFiles
} = require("../testUtils");
const { runCampaignPipelineFromForm } = require(path.join(PROJECT_ROOT, "src"));

function resolveInputDirectory(argv = process.argv.slice(2)) {
  if (argv[0]) {
    return path.resolve(process.cwd(), argv[0]);
  }

  return findExistingPath([
    "scripts/fixtures/pipeline",
    "misc/test-inputs"
  ]);
}

function main() {
  const inputDirectory = resolveInputDirectory();

  if (!inputDirectory) {
    throw new Error(
      "No pipeline fixture directory found. Pass one explicitly or create scripts/fixtures/pipeline."
    );
  }

  const files = collectJsonFiles(inputDirectory);

  if (files.length === 0) {
    throw new Error(`No JSON fixtures found under ${inputDirectory}`);
  }

  let passed = 0;
  const failures = [];

  for (const filePath of files) {
    try {
      const answers = JSON.parse(fs.readFileSync(filePath, "utf8"));
      const result = runCampaignPipelineFromForm(answers);

      if (result?.error) {
        throw new Error(
          JSON.stringify(result.validation || result.error)
        );
      }

      for (const directionKey of [
        "primary",
        "adjacent",
        "wildcard"
      ]) {
        if (!result.clientPitch?.[directionKey]) {
          throw new Error(`Missing ${directionKey} client pitch`);
        }
      }

      passed += 1;
    } catch (error) {
      failures.push({
        file: path.relative(PROJECT_ROOT, filePath),
        error: error.message
      });
    }
  }

  console.log(
    `Batch pipeline fixtures: ${passed} passed, ${failures.length} failed`
  );

  for (const failure of failures) {
    console.error(`- ${failure.file}: ${failure.error}`);
  }

  if (failures.length > 0) {
    process.exitCode = 1;
    return;
  }

  console.log("✅ Public batch pipeline tests passed");
}

try {
  main();
} catch (error) {
  console.error("❌ Public batch pipeline tests failed");
  console.error(error);
  process.exitCode = 1;
}
