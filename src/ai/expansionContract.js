// src/ai/expansionContract.js

const DIRECTION_INTENTS = Object.freeze({
  primary: "the clearest, most marketable expression of the campaign's core fantasy",
  adjacent: "a meaningful shift in gameplay emphasis that preserves the core promise",
  wildcard: "a bolder thematic or conceptual reframing that still fits the intake"
});

const OUTPUT_FIELDS = Object.freeze(["pitch", "about", "playersDo", "hook"]);

const SECTION_RULES = Object.freeze({
  pitch: Object.freeze({
    purpose: "Clarify the campaign promise and make the direction immediately understandable.",
    limits: "One concise paragraph of 2-4 sentences. Lead with campaign identity, not mechanics."
  }),
  about: Object.freeze({
    purpose: "Deepen the existing meaning, tension, and stakes without introducing new lore.",
    limits: "One paragraph of 2-4 sentences. Preserve the selected core ideas."
  }),
  playersDo: Object.freeze({
    purpose: "Make the recurring table experience concrete and easy to imagine.",
    limits: "One paragraph of 2-4 sentences. Use only the selected systems and activities."
  }),
  hook: Object.freeze({
    purpose: "Sharpen curiosity, urgency, or tension already present in the source.",
    limits: "One or two short sentences. Do not add named people, places, factions, or plot facts."
  })
});

const PRESERVE_RULES = Object.freeze([
  "Preserve the selected campaign identity and direction label.",
  "Preserve the meaning of each source section.",
  "Preserve audience, safety, inclusion, and exclusion constraints.",
  "Preserve the distinction between Primary, Adjacent, and Wildcard.",
  "Keep the deterministic title unchanged; it is not part of the editable output."
]);

const ALLOWED_CHANGES = Object.freeze([
  "Improve clarity, cadence, transitions, and client-facing readability.",
  "Deepen ideas already present in the source.",
  "Add restrained sensory or emotional specificity when directly supported by the supplied genre, tone, or environments.",
  "Vary phrasing while preserving intent and scope."
]);

const FORBIDDEN_CHANGES = Object.freeze([
  "Do not invent mechanics, rules, subsystems, or character options.",
  "Do not invent named NPCs, factions, locations, villains, artifacts, or historical events.",
  "Do not add a plot outline, quest chain, twist, or campaign ending.",
  "Do not change selected frames, genre, tone, environments, or safety boundaries.",
  "Do not add keys, commentary, markdown, or explanations outside the required JSON object.",
  "Do not make the prose more extreme, hopeless, violent, or psychologically heavy than the source allows."
]);

const VOICE_RULES = Object.freeze([
  "Use a grounded, confident, client-facing QuestForge voice.",
  "Favor clear experience and stakes over lore exposition.",
  "Avoid purple prose, melodrama, generic epic claims, and promotional filler.",
  "Use varied sentence rhythm without becoming verbose.",
  "Do not repeat the same metaphor or idea in slightly different words.",
  "Do not flatten all three directions into the same cadence or emphasis."
]);

function getExpansionContract() {
  return {
    version: "0.9.1",
    outputFields: [...OUTPUT_FIELDS],
    directionIntents: { ...DIRECTION_INTENTS },
    sectionRules: { ...SECTION_RULES },
    preserveRules: [...PRESERVE_RULES],
    allowedChanges: [...ALLOWED_CHANGES],
    forbiddenChanges: [...FORBIDDEN_CHANGES],
    voiceRules: [...VOICE_RULES]
  };
}

module.exports = {
  DIRECTION_INTENTS,
  OUTPUT_FIELDS,
  SECTION_RULES,
  PRESERVE_RULES,
  ALLOWED_CHANGES,
  FORBIDDEN_CHANGES,
  VOICE_RULES,
  getExpansionContract
};
