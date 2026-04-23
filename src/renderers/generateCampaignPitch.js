const { sentenceCase } = require("./pitchCleanup");
const {
  getAdjudication,
  getSafetyProfile,
  getHandoffGuidance,
  appendAudienceGuidance,
  applyToneFilters
} = require("./pitchSafetyFilters");
const { buildPitchContext } = require("./pitchCore");
const {
  buildTitle,
  buildAbout,
  buildPlayersDo,
  buildDistinctHook
} = require("./pitchSectionBuilders");
const {
  buildPitchParagraph,
  buildAIBrief
} = require("./pitchAssembly");

function generateCampaignPitch(selections = {}) {
  const ctx = buildPitchContext(selections);

  const adjudication = getAdjudication(selections);
  const safetyProfile = getSafetyProfile(selections);
  const handoffGuidance = getHandoffGuidance(selections);

  const title = buildTitle({
    genreName: ctx.genreName,
    coreAName: ctx.coreAName,
    systemAName: ctx.systemAName,
    label: ctx.label
  });

  const about = sentenceCase(
    buildAbout(
      ctx.coreA,
      ctx.coreB,
      ctx.includeNotes,
      ctx.experienceProfile
    )
  );

  const playersDo = sentenceCase(
    buildPlayersDo(
      ctx.systemA,
      ctx.systemB,
      ctx.experienceProfile,
      ctx.label
    )
  );

  const distinctHook = sentenceCase(
    buildDistinctHook({
      genre: ctx.genre,
      tone: ctx.tone,
      environments: ctx.environmentSkins,
      label: ctx.label,
      experienceProfile: ctx.experienceProfile,
      coreIds: ctx.coreIds
    })
  );

  const pitch = buildPitchParagraph({
    label: ctx.label,
    coreA: ctx.coreA,
    coreB: ctx.coreB,
    systemA: ctx.systemA,
    systemB: ctx.systemB,
    genreName: ctx.genreName,
    toneName: ctx.toneName,
    envNames: ctx.envNames,
    coreIds: ctx.coreIds,
    includeNotes: ctx.includeNotes,
    excludeNotes: ctx.excludeNotes,
    experienceProfile: ctx.experienceProfile
  });

  const aiBrief = buildAIBrief({
    label: ctx.label,
    emphasis: ctx.emphasis,
    title,
    coreFrames: ctx.coreFrames,
    systemFrames: ctx.systemFrames,
    genre: ctx.genre,
    tone: ctx.tone,
    environments: ctx.environmentSkins,
    includeNotes: ctx.includeNotes,
    excludeNotes: ctx.excludeNotes,
    about,
    playersDo,
    distinctHook,
    selections
  });

  return {
    title,
    pitch: applyToneFilters(
      appendAudienceGuidance(pitch, selections),
      ctx.toneName,
      ctx.excludeNotes,
      selections
    ),
    about: applyToneFilters(
      about,
      ctx.toneName,
      ctx.excludeNotes,
      selections
    ),
    playersDo: applyToneFilters(
      playersDo,
      ctx.toneName,
      ctx.excludeNotes,
      selections
    ),
    distinctHook: applyToneFilters(
      distinctHook,
      ctx.toneName,
      ctx.excludeNotes,
      selections
    ),
    aiBrief,
    adjudicationSummary: {
      experienceProfile: ctx.experienceProfile,
      safetyProfile,
      handoffGuidance,
      confidence: adjudication.confidence || {},
      suppressed: adjudication.suppressed || []
    }
  };
}

module.exports = {
  generateCampaignPitch
};