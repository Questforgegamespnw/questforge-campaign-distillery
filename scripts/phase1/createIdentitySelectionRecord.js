#!/usr/bin/env node

const path = require("node:path");
const {
  fileExists,
  readJson,
  writeJson,
  ensureDirectory
} = require("../shared/jsonFiles");
const {
  parseCliArgs,
  resolvedPositionalPath,
  stringOption
} = require("../shared/cliArgs");
const {
  getExportPaths
} = require("../shared/submissionPathUtils");
const {
  markSubmissionWorkflowStep,
  relativePath
} = require("../shared/submissionStatusUtils");
const {
  buildIdentitySelectionRecord
} = require("../../src/builders/buildIdentitySelectionRecord");

const USAGE =
  'Usage: node scripts/phase1/createIdentitySelectionRecord.js <validated-identity-pitches.json> --direction <primary|adjacent|wildcard> [--submission-id <id>] [--submission-slug <slug>] [--output-root <path>] [--selected-by "Client Name"] [--notes "..."] [--liked "..."] [--concerns "..."] [--requested-adjustments "..."] [--must-preserve "..."] [--flexible "..."] [--avoid "..."]';

function parseList(value = "") {
  return String(value || "")
    .split(/[;|]/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function parseArgs(argv = process.argv.slice(2)) {
  const parsed = parseCliArgs(argv);

  return {
    inputFile: resolvedPositionalPath(parsed, 0, USAGE),
    direction: stringOption(parsed, "direction"),
    submissionId: stringOption(parsed, "submission-id"),
    submissionSlug: stringOption(parsed, "submission-slug"),
    outputRoot: stringOption(parsed, "output-root"),
    clientResponse: {
      selectedBy: stringOption(parsed, "selected-by"),
      notes: stringOption(parsed, "notes"),
      liked: stringOption(parsed, "liked"),
      concerns: stringOption(parsed, "concerns"),
      requestedAdjustments: stringOption(parsed, "requested-adjustments")
    },
    preservationGuidance: {
      mustPreserve: parseList(stringOption(parsed, "must-preserve")),
      flexible: parseList(stringOption(parsed, "flexible")),
      avoid: parseList(stringOption(parsed, "avoid"))
    }
  };
}

function main() {
  const options = parseArgs();

  if (!fileExists(options.inputFile)) {
    throw new Error(`Validated Identity Pitch file not found: ${options.inputFile}`);
  }

  if (!options.direction) {
    throw new Error("--direction is required when creating an Identity Selection Record.");
  }

  const identityDocument = readJson(options.inputFile);
  const paths = getExportPaths({
    inputFile: options.inputFile,
    submissionSlug: options.submissionSlug,
    outputRoot: options.outputRoot,
    direction: options.direction
  });
  const outputPath = path.join(
    ensureDirectory(paths.phase1Root),
    "identity-selection-record.json"
  );

  const record = buildIdentitySelectionRecord({
    identityDocument,
    selectedDirection: options.direction,
    submissionId: options.submissionId || paths.slug,
    sourceFile: path.relative(process.cwd(), options.inputFile),
    sourceSlug: paths.slug,
    clientResponse: options.clientResponse,
    preservationGuidance: options.preservationGuidance
  });

  writeJson(outputPath, record);

  markSubmissionWorkflowStep({
    inputFile: options.inputFile,
    sourceFile: options.inputFile,
    submissionSlug: paths.slug,
    stage: record.validation.isValid
      ? "identity_selection_recorded"
      : "identity_selection_record_invalid",
    phase: "phase1",
    phasePatch: {
      identitySelectionRecorded: record.validation.isValid,
      selectedDirection: record.selectedIdentityDirection
    },
    artifacts: {
      identitySelectionRecord: relativePath(outputPath)
    },
    nextAction: record.validation.isValid
      ? "Use identity-selection-record.json to prepare the Phase 2 Campaign Concept round trip."
      : "Review identity-selection-record.json validation errors before preparing Phase 2.",
    message: record.validation.isValid
      ? "Client identity selection was recorded."
      : "Identity Selection Record was created but did not pass validation."
  });

  console.log("");
  console.log(
    record.validation.isValid
      ? "✅ Identity Selection Record created"
      : "⚠️ Identity Selection Record created with validation errors"
  );
  console.log(`📁 Submission: ${paths.slug}`);
  console.log(`📁 Direction: ${record.selectedIdentityDirection}`);
  console.log(`📄 Record: ${outputPath}`);

  if (!record.validation.isValid) {
    console.log("\nValidation errors:");
    for (const error of record.validation.errors) {
      console.log(`- ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log("\nNext command:");
  console.log(
    `node scripts/phase2/prepareCampaignConceptRoundTrip.js "${path.relative(
      process.cwd(),
      outputPath
    )}"`
  );
}

try {
  main();
} catch (error) {
  console.error("❌ Could not create Identity Selection Record");
  console.error(error.message);
  process.exitCode = 1;
}

module.exports = {
  parseArgs,
  parseList
};
