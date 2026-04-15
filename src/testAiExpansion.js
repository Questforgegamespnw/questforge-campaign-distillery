const fs = require("fs");
const path = require("path");

const { translateFormAnswers } = require("./parsers/translateFormAnswers");
const { selectCampaignDirections } = require("./selectors/selectCampaignDirections");
const { resolveSelections } = require("./utils/lookupById");

const { buildPitch } = require("./voice/pitchBuilder");
const { buildExpansionInput } = require("./ai/buildExpansionInput");
const { buildExpansionPrompt } = require("./ai/expandPitch");

const coreFrames = require("./data/coreFrames");
const systemFrames = require("./data/systemFrames");
const genreSkins = require("./data/genreSkins");
const toneSkins = require("./data/toneSkins");
const environmentSkins = require("./data/environmentSkins");

const INPUT_DIR = path.resolve(__dirname, "../misc/test-inputs");

function loadInputFiles() {
  if (!fs.existsSync(INPUT_DIR)) {
    throw new Error(`Missing test input directory: ${INPUT_DIR}`);
  }

  return fs
    .readdirSync(INPUT_DIR)
    .filter((file) => file.endsWith(".json"))
    .map((file) => ({
      name: file,
      fullPath: path.join(INPUT_DIR, file)
    }));
}

function loadJson(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8").trim();

  if (!raw) {
    throw new Error("File is empty");
  }

  return JSON.parse(raw);
}

function resolveDirectionBundle(direction) {
  return {
    label: direction.label,
    emphasis: direction.emphasis,
    includeNotes: direction.includeNotes || "",
    excludeNotes: direction.excludeNotes || "",
    modifiers: direction.modifiers || {},
    coreFrames: resolveSelections(direction.coreFrames || [], coreFrames),
    systemFrames: resolveSelections(direction.systemFrames || [], systemFrames),
    genreSkin: resolveSelections(direction.genreSkin || [], genreSkins),
    toneSkin: resolveSelections(direction.toneSkin || [], toneSkins),
    environmentSkins: resolveSelections(direction.environmentSkins || [], environmentSkins)
  };
}

function extractIds(entries) {
  return (entries || []).map((entry) => entry.id).filter(Boolean);
}

function summarizeNames(entries) {
  return (entries || []).map((entry) => entry.name).filter(Boolean).join(" | ");
}

function buildPitchInput(directionBundle) {
  return {
    coreIds: extractIds(directionBundle.coreFrames),
    systemIds: extractIds(directionBundle.systemFrames),
    environmentIds: extractIds(directionBundle.environmentSkins),
    genreId: extractIds(directionBundle.genreSkin)[0] || "",
    toneId: extractIds(directionBundle.toneSkin)[0] || ""
  };
}

function printDirectionSummary(directionBundle, basePitch, expansionInput) {
  console.log(`\n  ▶ ${directionBundle.label.toUpperCase()}`);
  console.log(`    Core: ${summarizeNames(directionBundle.coreFrames)}`);
  console.log(`    Systems: ${summarizeNames(directionBundle.systemFrames)}`);
  console.log(`    Genre: ${summarizeNames(directionBundle.genreSkin)}`);
  console.log(`    Tone: ${summarizeNames(directionBundle.toneSkin)}`);
  console.log(`    Environment: ${summarizeNames(directionBundle.environmentSkins)}`);
  console.log(`    Base Pitch: ${basePitch.replace(/\s+/g, " ").trim()}`);
  console.log(`    Prompt Inputs:`);
  console.log(`      includeNotes: ${expansionInput.includeNotes || "(none)"}`);
  console.log(`      excludeNotes: ${expansionInput.excludeNotes || "(none)"}`);
}

function printCopyPrompt(directionLabel, prompt) {
  console.log("\n==================================================");
  console.log(`🧠 COPY INTO CHATGPT — ${directionLabel.toUpperCase()}`);
  console.log("==================================================\n");
  console.log("💡 Tip: triple-click to select, then Ctrl+C\n");
  console.log(prompt);

  console.log("\n==================================================");
  console.log("📋 END PROMPT");
  console.log("==================================================\n");
}

async function runSingleFile(fileInfo) {
  const answers = loadJson(fileInfo.fullPath);
  const translated = translateFormAnswers(answers);
  const directions = selectCampaignDirections(translated);

  const resolvedPrimary = resolveDirectionBundle(directions.primary);
  const resolvedAdjacent = resolveDirectionBundle(directions.adjacent);
  const resolvedWildcard = resolveDirectionBundle(directions.wildcard);

  const directionBundles = [resolvedPrimary, resolvedAdjacent, resolvedWildcard];

  console.log("\n==================================================");
  console.log(`FILE: ${fileInfo.name}`);
  console.log("==================================================");

  for (const directionBundle of directionBundles) {
  const basePitch = buildPitch(buildPitchInput(directionBundle));
  const expansionInput = buildExpansionInput(directionBundle, basePitch);
  const prompt = buildExpansionPrompt(expansionInput);

  printDirectionSummary(directionBundle, basePitch, expansionInput);

  printCopyPrompt(directionBundle.label, prompt);
}
}

async function main() {
  try {
    console.clear();

    const files = loadInputFiles();

    if (files.length === 0) {
      throw new Error(`No JSON files found in ${INPUT_DIR}`);
    }

    console.log("🤖 AI EXPANSION TEST");

    for (const fileInfo of files) {
      await runSingleFile(fileInfo);
    }

    console.log("\n✅ AI expansion test complete.");
  } catch (error) {
    console.error("AI expansion test failed.");
    console.error(error.message);
    process.exit(1);
  }
}



main();