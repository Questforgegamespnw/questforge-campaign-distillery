const fs = require("fs");
const path = require("path");

const { translateFormAnswers } = require("../src/parsers/translateFormAnswers");
const { resolveCampaignContext } = require("../src/resolvers/resolveCampaignContext");
const { selectCampaignDirections } = require("../src/selectors/selectCampaignDirections");
const { resolveSelections } = require("../src/utils/lookupById");
const { generateCampaignPitch } = require("../src/renderers/generateCampaignPitch");

const coreFrames = require("../src/data/coreFrames");
const systemFrames = require("../src/data/systemFrames");
const genreSkins = require("../src/data/genreSkins");
const toneSkins = require("../src/data/toneSkins");
const environmentSkins = require("../src/data/environmentSkins");

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

function resolveDirectionBundle(direction, experienceProfile = "standard") {
  return {
    label: direction.label,
    emphasis: direction.emphasis,
    includeNotes: direction.includeNotes || "",
    excludeNotes: direction.excludeNotes || "",
    modifiers: direction.modifiers || {},
    experienceProfile,
    coreFrames: resolveSelections(direction.coreFrames || [], coreFrames),
    systemFrames: resolveSelections(direction.systemFrames || [], systemFrames),
    genreSkin: resolveSelections(direction.genreSkin || [], genreSkins),
    toneSkin: resolveSelections(direction.toneSkin || [], toneSkins),
    environmentSkins: resolveSelections(direction.environmentSkins || [], environmentSkins)
  };
}

function summarizeNames(entries) {
  return (entries || []).map((entry) => entry.name).filter(Boolean).join(" | ");
}

function extractIds(entries) {
  return (entries || []).map((entry) => entry.id).filter(Boolean);
}

function printDirectionSummary(directionBundle, pitchBlock) {
  console.log(`\n  ▶ ${directionBundle.label.toUpperCase()}`);
  console.log(`    Core: ${summarizeNames(directionBundle.coreFrames)}`);
  console.log(`    Systems: ${summarizeNames(directionBundle.systemFrames)}`);
  console.log(`    Genre: ${summarizeNames(directionBundle.genreSkin)}`);
  console.log(`    Tone: ${summarizeNames(directionBundle.toneSkin)}`);
  console.log(`    Environment: ${summarizeNames(directionBundle.environmentSkins)}`);
  console.log(`    Pitch: ${pitchBlock.pitch.replace(/\s+/g, " ").trim()}`);
}

function runSingleFile(fileInfo) {
  const answers = loadJson(fileInfo.fullPath);
  const translated = translateFormAnswers(answers);

  const resolvedContext = resolveCampaignContext({
    translatedForm: translated,
    rawAnswers: answers
  });

  const directions = selectCampaignDirections(resolvedContext.candidateBuckets);

  const resolvedPrimary = resolveDirectionBundle(
    directions.primary,
    resolvedContext.experienceProfile
  );
  const resolvedAdjacent = resolveDirectionBundle(
    directions.adjacent,
    resolvedContext.experienceProfile
  );
  const resolvedWildcard = resolveDirectionBundle(
    directions.wildcard,
    resolvedContext.experienceProfile
  );

  const primaryPitch = generateCampaignPitch(resolvedPrimary);
  const adjacentPitch = generateCampaignPitch(resolvedAdjacent);
  const wildcardPitch = generateCampaignPitch(resolvedWildcard);

  console.log("\n==================================================");
  console.log(`FILE: ${fileInfo.name}`);
  console.log("==================================================");

  printDirectionSummary(resolvedPrimary, primaryPitch);
  printDirectionSummary(resolvedAdjacent, adjacentPitch);
  printDirectionSummary(resolvedWildcard, wildcardPitch);
}

function main() {
  try {
    console.clear();

    const files = loadInputFiles();

    if (files.length === 0) {
      throw new Error(`No JSON files found in ${INPUT_DIR}`);
    }

    console.log("🎲 BATCH FORM TEST");

    files.forEach(runSingleFile);

    console.log("\n✅ Batch test complete.");
  } catch (error) {
    console.error("Batch test failed.");
    console.error(error.message);
    process.exit(1);
  }
}

main();