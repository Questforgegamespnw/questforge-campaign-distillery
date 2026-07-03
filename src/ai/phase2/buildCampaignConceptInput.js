// src/ai/phase2/buildCampaignConceptInput.js

const {
  CONTRACT_VERSION,
  SCHEMA_VERSION
} = require("./campaignConceptSchema");

function cleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanStringArray(value) {
  if (!Array.isArray(value)) return [];

  return [...new Set(
    value
      .map(cleanString)
      .filter(Boolean)
  )];
}

function firstNonEmpty(...values) {
  return values.map(cleanString).find(Boolean) || "";
}

function normalizeContextDecision(value = {}, kind) {
  const isSystem = kind === "system";

  return {
    status: cleanString(value.status) || "undecided",
    ...(isSystem
      ? {
          preferredSystem: cleanString(value.preferredSystem),
          systemsToAvoid: cleanStringArray(value.systemsToAvoid)
        }
      : {
          preferredSetting: cleanString(value.preferredSetting),
          settingConstraints: cleanStringArray(value.settingConstraints)
        })
  };
}

function deriveIdentitySummary(options = {}) {
  const pitch = options.selectedIdentityPitch || {};
  const supplied = options.identitySummary || {};
  const selection = options.selectionRecord || {};
  const sourceContext = options.sourceContext || {};

  return {
    identityTitle: firstNonEmpty(
      supplied.identityTitle,
      pitch.title
    ),
    identityPitch: firstNonEmpty(
      supplied.identityPitch,
      pitch.pitch
    ),
    corePromise: firstNonEmpty(
      supplied.corePromise,
      pitch.about,
      pitch.pitch
    ),
    playEmphasis: cleanStringArray(
      supplied.playEmphasis?.length
        ? supplied.playEmphasis
        : sourceContext.playEmphasis || sourceContext.systemNames
    ),
    tone: cleanStringArray(
      supplied.tone?.length
        ? supplied.tone
        : sourceContext.tone || sourceContext.toneNames
    ),
    genre: cleanStringArray(
      supplied.genre?.length
        ? supplied.genre
        : sourceContext.genre || sourceContext.genreNames
    ),
    environment: cleanStringArray(
      supplied.environment?.length
        ? supplied.environment
        : sourceContext.environment || sourceContext.environmentNames
    ),
    mustPreserve: cleanStringArray([
      ...(supplied.mustPreserve || []),
      ...(selection.likedElements || []),
      ...(options.mustPreserve || [])
    ]),
    mustAvoid: cleanStringArray([
      ...(supplied.mustAvoid || []),
      ...(selection.elementsToAvoid || []),
      ...(options.mustAvoid || []),
      ...(options.safetyProfile?.mustAvoid || [])
    ])
  };
}

/**
 * Build the canonical, provider-agnostic Phase 2 input payload.
 *
 * Required practical inputs:
 * - submissionId
 * - selectedIdentityDirection
 * - selectedIdentityPitch or identitySummary
 *
 * The builder intentionally accepts partially normalized records so the
 * selection handoff format can evolve without changing the prompt contract.
 */
function buildCampaignConceptInput(options = {}) {
  const selection = options.selectionRecord || {};
  const systemDecision = options.systemContext || selection.systemDecision || {};
  const settingDecision = options.settingContext || selection.settingDecision || {};

  return {
    contractVersion: CONTRACT_VERSION,
    schemaVersion: SCHEMA_VERSION,
    submissionId: cleanString(options.submissionId),
    selectedIdentityDirection: firstNonEmpty(
      options.selectedIdentityDirection,
      selection.selectedDirection
    ),
    generationMode: cleanString(options.generationMode) || "three_variants",
    identitySummary: deriveIdentitySummary(options),
    selectionContext: {
      likedElements: cleanStringArray(selection.likedElements),
      elementsToAvoid: cleanStringArray(selection.elementsToAvoid),
      requestedChanges: cleanString(selection.requestedChanges),
      additionalNotes: cleanString(selection.additionalNotes)
    },
    intakeContext: {
      canonicalSummary: cleanString(options.intakeSummary?.canonicalSummary),
      experienceProfile: cleanString(options.intakeSummary?.experienceProfile) || "standard",
      audienceMode: cleanString(options.intakeSummary?.audienceMode) || "standard",
      campaignLength: cleanString(options.intakeSummary?.campaignLength),
      playerCount: cleanString(options.intakeSummary?.playerCount),
      additionalConstraints: cleanStringArray(
        options.intakeSummary?.additionalConstraints
      )
    },
    safetyContext: {
      youthSafeMode: Boolean(options.safetyProfile?.youthSafeMode),
      familyFriendly: Boolean(options.safetyProfile?.familyFriendly),
      horrorRestricted: Boolean(options.safetyProfile?.horrorRestricted),
      graphicContentRestricted: Boolean(
        options.safetyProfile?.graphicContentRestricted
      ),
      oppressiveToneRestricted: Boolean(
        options.safetyProfile?.oppressiveToneRestricted
      ),
      toneGuardrails: cleanStringArray(options.safetyProfile?.toneGuardrails),
      audienceGuardrails: cleanStringArray(
        options.safetyProfile?.audienceGuardrails
      )
    },
    systemContext: normalizeContextDecision(systemDecision, "system"),
    settingContext: normalizeContextDecision(settingDecision, "setting")
  };
}

module.exports = {
  buildCampaignConceptInput,
  cleanString,
  cleanStringArray,
  normalizeContextDecision
};
