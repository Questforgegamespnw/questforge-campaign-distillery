const path = require("node:path");
const { PROJECT_ROOT } = require("./projectPaths");
const { getSubmissionRecordPaths } = require("./submissionPathUtils");
const {
  fileExists,
  readJson,
  writeJson
} = require("./jsonFiles");

function cleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function relativePath(value = "") {
  const cleaned = cleanString(value);
  return cleaned ? path.relative(PROJECT_ROOT, path.resolve(process.cwd(), cleaned)) : "";
}

function defaultStatus({ slug = "submission", sourceFile = "", now = new Date().toISOString() } = {}) {
  return {
    submissionId: cleanString(slug) || "submission",
    sourceFile: sourceFile ? relativePath(sourceFile) : "",
    status: "initialized",
    currentStage: "initialized",
    nextAction: "Run the next production workflow step.",
    phase1: {
      rawCaptured: false,
      normalized: false,
      pipelineComplete: false,
      pipelineError: false,
      aiPolishPrepared: false,
      aiPolishComplete: false,
      aiPolishValidationFailed: false,
      clientDeliveryComplete: false,
      identitySelectionRecorded: false,
      selectedDirection: ""
    },
    phase2: {
      handoffPrepared: false,
      handoffComplete: false,
      conceptRoundTripPrepared: false,
      conceptGenerationComplete: false,
      conceptValidationFailed: false,
      clientDeliveryComplete: false
    },
    artifacts: {
      rawSubmission: "",
      normalizedSubmission: "",
      pipelineResult: "",
      phase1RoundTrip: "",
      phase1ValidationResult: "",
      validatedIdentityPitches: "",
      identityPitchHtml: "",
      identityPitchPdf: "",
      identitySelectionRecord: "",
      phase2RoundTrip: "",
      phase2Handoff: "",
      phase2ValidationResult: "",
      validatedCampaignConcepts: "",
      campaignConceptHtml: "",
      campaignConceptPdf: ""
    },
    history: [],
    createdAt: now,
    updatedAt: now
  };
}

function isPlainObject(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function mergeObjects(base = {}, patch = {}) {
  const result = { ...base };

  for (const [key, value] of Object.entries(patch || {})) {
    if (isPlainObject(value) && isPlainObject(result[key])) {
      result[key] = mergeObjects(result[key], value);
    } else if (value !== undefined) {
      result[key] = value;
    }
  }

  return result;
}

function resolveSubmissionStatusPaths(options = {}) {
  const inputFile = options.inputFile || options.sourceFile || options.statusFile || "submission.json";
  return getSubmissionRecordPaths({
    inputFile,
    submissionSlug: options.submissionSlug || options.slug || "",
    submissionsRoot: options.submissionsRoot || ""
  });
}

function readSubmissionStatus(options = {}) {
  const paths = resolveSubmissionStatusPaths(options);

  if (!fileExists(paths.status)) {
    return defaultStatus({
      slug: paths.slug,
      sourceFile: options.sourceFile || options.inputFile || ""
    });
  }

  return mergeObjects(
    defaultStatus({
      slug: paths.slug,
      sourceFile: options.sourceFile || options.inputFile || ""
    }),
    readJson(paths.status)
  );
}

function writeSubmissionStatus(options = {}, status = {}) {
  const paths = resolveSubmissionStatusPaths(options);
  writeJson(paths.status, status);
  return {
    status,
    paths
  };
}

function appendHistory(current = {}, entry = {}) {
  const history = Array.isArray(current.history) ? current.history : [];
  const cleaned = Object.fromEntries(
    Object.entries(entry).filter(([, value]) => value !== undefined && value !== "")
  );

  if (!cleaned.stage && !cleaned.message) {
    return history;
  }

  return [
    ...history,
    {
      at: cleaned.at || new Date().toISOString(),
      ...cleaned
    }
  ];
}

function updateSubmissionStatus(options = {}, patch = {}) {
  const paths = resolveSubmissionStatusPaths(options);
  const now = new Date().toISOString();
  const current = readSubmissionStatus({
    ...options,
    inputFile: options.inputFile || options.sourceFile || paths.rawSubmission
  });

  const stage = patch.currentStage || patch.status;
  const nextAction = patch.nextAction;
  const historyEntry = patch.historyEntry || (stage
    ? {
        stage,
        message: patch.historyMessage || nextAction || "Submission workflow status updated."
      }
    : null);

  const patchWithoutMeta = { ...patch };
  delete patchWithoutMeta.historyEntry;
  delete patchWithoutMeta.historyMessage;

  const updated = mergeObjects(current, {
    ...patchWithoutMeta,
    submissionId: current.submissionId || paths.slug,
    sourceFile: patch.sourceFile || current.sourceFile || relativePath(options.sourceFile || options.inputFile || ""),
    status: patch.status || stage || current.status,
    currentStage: stage || current.currentStage,
    nextAction: nextAction || current.nextAction,
    updatedAt: now,
    history: historyEntry
      ? appendHistory(current, historyEntry)
      : Array.isArray(current.history) ? current.history : []
  });

  writeJson(paths.status, updated);

  return {
    status: updated,
    paths
  };
}

function markSubmissionWorkflowStep(options = {}) {
  const stage = cleanString(options.stage);
  const phase = cleanString(options.phase);
  const phasePatch = isPlainObject(options.phasePatch) ? options.phasePatch : {};
  const artifacts = isPlainObject(options.artifacts) ? options.artifacts : {};
  const patch = {
    status: stage,
    currentStage: stage,
    nextAction: cleanString(options.nextAction),
    artifacts,
    historyEntry: {
      stage,
      message: cleanString(options.message) || cleanString(options.nextAction)
    }
  };

  if (phase === "phase1" || phase === "phase2") {
    patch[phase] = phasePatch;
  }

  if (options.sourceFile) {
    patch.sourceFile = relativePath(options.sourceFile);
  }

  return updateSubmissionStatus(options, patch);
}

module.exports = {
  cleanString,
  relativePath,
  defaultStatus,
  mergeObjects,
  resolveSubmissionStatusPaths,
  readSubmissionStatus,
  writeSubmissionStatus,
  updateSubmissionStatus,
  markSubmissionWorkflowStep
};
