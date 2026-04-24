const { processFormSubmission } = require("./intake");
const { buildTranslatorInput } = require("./intake/buildTranslatorInput");
const { validateCanonicalIntake } = require("./parsers/validateCanonicalIntake");
const { translateFormAnswers } = require("./parsers/translateFormAnswers");
const { resolveCampaignContext } = require("./resolvers/resolveCampaignContext");
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
    

    const validation = validateCanonicalIntake(canonical);

    console.log("🧪 VALIDATION CHECK:", validation.isValid);
    console.log("🧪 CANONICAL TOP-LEVEL KEYS:", Object.keys(canonical));

    if (!validation.isValid) {
        console.error("❌ CANONICAL VALIDATION FAILED");
        console.error(validation.errors);
        return {
            error: "Invalid canonical intake",
            validation
        };
    }
 
    const translatorInput = buildTranslatorInput(canonical);
    const translated = translateFormAnswers(translatorInput);

    const campaignContext = resolveCampaignContext({
        normalizedIntake: canonical,
        translatedForm: translated,
        rawAnswers: rawSubmission
    });

    const selected = selectCampaignDirections(
        campaignContext.candidateBuckets,
        canonical
    );

///CONSOLE LOGS FOR DEBUG AND IDENTIFYING LEAKS OR SIGNAL LOSS///
    console.log("🧭 SELECTED PRIMARY:", selected.primary);
    console.log("🧠 EXPERIENCE PROFILE:", campaignContext.experienceProfile);
    console.log("🧠 POST-CROSSWALK CORES:", campaignContext.candidateBuckets.coreFrames);
///

    function resolveDirection(direction) {
        return {
            ...direction,
            coreFrames: resolveSelections(
                direction.coreFrames || [],
                campaignContext.availablePools.coreFrames
            ),
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

///More debugging lines to find signal loss///
    console.log("🧩 RESOLVED PRIMARY CORE:", resolved.primary.coreFrames);
    console.log("🧩 RESOLVED PRIMARY GENRE:", resolved.primary.genreSkin);
    console.log("🧩 RESOLVED PRIMARY ENV:", resolved.primary.environmentSkins);

    function toClientPitchBlock(pitch = {}) {
        return {
            title: pitch.title || "",
            pitch: pitch.pitch || "",
            about: pitch.about || "",
            playersDo: pitch.playersDo || "",
            distinctHook: pitch.distinctHook || ""
        };
    }

    function toAuditPitchBlock(pitch) {
        return {
            aiBrief: pitch.aiBrief,
            adjudicationSummary: pitch.adjudicationSummary
        };
    }

    const fullPitch = {
        primary: generateCampaignPitch(resolved.primary),
        adjacent: generateCampaignPitch(resolved.adjacent),
        wildcard: generateCampaignPitch(resolved.wildcard)
    };

    const clientPitch = {
        primary: toClientPitchBlock(fullPitch.primary),
        adjacent: toClientPitchBlock(fullPitch.adjacent),
        wildcard: toClientPitchBlock(fullPitch.wildcard)
    };

    const auditPitch = {
        primary: toAuditPitchBlock(fullPitch.primary),
        adjacent: toAuditPitchBlock(fullPitch.adjacent),
        wildcard: toAuditPitchBlock(fullPitch.wildcard)
    };

    return {
        intake: {
            mapped,
            normalized,
            canonical,
            translatorInput
        },
        translated,
        selected,
        resolved,
        clientPitch,
        auditPitch
        // debug only
        // fullPitch
    };
}

module.exports = {
    runCampaignPipelineFromForm
};