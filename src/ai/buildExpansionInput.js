// src/ai/buildExpansionInput.js

const { DIRECTION_INTENTS } = require("./expansionContract");

function summarizeNames(entries) {
  return (entries || []).map((entry) => entry?.name).filter(Boolean);
}

function asText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null);
}

function normalizeSource(source) {
  if (typeof source === "string") {
    return {
      title: "",
      pitch: source.trim(),
      about: "",
      playersDo: "",
      hook: ""
    };
  }

  const value = source || {};
  return {
    title: asText(value.title),
    pitch: asText(value.pitch),
    about: asText(value.about),
    playersDo: asText(value.playersDo),
    hook: asText(value.hook || value.distinctHook)
  };
}

function normalizeNoteList(value) {
  if (Array.isArray(value)) {
    return value.map(asText).filter(Boolean);
  }

  const text = asText(value);
  return text ? [text] : [];
}

function mergeNoteLists(...values) {
  return [...new Set(values.flatMap(normalizeNoteList))];
}


function summarizeContextNames(entries) {
  return (entries || [])
    .map((entry) => {
      if (typeof entry === "string") return entry.trim();
      if (entry && typeof entry === "object") return entry.name || entry.id || "";
      return "";
    })
    .filter(Boolean);
}

function getGenreContext(directionBundle = {}) {
  const metadata = directionBundle.contextMetadata || {};

  return {
    legacyGenre: summarizeNames(directionBundle.genreSkin),
    eras: summarizeContextNames(metadata.eraFrames || directionBundle.eraFrames),
    aesthetics: summarizeContextNames(metadata.aestheticSkins || directionBundle.aestheticSkins),
    worldConditions: summarizeContextNames(metadata.worldConditions || directionBundle.worldConditions)
  };
}

function getSafetyContext(directionBundle = {}, campaignContext = {}) {
  const adjudication = directionBundle.adjudication || {};
  const constraints = adjudication.constraints || {};
  const safetyProfile = constraints.safetyProfile || {};
  const guidance = adjudication.handoffGuidance || {};
  const finalSafety = campaignContext.safety || campaignContext.safetyProfile || {};

  const experienceProfile = asText(
    firstDefined(
      campaignContext.experienceProfile,
      adjudication.experienceProfile,
      directionBundle.experienceProfile,
      "standard"
    )
  ).toLowerCase() || "standard";

  const softerThemesMode =
    experienceProfile === "youth" ||
    Boolean(
      firstDefined(
        finalSafety.softerThemesMode,
        campaignContext.softerThemesMode,
        safetyProfile.softerThemesMode,
        false
      )
    );

  const fullSafeMode =
    experienceProfile === "kids" ||
    Boolean(
      firstDefined(
        finalSafety.fullSafeMode,
        campaignContext.fullSafeMode,
        safetyProfile.fullSafeMode,
        safetyProfile.youthSafeMode,
        false
      )
    );

  const youthSafeMode = fullSafeMode;

  // Audience mode is an independent intake fact. Do not derive or overwrite it
  // from the experience profile; only fall back to "standard" when absent.
  const audienceMode = asText(
    firstDefined(
      finalSafety.audienceMode,
      campaignContext.audienceMode,
      safetyProfile.audienceMode,
      "standard"
    )
  ) || "standard";

  return {
    experienceProfile,
    audienceMode,
    youthSafeMode,
    softerThemesMode,
    fullSafeMode,
    heroKidsMode: Boolean(
      firstDefined(
        finalSafety.heroKidsMode,
        campaignContext.heroKidsMode,
        safetyProfile.heroKidsMode,
        fullSafeMode
      )
    ),
    familyFriendly: Boolean(
      firstDefined(
        finalSafety.familyFriendly,
        campaignContext.familyFriendly,
        safetyProfile.familyFriendly,
        softerThemesMode || fullSafeMode,
        false
      )
    ),
    horrorRestricted: Boolean(
      firstDefined(
        finalSafety.horrorRestricted,
        campaignContext.horrorRestricted,
        safetyProfile.horrorRestricted,
        false
      )
    ),
    graphicContentRestricted: Boolean(
      firstDefined(
        finalSafety.graphicContentRestricted,
        campaignContext.graphicContentRestricted,
        safetyProfile.graphicContentRestricted,
        false
      )
    ),
    oppressiveToneRestricted: Boolean(
      firstDefined(
        finalSafety.oppressiveToneRestricted,
        campaignContext.oppressiveToneRestricted,
        safetyProfile.oppressiveToneRestricted,
        false
      )
    ),
    toneGuardrails: mergeNoteLists(
      campaignContext.toneGuardrails,
      finalSafety.toneGuardrails,
      guidance.toneGuardrails
    ),
    audienceGuardrails: mergeNoteLists(
      campaignContext.audienceGuardrails,
      finalSafety.audienceGuardrails,
      guidance.audienceGuardrails
    )
  };
}

function buildExpansionInput(directionBundle = {}, source = {}, campaignContext = {}) {
  const directionKey = asText(directionBundle.label).toLowerCase();
  const guidance = directionBundle.adjudication?.handoffGuidance || {};

  return {
    contractVersion: "0.9.1",
    direction: {
      key: directionKey,
      intent: DIRECTION_INTENTS[directionKey] || "preserve the supplied campaign direction"
    },
    source: normalizeSource(source),
    context: {
      coreNames: summarizeNames(directionBundle.coreFrames),
      systemNames: summarizeNames(directionBundle.systemFrames),
      genreName: summarizeNames(directionBundle.genreSkin)[0] || "",
      toneName: summarizeNames(directionBundle.toneSkin)[0] || "",
      environmentNames: summarizeNames(directionBundle.environmentSkins),
      genreContext: getGenreContext(directionBundle)
    },
    constraints: {
      mustInclude: mergeNoteLists(
        directionBundle.includeNotes,
        guidance.mustInclude,
        campaignContext.mustInclude
      ),
      avoid: mergeNoteLists(
        directionBundle.excludeNotes,
        guidance.avoid,
        campaignContext.avoid
      ),
      ...getSafetyContext(directionBundle, campaignContext)
    }
  };
}

module.exports = {
  buildExpansionInput,
  getSafetyContext,
  normalizeSource,
  getGenreContext
};
