const fs = require("fs");
const path = require("path");

const { translateFormAnswers } = require("../../src/parsers/translateFormAnswers");
const { resolveCampaignContext } = require("../../src/resolvers/resolveCampaignContext");
const { selectCampaignDirections } = require("../../src/selectors/selectCampaignDirections");
const { resolveSelections } = require("../../src/utils/lookupById");
const { generateCampaignPitch } = require("../../src/renderers/generateCampaignPitch");

const coreFrames = require("../../src/data/coreFrames");
const systemFrames = require("../../src/data/systemFrames");
const genreSkins = require("../../src/data/genreSkins");
const toneSkins = require("../../src/data/toneSkins");
const environmentSkins = require("../../src/data/environmentSkins");

const INPUT_DIRS = [
  path.resolve(__dirname, "../misc/test-inputs/core"),
  path.resolve(__dirname, "../misc/test-inputs/coverage"),
  path.resolve(__dirname, "../misc/test-inputs/youth"),
  path.resolve(__dirname, "../misc/test-inputs/edge-cases")
];

const OUTPUT_DIR = path.resolve(__dirname, "../misc/test-output");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "batch-forms-output.txt");

function loadInputFiles() {
  const collected = [];

  INPUT_DIRS.forEach((dirPath) => {
    if (!fs.existsSync(dirPath)) {
      return;
    }

    const dirLabel = path.basename(dirPath);

    fs.readdirSync(dirPath)
      .filter((file) => file.endsWith(".json"))
      .forEach((file) => {
        collected.push({
          name: file,
          fullPath: path.join(dirPath, file),
          group: dirLabel
        });
      });
  });

  collected.sort((a, b) => {
    if (a.group !== b.group) {
      return a.group.localeCompare(b.group);
    }
    return a.name.localeCompare(b.name);
  });

  return collected;
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

function normalizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function buildDirectionSummary(directionBundle, pitchBlock) {
  return [
    `\n  ▶ ${directionBundle.label.toUpperCase()}`,
    `    Core: ${summarizeNames(directionBundle.coreFrames)}`,
    `    Systems: ${summarizeNames(directionBundle.systemFrames)}`,
    `    Genre: ${summarizeNames(directionBundle.genreSkin)}`,
    `    Tone: ${summarizeNames(directionBundle.toneSkin)}`,
    `    Environment: ${summarizeNames(directionBundle.environmentSkins)}`,
    `    Pitch: ${normalizeText(pitchBlock.pitch)}`,
    `    About: ${normalizeText(pitchBlock.about)}`,
    `    Players Do: ${normalizeText(pitchBlock.playersDo)}`,
    `    Hook: ${normalizeText(pitchBlock.distinctHook)}`
  ];
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

  return [
    "",
    "==================================================",
    `GROUP: ${fileInfo.group} | FILE: ${fileInfo.name}`,
    "==================================================",
    ...buildDirectionSummary(resolvedPrimary, primaryPitch),
    ...buildDirectionSummary(resolvedAdjacent, adjacentPitch),
    ...buildDirectionSummary(resolvedWildcard, wildcardPitch)
  ];
}

function main() {
  try {
    console.clear();

    const files = loadInputFiles();

    if (files.length === 0) {
      throw new Error("No JSON files found in any configured test-input directory.");
    }

    const countsByGroup = files.reduce((acc, file) => {
      acc[file.group] = (acc[file.group] || 0) + 1;
      return acc;
    }, {});

    const outputLines = [
      "🎲 BATCH FORM TEST",
      `Groups loaded: ${JSON.stringify(countsByGroup)}`
    ];

    let passed = 0;
    let failed = 0;
    const failedFiles = [];

    files.forEach((fileInfo) => {
      try {
        outputLines.push(...runSingleFile(fileInfo));
        passed += 1;
      } catch (error) {
        failed += 1;
        failedFiles.push(`${fileInfo.group}/${fileInfo.name}`);
        outputLines.push(
          "",
          "==================================================",
          `GROUP: ${fileInfo.group} | FILE: ${fileInfo.name}`,
          "==================================================",
          `❌ Failed: ${error.message}`
        );
      }
    });

    outputLines.push(
      "",
      `✅ Batch test complete. Passed: ${passed} | Failed: ${failed}`,
      ""
    );

    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, outputLines.join("\n"), "utf-8");

    console.log("🎲 BATCH FORM TEST");
    console.log(`Output written to: ${OUTPUT_FILE}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);

    if (failedFiles.length > 0) {
      console.log("Failed fixtures:");
      failedFiles.forEach((file) => console.log(`  - ${file}`));
      process.exitCode = 1;
    }
  } catch (error) {
    console.error("Batch test failed.");
    console.error(error.message);
    process.exit(1);
  }
}

main();
