const { processFormSubmission } = require("./intake");
const { translateFormAnswers } = require("./parsers/translateFormAnswers");
const { selectCampaignDirections } = require("./selectors/selectCampaignDirections");
const { resolveSelections } = require("./utils/lookupById");
const { generateCampaignPitch } = require("./renderers/generateCampaignPitch");

const coreFrames = require("./data/coreFrames");
const systemFrames = require("./data/systemFrames");
const genreSkins = require("./data/genreSkins");
const toneSkins = require("./data/toneSkins");
const environmentSkins = require("./data/environmentSkins");


function runCampaignPipelineFromForm(rawSubmission = {}) {
    const { mapped, normalized, canonical } = processFormSubmission(rawSubmission);

    const translated = translateFormAnswers(canonical.pipelineInput);
    const selected = selectCampaignDirections(translated, canonical);
    function resolveDirection(direction) {
        return {
            ...direction,
            coreFrames: resolveSelections(direction.coreFrames || [], coreFrames),
            systemFrames: resolveSelections(direction.systemFrames || [], systemFrames),
            genreSkin: resolveSelections(direction.genreSkin || [], genreSkins),
            toneSkin: resolveSelections(direction.toneSkin || [], toneSkins),
            environmentSkins: resolveSelections(direction.environmentSkins || [], environmentSkins)
        };
    }

    const resolved = {
        primary: resolveDirection(selected.primary),
        adjacent: resolveDirection(selected.adjacent),
        wildcard: resolveDirection(selected.wildcard)
    };
    const pitch = {
        primary: generateCampaignPitch(resolved.primary),
        adjacent: generateCampaignPitch(resolved.adjacent),
        wildcard: generateCampaignPitch(resolved.wildcard)
    };

    return {
        intake: {
            mapped,
            normalized,
            canonical
        },
        translated,
        selected,
        resolved,
        pitch
    };
}

module.exports = {
    runCampaignPipelineFromForm
};