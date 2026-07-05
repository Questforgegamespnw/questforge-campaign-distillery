#!/usr/bin/env node

const path = require("node:path");
const {
  fileExists,
  readJson,
  writeJson
} = require("../shared/jsonFiles");
const {
  parseCliArgs,
  resolvedPositionalPath,
  stringOption
} = require("../shared/cliArgs");
const {
  getRoundTripPaths,
  readRoundTripStatus,
  updateRoundTripStatus
} = require("../shared/roundTripFiles");
const {
  CONTRACT_VERSION,
  DIRECTIONS,
  resolvePipelineOutput,
  createSourceFingerprint,
  exportPitchExpansionPrompts
} = require("../shared/identityPolishRoundTripUtils");
const {
  markSubmissionWorkflowStep,
  relativePath
} = require("../shared/submissionStatusUtils");

const USAGE =
  "Usage: node scripts/phase1/buildIdentityPitchHandoff.js <validated-identity-pitches.json> [--output <path>] [--submission-slug <slug>]";

function cleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function plainObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function parseArgs(argv = process.argv.slice(2)) {
  const parsed = parseCliArgs(argv);

  return {
    validatedIdentityPitchesFile: resolvedPositionalPath(parsed, 0, USAGE),
    outputFile: cleanString(stringOption(parsed, "output")),
    submissionSlug: cleanString(stringOption(parsed, "submission-slug"))
  };
}

function resolveValidatedPitch(identityDocument = {}, directionKey = "") {
  const pitches = plainObject(identityDocument.identityPitches);
  const direct = plainObject(identityDocument);
  return plainObject(pitches[directionKey] || direct[directionKey]);
}

function requirePitchFields(pitch = {}, directionKey = "") {
  const errors = [];

  for (const field of ["title", "pitch", "about", "playersDo", "hook"]) {
    if (!cleanString(pitch[field])) {
      errors.push(`Validated Identity Pitch ${directionKey}.${field} is missing.`);
    }
  }

  return errors;
}

function buildEnrichedPitch({ directionKey, validatedPitch, promptExport }) {
  const expansionInput = plainObject(promptExport[directionKey]?.expansionInput);
  const deterministicSource = plainObject(expansionInput.source);

  return {
    title:
      cleanString(validatedPitch.title) ||
      cleanString(deterministicSource.title),
    pitch: cleanString(validatedPitch.pitch),
    about: cleanString(validatedPitch.about),
    playersDo: cleanString(validatedPitch.playersDo),
    hook: cleanString(validatedPitch.hook || validatedPitch.distinctHook),
    direction: plainObject(expansionInput.direction),
    source: deterministicSource,
    context: plainObject(expansionInput.context),
    constraints: plainObject(expansionInput.constraints)
  };
}

function buildIdentityPitchHandoff({
  validatedIdentityPitches,
  promptExport,
  sourceFile,
  validatedIdentityPitchesFile,
  sourceFingerprint
}) {
  const errors = [];
  const identityPitches = {};

  for (const directionKey of DIRECTIONS) {
    const validatedPitch = resolveValidatedPitch(
      validatedIdentityPitches,
      directionKey
    );

    errors.push(...requirePitchFields(validatedPitch, directionKey));

    identityPitches[directionKey] = buildEnrichedPitch({
      directionKey,
      validatedPitch,
      promptExport
    });
  }

  if (errors.length > 0) {
    throw new Error(
      `Validated Identity Pitch handoff could not be built:\n- ${errors.join("\n- ")}`
    );
  }

  return {
    metadata: {
      contractVersion: CONTRACT_VERSION,
      sourceFile: path.basename(sourceFile),
      sourceFingerprint,
      sourceMatched: true,
      enriched: true,
      enrichedAt: new Date().toISOString(),
      validatedIdentityPitchesFile: path.relative(
        process.cwd(),
        validatedIdentityPitchesFile
      )
    },
    identityPitches
  };
}

