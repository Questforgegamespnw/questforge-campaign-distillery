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

function printDirection(label, block) {
  if (!block) return;

  console.log(`\n==================================================`);
  console.log(`${label.toUpperCase()}`);
  console.log(`==================================================`);
  console.log(`Title: ${block.title}\n`);
  console.log(`Pitch: ${block.pitch}\n`);
  console.log(`About: ${block.about}\n`);
  console.log(`Players Do: ${block.playersDo}\n`);
  console.log(`Distinct Hook: ${block.distinctHook}\n`);
}

function printAuditDirection(label, block) {
  if (!block) return;

  console.log(`\n--------------------------------------------------`);
  console.log(`AUDIT: ${label.toUpperCase()}`);
  console.log(`--------------------------------------------------`);
  console.log(JSON.stringify(block, null, 2));
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

    console.log("\n=== CLIENT PITCHES ===");

    printDirection("primary", result.clientPitch?.primary);
    printDirection("adjacent", result.clientPitch?.adjacent);
    printDirection("wildcard", result.clientPitch?.wildcard);

    // Toggle audit visibility when needed
    const SHOW_AUDIT = false;

    if (SHOW_AUDIT) {
      console.log("\n=== AUDIT DATA ===");

      printAuditDirection("primary", result.auditPitch?.primary);
      printAuditDirection("adjacent", result.auditPitch?.adjacent);
      printAuditDirection("wildcard", result.auditPitch?.wildcard);
    }
  } catch (error) {
    console.error("Form translation failed.");
    console.error(error.message);
    process.exit(1);
  }
}

main();