#!/usr/bin/env node

// scripts/completeCampaignConceptRoundTrip.js

const fs = require("node:fs");
const path = require("node:path");

const {
  evaluateCampaignConceptResponse
} = require("../../src/ai/phase2");

const {
  readJson,
  writeJson,
  createFingerprint,
  resolveIdentityPitches,
  assertDirection,
  buildInputFromHandoff,
  validateHandoffAgainstIdentity,
  validateCampaignConceptInput
} = require("./campaignConceptRoundTripUtils");

function parseArgs(argv = process.argv.slice(2)) {
  const workspaceArg = argv[0];

  if (!workspaceArg) {
    throw new Error(
      "Usage: node scripts/completeCampaignConceptRoundTrip.js <phase2-round-trip-folder>"
    );
  }

  return {
    workspaceDir: path.resolve(process.cwd(), workspaceArg)
  };
}

function writeFailureSummary(summaryPath, heading, errors = [], warnings = []) {
  const lines = [heading, ""];

  for (const error of errors) lines.push(`ERROR: ${error}`);
  for (const warning of warnings) lines.push(`WARNING: ${warning}`);

  fs.writeFileSync(summaryPath, `${lines.join("\n")}\n`, "utf8");
}

function main() {
  const { workspaceDir } = parseArgs();
  const statusPath = path.join(workspaceDir, "round-trip-status.json");
  const responsePath = path.join(
    workspaceDir,
    "02_PASTE_CHATGPT_RESPONSE_HERE.json"
  );
  const validationPath = path.join(workspaceDir, "03_VALIDATION_RESULT.json");
  const validatedPath = path.join(
    workspaceDir,
    "04_VALIDATED_CAMPAIGN_CONCEPTS.json"
  );
  const summaryPath = path.join(workspaceDir, "05_VALIDATION_SUMMARY.txt");

  if (!fs.existsSync(statusPath)) {
    throw new Error(`Missing round-trip status file: ${statusPath}`);
  }

  if (!fs.existsSync(responsePath)) {
    throw new Error(`Missing ChatGPT response file: ${responsePath}`);
  }

  const status = readJson(statusPath);
  const identityFile = path.resolve(process.cwd(), status.sourceIdentityFile);
  const handoffPath = path.resolve(process.cwd(), status.handoffFile);

  if (!fs.existsSync(identityFile)) {
    throw new Error(`Validated Identity Pitch source no longer exists: ${identityFile}`);
  }

  if (!fs.existsSync(handoffPath)) {
    throw new Error(`Phase 2 handoff no longer exists: ${handoffPath}`);
  }

  const identityDocument = readJson(identityFile);
  const pitches = resolveIdentityPitches(identityDocument);
  const selectedPitch = assertDirection(status.selectedIdentityDirection, pitches);
  const handoff = readJson(handoffPath);

  const handoffErrors = validateHandoffAgainstIdentity(
    handoff,
    status.selectedIdentityDirection,
    selectedPitch
  );

  if (handoffErrors.length > 0) {
    const report = {
      accepted: false,
      parsed: false,
      sourceMatched: false,
      errors: handoffErrors,
      warnings: [],
      output: null
    };

    writeJson(validationPath, report);
    writeFailureSummary(
      summaryPath,
      "PHASE 2 CAMPAIGN CONCEPT VALIDATION FAILED",
      handoffErrors
    );
    process.exitCode = 1;
    return;
  }

  const input = buildInputFromHandoff(handoff);
  const inputValidation = validateCampaignConceptInput(input);

  if (!inputValidation.isValid) {
    const report = {
      accepted: false,
      parsed: false,
      sourceMatched: false,
      errors: inputValidation.errors,
      warnings: inputValidation.warnings,
      output: null
    };

    writeJson(validationPath, report);
    writeFailureSummary(
      summaryPath,
      "PHASE 2 CAMPAIGN CONCEPT INPUT INVALID",
      inputValidation.errors,
      inputValidation.warnings
    );
    process.exitCode = 1;
    return;
  }

  const currentFingerprint = createFingerprint(input);

  if (currentFingerprint !== status.sourceFingerprint) {
    const errors = [
      `Phase 2 source changed after the prompt was generated. Expected ${status.sourceFingerprint}; current ${currentFingerprint}.`,
      "Rerun prepareCampaignConceptRoundTrip.js to regenerate the prompt and waiting response file."
    ];

    const report = {
      accepted: false,
      parsed: false,
      sourceMatched: false,
      errors,
      warnings: [],
      expectedFingerprint: status.sourceFingerprint,
      currentFingerprint,
      output: null
    };

    writeJson(validationPath, report);
    writeFailureSummary(
      summaryPath,
      "PHASE 2 CAMPAIGN CONCEPT SOURCE MISMATCH",
      errors
    );

    writeJson(statusPath, {
      ...status,
      stage: "source_changed_reprepare_required",
      responseImported: false,
      validationRun: true,
      completed: false,
      nextAction:
        "Rerun prepareCampaignConceptRoundTrip.js for this Identity Pitch to regenerate the prompt from the updated handoff."
    });

    process.exitCode = 1;
    return;
  }

  const rawResponse = fs.readFileSync(responsePath, "utf8");
  const result = evaluateCampaignConceptResponse(input, rawResponse);

  const report = {
    metadata: {
      contractVersion: input.contractVersion,
      schemaVersion: input.schemaVersion,
      submissionId: input.submissionId,
      selectedIdentityDirection: input.selectedIdentityDirection,
      generationMode: input.generationMode,
      sourceFingerprint: currentFingerprint,
      sourceMatched: true
    },
    accepted: result.accepted,
    parsed: result.parsed,
    fallbackUsed: result.fallbackUsed,
    errors: result.errors,
    warnings: result.warnings,
    output: result.output,
    rejectedCandidate: result.rejectedCandidate || null
  };

  writeJson(validationPath, report);

  if (result.accepted) {
    writeJson(validatedPath, result.output);
  }

  const summaryLines = [
    "QUESTFORGE PHASE 2 CAMPAIGN CONCEPT VALIDATION",
    "",
    `Submission: ${input.submissionId}`,
    `Selected Identity: ${input.selectedIdentityDirection}`,
    `Generation mode: ${input.generationMode}`,
    `Source matched: true`,
    `Parsed: ${result.parsed}`,
    `Accepted: ${result.accepted}`,
    ""
  ];

  for (const error of result.errors) summaryLines.push(`ERROR: ${error}`);
  for (const warning of result.warnings) summaryLines.push(`WARNING: ${warning}`);

  summaryLines.push(
    "",
    result.accepted
      ? "The Campaign Concept response passed validation and is ready for review."
      : "The response requires correction or regeneration before it can be used."
  );

  fs.writeFileSync(summaryPath, `${summaryLines.join("\n")}\n`, "utf8");

  writeJson(statusPath, {
    ...status,
    stage: result.accepted ? "complete" : "validation_review_required",
    responseImported: true,
    validationRun: true,
    completed: result.accepted,
    nextAction: result.accepted
      ? "Review 04_VALIDATED_CAMPAIGN_CONCEPTS.json and prepare the client-facing Phase 2 deliverable."
      : "Review 03_VALIDATION_RESULT.json, correct or regenerate the ChatGPT response, and rerun this command."
  });

  console.log("");
  console.log(`✅ Source matched: ${input.submissionId}`);
  console.log(`${result.accepted ? "✅" : "⚠️"} Accepted: ${result.accepted}`);
  console.log(`📄 Validation result: ${validationPath}`);
  console.log(`📄 Summary: ${summaryPath}`);

  if (result.accepted) {
    console.log(`📦 Validated Campaign Concepts: ${validatedPath}`);
  } else {
    process.exitCode = 1;
  }
}

try {
  main();
} catch (error) {
  console.error("❌ Could not complete Phase 2 Campaign Concept round trip");
  console.error(error.message);
  process.exitCode = 1;
}