function main() {
  const options = parseArgs();

  if (!fileExists(options.validatedIdentityPitchesFile)) {
    throw new Error(
      `Validated Identity Pitch file not found: ${options.validatedIdentityPitchesFile}`
    );
  }

  const roundTripDir = path.dirname(options.validatedIdentityPitchesFile);
  const artifacts = getRoundTripPaths(roundTripDir, "phase1");

  if (!fileExists(artifacts.status)) {
    throw new Error(
      `Could not find Phase 1 round-trip status beside the validated pitch file: ${artifacts.status}`
    );
  }

  const status = readRoundTripStatus(artifacts);
  const sourceFile = path.resolve(process.cwd(), status.sourceFile || "");

  if (!fileExists(sourceFile)) {
    throw new Error(`Original source file no longer exists: ${sourceFile}`);
  }

  const validatedIdentityPitches = readJson(options.validatedIdentityPitchesFile);
  const inputValue = readJson(sourceFile);
  const pipelineOutput = resolvePipelineOutput(inputValue);
  const promptExport = exportPitchExpansionPrompts(pipelineOutput);
  const sourceFingerprint = createSourceFingerprint(promptExport);

  const validatedFingerprint = cleanString(
    validatedIdentityPitches.metadata?.sourceFingerprint
  );

  if (validatedFingerprint && validatedFingerprint !== sourceFingerprint) {
    throw new Error(
      `Validated Identity Pitch source mismatch. Expected ${sourceFingerprint}; received ${validatedFingerprint}. Rerun Phase 1 prepare/complete from the current source.`
    );
  }

  if (cleanString(status.sourceFingerprint) && status.sourceFingerprint !== sourceFingerprint) {
    throw new Error(
      `Round-trip status source mismatch. Expected ${status.sourceFingerprint}; current source is ${sourceFingerprint}. Rerun Phase 1 prepare/complete from the current source.`
    );
  }

  const outputFile = path.resolve(
    process.cwd(),
    options.outputFile ||
      path.join(roundTripDir, "05_ENRICHED_IDENTITY_PITCHES.json")
  );

  const handoff = buildIdentityPitchHandoff({
    validatedIdentityPitches,
    promptExport,
    sourceFile,
    validatedIdentityPitchesFile: options.validatedIdentityPitchesFile,
    sourceFingerprint
  });

  writeJson(outputFile, handoff);

  updateRoundTripStatus(artifacts, {
    stage: "identity_pitch_handoff_built",
    identityPitchHandoffBuilt: true,
    enrichedIdentityPitches: path.relative(process.cwd(), outputFile),
    nextAction:
      "Review 05_ENRICHED_IDENTITY_PITCHES.json, then create the Identity Selection Record from that enriched handoff file."
  });

  markSubmissionWorkflowStep({
    inputFile: options.validatedIdentityPitchesFile,
    sourceFile: options.validatedIdentityPitchesFile,
    submissionSlug: options.submissionSlug || status.submissionSlug,
    stage: "identity_pitch_handoff_built",
    phase: "phase1",
    phasePatch: {
      aiPolishComplete: true
    },
    artifacts: {
      enrichedIdentityPitches: relativePath(outputFile)
    },
    nextAction:
      "Create the Identity Selection Record from 05_ENRICHED_IDENTITY_PITCHES.json.",
    message: "Enriched Identity Pitch handoff was built."
  });

  console.log("");
  console.log("✅ Enriched Identity Pitch handoff built");
  console.log(`📄 Source: ${sourceFile}`);
  console.log(`📦 Handoff: ${outputFile}`);
  console.log("");
  console.log("Next command:");
  console.log(
    `node scripts/phase1/createIdentitySelectionRecord.js "${path.relative(
      process.cwd(),
      outputFile
    )}" --direction <primary|adjacent|wildcard>`
  );
}

try {
  main();
} catch (error) {
  console.error("❌ Could not build enriched Identity Pitch handoff");
  console.error(error.message);
  process.exitCode = 1;
}

module.exports = {
  parseArgs,
  buildIdentityPitchHandoff
};
