// scripts/shared/campaignConceptRoundTripUtils.js

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const {
  buildCampaignConceptInput,
  buildCampaignConceptPrompt,
  buildOutputSkeleton,
  validateCampaignConceptInput
} = require("../../src/ai/phase2");
const {
  validateIdentitySelectionRecord
} = require("../../src/validators/validateIdentitySelectionRecord");

const IDENTITY_SELECTION_RECORD_TYPE = "identity_selection_record";

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function cleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function stringArray(value, fallback = []) {
  if (Array.isArray(value)) {
    const cleaned = value.map(cleanString).filter(Boolean);
    return cleaned.length > 0 ? cleaned : fallback;
  }

  const cleaned = cleanString(value);
  return cleaned ? [cleaned] : fallback;
}

function plainObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);

  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((result, key) => {
        result[key] = stableValue(value[key]);
        return result;
      }, {});
  }

  return value;
}

function createFingerprint(value) {
  const serialized = JSON.stringify(stableValue(value));
  const digest = crypto.createHash("sha256").update(serialized).digest("hex");
  return `sha256:${digest}`;
}

function isIdentitySelectionRecord(value = {}) {
  return Boolean(
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    value.recordType === IDENTITY_SELECTION_RECORD_TYPE
  );
}

function resolveIdentityPitches(value = {}) {
  if (value.identityPitches && typeof value.identityPitches === "object") {
    return value.identityPitches;
  }

  if (value.directions && typeof value.directions === "object") {
    const pitches = {};

    for (const directionKey of ["primary", "adjacent", "wildcard"]) {
      const block = value.directions[directionKey];
      if (!block) continue;

      pitches[directionKey] = {
        title: block.title || block.output?.title || block.source?.title || "",
        ...(block.output || {}),
        context: block.context || {},
        constraints: block.constraints || {},
        source: block.source || {}
      };
    }

    return pitches;
  }

  if (
    value.primary &&
    value.adjacent &&
    value.wildcard
  ) {
    return value;
  }

  throw new Error(
    "Could not find Identity Pitches. Expected identityPitches, directions, or primary/adjacent/wildcard keys."
  );
}

function assertDirection(directionKey, pitches) {
  const allowed = ["primary", "adjacent", "wildcard"];
  const normalizedDirection = cleanString(directionKey).toLowerCase();

  if (!allowed.includes(normalizedDirection)) {
    throw new Error(`--direction must be one of: ${allowed.join(", ")}.`);
  }

  const pitch = pitches[normalizedDirection];
  if (!pitch || typeof pitch !== "object") {
    throw new Error(`Selected direction was not found: ${normalizedDirection}`);
  }

  for (const field of ["title", "pitch", "about", "playersDo", "hook"]) {
    if (!cleanString(pitch[field])) {
      throw new Error(`Selected Identity Pitch is missing ${normalizedDirection}.${field}.`);
    }
  }

  return pitch;
}

function assertIdentitySelectionRecord(record = {}, requestedDirection = "") {
  const validation = validateIdentitySelectionRecord(record);

  if (!validation.isValid) {
    throw new Error(
      `Identity Selection Record is invalid:\n- ${validation.errors.join("\n- ")}`
    );
  }

  const selectedDirection = cleanString(record.selectedIdentityDirection).toLowerCase();
  const requested = cleanString(requestedDirection).toLowerCase();

  if (requested && requested !== selectedDirection) {
    throw new Error(
      `Identity Selection Record already selects ${selectedDirection}; received conflicting --direction ${requested}.`
    );
  }

  const selectedPitch = assertDirection(selectedDirection, {
    [selectedDirection]: record.selectedIdentityPitch
  });

  return {
    selectedDirection,
    selectedPitch,
    validation
  };
}

function resolveIdentitySource(value = {}, directionKey = "") {
  if (isIdentitySelectionRecord(value)) {
    const resolved = assertIdentitySelectionRecord(value, directionKey);

    return {
      sourceType: "identity_selection_record",
      selectedIdentityDirection: resolved.selectedDirection,
      selectedIdentityPitch: resolved.selectedPitch,
      identitySelectionRecord: value,
      identityPitches: {
        [resolved.selectedDirection]: resolved.selectedPitch
      },
      validation: resolved.validation
    };
  }

  const normalizedDirection = cleanString(directionKey).toLowerCase();

  if (!normalizedDirection) {
    throw new Error(
      "--direction is required when the source is a validated Identity Pitches file. Identity Selection Records already contain their selected direction."
    );
  }

  const pitches = resolveIdentityPitches(value);
  const selectedPitch = assertDirection(normalizedDirection, pitches);

  return {
    sourceType: "validated_identity_pitches",
    selectedIdentityDirection: normalizedDirection,
    selectedIdentityPitch: selectedPitch,
    identitySelectionRecord: null,
    identityPitches: pitches,
    validation: null
  };
}

