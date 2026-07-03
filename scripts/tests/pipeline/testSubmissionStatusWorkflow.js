#!/usr/bin/env node

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const {
  updateSubmissionStatus,
  readSubmissionStatus
} = require("../../../scripts/shared/submissionStatusUtils");

const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "qf-status-"));
const submissionsRoot = path.join(tmpRoot, "submissions");
const inputFile = path.join(tmpRoot, "incoming", "alpha.json");
fs.mkdirSync(path.dirname(inputFile), { recursive: true });
fs.writeFileSync(inputFile, "{}\n", "utf8");

const baseOptions = {
  inputFile,
  sourceFile: inputFile,
  submissionSlug: "submission-alpha",
  submissionsRoot
};

updateSubmissionStatus(baseOptions, {
  status: "phase_1_pipeline_complete",
  currentStage: "phase_1_pipeline_complete",
  nextAction: "Prepare Phase 1 round trip.",
  phase1: {
    rawCaptured: true,
    normalized: true,
    pipelineComplete: true
  },
  artifacts: {
    rawSubmission: "submissions/submission-alpha/00_RAW_SUBMISSION.json",
    pipelineResult: "submissions/submission-alpha/02_PIPELINE_RESULT.json"
  },
  historyEntry: {
    stage: "phase_1_pipeline_complete",
    message: "Deterministic processing completed."
  }
});

updateSubmissionStatus(baseOptions, {
  status: "phase_1_round_trip_prepared",
  currentStage: "phase_1_round_trip_prepared",
  nextAction: "Paste the Phase 1 prompt into ChatGPT.",
  phase1: {
    aiPolishPrepared: true
  },
  artifacts: {
    phase1RoundTrip: "exports/submissions/submission-alpha/phase-1/round-trip"
  },
  historyEntry: {
    stage: "phase_1_round_trip_prepared",
    message: "Phase 1 round trip prepared."
  }
});

let status = readSubmissionStatus(baseOptions);
assert.equal(status.phase1.rawCaptured, true);
assert.equal(status.phase1.normalized, true);
assert.equal(status.phase1.pipelineComplete, true);
assert.equal(status.phase1.aiPolishPrepared, true);
assert.equal(status.phase2.conceptGenerationComplete, false);
assert.equal(status.artifacts.rawSubmission, "submissions/submission-alpha/00_RAW_SUBMISSION.json");
assert.equal(status.artifacts.phase1RoundTrip, "exports/submissions/submission-alpha/phase-1/round-trip");
assert.equal(status.currentStage, "phase_1_round_trip_prepared");
assert.equal(status.history.length, 2);

updateSubmissionStatus(baseOptions, {
  status: "phase_1_validation_review_required",
  currentStage: "phase_1_validation_review_required",
  nextAction: "Review Phase 1 validation errors.",
  phase1: {
    aiPolishValidationFailed: true
  },
  artifacts: {
    phase1ValidationResult: "exports/submissions/submission-alpha/phase-1/round-trip/03_VALIDATION_RESULT.json"
  },
  historyEntry: {
    stage: "phase_1_validation_review_required",
    message: "Phase 1 validation failed."
  }
});

status = readSubmissionStatus(baseOptions);
assert.equal(status.phase1.pipelineComplete, true);
assert.equal(status.phase1.aiPolishPrepared, true);
assert.equal(status.phase1.aiPolishValidationFailed, true);
assert.match(status.nextAction, /Review Phase 1 validation errors/);

updateSubmissionStatus(baseOptions, {
  status: "identity_selection_recorded",
  currentStage: "identity_selection_recorded",
  nextAction: "Prepare Phase 2.",
  phase1: {
    identitySelectionRecorded: true,
    selectedDirection: "adjacent"
  },
  artifacts: {
    identitySelectionRecord: "exports/submissions/submission-alpha/phase-1/identity-selection-record.json"
  },
  historyEntry: {
    stage: "identity_selection_recorded",
    message: "Client identity selection recorded."
  }
});

updateSubmissionStatus(baseOptions, {
  status: "phase_2_validation_complete",
  currentStage: "phase_2_validation_complete",
  nextAction: "Export Phase 2 PDF.",
  phase2: {
    handoffPrepared: true,
    conceptRoundTripPrepared: true,
    conceptGenerationComplete: true
  },
  artifacts: {
    phase2RoundTrip: "exports/submissions/submission-alpha/phase-2/adjacent/round-trip",
    validatedCampaignConcepts: "exports/submissions/submission-alpha/phase-2/adjacent/round-trip/04_VALIDATED_CAMPAIGN_CONCEPTS.json"
  },
  historyEntry: {
    stage: "phase_2_validation_complete",
    message: "Phase 2 validation completed."
  }
});

status = readSubmissionStatus(baseOptions);
assert.equal(status.phase1.identitySelectionRecorded, true);
assert.equal(status.phase1.selectedDirection, "adjacent");
assert.equal(status.phase1.pipelineComplete, true);
assert.equal(status.phase2.handoffPrepared, true);
assert.equal(status.phase2.conceptRoundTripPrepared, true);
assert.equal(status.phase2.conceptGenerationComplete, true);
assert.equal(status.artifacts.identitySelectionRecord, "exports/submissions/submission-alpha/phase-1/identity-selection-record.json");
assert.equal(status.artifacts.validatedCampaignConcepts, "exports/submissions/submission-alpha/phase-2/adjacent/round-trip/04_VALIDATED_CAMPAIGN_CONCEPTS.json");
assert.equal(status.currentStage, "phase_2_validation_complete");
assert.equal(status.history.length, 5);

console.log("PASS submission status workflow");
