const fs = require("fs");
const path = require("path");

const { runCampaignPipelineFromForm } = require("../src");

function loadFormAnswers() {
  const filePath = path.resolve(
    __dirname,
    "../misc/example-form-submission-youth.json"
  );
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function main() {
  try {
    const answers = loadFormAnswers();
    const result = runCampaignPipelineFromForm(answers);

    console.log("\n🎲 FORM-DRIVEN CAMPAIGN PIPELINE");

    if (result.error) {
      console.log("\n=== VALIDATION FAILED ===");
      console.log(JSON.stringify(result.validation, null, 2));
      process.exit(1);
    }

    console.log("\n=== CANONICAL INTAKE ===");
    console.log(JSON.stringify(result.intake.canonical, null, 2));

    console.log("\n=== TRANSLATOR INPUT ===");
    console.log(JSON.stringify(result.intake.translatorInput, null, 2));

    console.log("\n=== TRANSLATED ===");
    console.log(JSON.stringify(result.translated, null, 2));

    console.log("\n=== SELECTED ===");
    console.log(JSON.stringify(result.selected, null, 2));

    console.log("\n=== RESOLVED ===");
    console.log(JSON.stringify(result.resolved, null, 2));

    console.log("\n=== PITCH ===");
    console.log(JSON.stringify(result.pitch, null, 2));
  } catch (error) {
    console.error("Form translation failed.");
    console.error(error.message);
    process.exit(1);
  }
}

main();