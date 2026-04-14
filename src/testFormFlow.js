const fs = require("fs");
const path = require("path");

const { translateFormAnswers } = require("./parsers/translateFormAnswers");
const { selectCampaignDirections } = require("./selectors/selectCampaignDirections");
const { resolveSelections } = require("./utils/lookupById");
const { generateCampaignPitch } = require("./renderers/generateCampaignPitch");

const coreFrames = require("./data/coreFrames");
const systemFrames = require("./data/systemFrames");
const genreSkins = require("./data/genreSkins");
const toneSkins = require("./data/toneSkins");
const environmentSkins = require("./data/environmentSkins");

function loadFormAnswers() {
  const filePath = path.resolve(__dirname, "../misc/example-form-answers.json");
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
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

function printSection(title, entries) {
  console.log(`\n${title}`);
  entries.forEach((entry) => {
    console.log(`- ${entry.name} (${entry.weight})`);
    if (entry.description) {
      console.log(`  ${entry.description}`);
    }
  });
}

function printRecommendation(directionBundle, pitchBlock) {
  const label = directionBundle.label
    ? directionBundle.label.toUpperCase()
    : "DIRECTION";

  console.log(`\n========================================`);
  console.log(`🎯 ${label}`);
  console.log(`========================================`);

  if (directionBundle.emphasis) {
    console.log(`\n${directionBundle.emphasis}`);
  }

  printSection("🧱 Core Frames:", directionBundle.coreFrames);
  printSection("⚙️ System Frames:", directionBundle.systemFrames);
  printSection("🎨 Genre:", directionBundle.genreSkin);
  printSection("🎭 Tone:", directionBundle.toneSkin);
  printSection("🌍 Environment:", directionBundle.environmentSkins);

  console.log("\n📝 Campaign Pitch:");
  console.log(pitchBlock.pitch);

  console.log("\n• What the campaign is about:");
  console.log(pitchBlock.about);

  console.log("\n• What the players do:");
  console.log(pitchBlock.playersDo);

  console.log("\n• What makes it distinct:");
  console.log(pitchBlock.distinctHook);

  if (directionBundle.includeNotes) {
    console.log("\n• Include notes:");
    console.log(directionBundle.includeNotes);
  }

  if (directionBundle.excludeNotes) {
    console.log("\n• Exclude notes:");
    console.log(directionBundle.excludeNotes);
  }
}

function main() {
  try {
    const answers = loadFormAnswers();
    const translated = translateFormAnswers(answers);

    const directions = selectCampaignDirections(translated);

    const resolvedPrimary = resolveDirectionBundle(directions.primary);
    const resolvedAdjacent = resolveDirectionBundle(directions.adjacent);
    const resolvedWildcard = resolveDirectionBundle(directions.wildcard);

    const primaryPitch = generateCampaignPitch(resolvedPrimary);
    const adjacentPitch = generateCampaignPitch(resolvedAdjacent);
    const wildcardPitch = generateCampaignPitch(resolvedWildcard);

    console.log("\n🎲 FORM-DRIVEN CAMPAIGN DIRECTIONS");

    printRecommendation(resolvedPrimary, primaryPitch);
    printRecommendation(resolvedAdjacent, adjacentPitch);
    printRecommendation(resolvedWildcard, wildcardPitch);
  } catch (error) {
    console.error("Form translation failed.");
    console.error(error.message);
    process.exit(1);
  }
}

main();