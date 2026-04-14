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

function buildOpening({ label, genreName, toneName, envNames, coreIds = [] }) {
  const envText = joinNatural(envNames);
  const genreText = genreName ? humanizeName(genreName) : "fantasy";
  const toneText = toneName ? humanizeName(toneName) : "dangerous";
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

  return `${opener} a ${safeToneText ? safeToneText + " " : ""}${genreText} ${campaignShape}${envText ? ` shaped by ${envText}` : ""}.`;
}

  if (label === "wildcard") {
    return `This version pushes toward a stranger and more dangerous edge, turning the campaign into a ${safeToneText ? safeToneText + " " : ""}${genreText} ${campaignShape}${envText ? ` shaped by ${envText}` : ""}.`;
  }

  return `At its strongest, this campaign feels like a ${safeToneText ? safeToneText + " " : ""}${genreText} ${campaignShape}${envText ? ` shaped by ${envText}` : ""}.`;
}

function buildAbout(coreA, coreB, includeNotes) {
  const coreADesc = normalizeDescription(
    coreA?.description,
    "The world is not what it seems, and the deeper the players dig, the worse the truth becomes"
  );

  const coreBDesc = normalizeDescription(
    coreB?.description,
    "Understanding what is really happening comes with consequences"
  );

  let text = `${coreADesc} ${coreBDesc}`.trim();

  if (includeNotes) {
    text += ` The campaign should make room for ${includeNotes.trim()}`;
    if (!text.endsWith(".")) {
      text += ".";
    }
  }

  return text;
}

function buildPlayersDo(systemA, systemB) {
  const systemADesc = normalizeDescription(
    systemA?.description,
    "Players investigate, connect hidden information, and push deeper into the campaign's central conflict"
  );

  const systemBDesc = normalizeDescription(
    systemB?.description,
    "Their choices, alliances, and leverage shape how the world responds"
  );

  return `${systemADesc} ${systemBDesc}`.trim();
}

function buildDistinctHook({ genre, tone, environments, label }) {
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

  return [genreDesc, labelHooks[label] || ""]
    .filter(Boolean)
    .join(" ")
    .trim();
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
  excludeNotes
}) {
  const opening = buildOpening({
  label,
  genreName,
  toneName,
  envNames,
  coreIds
});

  const coreText = joinNatural(
  [coreAName, coreBName].filter(Boolean).map((name) => humanizeName(name))
);

  const systemText = joinNatural(
  [systemAName, systemBName].filter(Boolean).map((name) => humanizeName(name))
);

  let secondParagraph = `The campaign revolves around ${coreText || "dangerous truths and meaningful consequences"}, with players most often engaging through ${systemText || "investigation, pressure, and difficult choices"}.`;

  const includeText = includeNotes
  ? ` It should explicitly include ${includeNotes.trim().toLowerCase().replace(/\.$/, "")}.`
  : "";

  const excludeClean = excludeNotes
  ? excludeNotes.trim().toLowerCase().replace(/\.$/, "")
  : "";

const excludeText = excludeClean
  ? ` It should avoid ${excludeClean.startsWith("no ")
      ? excludeClean.slice(3)
      : excludeClean}.`
  : "";

secondParagraph += includeText + excludeText;

  return `${opening}\n\n${secondParagraph}`;
}

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

  const coreAName = cleanName(coreA?.name, "Hidden Truth");
const coreBName = cleanName(coreB?.name, "");
const systemAName = cleanName(systemA?.name, "Investigation");
const systemBName = cleanName(systemB?.name, "");
const genreName = cleanName(genre?.name, "Fantasy");
const toneName = cleanName(tone?.name, "Dangerous");
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
  const about = sentenceCase(buildAbout(coreA, coreB, includeNotes));
  const playersDo = sentenceCase(buildPlayersDo(systemA, systemB));
  const distinctHook = sentenceCase(
    buildDistinctHook({
      genre,
      tone,
      environments: environmentSkins,
      label
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
  excludeNotes
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
    pitch,
    about,
    playersDo,
    distinctHook,
    aiBrief
  };
}

module.exports = {
  generateCampaignPitch
};