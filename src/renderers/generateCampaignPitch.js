/**
 * Builds a more human-facing campaign pitch from selected frames and skins,
 * while also producing a structured handoff block for future AI-assisted prose.
 *
 * Expected input:
 * {
 *   label?: string,
 *   emphasis?: string,
 *   coreFrames: Array<{ name?: string, description?: string }>,
 *   systemFrames: Array<{ name?: string, description?: string }>,
 *   genreSkin: Array<{ name?: string, description?: string }>,
 *   toneSkin: Array<{ name?: string, description?: string }>,
 *   environmentSkins: Array<{ name?: string, description?: string }>,
 *   includeNotes?: string,
 *   excludeNotes?: string,
 *   modifiers?: object
 * }
 */

// ==================================================
// BASIC HELPERS
// ==================================================

function first(array) {
  return Array.isArray(array) && array.length > 0 ? array[0] : null;
}

function second(array) {
  return Array.isArray(array) && array.length > 1 ? array[1] : null;
}

function cleanName(value, fallback = "") {
  if (!value || typeof value !== "string") {
    return fallback;
  }

  return value.replace(/\s+/g, " ").trim();
}

function humanizeName(name) {
  if (!name || typeof name !== "string") {
    return "";
  }

  const cleaned = name
    .replace(/\//g, " ")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = cleaned.split(" ");

  return words
    .map((word, index) => {
      if (index === 0) return word.charAt(0).toUpperCase() + word.slice(1);
      return word.toLowerCase();
    })
    .join(" ");
}

function sentenceCase(value) {
  if (!value || typeof value !== "string") {
    return "";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

// ==================================================
// PROFILE + SAFETY TEXT HELPERS
// ==================================================

function isYouthProfile(experienceProfile) {
  return cleanName(experienceProfile, "").toLowerCase() === "youth";
}

function softenYouthText(text) {
  if (!text || typeof text !== "string") {
    return "";
  }

  return text
    .replace(
      /the world is not what it seems/gi,
      "there is more to the world than it first appears"
    )
    .replace(/the worse the truth becomes/gi, "the more surprising the truth becomes")
    .replace(/comes with consequences/gi, "opens up new choices")
    .replace(/never meant to stay buried/gi, "has been waiting to be discovered")
    .replace(
      /understanding what is really happening opens up new choices/gi,
      "figuring things out helps the players decide what to do next"
    )
    .replace(
      /understanding what is really happening/gi,
      "figuring out what’s going on"
    )
    .replace(
      /the deeper the players dig/gi,
      "as the players explore further"
    )
  
    .replace(/learning the truth feels dangerous in its own right/gi, "learning the truth feels exciting and important")
    .replace(/something that was never meant to stay buried/gi, "something that has been hidden for a long time")
    .replace(/dangerous truths and meaningful consequences/gi, "mysteries, discovery, and meaningful choices")
    .replace(/more dangerous edge/gi, "more adventurous edge")
    .replace(/the more surprising the truth becomes/gi, "the more interesting things they discover")
    .replace(/cannot ignore/gi, "need to understand")
    .replace(/was has been/gi, "has been")
    .replace(/\. figuring/gi, ". Figuring");
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
      ? guidance.mustInclude.map(s => s.replace(/\s+/g, " ").trim())
      : [],
    avoid: Array.isArray(guidance.avoid) ? guidance.avoid.filter(Boolean) : [],
    toneGuardrails: Array.isArray(guidance.toneGuardrails) ? guidance.toneGuardrails.filter(Boolean) : [],
    audienceGuardrails: Array.isArray(guidance.audienceGuardrails) ? guidance.audienceGuardrails.filter(Boolean) : [],
    notes: Array.isArray(guidance.notes) ? guidance.notes.filter(Boolean) : []
  };
}

function appendAudienceGuidance(text = "", selections = {}) {
  const safetyProfile = getSafetyProfile(selections);
  const guidance = collectGuardrailText(selections);

  let result = text;

  if (safetyProfile.youthSafeMode) {
    if (!/kid-safe|family-friendly|wonder|curiosity|adventure/i.test(result)) {
      result += " The tone stays light, family-friendly, and rooted in wonder and curiosity.";
    }
  }

  return result.trim();
}

// ==================================================
// LIST / TEXT NORMALIZATION HELPERS
// ==================================================

function joinNatural(items = []) {
  const cleaned = items.filter(Boolean);

  if (cleaned.length === 0) return "";
  if (cleaned.length === 1) return cleaned[0];
  if (cleaned.length === 2) return `${cleaned[0]} and ${cleaned[1]}`;

  return `${cleaned.slice(0, -1).join(", ")}, and ${cleaned[cleaned.length - 1]}`;
}

function uniqueByName(entries = []) {
  const seen = new Set();
  const result = [];

  for (const entry of entries) {
    const key = cleanName(entry?.name || entry?.id || "").toLowerCase();
    if (!key || seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(entry);
  }

  return result;
}

function extractIds(entries = []) {
  return entries
    .map((entry) => cleanName(entry?.id || "").toLowerCase())
    .filter(Boolean);
}

function normalizeDescription(text, fallback = "") {
  const cleaned = cleanName(text, fallback);
  if (!cleaned) {
    return "";
  }

  return cleaned.endsWith(".") ? cleaned : `${cleaned}.`;
}

function cleanIncludeText(text = "") {
  return text
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((s) => !/^avoid\s+/i.test(s) && !/^no\s+/i.test(s))
    .map((s) => s.replace(/\.$/, ""))
    .join(", ");
}

function cleanExcludeText(text = "") {
  const cleaned = text
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.replace(/^avoid\s+/i, "").replace(/^no\s+/i, ""))
    .map((s) => s.replace(/\.$/, ""))
    .map((s) => s.replace(/or anything too scary/gi, ""))
    .map((s) => s.replace(/\s+/g, " ").trim())
    .filter((s) => s.length > 2);

  return cleaned.join(", ");
}

function formatToneLabel(toneName = "") {
  const tone = humanizeName(toneName).toLowerCase();

  if (!tone) return "";
  if (tone === "lighthearted chaotic") return "playful, lighthearted";
  if (tone === "political intrigue") return "tense, intrigue-heavy";

  return tone;
}

function dedupePhrases(text = "") {
  const parts = text.split(",").map((p) => p.trim().toLowerCase());
  const unique = [];

  for (const part of parts) {
    if (!unique.some((u) => u.includes(part) || part.includes(u))) {
      unique.push(part);
    }
  }

  return unique.join(", ");
}

function chooseByLabel(label, options = {}) {
  if (options[label] && Array.isArray(options[label]) && options[label].length) {
    return options[label][Math.floor(Math.random() * options[label].length)];
  }

  const fallback = options.default || [];
  return fallback[Math.floor(Math.random() * fallback.length)] || "";
}

function stripTrailingPeriod(text = "") {
  return cleanName(text).replace(/\.$/, "");
}

function cleanOutputText(text = "") {
  return text
    .replace(/\.\.+/g, ".")
    .replace(/\s+/g, " ")
    .replace(/\s([.,!?;:])/g, "$1")
    .replace(/\.\s+\./g, ".")
    .replace(/(divided,\s*or incomplete,\s*and incomplete|divided,\s*or incomplete)/gi, "divided and incomplete")
    .replace(/family-friendly\.\s+It stays approachable and family-friendly\./gi, "family-friendly.")
    .replace(/The mood stays rooted in wonder, curiosity, and adventure\.\s+The mood stays rooted in wonder, curiosity, and adventure\./gi, "The mood stays rooted in wonder, curiosity, and adventure.")
    .replace(/It stays approachable and family-friendly\.\s+The mood stays rooted in wonder, curiosity, and adventure\./gi, "It stays approachable and family-friendly, with a tone rooted in wonder and curiosity.")
    .replace(/The tone stays light and kid-safe, family-friendly\.\s+It stays approachable and family-friendly\./gi, "The tone stays light, kid-safe, and approachable.")
    .trim();
}

function isPluralConcept(text = "") {
  return /\band\b/i.test(text);
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

// ==================================================
// TITLE + SECTION BUILDERS
// ==================================================

function buildTitle({ genreName, coreAName, systemAName, label }) {
  const corePart = coreAName || "Hidden Truth";
  const genrePart = genreName || "Campaign";
  const systemPart = systemAName || "Intrigue";

  const titlesByLabel = {
    primary: `${corePart} in ${genrePart}`,
    adjacent: `${systemPart} Beneath the Surface`,
    wildcard: `The Cost of Knowing`
  };

  return titlesByLabel[label] || `${corePart} and ${systemPart}`;
}

function buildOpening({ label, genreName, toneName, envNames, coreIds = [], experienceProfile }) {
  const envText = joinNatural(envNames);
  const genreText = genreName ? humanizeName(genreName) : "fantasy";
  const toneText = formatToneLabel(toneName);
  const safeToneText =
  genreText.toLowerCase().includes(toneText.toLowerCase()) ? "" : toneText;

  let campaignShape = "campaign";

  if (coreIds.includes("hidden_truth") || coreIds.includes("lost_knowledge")) {
    campaignShape = "mystery";
  } else if (
    coreIds.includes("survival_against_overwhelming_force") ||
    coreIds.includes("the_endless_siege") ||
    coreIds.includes("entropy_decay")
  ) {
    campaignShape = "survival story";
  } else if (
    coreIds.includes("power_comes_from_within") ||
    coreIds.includes("creation_vs_destruction") ||
    coreIds.includes("rise_to_power")
  ) {
    campaignShape = "epic";
  } else if (
    coreIds.includes("war_of_ideologies") ||
    coreIds.includes("power_vacuum") ||
    coreIds.includes("duty_vs_self")
  ) {
    campaignShape = "conflict-driven campaign";
  } else if (
    coreIds.includes("becoming_something_else") ||
    coreIds.includes("fragmented_self") ||
    coreIds.includes("what_is_humanity")
  ) {
    campaignShape = "character-driven descent";
  } else if (
    coreIds.includes("exploration_wonder") ||
    coreIds.includes("the_world_is_alive")
  ) {
    campaignShape = "discovery-driven adventure";
  }

  const tonePrefix = safeToneText ? `${safeToneText.toLowerCase()} ` : "";
  const genrePhrase = `${genreText} ${campaignShape}`;  

  if (label === "adjacent") {
    
  const adjacentOpeners = [
    "This direction reframes the campaign as",
    "This version shifts the focus toward",
    "Here, the campaign pivots into",
    "This take emphasizes",
    "This direction leans into"
  ];
  
  const opener =
    adjacentOpeners[
      Math.floor(Math.random() * adjacentOpeners.length)
    ];

    const base = `${opener} a ${tonePrefix}${genrePhrase}${envText ? ` shaped by ${envText}` : ""}.`;
    return isYouthProfile(experienceProfile) ? softenYouthText(base) : base;
}

  if (label === "wildcard") {
    const toneAdjustedEdge =
      toneName && toneName.toLowerCase().includes("lighthearted")
        ? "more playful and unexpected direction"
        : "a stranger and more intense direction";

    const base = `This version pushes toward a ${toneAdjustedEdge}, turning the campaign into a ${tonePrefix}${genrePhrase}${envText ? ` shaped by ${envText}` : ""}.`;

    return isYouthProfile(experienceProfile) ? softenYouthText(base) : base;
  }

  const base = `At its strongest, this campaign feels like a ${tonePrefix}${genrePhrase}${envText ? ` shaped by ${envText}` : ""}.`;
  return isYouthProfile(experienceProfile) ? softenYouthText(base) : base;
}

function buildAbout(coreA, coreB, includeNotes, experienceProfile) {
  const coreADesc = stripTrailingPeriod(
    normalizeDescription(
      coreA?.description,
      "The world is not what it seems, and the deeper the players dig, the worse the truth becomes"
    )
  );

  let coreBDesc = stripTrailingPeriod(
    normalizeDescription(
      coreB?.description,
      "Understanding what is really happening comes with consequences"
    )
  );

  // remove duplicated trailing clause BEFORE rendering
  coreBDesc = coreBDesc
    .replace(/divided,\s*or incomplete,\s*and incomplete/gi, "divided and incomplete")
    .replace(/divided,\s*or incomplete/gi, "divided")
    .replace(/,\s*and incomplete/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  const includeCleanRaw = cleanIncludeText(includeNotes);
  const includeClean = dedupePhrases(includeCleanRaw);

  const tonePhrase = includeClean
    .toLowerCase()
    .replace(/keep it\s*/g, "")
    .replace(/\/\s*kid-safe/g, "")
    .trim();

  const joiner = chooseByLabel("about", {
    default: [
      "Alongside that,",
      "At the same time,",
      "Running underneath it all,",
      "What gives it extra weight is that"
    ]
  });

  let text = `${coreADesc}. ${joiner} ${coreBDesc.toLowerCase()}.`;

  if (tonePhrase) {
    text += ` The overall feel stays ${tonePhrase}.`;
  }

  text = softenIdentityPhrase(text, experienceProfile);
  text = cleanOutputText(text);

  return isYouthProfile(experienceProfile) ? softenYouthText(text) : text;
}

function buildPlayersDo(systemA, systemB, experienceProfile, label = "primary") {
  const systemADesc = stripTrailingPeriod(
    normalizeDescription(
      systemA?.description,
      "Players investigate, connect hidden information, and push deeper into the campaign's central conflict"
    )
  );

  const systemBDesc = stripTrailingPeriod(
    normalizeDescription(
      systemB?.description,
      "Their choices, alliances, and leverage shape how the world responds"
    )
  );

  const startsLikeSentence = /^(players|progress|their|the group|the players|discovery|exploration)\b/i.test(systemADesc);

  const lead = chooseByLabel(label, {
    primary: [
      "Most sessions revolve around this loop:",
      "At the table, the experience tends to unfold like this:",
      "The core rhythm of play looks like this:"
    ],
    adjacent: [
      "This version shifts the table experience in a slightly different direction:",
      "Here, the play loop tilts more toward this structure:",
      "This take changes the rhythm at the table in a useful way:"
    ],
    wildcard: [
      "The wildcard energy shows up most clearly in how play unfolds:",
      "This version feels bolder at the table because of this loop:",
      "What gives this take its edge is the way play actually works:"
    ],
    default: [
      "Play tends to unfold like this:"
    ]
  });

  let text = startsLikeSentence
    ? `${lead} ${systemADesc}. ${sentenceCase(systemBDesc)}.`
    : `${lead} ${systemADesc.toLowerCase()}. ${sentenceCase(systemBDesc)}.`;

  text = cleanOutputText(text);
  return isYouthProfile(experienceProfile) ? softenYouthText(text) : text;
}

function buildDistinctHook({ genre, tone, environments, label, experienceProfile }) {
  const genreDesc = stripTrailingPeriod(
    normalizeDescription(
      genre?.description,
      "The setting's identity comes from the way atmosphere, conflict, and player pressure reinforce one another"
    )
  );

  const envDescs = uniqueByName(environments)
    .map((env) => cleanName(env?.description))
    .filter(Boolean);

  const envFragment = envDescs.length
    ? `The world draws a lot of its identity from ${joinNatural(
      envDescs.map((text) => humanizeName(text))
    )}.`
    : "";

  const labelHooks = {
    primary: [
      "It should feel like every discovery opens the door to something larger.",
      "The strongest version of this campaign makes discovery feel momentum-building rather than static.",
      "The hook here is the sense that the world is always holding one more answer just out of reach."
    ],
    adjacent: [
      "What sets this version apart is how much progress comes from following threads, leverage, and layered discovery.",
      "This take stands out when the players are constantly choosing which clue, lead, or opportunity to chase next.",
      "Its identity really sharpens when exploration and information start feeding each other."
    ],
    wildcard: [
      "This version stands out when the truth feels strange, exciting, and just a little larger than expected.",
      "The wildcard energy comes from letting discovery reshape how the players understand the world around them.",
      "Its best moments come when each answer changes the meaning of the next question."
    ]
  };

  let text = `${genreDesc}. ${chooseByLabel(label, labelHooks)} ${envFragment}`.trim();
  text = softenIdentityPhrase(text, experienceProfile);
  text = cleanOutputText(text);

  return isYouthProfile(experienceProfile) ? softenYouthText(text) : text;
}

function buildPitchParagraph({
  label,
  coreAName,
  coreBName,
  systemAName,
  systemBName,
  genreName,
  toneName,
  envNames,
  coreIds,
  includeNotes,
  excludeNotes,
  experienceProfile

}) {
  const opening = buildOpening({
    label,
    genreName,
    toneName,
    envNames,
    coreIds,
    experienceProfile
  });

  const coreText = softenIdentityPhrase(
    joinNatural(
      [coreAName, coreBName]
        .filter(Boolean)
        .map((name) => humanizeName(name).replace(/_/g, " ").toLowerCase())
    ),
    experienceProfile
  );

  const systemText = joinNatural(
    [systemAName, systemBName]
      .filter(Boolean)
      .map((name) => {
        const cleaned = humanizeName(name)
          .replace(/Clue web/i, "a network of clues")
          .replace(/Exploration discovery/i, "exploration and discovery")
          .replace(/Hidden information/i, "hidden information")
          .replace(/loop/gi, "")
          .replace(/\s+/g, " ")
          .trim();

        return cleaned.toLowerCase();
      })
  );

  const coreVerb = isPluralConcept(coreText) ? "give" : "gives";
  const coreKeepVerb = isPluralConcept(coreText) ? "keep" : "keeps";
  const systemVerb = isPluralConcept(systemText) ? "shape" : "shapes";

  const secondParagraph = chooseByLabel(label, {
    primary: [
      `Most sessions are driven by ${systemText}, while the larger story keeps pulling the players toward ${coreText}.`,
      `${systemText} ${systemVerb} the moment-to-moment play, while ${coreText} ${coreVerb} the campaign its larger sense of direction.`,
      `At the table, ${systemText} keeps things moving, while ${coreText} ${coreVerb} each discovery more meaning.`
    ],
    adjacent: [
      `This version puts more weight on ${systemText}, letting ${coreText} build gradually underneath it.`,
      `${systemText} takes the lead here, with ${coreText} unfolding over time rather than all at once.`,
      `The campaign breathes through ${systemText}, while ${coreText} slowly ${coreKeepVerb} shaping the bigger picture.`
    ],
    wildcard: [
      `This take leans harder into ${systemText}, with ${coreText} giving the campaign its stranger edge.`,
      `${systemText} does more of the heavy lifting here, while ${coreText} ${coreKeepVerb} the campaign feeling slightly off-center in a good way.`,
      `The wildcard version gets its energy from ${systemText}, while ${coreText} ${coreKeepVerb} expanding what the players think they understand.`
    ],
    default: [
      `${systemText} and ${coreText} work together to define the campaign's rhythm.`
    ]
  });

  const includeCleanRaw = cleanIncludeText(includeNotes);
  const includeClean = dedupePhrases(includeCleanRaw);
  const excludeClean = cleanExcludeText(excludeNotes);

  const includePhrase = includeClean
    .toLowerCase()
    .replace(/keep it\s*/g, "")
    .replace(/\/\s*kid-safe/g, "")
    .trim();

  let closer = "";

  if (includePhrase) {
    closer = ` The tone stays ${includePhrase}.`;
  }

  const shouldRenderExclude =
    excludeClean &&
    !/^horror$/i.test(excludeClean) &&
    excludeClean.split(" ").length > 1;

  if (shouldRenderExclude) {
    closer += ` It avoids ${excludeClean.toLowerCase()}.`;
  }

  const text = cleanOutputText(`${opening}\n\n${secondParagraph}${closer}`);
  return isYouthProfile(experienceProfile) ? softenYouthText(text).trim() : text;
}
// ==================================================
// AI HANDOFF BLOCK
// ==================================================

function buildAIBrief({
  label,
  emphasis,
  title,
  coreFrames,
  systemFrames,
  genre,
  tone,
  environments,
  includeNotes,
  excludeNotes,
  about,
  playersDo,
  distinctHook,
  selections
}) {
  const adjudication = getAdjudication(selections);
  const safetyProfile = getSafetyProfile(selections);
  const handoffGuidance = getHandoffGuidance(selections);

  return {
    directionType: label || "direction",
    emphasis: emphasis || "",
    title,
    genre: cleanName(genre?.name, ""),
    tone: cleanName(tone?.name, ""),
    coreConflict: about,
    tableExperience: playersDo,
    distinctIdentity: distinctHook,
    coreFrames: uniqueByName(coreFrames).map((entry) => ({
      name: cleanName(entry?.name, entry?.id || ""),
      description: normalizeDescription(entry?.description, "")
    })),
    systemFrames: uniqueByName(systemFrames).map((entry) => ({
      name: cleanName(entry?.name, entry?.id || ""),
      description: normalizeDescription(entry?.description, "")
    })),
    environments: uniqueByName(environments).map((entry) => ({
      name: cleanName(entry?.name, entry?.id || ""),
      description: normalizeDescription(entry?.description, "")
    })),
    includeNotes: cleanName(includeNotes, ""),
    excludeNotes: cleanName(excludeNotes, ""),
    experienceProfile: adjudication.experienceProfile || cleanName(selections?.experienceProfile, "standard"),
    safetyProfile,
    toneGuardrails: handoffGuidance.toneGuardrails || [],
    audienceGuardrails: handoffGuidance.audienceGuardrails || [],
    mustInclude: handoffGuidance.mustInclude || [],
    avoid: handoffGuidance.avoid || [],
    suppressedSignals: adjudication.suppressed || [],
    confidence: adjudication.confidence || {},

    rewriteGoal:
      "Rewrite this into polished, consult-ready campaign prose that sounds natural, cinematic, and specific without contradicting the structured intent."
  };
}

// ==================================================
// TONE / SAFETY POST-PROCESSING
// ==================================================

function applyToneFilters(text, toneName = "", excludeNotes = "", selections = {}) {
  if (!text) return "";

  let result = text;
  const safetyProfile = getSafetyProfile(selections);
  const guidance = collectGuardrailText(selections);
  const tone = (toneName || "").toLowerCase();
  const exclude = (excludeNotes || "").toLowerCase();

  // Safety first
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

  // Lighthearted tone adjustments
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
      .replace(/divided,\s*or fractured/gi, "divided and incomplete")
      .replace(/fractured/gi, "incomplete")
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

// ==================================================
// MAIN RENDERER
// ==================================================

function generateCampaignPitch(selections = {}) {
  const coreFrames = uniqueByName(selections.coreFrames || []);
  const systemFrames = uniqueByName(selections.systemFrames || []);
  const genreSkin = uniqueByName(selections.genreSkin || []);
  const toneSkin = uniqueByName(selections.toneSkin || []);
  const environmentSkins = uniqueByName(selections.environmentSkins || []);

  const coreA = first(coreFrames);
  const coreB = second(coreFrames);
  const systemA = first(systemFrames);
  const systemB = second(systemFrames);
  const genre = first(genreSkin);
  const tone = first(toneSkin);

  const label = cleanName(selections.label, "direction").toLowerCase();
  const emphasis = cleanName(selections.emphasis, "");
  const includeNotes = cleanName(selections.includeNotes, "");
  const excludeNotes = cleanName(selections.excludeNotes, "");
  const experienceProfile = cleanName(selections.experienceProfile, "standard").toLowerCase();
  const adjudication = getAdjudication(selections);
  const safetyProfile = getSafetyProfile(selections);
  const handoffGuidance = getHandoffGuidance(selections);

  const coreAName = cleanName(coreA?.name, "Hidden Truth");
const coreBName = cleanName(coreB?.name, "");
const systemAName = cleanName(systemA?.name, "Investigation");
const systemBName = cleanName(systemB?.name, "");
const genreName = cleanName(genre?.name, "Fantasy");
  const toneName = cleanName(tone?.name, "");
const envNames = environmentSkins
  .map((entry) => humanizeName(entry?.name))
  .filter(Boolean);

  const title = buildTitle({
    genreName,
    coreAName,
    systemAName,
    label
  });

  const coreIds = extractIds(coreFrames);
  const about = sentenceCase(buildAbout(coreA, coreB, includeNotes, experienceProfile));
  const playersDo = sentenceCase(buildPlayersDo(systemA, systemB, experienceProfile, label));
  const distinctHook = sentenceCase(
    buildDistinctHook({
      genre,
      tone,
      environments: environmentSkins,
      label,
      experienceProfile
    })
  );

  const pitch = buildPitchParagraph({
    label,
    title,
    coreAName,
    coreBName,
    systemAName,
    systemBName,
    genreName,
    toneName,
    envNames,
    coreIds,
    includeNotes,
    excludeNotes,
    experienceProfile
  });
  const aiBrief = buildAIBrief({
    label,
    emphasis,
    title,
    coreFrames,
    systemFrames,
    genre,
    tone,
    environments: environmentSkins,
    includeNotes,
    excludeNotes,
    about,
    playersDo,
    distinctHook,
    selections
  });

  return {
    title,
    pitch: applyToneFilters(appendAudienceGuidance(pitch, selections), toneName, excludeNotes, selections),
    about: applyToneFilters(about, toneName, excludeNotes, selections),
    playersDo: applyToneFilters(playersDo, toneName, excludeNotes, selections),
    distinctHook: applyToneFilters(distinctHook, toneName, excludeNotes, selections),
    aiBrief,
    adjudicationSummary: {
      experienceProfile,
      safetyProfile,
      handoffGuidance,
      confidence: adjudication.confidence || {},
      suppressed: adjudication.suppressed || []
    }
  };
}

// ==================================================
// EXPORTS
// ==================================================

module.exports = {
  generateCampaignPitch
};