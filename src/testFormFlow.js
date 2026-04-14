const fs = require("fs");
const path = require("path");

const { translateFormAnswers } = require("./parsers/translateFormAnswers");
const { selectTopWeighted } = require("./selectors/selectTopWeighted");
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

function buildSelectionBundle(translated) {
  const topCore = resolveSelections(
    selectTopWeighted(translated.coreFrames, 2),
    coreFrames
  );

  const topSystem = resolveSelections(
    selectTopWeighted(translated.systemFrames, 2),
    systemFrames
  );

  const topGenre = resolveSelections(
    selectTopWeighted(translated.genreSkins, 1),
    genreSkins
  );

  const topTone = resolveSelections(
    selectTopWeighted(translated.toneSkins, 1),
    toneSkins
  );

  const topEnvironment = resolveSelections(
    selectTopWeighted(translated.environmentSkins, 2),
    environmentSkins
  );

  return {
    coreFrames: topCore,
    systemFrames: topSystem,
    genreSkin: topGenre,
    toneSkin: topTone,
    environmentSkins: topEnvironment
  };
}

function printRecommendations(bundle, pitchBlock) {
  console.log("\n🎯 FORM RECOMMENDATION\n");

  console.log("🧱 Core Frames:");
  bundle.coreFrames.forEach((entry) => {
    console.log(`- ${entry.name} (${entry.weight})`);
    if (entry.description) {
      console.log(`  ${entry.description}`);
    }
  });

  console.log("\n⚙️ System Frames:");
  bundle.systemFrames.forEach((entry) => {
    console.log(`- ${entry.name} (${entry.weight})`);
    if (entry.description) {
      console.log(`  ${entry.description}`);
    }
  });

  console.log("\n🎨 Genre:");
  bundle.genreSkin.forEach((entry) => {
    console.log(`- ${entry.name} (${entry.weight})`);
    if (entry.description) {
      console.log(`  ${entry.description}`);
    }
  });

  console.log("\n🎭 Tone:");
  bundle.toneSkin.forEach((entry) => {
    console.log(`- ${entry.name} (${entry.weight})`);
    if (entry.description) {
      console.log(`  ${entry.description}`);
    }
  });

  console.log("\n🌍 Environment:");
  bundle.environmentSkins.forEach((entry) => {
    console.log(`- ${entry.name} (${entry.weight})`);
    if (entry.description) {
      console.log(`  ${entry.description}`);
    }
  });

  console.log("\n📝 Campaign Pitch:");
  console.log(pitchBlock.pitch);

  console.log("\n• What the campaign is about:");
  console.log(pitchBlock.about);

  console.log("\n• What the players do:");
  console.log(pitchBlock.playersDo);

  console.log("\n• What makes it distinct:");
  console.log(pitchBlock.distinctHook);
}

function main() {
  try {
    const answers = loadFormAnswers();
    const translated = translateFormAnswers(answers);
    const bundle = buildSelectionBundle(translated);
    const pitchBlock = generateCampaignPitch(bundle);

    printRecommendations(bundle, pitchBlock);
  } catch (error) {
    console.error("Form translation failed.");
    console.error(error.message);
    process.exit(1);
  }
}

main();