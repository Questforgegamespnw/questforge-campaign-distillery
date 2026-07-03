#!/usr/bin/env node

const path = require("node:path");
const {
  readJson,
  writeJson,
  writeText,
  fileExists,
  ensureDirectory
} = require("../shared/jsonFiles");
const {
  parseCliArgs,
  resolvedPositionalPath,
  stringOption
} = require("../shared/cliArgs");
const {
  CONTRACT_VERSION,
  resolvePipelineOutput,
  createSourceFingerprint,
  createResponseEnvelope,
  buildCombinedPrompt,
  exportPitchExpansionPrompts
} = require("../shared/identityPolishRoundTripUtils");
const {
  getExportPaths
} = require("../shared/submissionPathUtils");
const {
  getRoundTripPaths
} = require("../shared/roundTripFiles");
const {
  markSubmissionWorkflowStep,
  relativePath
} = require("../shared/submissionStatusUtils");

const USAGE =
  "Usage: node scripts/phase1/prepareIdentityPolishRoundTrip.js <submission-or-result.json> [--submission-slug <slug>] [--output-root <path>]";

function parseArgs(argv = process.argv.slice(2)) {
  const parsed = parseCliArgs(argv);

  return {
    inputFile: resolvedPositionalPath(parsed, 0, USAGE),
    submissionSlug: stringOption(parsed, "submission-slug"),
    outputRoot: stringOption(parsed, "output-root")
  };
}

function main() {
  const { inputFile, submissionSlug, outputRoot } = parseArgs();

  if (!fileExists(inputFile)) {
    throw new Error(`Input file not found: ${inputFile}`);
  }

  const inputValue = readJson(inputFile);
  const pipelineOutput = resolvePipelineOutput(inputValue);
  const promptExport = exportPitchExpansionPrompts(pipelineOutput);
  const sourceFingerprint = createSourceFingerprint(promptExport);
  const paths = getExportPaths({
    inputFile,
    submissionSlug,
    outputRoot
  });
  const workspaceDir = ensureDirectory(paths.phase1RoundTrip);
  const artifacts = getRoundTripPaths(workspaceDir, "phase1");

  const metadata = {
    contractVersion: CONTRACT_VERSION,
    sourceFile: path.basename(inputFile),
    sourceFingerprint
  };

  writeText(
    artifacts.prompt,
    buildCombinedPrompt(promptExport, metadata),
    "utf8"
  );
  writeJson(
    artifacts.response,
    createResponseEnvelope(inputFile, sourceFingerprint)
  );

  writeJson(artifacts.status, {
    workflow: "identity_polish_manual_round_trip",
    contractVersion: CONTRACT_VERSION,
    submissionSlug: paths.slug,
    sourceFile: path.relative(process.cwd(), inputFile),
    sourceFingerprint,
    workspace: path.relative(process.cwd(), workspaceDir),
    clientDelivery: path.relative(
      process.cwd(),
      paths.phase1ClientDelivery
    ),
    stage: "awaiting_chatgpt_response",
    promptGenerated: true,
    responseImported: false,
    validationRun: false,
    completed: false,
    createdAt: new Date().toISOString(),
    files: {
      prompt: path.basename(artifacts.prompt),
      waitingResponse: path.basename(artifacts.response),
      validationResult: path.basename(artifacts.validation),
      validatedIdentityPitches: path.basename(artifacts.validated),
      summary: path.basename(artifacts.summary)
    },
    nextAction:
      "Paste 01_IDENTITY_POLISH_PROMPT.md into one ChatGPT conversation, replace 02_PASTE_CHATGPT_RESPONSE_HERE.json with the returned JSON, then run the completion command."
  });

  console.log("");
  console.log("✅ Manual AI round-trip workspace prepared");
  console.log(`📁 Submission: ${paths.slug}`);
  console.log(`📁 Workspace: ${workspaceDir}`);
  console.log(`📋 Copy into ChatGPT: ${artifacts.prompt}`);
  console.log(`📥 Paste the JSON response here: ${artifacts.response}`);
  console.log("\nNext command:");
  console.log(
    `node scripts/phase1/completeIdentityPolishRoundTrip.js "${path.relative(
      process.cwd(),
      workspaceDir
    )}"`
  );
}

try {
  main();
} catch (error) {
  console.error("❌ Could not prepare Identity Pitch round trip");
  console.error(error.message);
  process.exitCode = 1;
}
