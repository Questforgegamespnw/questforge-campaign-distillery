// src/voice/pitchBuilder.js

const {
  coreVoiceMap,
  systemVoiceMap,
  environmentVoiceMap,
  genreVoiceMap,
  toneVoiceMap,
  collectVoiceLines,
  pickOne
} = require("./voiceMap");

/**
 * Build a client-facing campaign pitch from structured generator output.
 *
 * Expected shape:
 * {
 *   coreIds: ["hidden_truth", "investigators_burden"],
 *   systemIds: ["clue_web", "hidden_information"],
 *   environmentIds: ["dense_city_urban", "ruined_civilization"],
 *   genreId: "victorian_gothic",
 *   toneId: "grimdark"
 * }
 */
function buildPitch(input) {
  const {
    coreIds = [],
    systemIds = [],
    environmentIds = [],
    genreId = "",
    toneId = ""
  } = input || {};

  const corePremises = uniqueLines(
  collectVoiceLines(coreVoiceMap, coreIds, "premise")
);

const coreBurdens = uniqueLines(
  collectVoiceLines(coreVoiceMap, coreIds, "burden")
);

const coreQuestions = uniqueLines(
  collectVoiceLines(coreVoiceMap, coreIds, "question")
);

  const systemGameplay = uniqueLines(
    collectVoiceLines(systemVoiceMap, systemIds, "gameplay")
  );

  const systemPressure = uniqueLines(
    collectVoiceLines(systemVoiceMap, systemIds, "pressure")
  );

  const environmentImagery = uniqueLines(
  collectVoiceLines(environmentVoiceMap, environmentIds, "imagery")
);

const environmentGameplay = uniqueLines(
  collectVoiceLines(environmentVoiceMap, environmentIds, "gameplay")
);

  const genreFraming = genreVoiceMap[genreId]?.framing || [];
  const toneData = toneVoiceMap[toneId] || null;

  const opening = buildOpening({
    corePremises,
    environmentImagery,
    genreFraming,
    toneData
  });

  const premiseBlock = buildPremiseBlock({
    corePremises,
    coreBurdens,
    environmentGameplay
  });

  const gameplayBlock = buildGameplayBlock({
    systemGameplay,
    systemPressure
  });

  const escalation = buildEscalation({
    coreBurdens,
  });

  const closing = buildClosing({
    coreQuestions
  });

  return [opening, premiseBlock, gameplayBlock, escalation, closing]
    .filter(Boolean)
    .join("\n\n");
}

function buildOpening({ corePremises, environmentImagery, genreFraming, toneData }) {
  const premise = pickOne(corePremises, "");
  const imagery = pickOne(environmentImagery, "");
  const framing = pickOne(genreFraming, "");

  const heavyOpeners = [
    "Something is already starting to break.",
    "By the time the group arrives, stability is already slipping.",
    "Whatever once kept this world steady is no longer holding."
  ];

  const elevatedOpeners = [
    "The world is shifting, and the group is arriving at the moment it starts to matter.",
    "Something larger than the group is already in motion.",
    "The old order is no longer enough to contain what is coming next."
  ];

  const intimateOpeners = [
    "The first signs are easy to dismiss—until they stop being dismissible.",
    "What begins as uncertainty does not stay small for long.",
    "Something beneath the surface is already putting pressure on everything around it."
  ];

  const cadence = toneData?.cadence || "heavy";

  let openerPool = heavyOpeners;
  if (cadence === "elevated" || cadence === "driving") {
    openerPool = elevatedOpeners;
  } else if (cadence === "intimate" || cadence === "slow_burn") {
    openerPool = intimateOpeners;
  }

  const opener = pickOne(openerPool, "Something is already changing.");

  const secondLineParts = [premise, imagery || framing].filter(Boolean);
  const secondLine = secondLineParts.length ? secondLineParts.join(" ") : "";

  if (secondLine) {
    const cleanedSecond = cleanSentence(secondLine);
    return `${opener}\n\n${capitalize(cleanedSecond)}`;
  }

  return opener;
}

function buildPremiseBlock({ corePremises, coreBurdens, environmentGameplay }) {
  const premise = pickUnique(corePremises, []);
  const burden = pickUnique(coreBurdens, [premise]);
  const worldLoop = pickUnique(environmentGameplay, [premise, burden]);

  return [premise, burden, worldLoop]
  .filter(Boolean)
  .map(capitalize)
  .join("\n\n");
}

function buildGameplayBlock({ systemGameplay, systemPressure }) {
  const gameplay1 = pickOne(systemGameplay, "");
  const pressure = pickOne(systemPressure, "");

  const lines = [];

  if (gameplay1) {
  const cleanedGameplay = cleanSentence(gameplay1);

  const standaloneStarters = [
  "Once",
  "When",
  "What",
  "Who",
  "Why",
  "How"
];

const standalonePhrases = [
  "The world",
  "The group",
  "Actions",
  "Progress",
  "Discovery",
  "Power",
  "Victory",
  "Reputation",
  "Certainty",
  "Nothing"
];

const isStandaloneStarter = standaloneStarters.some((starter) =>
  cleanedGameplay.startsWith(starter)
);

const isStandalonePhrase = standalonePhrases.some((phrase) =>
  cleanedGameplay.startsWith(phrase)
);

// NEW RULE: full-sentence protection
const looksLikeFullSentence =
  cleanedGameplay.endsWith(".") ||
  cleanedGameplay.includes(",") ||
  cleanedGameplay.split(" ").length > 8;

const shouldStandAlone =
  isStandaloneStarter || isStandalonePhrase || looksLikeFullSentence;

  if (shouldStandAlone) {
    lines.push(cleanedGameplay);
  } else {
    const gameplayIntros = [
      "This campaign is built around",
      "Play centers on",
      "You’ll spend most of your time",
      "The experience focuses on"
    ];

    const intro = pickOne(gameplayIntros, "This campaign is built around");
    lines.push(`${intro} ${cleanedGameplay}`);
  }
}

  return lines.join("\n");
}

function buildEscalation({ coreBurdens}) {
  const burden = pickOne(coreBurdens, "");
  

  const escalationLines = [
    "The deeper the group gets, the harder it becomes to stay untouched by the consequences.",
    "Progress does not reduce pressure so much as reveal what the pressure is really asking of the group.",
    "Every answer, victory, or delay reshapes what the next problem will cost."
  ];

  if (burden) return burden;

return pickOne(escalationLines, "");
}

function buildClosing({ coreQuestions }) {
  const fallbackQuestion = "what happens when the situation can no longer be ignored";
  const question = pickOne(coreQuestions, fallbackQuestion);

  const leadIns = [
    "The question isn’t whether the group can keep moving.",
    "The question isn’t simply whether the group can succeed.",
    "The question isn’t whether the danger is real."
  ];

  return `${pickOne(
    leadIns,
    "The question isn’t whether this can be survived."
  )}\n\nIt’s: what ${stripLeadingWhat(question)}`;
}

function pickUnique(arr, used) {
  if (!Array.isArray(arr) || arr.length === 0) return "";
  const filtered = arr.filter((item) => item && !used.includes(item));
  return pickOne(filtered.length ? filtered : arr, "");
}

function stripLeadingWhat(text) {
  if (!text) return "";
  return text.replace(/^what\s+/i, "");
}

function cleanSentence(text) {
  if (!text) return "";
  return text
    .replace(/\s+/g, " ")
    .replace(/\s([.,!?;:])/g, "$1")
    .trim();
}

function uniqueLines(arr) {
  return [...new Set(arr.filter(Boolean))];
}

function capitalize(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

module.exports = {
  buildPitch
};