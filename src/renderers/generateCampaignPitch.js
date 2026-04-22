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


function stripLeadingWhile(text) {
  if (!text) return "";
  return text.replace(/^while\s+/i, "").trim();
}

function normalizeSystemLead(text = "") {
  const cleaned = stripTrailingPeriod(cleanName(text));

  if (!cleaned) return "";

  return cleaned
    .replace(
      /^Players assemble scattered clues into a larger understanding rather than following a single linear trail$/i,
      "following scattered clues and slowly piecing them together"
    )
    .replace(
      /^Players never have the full picture, and uncertainty becomes part of the tension$/i,
      "working with incomplete information and mounting uncertainty"
    )
    .replace(
      /^The players never have enough time, safety, light, healing, or supplies, so every decision costs something$/i,
      "making hard calls when time, safety, and supplies are always running short"
    )
    .replace(
      /^Progress comes from uncovering new places, secrets, paths, and environmental story buried in the world$/i,
      "exploring strange places and uncovering what they mean"
    )
    .replace(
      /^The longer events continue or the more certain actions are taken, the worse consequences become$/i,
      "managing problems before they spiral"
    )
    .replace(
      /^The longer events continue or the more certain actions are taken, the worse outcomes become$/i,
      "managing problems before they spiral"
    )
    .replace(
      /^Movement, territory, chokepoints, and positioning become central to how encounters are won or lost$/i,
      "managing movement, territory, chokepoints, and positioning"
    )
    .replace(
      /^Words, alliances, leverage, and negotiation shape the campaign as much as combat does$/i,
      "managing pressure, leverage, negotiation, and fragile alliances"
    )
    .replace(
      /^Enemies break normal expectations and create memorable multi-phase setpiece encounters$/i,
      "facing enemies that force new tactics instead of routine fights"
    )
    .replace(
      /^Power changes the characters over time, creating tradeoffs between strength, identity, and consequence$/i,
      "dealing with power that changes the characters over time"
    )
    .replace(
      /^The battlefield matters as much as the enemies, with hazards, terrain, and interaction shaping the fight$/i,
      "surviving battlefields where hazards and terrain matter as much as the enemies"
    )
    .replace(
      /^The world responds to player action over time, with areas, threats, and NPC behavior changing in reaction$/i,
      "dealing with a world that keeps reacting to what the players do"
    )
    .replace(
      /^Player actions shift their standing with factions, unlocking opportunities or closing doors over time$/i,
      "shifting faction standing as alliances form, break, and evolve"
    )
    .replace(
      /^Their choices, alliances, and leverage shape how the world responds$/i,
      "watching choices and alliances reshape how the world responds"
    )
    .replace(
      /^Players build their identity through flexible components, allowing highly customized growth and expression$/i,
      "shaping identity through modular growth and highly customized choices"
    )
    .replace(
      /^No alliance is simple, and choosing sides carries long-term consequences, tension, and compromise$/i,
      "navigating alliances where every choice comes with tradeoffs and long-term consequences"
    )

    .replace(/\s+/g, " ")
    .trim();
}

