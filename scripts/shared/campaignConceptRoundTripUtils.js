// scripts/campaignConceptRoundTripUtils.js

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const {
  buildCampaignConceptInput,
  buildCampaignConceptPrompt,
  buildOutputSkeleton,
  validateCampaignConceptInput
} = require("../../src/ai/phase2");

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
        title: block.title || block.output?.title || "",
        ...(block.output || {})
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

  if (!allowed.includes(directionKey)) {
    throw new Error(`--direction must be one of: ${allowed.join(", ")}.`);
  }

  const pitch = pitches[directionKey];
  if (!pitch || typeof pitch !== "object") {
    throw new Error(`Selected direction was not found: ${directionKey}`);
  }

  for (const field of ["title", "pitch", "about", "playersDo", "hook"]) {
    if (!cleanString(pitch[field])) {
      throw new Error(`Selected Identity Pitch is missing ${directionKey}.${field}.`);
    }
  }

  return pitch;
}

function createDefaultHandoff(options = {}) {
  const pitch = options.selectedIdentityPitch;
  const directionKey = options.selectedIdentityDirection;
  const sourceName = path.parse(options.identityFile).name;

  return {
    handoffVersion: "0.1.0",
    submissionId: cleanString(options.submissionId) || sourceName,
    selectedIdentityDirection: directionKey,
    generationMode: "three_variants",
    selectedIdentityPitch: {
      title: pitch.title,
      pitch: pitch.pitch,
      about: pitch.about,
      playersDo: pitch.playersDo,
      hook: pitch.hook
    },
    identitySummary: {
      identityTitle: pitch.title,
      identityPitch: pitch.pitch,
      corePromise: pitch.about,
      playEmphasis: [pitch.playersDo],
      tone: ["Preserve the tone established by the selected Identity Pitch"],
      genre: ["Do not assume a more specific genre than the selected Identity Pitch supports"],
      environment: [],
      mustPreserve: [],
      mustAvoid: []
    },
    selectionRecord: {
      selectedDirection: directionKey,
      likedElements: [],
      elementsToAvoid: [],
      requestedChanges: "",
      additionalNotes: ""
    },
    intakeSummary: {
      canonicalSummary: "",
      experienceProfile: "standard",
      audienceMode: "standard",
      campaignLength: "",
      playerCount: "",
      additionalConstraints: []
    },
    safetyProfile: {
      youthSafeMode: false,
      familyFriendly: false,
      horrorRestricted: false,
      graphicContentRestricted: false,
      oppressiveToneRestricted: false,
      toneGuardrails: [],
      audienceGuardrails: [],
      mustAvoid: []
    },
    systemContext: {
      status: "undecided",
      preferredSystem: "",
      systemsToAvoid: []
    },
    settingContext: {
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

  if (handoff.selectedIdentityDirection !== directionKey) {
    errors.push(
      `Handoff selectedIdentityDirection must remain ${directionKey}; received ${handoff.selectedIdentityDirection || "missing"}.`
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
  readJson,
  writeJson,
  cleanString,
  stableValue,
  createFingerprint,
  resolveIdentityPitches,
  assertDirection,
  createDefaultHandoff,
  buildInputFromHandoff,
  validateHandoffAgainstIdentity,
  buildRoundTripPrompt,
  buildWorkspaceStatus,
  buildOutputSkeleton,
  validateCampaignConceptInput
};
