const path = require("node:path");
const {
  fileExists,
  readJson,
  writeJson
} = require("./jsonFiles");

const ROUND_TRIP_PROFILES = Object.freeze({
  phase1: Object.freeze({
    prompt: "01_IDENTITY_POLISH_PROMPT.md",
    response: "02_PASTE_CHATGPT_RESPONSE_HERE.json",
    validation: "03_VALIDATION_RESULT.json",
    validated: "04_VALIDATED_IDENTITY_PITCHES.json",
    summary: "05_VALIDATION_SUMMARY.txt",
    status: "round-trip-status.json"
  }),
  phase2: Object.freeze({
    handoff: "00_PHASE2_HANDOFF.json",
    prompt: "01_CAMPAIGN_CONCEPT_PROMPT.md",
    response: "02_PASTE_CHATGPT_RESPONSE_HERE.json",
    validation: "03_VALIDATION_RESULT.json",
    validated: "04_VALIDATED_CAMPAIGN_CONCEPTS.json",
    summary: "05_VALIDATION_SUMMARY.txt",
    status: "round-trip-status.json"
  })
});

function getRoundTripPaths(workspaceDir, profileName) {
  const profile = ROUND_TRIP_PROFILES[profileName];

  if (!profile) {
    throw new Error(`Unknown round-trip profile: ${profileName}`);
  }

  return Object.fromEntries(
    Object.entries(profile).map(([key, filename]) => [
      key,
      path.join(workspaceDir, filename)
    ])
  );
}

function requireRoundTripFiles(paths, requiredKeys) {
  const missing = requiredKeys
    .filter((key) => !fileExists(paths[key]))
    .map((key) => paths[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required round-trip file(s):\n- ${missing.join("\n- ")}`
    );
  }
}

function readRoundTripStatus(paths) {
  requireRoundTripFiles(paths, ["status"]);
  return readJson(paths.status);
}

function updateRoundTripStatus(paths, patch) {
  const current = readRoundTripStatus(paths);
  const updated = {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString()
  };

  writeJson(paths.status, updated);
  return updated;
}

module.exports = {
  ROUND_TRIP_PROFILES,
  getRoundTripPaths,
  requireRoundTripFiles,
  readRoundTripStatus,
  updateRoundTripStatus
};
