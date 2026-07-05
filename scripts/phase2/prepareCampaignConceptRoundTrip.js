#!/usr/bin/env node

const path = require("node:path");
const {
  fileExists,
  readJson,
  writeJson,
  writeText,
  ensureDirectory
} = require("../shared/jsonFiles");
const {
  parseCliArgs,
  resolvedPositionalPath,
  stringOption
} = require("../shared/cliArgs");
const {
  getRoundTripPaths
} = require("../shared/roundTripFiles");
const {
  cleanString,
  createFingerprint,
  resolveIdentitySource,
  createDefaultHandoff,
  buildInputFromHandoff,
  validateHandoffAgainstIdentity,
  validatePhase2IdentityMetadataPreserved,
  buildRoundTripPrompt,
  buildWorkspaceStatus,
  buildOutputSkeleton,
  validateCampaignConceptInput
} = require("../shared/campaignConceptRoundTripUtils");
const {
  getExportPaths
} = require("../shared/submissionPathUtils");
const {
  markSubmissionWorkflowStep,
  relativePath
} = require("../shared/submissionStatusUtils");

const USAGE =
  "Usage: node scripts/phase2/prepareCampaignConceptRoundTrip.js <validated-identity-pitches-or-identity-selection-record.json> [--direction <primary|adjacent|wildcard>] [--submission-id <id>] [--submission-slug <slug>] [--output-root <path>]";

function parseArgs(argv = process.argv.slice(2)) {
  const parsed = parseCliArgs(argv);

  return {
    identityFile: resolvedPositionalPath(parsed, 0, USAGE),
    directionKey: cleanString(stringOption(parsed, "direction")),
    submissionId: cleanString(stringOption(parsed, "submission-id")),
    submissionSlug: cleanString(stringOption(parsed, "submission-slug")),
    outputRoot: cleanString(stringOption(parsed, "output-root"))
  };
}

function main() {
  const {
    identityFile,
    directionKey,
    submissionId,
    submissionSlug,
    outputRoot
  } = parseArgs();

  if (!fileExists(identityFile)) {
    throw new Error(
      `Identity source file not found: ${identityFile}`
    );
  }

  const identityDocument = readJson(identityFile);
  const identitySource = resolveIdentitySource(identityDocument, directionKey);
  const selectedDirection = identitySource.selectedIdentityDirection;
  const selectedPitch = identitySource.selectedIdentityPitch;
  const paths = getExportPaths({
    inputFile: identityFile,
    submissionSlug,
    outputRoot,
    direction: selectedDirection
  });
  const workspaceDir = ensureDirectory(paths.phase2RoundTrip);
  const artifacts = getRoundTripPaths(workspaceDir, "phase2");

  if (!fileExists(artifacts.handoff)) {
    writeJson(
      artifacts.handoff,
      createDefaultHandoff({
        identityFile,
        submissionId: submissionId || paths.slug,
        selectedIdentityDirection: selectedDirection,
        selectedIdentityPitch: selectedPitch,
        identitySelectionRecord: identitySource.identitySelectionRecord
      })
    );

    console.log(`📝 Created Phase 2 handoff: ${artifacts.handoff}`);
    console.log(
      identitySource.identitySelectionRecord
        ? "Review it before generation if you need to add system decisions, setting decisions, or operator notes. Client selection details were imported from the Identity Selection Record."
        : "Review it before generation if you have client feedback, system decisions, setting decisions, or safety constraints."
    );
  }

  const handoff = readJson(artifacts.handoff);
  const handoffErrors = validateHandoffAgainstIdentity(
    handoff,
    selectedDirection,
    selectedPitch
  );

  if (handoffErrors.length > 0) {
    throw new Error(
      `Phase 2 handoff failed source checks:\n- ${handoffErrors.join("\n- ")}`
    );
  }

  const input = buildInputFromHandoff(handoff);
  const preservationValidation = validatePhase2IdentityMetadataPreserved({
    identitySource,
    handoff,
    input
  });

  if (!preservationValidation.isValid) {
    throw new Error(
      `Phase 2 identity metadata preservation failed:\n- ${preservationValidation.errors.join("\n- ")}`
    );
  }

  const inputValidation = validateCampaignConceptInput(input);

  if (!inputValidation.isValid) {
    throw new Error(
      `Phase 2 handoff cannot produce a valid input:\n- ${inputValidation.errors.join("\n- ")}`
    );
  }

  const fingerprint = createFingerprint(input);
  writeText(
    artifacts.prompt,
    buildRoundTripPrompt(input, fingerprint),
    "utf8"
  );
  writeJson(artifacts.response, buildOutputSkeleton(input));

  writeJson(artifacts.status, {
    ...buildWorkspaceStatus({
      input,
      fingerprint,
      sourceIdentityFile: path.relative(process.cwd(), identityFile),
      handoffFile: path.relative(process.cwd(), artifacts.handoff),
      workspace: path.relative(process.cwd(), workspaceDir)
    }),
    sourceIdentityType: identitySource.sourceType,
    submissionSlug: paths.slug,
    clientDelivery: path.relative(
      process.cwd(),
      paths.phase2ClientDelivery
    )
  });

  console.log("");
  console.log("✅ Phase 2 Campaign Concept round trip prepared");
  console.log(`📁 Submission: ${paths.slug}`);
  console.log(`📁 Direction: ${selectedDirection}`);
  console.log(`📁 Source type: ${identitySource.sourceType}`);
  console.log(`📁 Workspace: ${workspaceDir}`);
  console.log(`🧾 Handoff: ${artifacts.handoff}`);
  console.log(`📋 Copy into ChatGPT: ${artifacts.prompt}`);
  console.log(`📥 Paste the returned JSON here: ${artifacts.response}`);

  if (inputValidation.warnings.length > 0) {
    console.log("\nWarnings:");
    for (const warning of inputValidation.warnings) {
      console.log(`- ${warning}`);
    }
  }

  console.log("\nNext command:");
  console.log(
    `node scripts/phase2/completeCampaignConceptRoundTrip.js "${path.relative(
      process.cwd(),
      workspaceDir
    )}"`
  );
}

try {
  main();
} catch (error) {
  console.error(
    "❌ Could not prepare Phase 2 Campaign Concept round trip"
  );
  console.error(error.message);
  process.exitCode = 1;
}

module.exports = {
  parseArgs
};
