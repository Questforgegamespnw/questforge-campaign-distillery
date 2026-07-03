const path = require("node:path");
const { PROJECT_ROOT } = require("./projectPaths");
const { getSubmissionRecordPaths } = require("./submissionPathUtils");
const {
  fileExists,
  readJson,
  writeJson
} = require("./jsonFiles");
const {
  updateSubmissionStatus,
  relativePath
} = require("./submissionStatusUtils");

const { runCampaignPipelineFromForm } = require(path.join(PROJECT_ROOT, "src"));
const {
  translateFormAnswers
} = require(path.join(
  PROJECT_ROOT,
  "src",
  "parsers",
  "translateFormAnswers"
));

function buildSubmissionStatus({
  slug,
  result,
  sourceFile,
  existingStatus = null
}) {
  const now = new Date().toISOString();
  const succeeded = !result?.error;

  return {
    ...(existingStatus || {}),
    submissionId: slug,
    sourceFile: path.relative(PROJECT_ROOT, sourceFile),
    status: succeeded ? "phase_1_pipeline_complete" : "pipeline_error",
    currentStage: succeeded ? "phase_1_pipeline_complete" : "pipeline_error",
    nextAction: succeeded
      ? "Prepare the Phase 1 Identity Pitch polish round trip."
      : "Review the deterministic pipeline error before continuing.",
    phase1: {
      ...(existingStatus?.phase1 || {}),
      rawCaptured: true,
      normalized: true,
      pipelineComplete: succeeded,
      pipelineError: !succeeded
    },
    phase2: {
      ...(existingStatus?.phase2 || {})
    },
    artifacts: {
      ...(existingStatus?.artifacts || {})
    },
    history: Array.isArray(existingStatus?.history)
      ? existingStatus.history
      : [],
    createdAt: existingStatus?.createdAt || now,
    updatedAt: now
  };
}

function processSubmissionFile(inputPath, options = {}) {
  const resolvedInput = path.resolve(inputPath);

  if (!fileExists(resolvedInput)) {
    throw new Error(`Input file not found: ${resolvedInput}`);
  }

  const rawSubmission = readJson(resolvedInput);
  const normalizedSubmission = translateFormAnswers(rawSubmission);
  const result = runCampaignPipelineFromForm(rawSubmission);
  const paths = getSubmissionRecordPaths({
    inputFile: resolvedInput,
    submissionSlug: options.submissionSlug,
    submissionsRoot: options.submissionsRoot
  });

  writeJson(paths.rawSubmission, rawSubmission);
  writeJson(paths.normalizedSubmission, normalizedSubmission);
  writeJson(paths.pipelineResult, result);

  const existingStatus = fileExists(paths.status)
    ? readJson(paths.status)
    : null;

  const baseStatus = buildSubmissionStatus({
    slug: paths.slug,
    result,
    sourceFile: resolvedInput,
    existingStatus
  });

  writeJson(paths.status, baseStatus);

  updateSubmissionStatus(
    {
      inputFile: resolvedInput,
      submissionSlug: paths.slug,
      submissionsRoot: options.submissionsRoot
    },
    {
      ...baseStatus,
      artifacts: {
        ...(baseStatus.artifacts || {}),
        rawSubmission: relativePath(paths.rawSubmission),
        normalizedSubmission: relativePath(paths.normalizedSubmission),
        pipelineResult: relativePath(paths.pipelineResult)
      },
      historyEntry: {
        stage: baseStatus.currentStage,
        message: result?.error
          ? "Deterministic submission processing failed."
          : "Deterministic submission processing completed."
      }
    }
  );

  return {
    result,
    paths
  };
}

module.exports = {
  buildSubmissionStatus,
  processSubmissionFile
};
