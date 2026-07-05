#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const {
  evaluateCampaignConceptResponse
} = require("../../src/ai/phase2");

const {
  readJson,
  writeJson,
  createFingerprint,
  resolveIdentitySource,
  buildInputFromHandoff,
  validateHandoffAgainstIdentity,
  validatePhase2IdentityMetadataPreserved,
  validateCampaignConceptInput
} = require("../shared/campaignConceptRoundTripUtils");
const {
  markSubmissionWorkflowStep,
  relativePath
} = require("../shared/submissionStatusUtils");

function parseArgs(argv = process.argv.slice(2)) {
  const workspaceArg = argv[0];

  if (!workspaceArg) {
    throw new Error(
      "Usage: node scripts/phase2/completeCampaignConceptRoundTrip.js <phase2-round-trip-folder>"
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
    throw new Error(`Identity source no longer exists: ${identityFile}`);
  }

  if (!fs.existsSync(handoffPath)) {
    throw new Error(`Phase 2 handoff no longer exists: ${handoffPath}`);
  }

  const identityDocument = readJson(identityFile);
  const identitySource = resolveIdentitySource(
    identityDocument,
    status.selectedIdentityDirection
  );
  const selectedPitch = identitySource.selectedIdentityPitch;
  const handoff = readJson(handoffPath);

  const handoffErrors = validateHandoffAgainstIdentity(
    handoff,
    identitySource.selectedIdentityDirection,
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
    markSubmissionWorkflowStep({
      inputFile: identityFile,
      sourceFile: identityFile,
      submissionSlug: status.submissionSlug,
      stage: "phase_2_handoff_validation_failed",
      phase: "phase2",
      phasePatch: {
        conceptValidationFailed: true
      },
      artifacts: {
        phase2ValidationResult: relativePath(validationPath)
      },
      nextAction: "Review 03_VALIDATION_RESULT.json and rebuild the Phase 2 handoff from the selected identity source.",
      message: "Phase 2 handoff failed source validation."
    });
    process.exitCode = 1;
    return;
  }

  const input = buildInputFromHandoff(handoff);
  const preservationValidation = validatePhase2IdentityMetadataPreserved({
    identitySource,
    handoff,
    input
  });

  if (!preservationValidation.isValid) {
    const report = {
      accepted: false,
      parsed: false,
      sourceMatched: false,
      errors: preservationValidation.errors,
      warnings: preservationValidation.warnings,
      output: null
    };

    writeJson(validationPath, report);
    writeFailureSummary(
      summaryPath,
      "PHASE 2 IDENTITY METADATA PRESERVATION FAILED",
      preservationValidation.errors,
      preservationValidation.warnings
    );
    markSubmissionWorkflowStep({
      inputFile: identityFile,
      sourceFile: identityFile,
      submissionSlug: status.submissionSlug,
      stage: "phase_2_identity_metadata_preservation_failed",
      phase: "phase2",
      phasePatch: {
        conceptValidationFailed: true
      },
      artifacts: {
        phase2ValidationResult: relativePath(validationPath)
      },
      nextAction: "Review 03_VALIDATION_RESULT.json and rebuild the Phase 2 handoff from the selected identity source.",
      message: "Phase 2 handoff dropped selected identity metadata."
    });
    process.exitCode = 1;
    return;
  }

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
    markSubmissionWorkflowStep({
      inputFile: identityFile,
      sourceFile: identityFile,
      submissionSlug: status.submissionSlug,
      stage: "phase_2_input_invalid",
      phase: "phase2",
      phasePatch: {
        conceptValidationFailed: true
      },
      artifacts: {
        phase2ValidationResult: relativePath(validationPath)
      },
      nextAction: "Review 03_VALIDATION_RESULT.json and correct the Phase 2 handoff before regenerating the prompt.",
      message: "Phase 2 handoff could not produce a valid campaign concept input."
    });
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
        "Rerun prepareCampaignConceptRoundTrip.js for this Identity Pitch or Identity Selection Record to regenerate the prompt from the updated handoff."
    });

    markSubmissionWorkflowStep({
      inputFile: identityFile,
      sourceFile: identityFile,
      submissionSlug: status.submissionSlug,
      stage: "phase_2_source_changed_reprepare_required",
      phase: "phase2",
      phasePatch: {
        conceptValidationFailed: true
      },
      artifacts: {
        phase2ValidationResult: relativePath(validationPath)
      },
      nextAction:
        "Rerun prepareCampaignConceptRoundTrip.js for this Identity Pitch or Identity Selection Record to regenerate the prompt from the updated handoff.",
      message: "Phase 2 source fingerprint changed after prompt generation."
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
      sourceMatched: true,
      sourceIdentityType: identitySource.sourceType
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
    `Identity source type: ${identitySource.sourceType}`,
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
    sourceIdentityType: identitySource.sourceType,
    stage: result.accepted ? "complete" : "validation_review_required",
    responseImported: true,
    validationRun: true,
    completed: result.accepted,
    nextAction: result.accepted
      ? "Review 04_VALIDATED_CAMPAIGN_CONCEPTS.json and prepare the client-facing Phase 2 deliverable."
      : "Review 03_VALIDATION_RESULT.json, correct or regenerate the ChatGPT response, and rerun this command."
  });

  markSubmissionWorkflowStep({
    inputFile: identityFile,
    sourceFile: identityFile,
    submissionSlug: status.submissionSlug,
    stage: result.accepted ? "phase_2_validation_complete" : "phase_2_validation_review_required",
    phase: "phase2",
    phasePatch: {
      conceptGenerationComplete: result.accepted,
      conceptValidationFailed: !result.accepted
    },
    artifacts: {
      phase2ValidationResult: relativePath(validationPath),
      validatedCampaignConcepts: result.accepted ? relativePath(validatedPath) : ""
    },
    nextAction: result.accepted
      ? "Review 04_VALIDATED_CAMPAIGN_CONCEPTS.json and export the Phase 2 client PDF."
      : "Review 03_VALIDATION_RESULT.json, correct or regenerate the ChatGPT response, and rerun completeCampaignConceptRoundTrip.js.",
    message: result.accepted
      ? "Phase 2 Campaign Concept validation completed."
      : "Phase 2 Campaign Concept validation requires review."
  });

  console.log("");
  console.log(`✅ Source matched: ${input.submissionId}`);
  console.log(`📁 Identity source type: ${identitySource.sourceType}`);
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

module.exports = {
  parseArgs
};
