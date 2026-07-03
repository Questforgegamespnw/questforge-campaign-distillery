const path = require("node:path");
const { PROJECT_ROOT } = require("./projectPaths");
const { getSubmissionRecordPaths } = require("./submissionPathUtils");
const {
  fileExists,
  readJson,
  writeJson
} = require("./jsonFiles");

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
    submissionId: slug,
    sourceFile: path.relative(PROJECT_ROOT, sourceFile),
    status: succeeded ? "phase_1_pipeline_complete" : "pipeline_error",
    phase1: {
      rawCaptured: true,
      normalized: true,
      pipelineComplete: succeeded,
      aiPolishComplete: existingStatus?.phase1?.aiPolishComplete || false,
      clientDeliveryComplete:
        existingStatus?.phase1?.clientDeliveryComplete || false,
      selectedDirection: existingStatus?.phase1?.selectedDirection || ""
    },
    phase2: {
      handoffComplete: existingStatus?.phase2?.handoffComplete || false,
      conceptGenerationComplete:
        existingStatus?.phase2?.conceptGenerationComplete || false,
      clientDeliveryComplete:
        existingStatus?.phase2?.clientDeliveryComplete || false
    },
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

  writeJson(
    paths.status,
    buildSubmissionStatus({
      slug: paths.slug,
      result,
      sourceFile: resolvedInput,
      existingStatus
    })
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