function combineToneAndGenre(toneText = "", genreText = "") {
  const tone = cleanName(toneText).toLowerCase();
  const genre = cleanName(genreText).toLowerCase();

  if (!tone) return genre;
  if (!genre) return tone;
  if (genre.includes(tone)) return genre;
  if (tone.includes(genre)) return tone;

  return `${tone} ${genre}`;
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

function toSentence(text = "") {
  const cleaned = cleanName(text);
  if (!cleaned) return "";
  return cleaned.endsWith(".") ? cleaned : `${cleaned}.`;
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

function pickOne(array = [], fallback = "") {
  if (!Array.isArray(array) || array.length === 0) {
    return fallback;
  }

  return array[Math.floor(Math.random() * array.length)] || fallback;
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
    .trim()
    .replace(/divided and incomplete,\s*and/gi, "divided and incomplete. ");
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
  const genreText = humanizeName(genreName || "fantasy").toLowerCase();
  const toneText = formatToneLabel(toneName).toLowerCase();
  const pitchGenreText = combineToneAndGenre(toneText, genreText);

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

  const genrePhrase = campaignShape === "campaign"
    ? pitchGenreText
    : `${pitchGenreText} ${campaignShape}`;

  if (label === "adjacent") {
    const adjacentOpeners = [
      "Here, the campaign leans into",
      "This one shifts toward",
      "This take moves closer to"
    ];

    const opener = pickOne(adjacentOpeners, "Here, the campaign leans into");
    const base = `${opener} a ${genrePhrase}${envText ? ` set against ${envText}` : ""}.`;
    return isYouthProfile(experienceProfile) ? softenYouthText(base) : base;
  }

  if (label === "wildcard") {
    const base = `This is the stranger version: a ${genrePhrase}${envText ? ` set against ${envText}` : ""}.`;
    return isYouthProfile(experienceProfile) ? softenYouthText(base) : base;
  }

  const primaryOpeners = [
    "This plays like",
    "At its best, this feels like",
    "This leans into"
  ];

  const opener = pickOne(primaryOpeners, "This plays like");
  const article = /^[aeiou]/i.test(genrePhrase) ? "an" : "a";
  const base = `${opener} ${article} ${genrePhrase}${envText ? ` set against ${envText}` : ""}.`;
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
    .replace(/divided,\s*or\s*incomplete,\s*and\s*incomplete/gi, "divided and incomplete")
    .replace(/divided,\s*or\s*incomplete/gi, "divided and incomplete")
    .replace(/divided and incomplete,\s*and/gi, "divided and incomplete. ")
    .replace(/incomplete,\s*divided and incomplete/gi, "divided and incomplete")
    .replace(/the self is incomplete,\s*divided and incomplete/gi, "the self is divided and incomplete")
    .replace(/\s+/g, " ")
    .replace(/the self is incomplete,\s*divided and incomplete/gi, "the self is divided and incomplete")
    .replace(/self is incomplete,\s*divided and incomplete/gi, "self is divided and incomplete")
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

  const systemALead = normalizeSystemLead(systemADesc);
  const systemBLead = normalizeSystemLead(systemBDesc);
  
  const openersByLabel = {
    primary: [
      "You’ll spend most of your time",
      "Most of play is about",
      "A lot of play comes from"
    ],
    adjacent: [
      "This version leans more into",
      "Here, play tilts more toward",
      "This take puts more emphasis on"
    ],
    wildcard: [
      "This one gets its edge from",
      "What makes this version feel different is",
      "Here, a lot of the tension comes from"
    ],
    default: [
      "Play tends to center on"
    ]
  };

  const connectiveLines = [
    "That works—until something stops lining up.",
    "It holds together—right up until it doesn’t.",
    "The deeper you go, the harder it is to trust what you’re seeing.",
    "At first it makes sense. Then the pieces stop fitting cleanly.",
    "You start getting answers—but they don’t agree with each other.",
    "It feels manageable—until the situation shifts under you.",
    "The more progress you make, the less stable the bigger picture becomes.",
    "Every step forward changes what you thought you understood."
  ];

  const opener = chooseByLabel(label, openersByLabel);
  const first = systemALead
    ? `${opener} ${systemALead}.`
    : "";

  const second = systemBLead && systemBLead !== systemALead
    ? `${sentenceCase(systemBLead)}.`
    : "";
  const third = pickOne(connectiveLines, "");

  let text = [first, second].filter(Boolean).join(" ");
  if (third) text += ` ${third}`;

  text = cleanOutputText(text);

  return isYouthProfile(experienceProfile) ? softenYouthText(text) : text;
}

function buildDistinctHook({ genre, tone, environments, label, experienceProfile }) {
  const genreDesc = stripTrailingPeriod(
    cleanName(genre?.description || "")
  );

  const envDescs = uniqueByName(environments)
    .map((env) => stripTrailingPeriod(cleanName(env?.description)))
    .filter(Boolean);

  const envLine = pickOne(envDescs, "");
  const hookByLabel = {
    primary: [
      "Something here lingers.",
      "This world gets under your skin fast.",
      "The setting sticks with you."
    ],
    adjacent: [
      "Every answer opens something stranger.",
      "Curiosity keeps turning into momentum.",
      "The deeper you look, the less stable things feel."
    ],
    wildcard: [
      "This is where things get weird on purpose.",
      "This one is harder to shake off afterward.",
      "The setting stops feeling passive very quickly."
    ]
  };

  const opener = chooseByLabel(label, hookByLabel);

  const lines = [genreDesc, opener, envLine]
    .filter(Boolean)
    .map((line) => `${sentenceCase(line)}.`);

  let text = lines.join(" ");
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
  const genreText = humanizeName(genreName || "fantasy").toLowerCase();
  const toneText = formatToneLabel(toneName).toLowerCase();
  const pitchGenreText = combineToneAndGenre(toneText, genreText);
  
  const coreAOnly = softenIdentityPhrase(
    humanizeName(coreAName || "").replace(/_/g, " ").toLowerCase(),
    experienceProfile
  );

  const coreBOnly = softenIdentityPhrase(
    humanizeName(coreBName || "").replace(/_/g, " ").toLowerCase(),
    experienceProfile
  );

  const systemText = [...new Set(
    [systemAName, systemBName]
      .filter(Boolean)
      .map((name) =>
        humanizeName(name)
          .replace(/Clue web/i, "uncovering hidden connections")
          .replace(/Exploration discovery loop/i, "exploration and discovery")
          .replace(/Exploration discovery/i, "exploration and discovery")
          .replace(/Hidden information/i, "realizing how much has been kept out of sight")
          .replace(/Environmental combat/i, "dealing with spaces that are as dangerous as the enemies in them")
          .replace(/Influence social leverage/i, "managing pressure, leverage, and fragile alliances")
          .replace(/\bloop\b/gi, "")
          .replace(/and and/gi, "and")
          .replace(/\b(.+?) and \1\b/gi, "$1")
          .replace(/\s+/g, " ")
          .trim()
          .toLowerCase()
      )
  )];
  
  const systemTextFiltered = systemText.filter(
    (text) => !/design|system|track|meter|build|control|reputation/i.test(text)
  );
  //temporary guard to block system ID's from leaking until v0.7.3 can be factored in.//
  const blockedSystemWords = [
    "resource scarcity",
    "attrition combat",
    "escalation meter",
    "modular build system",
    "corruption transformation track",
    "tactical positioning zone control",
    "living world reaction",
    "legacy inheritance system"
  ];

  const hasRawSystemLeak = systemText.some((text) =>
    blockedSystemWords.some((word) => text.includes(word))
  );

  const experienceLineByLabel = {
    primary: [
      `This one plays like a ${pitchGenreText} campaign where ${coreAOnly} keeps pulling the story forward.`,
      `This direction leans into a ${pitchGenreText} experience built around ${coreAOnly}.`,
      `At its best, this feels like a ${pitchGenreText} campaign driven by ${coreAOnly}.`
    ],
    adjacent: [
      `This version takes the same foundation in a slightly different direction, leaning harder into ${coreAOnly}.`,
      `Here, the campaign leans further into ${coreAOnly}, giving that tension more space to build over time.`,
      `This version leans harder into ${coreAOnly}, letting the larger pattern emerge more gradually.`
    ],
    wildcard: [
      `This is the stranger version—the one that leans fully into ${coreAOnly}.`,
      `This take pushes the campaign into a sharper, weirder direction by centering ${coreAOnly}.`,
      `If you want the version with more edge, this is where ${coreAOnly} really takes over.`
    ]
  };

  const secondLineOptions = [];

  if (coreAOnly && coreBOnly) {
    const coreTransitionOptions = [
      `The deeper you go, the more ${coreBOnly} starts surfacing underneath it.`,
      `What starts with ${coreAOnly} gradually opens into ${coreBOnly}.`,
      `And before long, ${coreBOnly} starts changing what the whole campaign is really about.`,
      `As things unfold, ${coreBOnly} starts reshaping what the story is really about.`,
      `Over time, ${coreBOnly} starts shifting the direction of the entire campaign.`
    ];

    secondLineOptions.push(...coreTransitionOptions);
  }

  if (systemTextFiltered.length && !hasRawSystemLeak) {
    const systemLineOptions = [
      `A lot of play comes from ${joinNatural(systemTextFiltered)}.`,
      `You’ll spend a lot of time focused on ${joinNatural(systemTextFiltered)}.`,
      `The rhythm of play comes from ${joinNatural(systemTextFiltered)}.`,
      `The campaign builds its pressure through ${joinNatural(systemTextFiltered)}.`
    ];

    secondLineOptions.push(pickOne(systemLineOptions));
  }

  
  const includeCleanRaw = cleanIncludeText(includeNotes);
  const includeClean = dedupePhrases(includeCleanRaw);
  const includePhrase = includeClean
    .toLowerCase()
    .replace(/keep it\s*/g, "")
    .replace(/\/\s*kid-safe/g, "")
    .trim();

  const first = chooseByLabel(label, experienceLineByLabel);
  const second = pickOne(
    secondLineOptions,
    coreAOnly ? `Everything keeps circling back to ${coreAOnly}.` : ""
  );
  const third = includePhrase
    ? pickOne([
      `The overall feel stays ${includePhrase}.`,
      `Tone-wise, it stays ${includePhrase}.`,
      `It keeps that ${includePhrase} edge without losing momentum.`
    ], "")
    : "";

  let text = [first, second, third].filter(Boolean).join(" ");
  text = cleanOutputText(text);

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