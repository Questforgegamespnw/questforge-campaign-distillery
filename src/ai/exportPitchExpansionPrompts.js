// src/ai/exportPitchExpansionPrompts.js

const { buildExpansionInput } = require("./buildExpansionInput");
const { buildExpansionPrompt } = require("./expandPitch");

const DIRECTIONS = ["primary", "adjacent", "wildcard"];

function firstObject(...values) {
  return values.find(
    (value) => value && typeof value === "object" && !Array.isArray(value)
  ) || {};
}

function extractCampaignContext(pipelineOutput = {}) {
  const translated = pipelineOutput.translated || {};
  const canonical = pipelineOutput.intake?.canonical || {};
  const canonicalSafety = canonical.safety || {};
  const primary = pipelineOutput.resolved?.primary || pipelineOutput.selected?.primary || {};
  const primaryAdjudication = primary.adjudication || {};
  const adjudicatedSafety = primaryAdjudication.constraints?.safetyProfile || {};

  const resolvedContext = firstObject(
    pipelineOutput.resolvedContext,
    pipelineOutput.campaignContext,
    pipelineOutput.context
  );

  const experienceProfile =
    resolvedContext.experienceProfile ||
    translated.experienceProfile ||
    primary.experienceProfile ||
    primaryAdjudication.experienceProfile ||
    "standard";

  const safety = {
    ...adjudicatedSafety,
    ...canonicalSafety,
    ...firstObject(resolvedContext.safety, resolvedContext.safetyProfile)
  };

  if (experienceProfile === "youth") {
    safety.youthSafeMode = true;
    safety.audienceMode = safety.audienceMode || "youth_safe";
    safety.familyFriendly = true;
  }

  return {
    experienceProfile,
    safety,
    mustInclude: resolvedContext.mustInclude,
    avoid: resolvedContext.avoid,
    toneGuardrails: resolvedContext.toneGuardrails,
    audienceGuardrails: resolvedContext.audienceGuardrails
  };
}

function buildDirectionPrompt(directionKey, pipelineOutput = {}) {
  const clientPitch = pipelineOutput.clientPitch?.[directionKey] || {};
  const resolved = pipelineOutput.resolved?.[directionKey] || {};
  const campaignContext = extractCampaignContext(pipelineOutput);

  const source = {
    title: clientPitch.title || "",
    pitch: clientPitch.pitch || "",
    about: clientPitch.about || "",
    playersDo: clientPitch.playersDo || "",
    hook: clientPitch.distinctHook || clientPitch.hook || ""
  };

  const expansionInput = buildExpansionInput(
    { ...resolved, label: resolved.label || directionKey },
    source,
    campaignContext
  );

  return {
    title: source.title,
    structured: clientPitch,
    expansionInput,
    prompt: buildExpansionPrompt(expansionInput)
  };
}

function exportPitchExpansionPrompts(pipelineOutput = {}) {
  const result = {};

  for (const directionKey of DIRECTIONS) {
    result[directionKey] = buildDirectionPrompt(directionKey, pipelineOutput);
  }

  return result;
}

module.exports = {
  DIRECTIONS,
  extractCampaignContext,
  buildDirectionPrompt,
  exportPitchExpansionPrompts
};
