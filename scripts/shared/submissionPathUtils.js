const path = require("node:path");
const {
  SUBMISSIONS_ROOT,
  EXPORTS_ROOT
} = require("./projectPaths");

function cleanSlug(value) {
  return String(value || "")
    .trim()
    .replace(/\\/g, "/")
    .split("/")
    .pop()
    .replace(/\.json$/i, "")
    .replace(/\.result$/i, "")
    .replace(/^\d+_/, "")
    .replace(/_?validated_?identity_?pitches?/i, "")
    .replace(/_?validated_?campaign_?concepts?/i, "")
    .replace(/_?pipeline_?result/i, "")
    .replace(/_?raw_?submission/i, "")
    .replace(/[^a-z0-9_-]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^[-_]+|[-_]+$/g, "")
    .toLowerCase();
}

function findSubmissionSlugInPath(filePath) {
  const parts = path.resolve(filePath).split(path.sep).filter(Boolean);

  for (let index = parts.length - 1; index >= 0; index -= 1) {
    if (/^submission[-_]/i.test(parts[index])) {
      return cleanSlug(parts[index]);
    }
  }

  return "";
}

function deriveSubmissionSlug(filePath, explicitSlug = "") {
  const fromFlag = cleanSlug(explicitSlug);
  if (fromFlag) return fromFlag;

  const fromPath = findSubmissionSlugInPath(filePath);
  if (fromPath) return fromPath;

  const parsed = path.parse(filePath);
  const fromName = cleanSlug(parsed.name);
  return fromName || "submission";
}

function resolveRoot(explicitRoot, defaultRoot) {
  return path.resolve(process.cwd(), explicitRoot || defaultRoot);
}

function getSubmissionRecordPaths({
  inputFile,
  submissionSlug = "",
  submissionsRoot = ""
}) {
  const slug = deriveSubmissionSlug(inputFile, submissionSlug);
  const root = path.join(
    resolveRoot(submissionsRoot, SUBMISSIONS_ROOT),
    slug
  );

  return {
    slug,
    root,
    rawSubmission: path.join(root, "00_RAW_SUBMISSION.json"),
    normalizedSubmission: path.join(root, "01_NORMALIZED_SUBMISSION.json"),
    pipelineResult: path.join(root, "02_PIPELINE_RESULT.json"),
    status: path.join(root, "submission-status.json")
  };
}

function getExportPaths({
  inputFile,
  submissionSlug = "",
  outputRoot = "",
  direction = "primary"
}) {
  const slug = deriveSubmissionSlug(inputFile, submissionSlug);
  const root = path.join(resolveRoot(outputRoot, EXPORTS_ROOT), slug);
  const phase1Root = path.join(root, "phase-1");
  const phase1RoundTrip = path.join(phase1Root, "round-trip");
  const phase1ClientDelivery = path.join(phase1Root, "client-delivery");
  const phase2Root = path.join(root, "phase-2");
  const directionKey = cleanSlug(direction) || "primary";
  const phase2DirectionRoot = path.join(phase2Root, directionKey);
  const phase2RoundTrip = path.join(phase2DirectionRoot, "round-trip");
  const phase2ClientDelivery = path.join(
    phase2DirectionRoot,
    "client-delivery"
  );

  return {
    slug,
    submissionRoot: root,
    phase1Root,
    phase1RoundTrip,
    phase1ClientDelivery,
    phase2Root,
    phase2DirectionRoot,
    phase2RoundTrip,
    phase2ClientDelivery
  };
}

function getCanonicalPaths(options = {}) {
  return {
    records: getSubmissionRecordPaths(options),
    exports: getExportPaths(options)
  };
}

function resolveSiblingClientDelivery(inputFile) {
  const inputDir = path.dirname(path.resolve(inputFile));
  return path.basename(inputDir).toLowerCase() === "round-trip"
    ? path.join(path.dirname(inputDir), "client-delivery")
    : path.join(inputDir, "client-delivery");
}

module.exports = {
  cleanSlug,
  findSubmissionSlugInPath,
  deriveSubmissionSlug,
  getSubmissionRecordPaths,
  getExportPaths,
  getCanonicalPaths,
  resolveSiblingClientDelivery
};
