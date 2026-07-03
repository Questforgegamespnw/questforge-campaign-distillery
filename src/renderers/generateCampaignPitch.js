const {
  sentenceCase,
  cleanClientFacingText
} = require("./pitchCleanup");
const { applyYouthVoiceLayer } = require("../voice/youthVoiceLayer");
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
      ctx.label,
      ctx.toneName
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

  const cleanClientField = (value, fieldName = "body") => cleanClientFacingText(
    applyYouthVoiceLayer(
      applyToneFilters(
        value,
        ctx.toneName,
        ctx.excludeNotes,
        selections
      ),
      {
        experienceProfile: ctx.experienceProfile,
        fieldName,
        selections
      }
    )
  );

  return {
    title: cleanClientFacingText(
      applyYouthVoiceLayer(title, {
        experienceProfile: ctx.experienceProfile,
        fieldName: "title",
        selections
      })
    ),
    pitch: cleanClientField(appendAudienceGuidance(pitch, selections), "pitch"),
    about: cleanClientField(about, "about"),
    playersDo: cleanClientField(playersDo, "playersDo"),
    distinctHook: cleanClientField(distinctHook, "distinctHook"),
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