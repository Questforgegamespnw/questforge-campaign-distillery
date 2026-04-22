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


function getSystemPitchText(system = {}) {
  const direct = stripTrailingPeriod(cleanName(system?.pitchText || ""));
  if (direct) return direct;

  const fallback = stripTrailingPeriod(
    normalizeDescription(
      system?.description || system?.name || "",
      "Players investigate, connect hidden information, and push deeper into the campaign's central conflict"
    )
  );

  return normalizeSystemLead(fallback);
}

function getCorePitchText(core = {}, fallback = "") {
  const direct = stripTrailingPeriod(cleanName(core?.pitchText || ""));
  if (direct) return direct;

  return softenIdentityPhrase(
    humanizeName(cleanName(core?.name || fallback || ""))
      .replace(/_/g, " ")
      .toLowerCase(),
    "standard"
  );
}

function getCorePitchTextForProfile(core = {}, experienceProfile = "standard", fallback = "") {
  const direct = stripTrailingPeriod(cleanName(core?.pitchText || ""));
  if (direct) {
    return softenIdentityPhrase(direct.toLowerCase(), experienceProfile);
  }

  return softenIdentityPhrase(
    humanizeName(cleanName(core?.name || fallback || ""))
      .replace(/_/g, " ")
      .toLowerCase(),
    experienceProfile
  );
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

function cleanCoreLead(text = "") {
  let cleaned = String(text || "").trim();

  cleaned = cleaned
    .replace(/^trying to\s+/i, "")
    .replace(/^getting caught in\s+/i, "")
    .replace(/^finding\s+/i, "")
    .replace(/^learning that\s+/i, "");

  // Fix common broken verb starts after stripping
  cleaned = cleaned
    .replace(/^survive\s+/i, "surviving ")
    .replace(/^piece together\s+/i, "piecing together ")
    .replace(/^matter\s+/i, "mattering ")
    .replace(/^change\s+/i, "changing ")
    .replace(/^hold on\s+/i, "holding on ");

  return cleaned.replace(/\s+/g, " ");
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

function detectHookCategory({ coreIds = [], toneName = "", genreName = "", label = "primary" }) {
  const tone = cleanName(toneName).toLowerCase();
  const genre = cleanName(genreName).toLowerCase();

  if (
    coreIds.includes("hidden_truth") ||
    coreIds.includes("lost_knowledge") ||
    coreIds.includes("something_is_wrong")
  ) {
    return "mystery";
  }

  if (
    coreIds.includes("survival_against_overwhelming_force") ||
    coreIds.includes("endless_siege") ||
    coreIds.includes("entropy_decay") ||
    coreIds.includes("power_has_a_cost")
  ) {
    return "pressure";
  }

  if (
    coreIds.includes("war_of_ideologies") ||
    coreIds.includes("power_vacuum") ||
    coreIds.includes("the_world_is_alive") ||
    coreIds.includes("cycle_recurrence")
  ) {
    return "world_state";
  }

  if (
    coreIds.includes("fragmented_self") ||
    coreIds.includes("becoming_something_else") ||
    coreIds.includes("what_is_humanity") ||
    coreIds.includes("power_comes_from_within")
  ) {
    return "character";
  }

  if (
    tone.includes("grim") ||
    tone.includes("dark") ||
    tone.includes("dangerous") ||
    tone.includes("bleak") ||
    genre.includes("dark")
  ) {
    return "pressure";
  }

  if (label === "wildcard") {
    return "disruption";
  }

  return "disruption";
}

function buildHookLineByCategory(category, label = "primary") {
  const hookPools = {
    disruption: [
      "It starts small—easy to dismiss—until it stops staying small.",
      "At first, nothing seems wrong. Then the pattern breaks.",
      "What looks stable at a glance does not stay that way for long.",
      "The first sign feels minor. The next one is harder to explain away.",
      "Something ordinary gives way first, and after that the rest stops feeling secure."
    ],
    pressure: [
      "There is not enough time to solve this cleanly.",
      "Every decision is already costing more than it should.",
      "The pressure starts early and rarely lets up.",
      "By the time the group understands the problem, something important is already under strain.",
      "This is the kind of situation where delay becomes part of the damage."
    ],
    mystery: [
      "The answers exist, but they do not line up cleanly.",
      "Everything points somewhere. Nothing agrees.",
      "The truth is there, just not in one place or one version.",
      "Every useful lead seems to come with a missing piece attached to it.",
      "The deeper the group looks, the harder it becomes to believe the obvious explanation."
    ],
    world_state: [
      "The world is no longer holding together the way it used to.",
      "Something fundamental has already shifted, and everyone is living in the aftermath.",
      "The setting is already changing before the group fully understands why.",
      "Whatever once kept things stable is no longer doing the job.",
      "The trouble here is larger than one villain or one event; the whole situation has started to move."
    ],
    character: [
      "This stops being distant the moment it starts changing the people inside it.",
      "You are not just dealing with the problem—you are being pulled into what it changes.",
      "What begins out in the world does not stay out there for long.",
      "This was never going to stay impersonal.",
      "The real pressure starts once the conflict becomes part of who the characters are becoming."
    ]
  };

  const adjacentTweaks = {
    disruption: [
      "The break in the pattern shows earlier than anyone expects.",
      "What first looks minor stops feeling containable very quickly.",
      "The first crack widens before anyone has time to call it harmless."
    ],
    pressure: [
      "The pressure starts building earlier than expected.",
      "The cost shows up faster than the group is ready for.",
      "Strain sets in before anyone has a clean way to answer it."
    ],
    mystery: [
      "The pattern gets harder to explain away the deeper you go.",
      "Uncertainty stops feeling accidental very quickly.",
      "Every answer opens onto a larger hidden structure."
    ],
    world_state: [
      "The wider shift is already underway by the time the group gets involved.",
      "The setting is moving before the characters understand what set it off.",
      "The larger instability is already in motion when the story begins."
    ],
    character: [
      "The conflict gets closer to the characters more quickly.",
      "The people involved do not come through it unchanged.",
      "The pressure turns personal sooner than anyone would like."
    ]
  };

  const wildcardTweaks = {
    disruption: [
      "The situation starts breaking in stranger ways than it first should.",
      "The familiar stops behaving like itself almost immediately.",
      "What should feel stable starts slipping out of place."
    ],
    pressure: [
      "The pressure gets sharp enough to leave marks.",
      "Something important is already being squeezed by the time the group arrives.",
      "There is already too much strain in the system for a clean solution."
    ],
    mystery: [
      "What should fit together keeps refusing to do so.",
      "The truth is there, but it reaches the group in damaged pieces.",
      "The answers get stranger instead of cleaner."
    ],
    world_state: [
      "The larger shift stops staying in the background.",
      "The setting itself has already started going unstable.",
      "Whatever was changing under the surface is no longer staying there."
    ],
    character: [
      "The story stops staying external almost immediately.",
      "The conflict starts getting under the characters' skin fast.",
      "What is happening in the world starts changing the people inside it."
    ]
  };

  if (label === "adjacent") {
    return pickOne(adjacentTweaks[category], pickOne(hookPools[category], ""));
  }

  if (label === "wildcard") {
    return pickOne(wildcardTweaks[category], pickOne(hookPools[category], ""));
  }

  return pickOne(hookPools[category], "");
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
  const systemALead = getSystemPitchText(systemA);
  const systemBLead = getSystemPitchText(systemB);

  const openersByLabel = {
    primary: [
      "You’ll spend most of your time",
      "Most of play is about",
      "A lot of play comes from"
    ],

    adjacent: [
      "Play here tends to revolve around",
      "Most sessions start focusing on",
      "The experience shifts toward",
      "This version puts more weight on",
      "You’ll find the group spending more time"
    ],

    wildcard: [
      "Here, a lot of the tension comes from",
      "The campaign really comes alive through",
      "Most of the pressure shows up through",
      "What defines play here is",
      "This version gets its edge from",
      "Sessions tend to focus on"
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
    "Every step forward changes what you thought you understood.",

    // NEW VARIANTS (critical)
    "The picture starts to shift the closer you look.",
    "Clarity comes in pieces—and they don’t stay consistent.",
    "What seemed solid starts to give way under pressure.",
    "The situation stops behaving the way it should.",
    "The more you uncover, the harder it is to stay certain.",
    "Answers come through—but they raise new problems instead.",
    "What made sense earlier doesn’t hold up anymore.",
    "The ground keeps shifting under what you thought you understood."
  ];

  const opener = chooseByLabel(label, openersByLabel);
  const first = systemALead ? `${opener} ${systemALead}.` : "";

  const second = systemBLead && systemBLead !== systemALead
    ? `${sentenceCase(systemBLead)}.`
    : "";

  const third = pickOne(connectiveLines, "");

  let text = [first, second].filter(Boolean).join(" ");
  if (third) text += ` ${third}`;

  text = cleanOutputText(text);

  return isYouthProfile(experienceProfile) ? softenYouthText(text) : text;
}

function buildDistinctHook({
  genre,
  tone,
  environments,
  label,
  experienceProfile,
  coreIds = []
}) {
  const genreDesc = stripTrailingPeriod(cleanName(genre?.description || ""));
  const genreName = cleanName(genre?.name || "");
  const toneName = cleanName(tone?.name || "");

  const envDescs = uniqueByName(environments)
    .map((env) => stripTrailingPeriod(cleanName(env?.description)))
    .filter(Boolean);

  const envLine = pickOne(envDescs, "");
  const hookCategory = detectHookCategory({
    coreIds,
    toneName,
    genreName,
    label
  });

  const hookLead = buildHookLineByCategory(hookCategory, label);

  const followupPools = {
    disruption: [
      "From there, the campaign starts widening around the first break instead of settling back down.",
      "From there, every attempt to steady the situation reveals something else already slipping.",
      "From there, the first fracture turns into a larger pattern the group cannot ignore."
    ],
    pressure: [
      "From there, the campaign keeps asking what can still be protected before the cost climbs again.",
      "From there, every delay, compromise, or hard choice carries a heavier price than the last one.",
      "From there, the situation keeps tightening faster than anyone can solve it cleanly."
    ],
    mystery: [
      "From there, every answer risks opening a larger contradiction instead of closing the question.",
      "From there, the truth keeps arriving in pieces that are useful, incomplete, and hard to trust all at once.",
      "From there, the group is left sorting through answers that only make the larger pattern stranger."
    ],
    world_state: [
      "From there, the group is dealing with a setting already changing under real strain.",
      "From there, every choice lands inside a world that is already shifting around them.",
      "From there, the story keeps pushing into a larger instability no one can fully step outside of."
    ],
    character: [
      "From there, the conflict starts shaping the people caught inside it as much as the world around them.",
      "From there, what is happening outside the group stops staying separate from what it is doing to them.",
      "From there, the story keeps pressing on identity, change, and what the characters are becoming under strain."
    ]
  };

  const followup = pickOne(followupPools[hookCategory], "");

  let text = [hookLead, followup]
    .filter(Boolean)
    .map((line) => {
      const cleaned = sentenceCase(stripTrailingPeriod(line));
      return cleaned ? `${cleaned}.` : "";
    })
    .filter(Boolean)
    .join(" ");

  text = softenIdentityPhrase(text, experienceProfile);
  text = cleanOutputText(text);

  return isYouthProfile(experienceProfile) ? softenYouthText(text) : text;
}

function buildPitchParagraph({
  label,
  coreA,
  coreB,
  systemA,
  systemB,
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

  const coreAOnly = getCorePitchTextForProfile(coreA, experienceProfile, "Hidden Truth");
  const coreAForPitch = cleanCoreLead(coreAOnly);
  const coreBOnly = getCorePitchTextForProfile(coreB, experienceProfile, "");

  const systemText = [...new Set(
    [systemA, systemB]
      .filter(Boolean)
      .map((system) => getSystemPitchText(system))
      .filter(Boolean)
      .map((text) => text.toLowerCase().replace(/\s+/g, " ").trim())
  )];

  const primarySystemText = systemText[0] || "";

  const experienceLineByLabel = {
    primary: [
      `At its core, this is a ${pitchGenreText} campaign about ${coreAForPitch}.`,
      `This plays like a ${pitchGenreText} story shaped by ${coreAForPitch}.`,
      `From the start, this puts the group inside a ${pitchGenreText} campaign built around ${coreAForPitch}.`,
      `Everything here turns on ${coreAForPitch} in a ${pitchGenreText} campaign.`
    ],
    adjacent: [
      `This version shifts the emphasis toward ${coreAForPitch}, letting that tension shape more of the campaign.`,
      `Here, the story leans further into ${coreAForPitch}, giving it more room to drive events.`,
      `This take moves closer to ${coreAForPitch}, so the campaign starts turning more directly around it.`,
      `The emphasis here falls more squarely on ${coreAForPitch}, which changes the feel of the whole campaign.`
    ],
    wildcard: [
      `This is the stranger angle: a campaign where ${coreAForPitch} takes over much more completely.`,
      `This take pushes deeper into ${coreAForPitch}, giving the campaign a sharper and less predictable identity.`,
      `Here, ${coreAForPitch} stops sitting underneath the story and starts driving it outright.`,
      `This version leans fully into ${coreAForPitch}, letting it shape the direction of the campaign.`
    ]
  };

  const secondLineOptions = [];

  if (primarySystemText) {
    const systemLineOptions = [
      `Most sessions revolve around ${primarySystemText}.`,
      `A lot of the campaign’s momentum comes from ${primarySystemText}.`,
      `Play keeps circling back to ${primarySystemText}.`,
      `What drives the campaign forward is ${primarySystemText}.`,
      `The pressure builds through ${primarySystemText}.`,
      `The group keeps getting pulled back into ${primarySystemText}.`,
      `The core loop centers on ${primarySystemText}.`,
      `What the players do here shapes the campaign through ${primarySystemText}.`
    ];

    secondLineOptions.push(...systemLineOptions);
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
      experienceProfile,
      coreIds
    })
  );

  const pitch = buildPitchParagraph({
    label,
    coreA,
    coreB,
    systemA,
    systemB,
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