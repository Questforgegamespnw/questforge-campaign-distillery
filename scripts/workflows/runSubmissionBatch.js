#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const {
  processSubmissionFile
} = require("../shared/submissionWorkflowUtils");

function parseArgs(argv = process.argv.slice(2)) {
  const positional = [];
  const options = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (!arg.startsWith("--")) {
      positional.push(arg);
      continue;
    }

    const [name, inlineValue] = arg.slice(2).split("=", 2);
    const next = argv[index + 1];

    if (inlineValue !== undefined) {
      options[name] = inlineValue;
    } else if (next && !next.startsWith("--")) {
      options[name] = next;
      index += 1;
    } else {
      options[name] = true;
    }
  }

  return {
    inputDirectory: path.resolve(
      process.cwd(),
      positional[0] || "misc/submissions"
    ),
    submissionsRoot:
      typeof options["submissions-root"] === "string"
        ? options["submissions-root"]
        : ""
  };
}

function main() {
  const options = parseArgs();

  if (!fs.existsSync(options.inputDirectory)) {
    throw new Error(`Submission directory not found: ${options.inputDirectory}`);
  }

  const files = fs
    .readdirSync(options.inputDirectory)
    .filter((name) => name.endsWith(".json") && !name.endsWith(".result.json"))
    .sort();

  if (files.length === 0) {
    throw new Error(`No submission JSON files found in: ${options.inputDirectory}`);
  }

  let failures = 0;

  for (const filename of files) {
    const inputPath = path.join(options.inputDirectory, filename);

    try {
      const { result, paths } = processSubmissionFile(inputPath, options);

      if (result?.error) {
        failures += 1;
        console.error(`FAIL ${filename}: ${result.error}`);
      } else {
        console.log(`PASS ${filename} -> ${paths.pipelineResult}`);
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
}

try {
  main();
} catch (error) {
  console.error("❌ Submission batch failed");
  console.error(error.message);
  process.exitCode = 1;
}