function buildIdentitySummaryFromSelectionRecord(record = {}, pitch = {}) {
  const recordSummary = plainObject(record.identitySummary);
  const preservation = plainObject(record.preservationGuidance);

  return {
    identityTitle: cleanString(recordSummary.identityTitle) || pitch.title,
    identityPitch: cleanString(recordSummary.identityPitch) || pitch.pitch,
    corePromise: cleanString(recordSummary.corePromise) || pitch.about,
    playEmphasis: stringArray(recordSummary.playEmphasis, [pitch.playersDo].filter(Boolean)),
    tone: stringArray(recordSummary.tone, [
      "Preserve the tone established by the selected Identity Pitch"
    ]),
    genre: stringArray(recordSummary.genre, [
      "Do not assume a more specific genre than the selected Identity Pitch supports"
    ]),
    environment: stringArray(recordSummary.environment),
    mustPreserve: stringArray(recordSummary.mustPreserve, stringArray(preservation.mustPreserve)),
    mustAvoid: stringArray(recordSummary.mustAvoid, stringArray(preservation.avoid))
  };
}

function buildSelectionRecordFromIdentitySelection(record = {}, directionKey = "") {
  const selection = plainObject(record.selectionRecord);
  const clientResponse = plainObject(record.clientResponse);
  const preservation = plainObject(record.preservationGuidance);

  return {
    selectedDirection: cleanString(selection.selectedDirection) || directionKey,
    likedElements: stringArray(
      selection.likedElements,
      stringArray(clientResponse.liked)
    ),
    elementsToAvoid: stringArray(
      selection.elementsToAvoid,
      stringArray(clientResponse.concerns)
    ),
    requestedChanges: cleanString(selection.requestedChanges) ||
      cleanString(clientResponse.requestedAdjustments),
    additionalNotes: cleanString(selection.additionalNotes) ||
      cleanString(clientResponse.notes),
    mustPreserve: stringArray(selection.mustPreserve, stringArray(preservation.mustPreserve)),
    flexible: stringArray(selection.flexible, stringArray(preservation.flexible)),
    mustAvoid: stringArray(selection.mustAvoid, stringArray(preservation.avoid))
  };
}

