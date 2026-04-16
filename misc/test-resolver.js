const { translateFormAnswers } = require("../src/parsers/translateFormAnswers");
const { resolveCampaignContext } = require("../src/resolvers/resolveCampaignContext");

const rawAnswers = {
    name: "Test User",
    email: "test@example.com",
    system: "D&D 5e",
    audience: "Family-friendly / kid-safe experience",
    age_band: "kids_8_10",
    youth_mode: "Yes",

    overallExperience: "solving_mysteries_and_uncovering_secrets",
    tone: "lighthearted_and_fun",
    worldAesthetic: "classic_fantasy",
    conflict: "a_hidden_truth_that_must_be_uncovered",
    choiceWeight: "some_meaningful_choices",
    playerFantasy: "discovering_who_we_really_are",

    gameplay: ["investigation_and_clue_solving", "exploration_and_discovery"],
    environments: ["ancient_ruins_and_fallen_civilizations"],

    includeNotes: "Keep it light and kid-safe.",
    excludeNotes: "No horror."
};

const translatedForm = translateFormAnswers(rawAnswers);

const resolved = resolveCampaignContext({
    translatedForm,
    rawAnswers
});

console.log("=== TRANSLATED FORM ===");
console.dir(translatedForm, { depth: null });

console.log("\n=== RESOLVED CONTEXT ===");
console.dir(resolved, { depth: null });