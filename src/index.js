const { loadNormalizedIntake } = require("./parsers/loadNormalizedIntake");
const { scoreCandidates } = require("./selectors/scoreCandidates");
const { selectTopThree } = require("./selectors/selectTopThree");
const coreFrames = require("./data/coreFrames");

function main() {
  try {
    const intake = loadNormalizedIntake("misc/example-normalized-output.json");

    console.log("✅ Normalized intake is valid.\n");

    const scoredCoreFrames = scoreCandidates(intake, coreFrames, "toneTags");
    const topThreeCoreFrames = selectTopThree(scoredCoreFrames);

    console.log("🎯 Top Core Frame Options:");
    console.log(
      `Primary:  ${
        topThreeCoreFrames.primary
          ? `${topThreeCoreFrames.primary.id} (${topThreeCoreFrames.primary.score})`
          : "None"
      }`
    );
    console.log(
      `Adjacent: ${
        topThreeCoreFrames.adjacent
          ? `${topThreeCoreFrames.adjacent.id} (${topThreeCoreFrames.adjacent.score})`
          : "None"
      }`
    );
    console.log(
      `Wildcard: ${
        topThreeCoreFrames.wildcard
          ? `${topThreeCoreFrames.wildcard.id} (${topThreeCoreFrames.wildcard.score})`
          : "None"
      }`
    );
  } catch (error) {
    console.error("Failed to run pipeline.");
    console.error(error.message);
    process.exit(1);
  }
}

main();