function createDefaultHandoff(options = {}) {
  const identitySelectionRecord = options.identitySelectionRecord || null;
  const pitch = identitySelectionRecord?.selectedIdentityPitch || options.selectedIdentityPitch;
  const directionKey = cleanString(
    identitySelectionRecord?.selectedIdentityDirection ||
    options.selectedIdentityDirection
  ).toLowerCase();
  const sourceName = path.parse(options.identityFile).name;
  const submissionId =
    cleanString(options.submissionId) ||
    cleanString(identitySelectionRecord?.submissionId) ||
    sourceName;

  const pitchContext = plainObject(pitch.context);
  const pitchConstraints = plainObject(pitch.constraints);

  const identitySummary = identitySelectionRecord
    ? buildIdentitySummaryFromSelectionRecord(identitySelectionRecord, pitch)
    : {
        identityTitle: pitch.title,
        identityPitch: pitch.pitch,
        corePromise: pitch.about,
        playEmphasis: [pitch.playersDo].filter(Boolean),
        tone: pitchContext.toneName
          ? [pitchContext.toneName]
          : ["Preserve the tone established by the selected Identity Pitch"],
        genre: pitchContext.genreName
          ? [pitchContext.genreName]
          : ["Do not assume a more specific genre than the selected Identity Pitch supports"],
        environment: stringArray(pitchContext.environmentNames),
        mustPreserve: stringArray(pitchConstraints.mustInclude),
        mustAvoid: stringArray(pitchConstraints.avoid)
      };

  const selectionRecord = identitySelectionRecord
    ? buildSelectionRecordFromIdentitySelection(identitySelectionRecord, directionKey)
    : {
        selectedDirection: directionKey,
        likedElements: [],
        elementsToAvoid: [],
        requestedChanges: "",
        additionalNotes: ""
      };

  return {
    handoffVersion: "0.1.0",
    submissionId,
    selectedIdentityDirection: directionKey,
    generationMode: "three_variants",
    sourceIdentitySelectionRecord: identitySelectionRecord
      ? {
          recordType: identitySelectionRecord.recordType,
          schemaVersion: identitySelectionRecord.schemaVersion,
          sourceFingerprint: identitySelectionRecord.source?.sourceFingerprint || ""
        }
      : null,
    selectedIdentityPitch: {
      title: pitch.title,
      pitch: pitch.pitch,
      about: pitch.about,
      playersDo: pitch.playersDo,
      hook: pitch.hook,
      context: pitch.context || {},
      constraints: pitch.constraints || {},
      source: pitch.source || {}
    },
    identitySummary,
    selectionRecord,
    intakeSummary: identitySelectionRecord?.intakeSummary || {
      canonicalSummary: "",
      experienceProfile: "standard",
      audienceMode: "standard",
      campaignLength: "",
      playerCount: "",
      additionalConstraints: []
    },
    safetyProfile: identitySelectionRecord?.safetyProfile || {
      youthSafeMode: false,
      familyFriendly: false,
      horrorRestricted: false,
      graphicContentRestricted: false,
      oppressiveToneRestricted: false,
      toneGuardrails: [],
      audienceGuardrails: [],
      mustAvoid: []
    },
    systemContext: identitySelectionRecord?.systemContext || {
      status: "undecided",
      preferredSystem: "",
      systemsToAvoid: []
    },
    settingContext: identitySelectionRecord?.settingContext || {
      status: "undecided",
      preferredSetting: "",
      settingConstraints: []
    },
    operatorNotes: {
      reviewBeforeGeneration: [
        "Add client-liked elements and requested changes when available.",
        "Replace the generic tone and genre entries when the approved intake provides more specific guidance.",
        "Confirm or update system and setting status before generating Phase 2 concepts."
      ]
    }
  };
}

function buildInputFromHandoff(handoff = {}) {
  return buildCampaignConceptInput({
    submissionId: handoff.submissionId,
    selectedIdentityDirection: handoff.selectedIdentityDirection,
    generationMode: handoff.generationMode,
    selectedIdentityPitch: handoff.selectedIdentityPitch,
    identitySummary: handoff.identitySummary,
    selectionRecord: handoff.selectionRecord,
    intakeSummary: handoff.intakeSummary,
    safetyProfile: handoff.safetyProfile,
    systemContext: handoff.systemContext,
    settingContext: handoff.settingContext,
    mustPreserve: handoff.identitySummary?.mustPreserve,
    mustAvoid: handoff.identitySummary?.mustAvoid
  });
}

function validateHandoffAgainstIdentity(handoff, directionKey, pitch) {
  const errors = [];
  const normalizedDirection = cleanString(directionKey).toLowerCase();

  if (handoff.selectedIdentityDirection !== normalizedDirection) {
    errors.push(
      `Handoff selectedIdentityDirection must remain ${normalizedDirection}; received ${handoff.selectedIdentityDirection || "missing"}.`
    );
  }

  const selected = handoff.selectedIdentityPitch || {};

  for (const field of ["title", "pitch", "about", "playersDo", "hook"]) {
    if (selected[field] !== pitch[field]) {
      errors.push(
        `Handoff selectedIdentityPitch.${field} no longer matches the validated Identity Pitch.`
      );
    }
  }

  return errors;
}

