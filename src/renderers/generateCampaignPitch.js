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

  return name
    .replace(/\//g, " ")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
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
  return text
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.replace(/^avoid\s+/i, "").replace(/^no\s+/i, ""))
    .map((s) => s.replace(/\.$/, ""))
    .filter((s) => s.length > 2) // 🔥 kills empty garbage
    .join(", ");
}

function formatToneLabel(toneName = "") {
  const tone = humanizeName(toneName);

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

  const tonePrefix = safeToneText ? `${safeToneText} ` : "";
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
  const coreADesc = normalizeDescription(
    coreA?.description,
    "The world is not what it seems, and the deeper the players dig, the worse the truth becomes"
  );

  const coreBDesc = normalizeDescription(
    coreB?.description,
    "Understanding what is really happening comes with consequences"
  );

  let text = `${coreADesc} ${coreBDesc}`.trim();

  const includeCleanRaw = cleanIncludeText(includeNotes);
  const includeClean = dedupePhrases(includeCleanRaw);

  const includePhrase = includeClean
    .toLowerCase()
    .replace(/keep it\s*/g, "")
    .replace(/\/\s*kid-safe/g, "")
    .trim();

  if (includePhrase) {
    text += ` The campaign should leave room for a ${includePhrase} tone`;
    if (!text.endsWith(".")) {
      text += ".";
    }
  }

  return isYouthProfile(experienceProfile) ? softenYouthText(text) : text;
}

function buildPlayersDo(systemA, systemB, experienceProfile) {
  const systemADesc = normalizeDescription(
    systemA?.description,
    "Players investigate, connect hidden information, and push deeper into the campaign's central conflict"
  );

  const systemBDesc = normalizeDescription(
    systemB?.description,
    "Their choices, alliances, and leverage shape how the world responds"
  );

  const text = `${systemADesc} ${systemBDesc}`.trim();
  return isYouthProfile(experienceProfile) ? softenYouthText(text) : text;
}

function buildDistinctHook({ genre, tone, environments, label, experienceProfile }) {
  const genreDesc = normalizeDescription(
    genre?.description,
    "The setting's identity comes from the way atmosphere, conflict, and player pressure reinforce one another"
  );

  const toneDesc = normalizeDescription(
    tone?.description,
    "The tone keeps pressure on every victory and weight behind every choice"
  );

  const envDescs = uniqueByName(environments)
    .map((env) => cleanName(env?.description))
    .filter(Boolean);

  const envText = envDescs.length
    ? `The strongest scenes come from ${joinNatural(envDescs.map((text) => humanizeName(text)))}.`
    : "";

  const labelHooks = {
    primary: "It should feel like the players are uncovering something that was never meant to stay buried.",
    adjacent: "What makes this version pop is that conversation, leverage, and partial knowledge matter just as much as discovery itself.",
    wildcard: "What makes this version stand out is that learning the truth feels dangerous in its own right."
  };

  const text = [genreDesc, labelHooks[label] || ""]
    .filter(Boolean)
    .join(" ")
    .trim();

  return isYouthProfile(experienceProfile) ? softenYouthText(text) : text;
}

function buildPitchParagraph({
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
}) {

  const opening = buildOpening({
    label,
    genreName,
    toneName,
    envNames,
    coreIds,
    experienceProfile
  });

  const coreText = joinNatural(
    [coreAName, coreBName]
      .filter(Boolean)
      .map((name) => humanizeName(name))
      .map((name) => name.replace(/_/g, " "))
  );

  const systemText = joinNatural(
    [systemAName, systemBName]
      .filter(Boolean)
      .map((name) => humanizeName(name))
      .map((name) => name.replace(/_/g, " "))
      .map((name) => name.replace("loop", "").trim())
  );

  const sentenceOptions = [
    `At the table, this plays out through ${systemText}, as players navigate ${coreText}.`,
    `Play centers on ${systemText}, with players gradually uncovering ${coreText}.`,
    `Most sessions revolve around ${systemText}, while the story pushes into ${coreText}.`
  ];

  let secondParagraph =
    sentenceOptions[Math.floor(Math.random() * sentenceOptions.length)];
  const includeCleanRaw = cleanIncludeText(includeNotes);
  const includeClean = dedupePhrases(includeCleanRaw);
  const excludeClean = cleanExcludeText(excludeNotes);

  const includePhrase = includeClean
    .toLowerCase()
    .replace(/keep it\s*/g, "")
    .replace(/\/\s*kid-safe/g, "")
    .trim();

  const includeText = includePhrase
    ? ` It keeps the tone ${includePhrase}.`
    : "";
  
  const finalExcludeText =
    excludeClean && excludeClean.length > 2
      ? ` It should avoid ${excludeClean.toLowerCase()}.`
      : "";

  secondParagraph += includeText;

  if (finalExcludeText) {
    secondParagraph += finalExcludeText;
  }

  const text = `${opening}\n\n${secondParagraph}`.trim();
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
  distinctHook
}) {
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
    rewriteGoal:
      "Rewrite this into polished, consult-ready campaign prose that sounds natural, cinematic, and specific without contradicting the structured intent."
  };
}

// ==================================================
// TONE / SAFETY POST-PROCESSING
// ==================================================

function applyToneFilters(text, toneName = "", excludeNotes = "") {
  if (!text) return "";

  let result = text;

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

  return result;
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
  const playersDo = sentenceCase(buildPlayersDo(systemA, systemB, experienceProfile));
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
    distinctHook
  });

  return {
    title,
    pitch: applyToneFilters(pitch, toneName, excludeNotes),
    about: applyToneFilters(about, toneName, excludeNotes),
    playersDo: applyToneFilters(playersDo, toneName, excludeNotes),
    distinctHook: applyToneFilters(distinctHook, toneName, excludeNotes),
    aiBrief
  };
}

// ==================================================
// EXPORTS
// ==================================================

module.exports = {
  generateCampaignPitch
};