const {
    cleanName
} = require("./pitchCleanup");

function isYouthProfile(experienceProfile) {
    return cleanName(experienceProfile, "").toLowerCase() === "youth";
}

function softenYouthText(text) {
    if (!text || typeof text !== "string") {
        return "";
    }

    return text
        .replace(/the world is not what it seems/gi, "there is more to the world than it first appears")
        .replace(/the worse the truth becomes/gi, "the more surprising the truth becomes")
        .replace(/comes with consequences/gi, "opens up new choices")
        .replace(/never meant to stay buried/gi, "has been waiting to be discovered")
        .replace(/understanding what is really happening opens up new choices/gi, "figuring things out helps the players decide what to do next")
        .replace(/understanding what is really happening/gi, "figuring out what’s going on")
        .replace(/the deeper the players dig/gi, "as the players explore further")
        .replace(/learning the truth feels dangerous in its own right/gi, "learning the truth feels exciting and important")
        .replace(/something that was never meant to stay buried/gi, "something that has been hidden for a long time")
        .replace(/dangerous truths and meaningful consequences/gi, "mysteries, discovery, and meaningful choices")
        .replace(/more dangerous edge/gi, "more adventurous edge")
        .replace(/the more surprising the truth becomes/gi, "the more interesting things they discover")
        .replace(/cannot ignore/gi, "need to understand")
        .replace(/was has been/gi, "has been")
        .replace(/\. figuring/gi, ". Figuring");
}

function softenIdentityPhrase(text = "", experienceProfile = "standard") {
    if (!isYouthProfile(experienceProfile)) {
        return text;
    }

    return text
        .replace(/fractured self/gi, "shifting sense of self")
        .replace(/fragmented self/gi, "shifting sense of self")
        .replace(/becoming something else/gi, "changing in unexpected ways")
        .replace(/what is humanity/gi, "what makes someone who they are");
}

function getAdjudication(selections = {}) {
    return selections.adjudication || {};
}

function getSafetyProfile(selections = {}) {
    return getAdjudication(selections).constraints?.safetyProfile || {};
}

function getHandoffGuidance(selections = {}) {
    return getAdjudication(selections).handoffGuidance || {};
}

function collectGuardrailText(selections = {}) {
    const guidance = getHandoffGuidance(selections);

    return {
        mustInclude: Array.isArray(guidance.mustInclude)
            ? guidance.mustInclude.map((s) => s.replace(/\s+/g, " ").trim())
            : [],
        avoid: Array.isArray(guidance.avoid) ? guidance.avoid.filter(Boolean) : [],
        toneGuardrails: Array.isArray(guidance.toneGuardrails) ? guidance.toneGuardrails.filter(Boolean) : [],
        audienceGuardrails: Array.isArray(guidance.audienceGuardrails) ? guidance.audienceGuardrails.filter(Boolean) : [],
        notes: Array.isArray(guidance.notes) ? guidance.notes.filter(Boolean) : []
    };
}

function appendAudienceGuidance(text = "", selections = {}) {
    const safetyProfile = getSafetyProfile(selections);

    let result = text;

    if (safetyProfile.youthSafeMode) {
        if (!/kid-safe|family-friendly|wonder|curiosity|adventure/i.test(result)) {
            result += " The tone stays light, family-friendly, and rooted in wonder and curiosity.";
        }
    }

    return result.trim();
}

function applyToneFilters(text, toneName = "", excludeNotes = "", selections = {}) {
    if (!text) return "";

    let result = text;
    const safetyProfile = getSafetyProfile(selections);
    const guidance = collectGuardrailText(selections);
    const tone = (toneName || "").toLowerCase();
    const exclude = (excludeNotes || "").toLowerCase();

    if (exclude.includes("no horror")) {
        result = result
            .replace(/dangerous/gi, "unexpected")
            .replace(/terrifying/gi, "surprising")
            .replace(/horror/gi, "")
            .replace(/dark/gi, "mysterious")
            .replace(/,?\s*or anything too scary/gi, "")
            .replace(/avoid\s*\./gi, "")
            .replace(/It should\s*\./gi, "")
            .replace(/\.\./g, ".")
            .replace(/It should\s*$/gi, "")
            .replace(/hidden beneath/gi, "beneath the surface")
            .replace(/uncovering/gi, "discovering");
    }

    if (tone.includes("lighthearted")) {
        result = result
            .replace(/dangerous/gi, "playful")
            .replace(/buried/gi, "hidden")
            .replace(/serious/gi, "fun")
            .replace(/consequences/gi, "outcomes")
            .replace(/the real danger is/gi, "the real mystery is");
    }

    if (safetyProfile.youthSafeMode) {
        result = result
            .replace(/dangerous in its own right/gi, "important in its own right")
            .replace(/uncertainty becomes part of the tension/gi, "uncertainty becomes part of the discovery and exploration")
            .replace(/incomplete,\s*divided,\s*or\s*fractured/gi, "divided and incomplete")
            .replace(/divided,\s*or\s*fractured/gi, "divided and incomplete")
            .replace(/\bfractured\b/gi, "incomplete")
            .replace(/burden/gi, "challenge")
            .replace(/dark/gi, "mysterious");
    }

    if (guidance.toneGuardrails.some((line) => /avoid dread-heavy|avoid scary/i.test(line))) {
        result = result
            .replace(/dread-heavy/gi, "wonder-filled")
            .replace(/scary/gi, "intense");
    }

    return result.trim();
}

module.exports = {
    isYouthProfile,
    softenYouthText,
    softenIdentityPhrase,
    getAdjudication,
    getSafetyProfile,
    getHandoffGuidance,
    collectGuardrailText,
    appendAudienceGuidance,
    applyToneFilters
};