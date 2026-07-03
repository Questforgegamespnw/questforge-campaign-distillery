const {
  ALLOWED_DIRECTIONS,
  validateIdentitySelectionRecord
} = require("../validators/validateIdentitySelectionRecord");

const IDENTITY_SELECTION_SCHEMA_VERSION = "0.1.0";

function cleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function toStringArray(value) {
  if (Array.isArray(value)) {
    return value
      .map((entry) => cleanString(entry))
      .filter(Boolean);
  }

  const cleaned = cleanString(value);
  return cleaned ? [cleaned] : [];
}

function normalizeDirection(value = "") {
  return cleanString(value).toLowerCase();
}

function normalizePitchBlock(block = {}) {
  const source = block.output && typeof block.output === "object"
    ? { ...block.output, title: block.title || block.output.title }
    : block;

  return {
    title: cleanString(source.title),
    pitch: cleanString(source.pitch),
    about: cleanString(source.about),
    playersDo: cleanString(source.playersDo),
    hook: cleanString(source.hook || source.distinctHook)
  };
}

function resolveIdentityPitches(value = {}) {
  if (value.identityPitches && typeof value.identityPitches === "object") {
    return value.identityPitches;
  }

  if (value.directions && typeof value.directions === "object") {
    const pitches = {};

    for (const directionKey of ALLOWED_DIRECTIONS) {
      const block = value.directions[directionKey];
      if (!block) continue;
      pitches[directionKey] = normalizePitchBlock(block);
    }

    return pitches;
  }

  if (value.primary || value.adjacent || value.wildcard) {
    return {
      primary: value.primary,
      adjacent: value.adjacent,
      wildcard: value.wildcard
    };
  }

  return {};
}

function normalizeClientResponse(clientResponse = {}, createdAt = "") {
  return {
    selectedBy: cleanString(clientResponse.selectedBy),
    selectedAt: cleanString(clientResponse.selectedAt) || createdAt,
    notes: cleanString(clientResponse.notes),
    liked: cleanString(clientResponse.liked),
    concerns: cleanString(clientResponse.concerns),
    requestedAdjustments: cleanString(clientResponse.requestedAdjustments)
  };
}

function normalizePreservationGuidance(preservationGuidance = {}) {
  return {
    mustPreserve: toStringArray(preservationGuidance.mustPreserve),
    flexible: toStringArray(preservationGuidance.flexible),
    avoid: toStringArray(preservationGuidance.avoid)
  };
}

function buildIdentitySummary(selectedPitch = {}, preservationGuidance = {}, identitySummary = {}) {
  return {
    identityTitle: cleanString(identitySummary.identityTitle) || selectedPitch.title,
    identityPitch: cleanString(identitySummary.identityPitch) || selectedPitch.pitch,
    corePromise: cleanString(identitySummary.corePromise) || selectedPitch.about,
    playEmphasis: toStringArray(identitySummary.playEmphasis).length > 0
      ? toStringArray(identitySummary.playEmphasis)
      : toStringArray(selectedPitch.playersDo),
    hook: cleanString(identitySummary.hook) || selectedPitch.hook,
    tone: toStringArray(identitySummary.tone),
    genre: toStringArray(identitySummary.genre),
    environment: toStringArray(identitySummary.environment),
    mustPreserve: toStringArray(identitySummary.mustPreserve).length > 0
      ? toStringArray(identitySummary.mustPreserve)
      : preservationGuidance.mustPreserve,
    mustAvoid: toStringArray(identitySummary.mustAvoid).length > 0
      ? toStringArray(identitySummary.mustAvoid)
      : preservationGuidance.avoid
  };
}

function buildSelectionRecord({
  selectedDirection,
  clientResponse = {},
  preservationGuidance = {}
} = {}) {
  return {
    selectedDirection,
    likedElements: toStringArray(clientResponse.likedElements || clientResponse.liked),
    elementsToAvoid: toStringArray(clientResponse.elementsToAvoid || clientResponse.concerns),
    requestedChanges: cleanString(
      clientResponse.requestedChanges || clientResponse.requestedAdjustments
    ),
    additionalNotes: cleanString(clientResponse.additionalNotes || clientResponse.notes),
    mustPreserve: preservationGuidance.mustPreserve,
    flexible: preservationGuidance.flexible,
    mustAvoid: preservationGuidance.avoid
  };
}

function buildIdentitySelectionRecord(options = {}) {
  const identityDocument = options.identityDocument || {};
  const metadata = identityDocument.metadata || {};
  const selectedIdentityDirection = normalizeDirection(options.selectedDirection);
  const createdAt = cleanString(options.createdAt) || new Date().toISOString();
  const pitches = resolveIdentityPitches(identityDocument);
  const selectedIdentityPitch = normalizePitchBlock(pitches[selectedIdentityDirection] || {});
  const preservationGuidance = normalizePreservationGuidance(options.preservationGuidance);
  const clientResponse = normalizeClientResponse(options.clientResponse, createdAt);
  const submissionId =
    cleanString(options.submissionId) ||
    cleanString(identityDocument.submissionId) ||
    cleanString(metadata.submissionId) ||
    cleanString(options.sourceSlug) ||
    "submission";

  const record = {
    recordType: "identity_selection_record",
    schemaVersion: IDENTITY_SELECTION_SCHEMA_VERSION,
    submissionId,
    selectedIdentityDirection,
    selectedIdentityPitch,
    identitySummary: buildIdentitySummary(
      selectedIdentityPitch,
      preservationGuidance,
      options.identitySummary || {}
    ),
    selectionRecord: buildSelectionRecord({
      selectedDirection: selectedIdentityDirection,
      clientResponse,
      preservationGuidance
    }),
    clientResponse,
    preservationGuidance,
    intakeSummary: options.intakeSummary || {},
    safetyProfile: options.safetyProfile || {},
    systemContext: options.systemContext || {
      status: "undecided",
      preferredSystem: "",
      systemsToAvoid: []
    },
    settingContext: options.settingContext || {
      status: "undecided",
      preferredSetting: "",
      settingConstraints: []
    },
    source: {
      sourceFile: cleanString(options.sourceFile) || cleanString(metadata.sourceFile),
      sourceFingerprint:
        cleanString(options.sourceFingerprint) || cleanString(metadata.sourceFingerprint),
      contractVersion: cleanString(metadata.contractVersion),
      schemaVersion: cleanString(metadata.schemaVersion)
    },
    createdAt,
    validation: {
      isValid: false,
      errors: [],
      warnings: [],
      missingFields: []
    }
  };

  return {
    ...record,
    validation: validateIdentitySelectionRecord(record)
  };
}

module.exports = {
  IDENTITY_SELECTION_SCHEMA_VERSION,
  cleanString,
  toStringArray,
  normalizeDirection,
  normalizePitchBlock,
  resolveIdentityPitches,
  buildIdentitySelectionRecord
};
