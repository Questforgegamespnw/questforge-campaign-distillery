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

function uniqueStringArray(...values) {
  const seen = new Set();
  const result = [];

  for (const value of values) {
    for (const entry of toStringArray(value)) {
      if (seen.has(entry)) continue;
      seen.add(entry);
      result.push(entry);
    }
  }

  return result;
}

function plainObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function hasOwnValue(value) {
  return Boolean(
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.keys(value).length > 0
  );
}

function normalizeDirection(value = "") {
  return cleanString(value).toLowerCase();
}

function normalizePitchBlock(block = {}) {
  const rawBlock = plainObject(block);
  const output = plainObject(rawBlock.output);
  const deterministicSource = plainObject(rawBlock.source);
  const source = hasOwnValue(output)
    ? {
        ...output,
        title:
          rawBlock.title ||
          output.title ||
          deterministicSource.title
      }
    : rawBlock;

  return {
    title: cleanString(source.title),
    pitch: cleanString(source.pitch),
    about: cleanString(source.about),
    playersDo: cleanString(source.playersDo),
    hook: cleanString(source.hook || source.distinctHook),
    context: plainObject(source.context || rawBlock.context),
    constraints: plainObject(source.constraints || rawBlock.constraints),
    source: deterministicSource
  };
}

function normalizePitchCollection(pitches = {}) {
  const normalized = {};

  for (const directionKey of ALLOWED_DIRECTIONS) {
    const block = pitches[directionKey];
    if (!block) continue;
    normalized[directionKey] = normalizePitchBlock(block);
  }

  return normalized;
}

function resolveIdentityPitches(value = {}) {
  if (value.identityPitches && typeof value.identityPitches === "object") {
    return normalizePitchCollection(value.identityPitches);
  }

  if (value.directions && typeof value.directions === "object") {
    return normalizePitchCollection(value.directions);
  }

  if (value.primary || value.adjacent || value.wildcard) {
    return normalizePitchCollection({
      primary: value.primary,
      adjacent: value.adjacent,
      wildcard: value.wildcard
    });
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
  const context = plainObject(selectedPitch.context);
  const constraints = plainObject(selectedPitch.constraints);

  return {
    identityTitle: cleanString(identitySummary.identityTitle) || selectedPitch.title,
    identityPitch: cleanString(identitySummary.identityPitch) || selectedPitch.pitch,
    corePromise: cleanString(identitySummary.corePromise) || selectedPitch.about,
    playEmphasis: toStringArray(identitySummary.playEmphasis).length > 0
      ? toStringArray(identitySummary.playEmphasis)
      : toStringArray(selectedPitch.playersDo),
    hook: cleanString(identitySummary.hook) || selectedPitch.hook,
    tone: toStringArray(identitySummary.tone).length > 0
      ? toStringArray(identitySummary.tone)
      : toStringArray(context.toneName),
    genre: toStringArray(identitySummary.genre).length > 0
      ? toStringArray(identitySummary.genre)
      : toStringArray(context.genreName),
    environment: toStringArray(identitySummary.environment).length > 0
      ? toStringArray(identitySummary.environment)
      : toStringArray(context.environmentNames),
    mustPreserve: uniqueStringArray(
      constraints.mustInclude,
      preservationGuidance.mustPreserve,
      identitySummary.mustPreserve
    ),
    mustAvoid: uniqueStringArray(
      constraints.avoid,
      preservationGuidance.avoid,
      identitySummary.mustAvoid
    )
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

function buildIntakeSummary(selectedPitch = {}, provided = {}) {
  const constraints = plainObject(selectedPitch.constraints);

  return {
    canonicalSummary: cleanString(provided.canonicalSummary),
    experienceProfile:
      cleanString(provided.experienceProfile) ||
      cleanString(constraints.experienceProfile) ||
      "standard",
    audienceMode:
      cleanString(provided.audienceMode) ||
      cleanString(constraints.audienceMode) ||
      "standard",
    campaignLength: cleanString(provided.campaignLength),
    playerCount: cleanString(provided.playerCount),
    additionalConstraints: toStringArray(provided.additionalConstraints)
  };
}

function buildSafetyProfile(selectedPitch = {}, provided = {}) {
  const constraints = plainObject(selectedPitch.constraints);

  return {
    youthSafeMode: Boolean(provided.youthSafeMode ?? constraints.youthSafeMode),
    familyFriendly: Boolean(provided.familyFriendly ?? constraints.familyFriendly),
    horrorRestricted: Boolean(provided.horrorRestricted ?? constraints.horrorRestricted),
    graphicContentRestricted: Boolean(
      provided.graphicContentRestricted ?? constraints.graphicContentRestricted
    ),
    oppressiveToneRestricted: Boolean(
      provided.oppressiveToneRestricted ?? constraints.oppressiveToneRestricted
    ),
    toneGuardrails: toStringArray(
      toStringArray(provided.toneGuardrails).length > 0
        ? provided.toneGuardrails
        : constraints.toneGuardrails
    ),
    audienceGuardrails: toStringArray(
      toStringArray(provided.audienceGuardrails).length > 0
        ? provided.audienceGuardrails
        : constraints.audienceGuardrails
    ),
    mustAvoid: uniqueStringArray(
      constraints.avoid,
      provided.mustAvoid
    )
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
    intakeSummary: buildIntakeSummary(
      selectedIdentityPitch,
      options.intakeSummary || {}
    ),
    safetyProfile: buildSafetyProfile(
      selectedIdentityPitch,
      options.safetyProfile || {}
    ),
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
