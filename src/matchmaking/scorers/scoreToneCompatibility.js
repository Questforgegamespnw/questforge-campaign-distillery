const { normalizeToken } = require("../pairs/pairUtils");
const { dimensionResult } = require("./scorerUtils");

const TONE_FAMILIES = [
    new Set(["heroic", "hopeful", "mythic"]),
    new Set(["gritty", "dark_foreboding", "horror", "tense"]),
    new Set(["mystery_noir", "political_intrigue", "tense"]),
    new Set(["chaotic_lighthearted", "hopeful"]),
    new Set(["emotional_character_driven", "melancholic", "hopeful"])
];

function sameFamily(toneA, toneB) {
    return TONE_FAMILIES.some((family) => family.has(toneA) && family.has(toneB));
}

function scoreToneCompatibility(profileA = {}, profileB = {}) {
    const toneA = normalizeToken(profileA.campaignPreferences?.tone);
    const toneB = normalizeToken(profileB.campaignPreferences?.tone);
    const evidence = [];

    let score = 0;
    if (toneA && toneB && toneA === toneB) {
        score = 5;
        evidence.push(`Both applicants selected the same tone: ${toneA}.`);
    } else if (toneA && toneB && sameFamily(toneA, toneB)) {
        score = 3.5;
        evidence.push("The applicants selected neighboring, compatible campaign tones.");
    } else if (toneA && toneB) {
        score = 1.5;
        evidence.push("Campaign tone is a meaningful Session Zero discussion point.");
    }

    return dimensionResult(score, 5, evidence, {
        toneA,
        toneB
    });
}

module.exports = {
    scoreToneCompatibility
};
