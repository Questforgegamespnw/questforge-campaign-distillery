#!/usr/bin/env node

const path = require("node:path");
const { PROJECT_ROOT } = require("../shared/projectPaths");
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

  if (!positional[0]) {
    throw new Error(
      "Usage: node scripts/workflows/runSubmission.js <submission.json> [--submission-slug <slug>] [--submissions-root <path>]"
    );
  }

  return {
    inputPath: path.resolve(process.cwd(), positional[0]),
    submissionSlug:
      typeof options["submission-slug"] === "string"
        ? options["submission-slug"]
        : "",
    submissionsRoot:
      typeof options["submissions-root"] === "string"
        ? options["submissions-root"]
        : ""
  };
}

function main() {
  const options = parseArgs();
  const { result, paths } = processSubmissionFile(options.inputPath, options);

  if (result?.error) {
    console.error(`Pipeline returned an error. Audit written to: ${paths.pipelineResult}`);
    process.exitCode = 1;
    return;
  }

  console.log(`✅ Submission processed: ${paths.slug}`);
  console.log(`📥 Raw submission: ${paths.rawSubmission}`);
  console.log(`🧭 Normalized submission: ${paths.normalizedSubmission}`);
  console.log(`📄 Pipeline result: ${paths.pipelineResult}`);
  console.log(`📌 Submission status: ${paths.status}`);
  console.log("\nNext command:");
  console.log(
    `node scripts/phase1/prepareIdentityPolishRoundTrip.js "${path.relative(
      PROJECT_ROOT,
      paths.pipelineResult
    )}"`
  );
}

try {
  main();
} catch (error) {
  console.error("❌ Submission pipeline failed");
  console.error(error.message);
  process.exitCode = 1;
}
