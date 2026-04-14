/**
 * Builds a short campaign pitch from selected frames and skins.
 *
 * @param {object} selections
 * @returns {{
 *   pitch: string,
 *   about: string,
 *   playersDo: string,
 *   distinctHook: string
 * }}
 */
function generateCampaignPitch(selections) {
  const coreA = selections.coreFrames?.[0];
  const coreB = selections.coreFrames?.[1];
  const systemA = selections.systemFrames?.[0];
  const systemB = selections.systemFrames?.[1];
  const genre = selections.genreSkin?.[0];
  const tone = selections.toneSkin?.[0];
  const envA = selections.environmentSkins?.[0];
  const envB = selections.environmentSkins?.[1];

  const toneName = tone?.name || "dramatic";
  const genreName = genre?.name || "fantasy";
  const envName = [envA?.name, envB?.name].filter(Boolean).join(" and ");

  const coreText = [coreA?.name, coreB?.name].filter(Boolean).join(" and ");
  const systemText = [systemA?.name, systemB?.name].filter(Boolean).join(" with ");
  const aboutText = coreA?.description || "The campaign revolves around dangerous truths and meaningful choices.";
  const playersDoText = systemA?.description || "Players investigate, survive, and push deeper into the world’s central conflict.";
  const distinctText = genre?.description || "Its identity comes from the way tone, world, and pressure reinforce one another.";

  const pitch = `In a ${toneName.toLowerCase()} ${genreName.toLowerCase()} setting${envName ? ` shaped by ${envName.toLowerCase()}` : ""}, the campaign centers on ${coreText || "conflicting forces and hidden truths"} while players navigate ${systemText || "high-pressure dangers"} in pursuit of answers, survival, or transformation.`;

  return {
    pitch,
    about: aboutText,
    playersDo: playersDoText,
    distinctHook: distinctText
  };
}

module.exports = {
  generateCampaignPitch
};