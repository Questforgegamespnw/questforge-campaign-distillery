#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { runCampaignPipelineFromForm } = require("../src");

const inputArg = process.argv[2];

if (!inputArg) {
  console.error("Usage: node scripts/runSubmission.js <submission.json>");
  process.exit(1);
}

const inputPath = path.resolve(process.cwd(), inputArg);

if (!fs.existsSync(inputPath)) {
  console.error(`Input file not found: ${inputPath}`);
  process.exit(1);
}

let rawSubmission;
try {
  rawSubmission = JSON.parse(fs.readFileSync(inputPath, "utf8"));
} catch (error) {
  console.error(`Could not parse JSON: ${error.message}`);
  process.exit(1);
}

const result = runCampaignPipelineFromForm(rawSubmission);
const parsed = path.parse(inputPath);
const outputPath = path.join(parsed.dir, `${parsed.name}.result.json`);

fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");

if (result?.error) {
  console.error(`Pipeline returned an error. Audit written to: ${outputPath}`);
  process.exitCode = 1;
} else {
  console.log(`Pipeline result written to: ${outputPath}`);
}