function validatePhase2IdentityMetadataPreserved({
  identitySource = {},
  handoff = {},
  input = {}
} = {}) {
  const errors = [];
  const warnings = [];

  const pitch = identitySource.selectedIdentityPitch || handoff.selectedIdentityPitch || {};
  const identitySelectionRecord = identitySource.identitySelectionRecord || null;
  const recordSummary = plainObject(identitySelectionRecord?.identitySummary);
  const preservation = plainObject(identitySelectionRecord?.preservationGuidance);
  const context = plainObject(pitch.context);
  const constraints = plainObject(pitch.constraints);
  const summary = plainObject(input.identitySummary || handoff.identitySummary);

  const expectedGenre = stringArray(recordSummary.genre,
    context.genreName ? [context.genreName] : []
  );
  const expectedTone = stringArray(recordSummary.tone,
    context.toneName ? [context.toneName] : []
  );
  const expectedEnvironment = stringArray(recordSummary.environment,
    stringArray(context.environmentNames)
  );
  const expectedMustPreserve = stringArray(
    recordSummary.mustPreserve,
    stringArray(preservation.mustPreserve, stringArray(constraints.mustInclude))
  );
  const expectedMustAvoid = stringArray(
    recordSummary.mustAvoid,
    stringArray(preservation.avoid, stringArray(constraints.avoid))
  );

  const actualGenre = stringArray(summary.genre);
  const actualTone = stringArray(summary.tone);
  const actualEnvironment = stringArray(summary.environment);
  const actualMustPreserve = stringArray(summary.mustPreserve);
  const actualMustAvoid = stringArray(summary.mustAvoid);

  for (const genre of expectedGenre) {
    if (!actualGenre.includes(genre)) {
      errors.push(`Phase 2 input dropped selected identity genre: ${genre}`);
    }
  }

  for (const tone of expectedTone) {
    if (!actualTone.includes(tone)) {
      errors.push(`Phase 2 input dropped selected identity tone: ${tone}`);
    }
  }

  for (const environment of expectedEnvironment) {
    if (!actualEnvironment.includes(environment)) {
      errors.push(`Phase 2 input dropped selected identity environment: ${environment}`);
    }
  }

  for (const item of expectedMustPreserve) {
    if (!actualMustPreserve.includes(item)) {
      errors.push(`Phase 2 input dropped selected identity mustPreserve item: ${item}`);
    }
  }

  for (const item of expectedMustAvoid) {
    if (!actualMustAvoid.includes(item)) {
      errors.push(`Phase 2 input dropped selected identity mustAvoid item: ${item}`);
    }
  }

  if (expectedEnvironment.length === 0 && actualEnvironment.length === 0) {
    warnings.push(
      "Phase 2 identitySummary.environment is empty; confirm this is intentional and not a lost Phase 1 environment signal."
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

function buildRoundTripPrompt(input, fingerprint) {
  const basePrompt = buildCampaignConceptPrompt(input);

  return `# QuestForge Phase 2 Campaign Concept Development\n\n` +
    `This is a manual, source-bound round trip. The source fingerprint for this package is:\n\n` +
    `\`${fingerprint}\`\n\n` +
    `Paste this entire file into ChatGPT. Return only the JSON object requested below.\n\n` +
    `---\n\n${basePrompt}\n`;
}

function buildWorkspaceStatus(options = {}) {
  return {
    workflow: "phase2_campaign_concept_manual_round_trip",
    contractVersion: options.input.contractVersion,
    schemaVersion: options.input.schemaVersion,
    sourceIdentityFile: options.sourceIdentityFile,
    handoffFile: options.handoffFile,
    selectedIdentityDirection: options.input.selectedIdentityDirection,
    generationMode: options.input.generationMode,
    sourceFingerprint: options.fingerprint,
    workspace: options.workspace,
    stage: "awaiting_chatgpt_response",
    promptGenerated: true,
    responseImported: false,
    validationRun: false,
    completed: false,
    files: {
      handoff: "00_PHASE2_HANDOFF.json",
      prompt: "01_CAMPAIGN_CONCEPT_PROMPT.md",
      waitingResponse: "02_PASTE_CHATGPT_RESPONSE_HERE.json",
      validationResult: "03_VALIDATION_RESULT.json",
      validatedConcepts: "04_VALIDATED_CAMPAIGN_CONCEPTS.json",
      summary: "05_VALIDATION_SUMMARY.txt"
    },
    nextAction:
      "Paste the entire contents of 01_CAMPAIGN_CONCEPT_PROMPT.md into one ChatGPT conversation, then replace 02_PASTE_CHATGPT_RESPONSE_HERE.json with the returned JSON object."
  };
}

module.exports = {
  IDENTITY_SELECTION_RECORD_TYPE,
  readJson,
  writeJson,
  cleanString,
  stableValue,
  createFingerprint,
  isIdentitySelectionRecord,
  resolveIdentityPitches,
  assertDirection,
  assertIdentitySelectionRecord,
  resolveIdentitySource,
  createDefaultHandoff,
  buildInputFromHandoff,
  validateHandoffAgainstIdentity,
  validatePhase2IdentityMetadataPreserved,
  buildRoundTripPrompt,
  buildWorkspaceStatus,
  buildOutputSkeleton,
  validateCampaignConceptInput
};
