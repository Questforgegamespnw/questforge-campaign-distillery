#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { runCampaignPipelineFromForm } = require("../src");

const directoryArg = process.argv[2] || "misc/submissions";
const inputDirectory = path.resolve(process.cwd(), directoryArg);
const outputDirectory = path.join(inputDirectory, "results");

if (!fs.existsSync(inputDirectory)) {
  console.error(`Submission directory not found: ${inputDirectory}`);
  process.exit(1);
}

fs.mkdirSync(outputDirectory, { recursive: true });

const files = fs.readdirSync(inputDirectory)
  .filter((name) => name.endsWith(".json") && !name.endsWith(".result.json"))
  .sort();

if (files.length === 0) {
  console.error(`No submission JSON files found in: ${inputDirectory}`);
  process.exit(1);
}

let failures = 0;

for (const filename of files) {
  const inputPath = path.join(inputDirectory, filename);

  try {
    const rawSubmission = JSON.parse(fs.readFileSync(inputPath, "utf8"));
    const result = runCampaignPipelineFromForm(rawSubmission);
    const outputName = `${path.parse(filename).name}.result.json`;
    const outputPath = path.join(outputDirectory, outputName);

    fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");

    if (result?.error) {
      failures += 1;
      console.error(`FAIL ${filename}: ${result.error}`);
    } else {
      console.log(`PASS ${filename} -> ${path.relative(process.cwd(), outputPath)}`);
    }
  } catch (error) {
    failures += 1;
    console.error(`FAIL ${filename}: ${error.message}`);
  }
}

if (failures > 0) {
  console.error(`${failures} submission(s) failed.`);
  process.exitCode = 1;
} else {
  console.log(`Completed ${files.length} submission(s).`);
}
