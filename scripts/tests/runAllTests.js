const path = require("node:path");
const { spawnSync } = require("node:child_process");

const includeFixtureTests = process.argv.includes("--include-fixtures");

const tests = [
  "scripts/tests/testSharedScriptUtilities.js",

  "scripts/tests/pipeline/testExperienceProfileBridge.js",
  "scripts/tests/pipeline/testIntakeGroupContextAndProfile.js",

  "scripts/tests/phase1/testAiExpansion.js",
  "scripts/tests/phase1/testIdentityPolishRoundTrip.js",
  "scripts/tests/phase1/testIdentitySelectionRecord.js",
  "scripts/tests/phase2/testPhase2CampaignConcept.js",
  "scripts/tests/phase2/testCampaignConceptRoundTrip.js",
  "scripts/tests/phase2/testCampaignConceptIdentitySelectionRecord.js",
  "scripts/tests/pipeline/testSystemLeadNormalization.js",
  "scripts/tests/pipeline/testClientFacingPhraseBoundaries.js",
  "scripts/tests/pipeline/testCoreFrameAudiencePolicy.js",
  "scripts/tests/pipeline/testYouthVoiceLayer.js",
  "scripts/tests/pipeline/testSubmissionStatusWorkflow.js",
  "scripts/tests/pipeline/testGenreLayerCompatibility.js",
];

if (includeFixtureTests) {
  tests.push(
    "scripts/tests/phase1/testAiPromptExport.js",
    "scripts/tests/pipeline/testFormFlow.js",
    "scripts/tests/pipeline/testBatchForms.js"
  );
}

let failed = 0;

for (const testFile of tests) {
  console.log(`\n▶ ${testFile}`);

  const result = spawnSync(
    process.execPath,
    [path.resolve(process.cwd(), testFile)],
    {
      stdio: "inherit"
    }
  );

  if (result.status !== 0) {
    failed += 1;
  }
}

console.log(
  `\nTest run complete: ${tests.length - failed} passed, ${failed} failed`
);

if (failed > 0) {
  process.exitCode = 1;
}
