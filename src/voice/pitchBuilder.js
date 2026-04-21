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
    systemPressure,
    toneData
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

  const detail = pickOne([imagery, framing].filter(Boolean), "");
  const secondLine = [premise, detail].filter(Boolean).join(". ");

  if (secondLine) {
    const cleanedSecond = cleanOutputText(secondLine);
    return `${opener}\n\n${capitalize(cleanedSecond)}`;
  }

  return opener;
}

function buildPremiseBlock({ corePremises, coreBurdens, environmentGameplay }) {
  const premise = cleanSentence(pickUnique(corePremises, []));
  const burden = cleanSentence(pickUnique(coreBurdens, [premise]));
  const worldLoop = cleanSentence(pickUnique(environmentGameplay, [premise, burden]));

  const frames = [
    ({ premise, burden, worldLoop }) =>
      [premise, burden, worldLoop]
        .filter(Boolean)
        .map(capitalize)
        .join("\n\n"),

    ({ premise, burden, worldLoop }) =>
      [premise, burden]
        .filter(Boolean)
        .map(capitalize)
        .join("\n\n"),

    ({ premise, burden, worldLoop }) =>
      [premise, worldLoop]
        .filter(Boolean)
        .map(capitalize)
        .join("\n\n"),

    ({ premise, burden, worldLoop }) =>
      [premise, burden, worldLoop]
        .filter(Boolean)
        .join(" ")
        .trim(),

    ({ premise, burden, worldLoop }) =>
      burden
        ? `${capitalize(premise)} ${lowerStart(burden)}`
        : capitalize(premise),

    ({ premise, burden, worldLoop }) =>
      worldLoop
        ? `${capitalize(premise)} ${lowerStart(worldLoop)}`
        : capitalize(premise)
  ];

  const frame = pickOne(frames, frames[0]);
  return cleanOutputText(frame({ premise, burden, worldLoop }));
}

function buildGameplayBlock({ systemGameplay, systemPressure, toneData }) {
  const gameplay = pickOne(systemGameplay, "");
  const pressure = pickOne(systemPressure, "");

  if (!gameplay && !pressure) return "";

  const cleanedGameplay = cleanSentence(gameplay);
  const cleanedPressure = cleanSentence(pressure);

  const cadence = toneData?.cadence || "neutral";
  const style = toneData?.sentenceStyle || "neutral";

  const immersiveFrames = [
    ({ gameplay, pressure }) =>
      [gameplay, pressure].filter(Boolean).join(" "),
    ({ gameplay, pressure }) =>
      pressure
        ? `${gameplay} ${pressure}`
        : gameplay,
    ({ gameplay, pressure }) =>
      pressure
        ? `Play tends to move through ${lowerStart(gameplay)} ${lowerStart(pressure)}`
        : `Play tends to move through ${lowerStart(gameplay)}`
  ];

  const declarativeFrames = [
    ({ gameplay, pressure }) =>
      pressure
        ? `At the table, ${lowerStart(gameplay)} ${lowerStart(pressure)}`
        : `At the table, ${lowerStart(gameplay)}`,
    ({ gameplay, pressure }) =>
      pressure
        ? `The play experience centers on ${lowerStart(gameplay)} ${lowerStart(pressure)}`
        : `The play experience centers on ${lowerStart(gameplay)}`,
    ({ gameplay, pressure }) =>
      pressure
        ? `${gameplay} ${pressure}`
        : gameplay
  ];

  const punchyFrames = [
    ({ gameplay, pressure }) =>
      pressure
        ? `${gameplay} ${pressure}`
        : gameplay,
    ({ gameplay, pressure }) =>
      pressure
        ? `${gameplay}\n\n${pressure}`
        : gameplay,
    ({ gameplay, pressure }) =>
      pressure
        ? `${gameplay} And ${lowerStart(pressure)}`
        : gameplay
  ];

  const bouncyFrames = [
    ({ gameplay, pressure }) =>
      pressure
        ? `${gameplay} ${pressure}`
        : gameplay,
    ({ gameplay, pressure }) =>
      pressure
        ? `Things stay in motion because ${lowerStart(gameplay)} ${lowerStart(pressure)}`
        : `Things stay in motion because ${lowerStart(gameplay)}`,
    ({ gameplay, pressure }) =>
      pressure
        ? `${gameplay} That momentum keeps building, because ${lowerStart(pressure)}`
        : `${gameplay}`
  ];

  let pool = declarativeFrames;

  if (cadence === "slow_burn" || cadence === "intimate" || style === "layered") {
    pool = immersiveFrames;
  } else if (
    cadence === "heavy" ||
    cadence === "urgent" ||
    style === "sharp" ||
    style === "tight"
  ) {
    pool = punchyFrames;
  } else if (
    cadence === "fast" ||
    style === "bouncy"
  ) {
    pool = bouncyFrames;
  }

  const frame = pickOne(pool, declarativeFrames[0]);
  return cleanOutputText(frame({ gameplay: cleanedGameplay, pressure: cleanedPressure }));
}

function buildEscalation({ coreBurdens }) {
  const burden = cleanSentence(pickOne(coreBurdens, ""));

  const escalationLines = [
    "The deeper the group gets, the harder it becomes to stay untouched by the consequences.",
    "Progress does not reduce pressure so much as reveal what the pressure is really asking of the group.",
    "Every answer, victory, or delay reshapes what the next problem will cost."
  ];

  const escalationFrames = [
    ({ burden }) =>
      burden
        ? `That pressure does not stay contained. ${lowerStart(burden)}`
        : "",

    ({ burden }) =>
      burden
        ? `What starts as a manageable problem rarely stays that way. ${lowerStart(burden)}`
        : "",

    ({ burden }) =>
      burden
        ? `The danger keeps changing shape as the group pushes forward. ${lowerStart(burden)}`
        : "",

    ({ burden }) =>
      burden
        ? `${capitalize(burden)}`
        : "",

    () => pickOne(escalationLines, "")
  ];

  const frame = pickOne(escalationFrames, escalationFrames[0]);
  return cleanOutputText(frame({ burden })) || pickOne(escalationLines, "");
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

function lowerStart(text = "") {
  if (!text) return "";
  return text.charAt(0).toLowerCase() + text.slice(1);
}

function uniqueLines(arr) {
  return [...new Set(arr.filter(Boolean))];
}

function capitalize(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function cleanOutputText(text) {
  if (!text) return "";
  return text
    .replace(/\s+/g, " ")
    .replace(/\s([.,!?;:])/g, "$1")
    .replace(/\.\s*\./g, ".")
    .trim();
}

module.exports = {
  buildPitch
};