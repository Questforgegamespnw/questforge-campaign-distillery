#!/usr/bin/env node

const path = require("node:path");
const { evaluateExpansionResponse } = require("../../src/ai/expandPitch");
const {
  readJson,
  readText,
  writeJson,
  writeText,
  fileExists
} = require("../shared/jsonFiles");
const {
  parseCliArgs,
  resolvedPositionalPath
} = require("../shared/cliArgs");
const {
  normalizeResponseValue,
  extractFirstJsonObject
} = require("../shared/aiResponseParsing");
const {
  getRoundTripPaths,
  requireRoundTripFiles,
  updateRoundTripStatus
} = require("../shared/roundTripFiles");
const {
  CONTRACT_VERSION,
  DIRECTIONS,
  resolvePipelineOutput,
  createSourceFingerprint,
  assertResponseEnvelope,
  exportPitchExpansionPrompts
} = require("../shared/identityPolishRoundTripUtils");

const USAGE =
  "Usage: node scripts/phase1/completeIdentityPolishRoundTrip.js <round-trip-folder>";

function parseArgs(argv = process.argv.slice(2)) {
  const parsed = parseCliArgs(argv);
  return {
    workspaceDir: resolvedPositionalPath(parsed, 0, USAGE)
  };
}

function buildClientOutput(report) {
  const result = {};

  for (const directionKey of DIRECTIONS) {
    const direction = report.directions[directionKey];

    result[directionKey] = {
      title: direction.title,
      pitch: direction.output.pitch,
      about: direction.output.about,
      playersDo: direction.output.playersDo,
      hook: direction.output.hook
    };
  }

  return result;
}

function main() {
  const { workspaceDir } = parseArgs();
  const artifacts = getRoundTripPaths(workspaceDir, "phase1");

  requireRoundTripFiles(artifacts, ["status", "response"]);

  const status = readJson(artifacts.status);
  const sourceFile = path.resolve(process.cwd(), status.sourceFile);

  if (!fileExists(sourceFile)) {
    throw new Error(`Original source file no longer exists: ${sourceFile}`);
  }

  const inputValue = readJson(sourceFile);
  const pipelineOutput = resolvePipelineOutput(inputValue);
  const promptExport = exportPitchExpansionPrompts(pipelineOutput);
  const sourceFingerprint = createSourceFingerprint(promptExport);
  const responseEnvelope = extractFirstJsonObject(
    readText(artifacts.response, "utf8")
  );

  const envelopeErrors = assertResponseEnvelope(responseEnvelope, {
    contractVersion: CONTRACT_VERSION,
    sourceFingerprint
  });

  if (envelopeErrors.length > 0) {
    writeJson(artifacts.validation, {
      accepted: false,
      sourceMatched: false,
      acceptedCount: 0,
      directionCount: DIRECTIONS.length,
      errors: envelopeErrors,
      expected: {
        contractVersion: CONTRACT_VERSION,
        sourceFile: path.basename(sourceFile),
        sourceFingerprint
      },
      received: responseEnvelope?.metadata || null
    });

    writeText(
      artifacts.summary,
      [
        "IDENTITY POLISH VALIDATION FAILED",
        "",
        ...envelopeErrors.map((error) => `- ${error}`),
        "",
        "No direction responses were evaluated against the wrong source.",
        "Regenerate the round trip if the source campaign has changed."
      ].join("\n") + "\n"
    );

    updateRoundTripStatus(artifacts, {
      stage: "response_source_mismatch",
      responseImported: true,
      validationRun: true,
      completed: false,
      nextAction:
        "Review 03_VALIDATION_RESULT.json. Regenerate the round trip if the source file changed, or paste the response produced from this workspace's prompt."
    });

    process.exitCode = 1;
    return;
  }

  const report = {
    metadata: {
      contractVersion: CONTRACT_VERSION,
      sourceFile: path.basename(sourceFile),
      sourceFingerprint,
      sourceMatched: true,
      acceptedCount: 0,
      directionCount: DIRECTIONS.length
    },
    directions: {}
  };

  for (const directionKey of DIRECTIONS) {
    const block = promptExport[directionKey];
    const rawText = normalizeResponseValue(
      responseEnvelope.responses[directionKey]
    );
    const result = evaluateExpansionResponse(
      block.expansionInput,
      rawText
    );

    report.directions[directionKey] = {
      title: block.title,
      accepted: result.accepted,
      fallbackUsed: result.fallbackUsed,
      errors: result.errors,
      deterministic: block.expansionInput.source,
      output: result.output
    };

    if (result.accepted) {
      report.metadata.acceptedCount += 1;
    }
  }

  writeJson(artifacts.validation, report);

  const allAccepted =
    report.metadata.acceptedCount === report.metadata.directionCount;

  if (allAccepted) {
    writeJson(artifacts.validated, {
      metadata: report.metadata,
      identityPitches: buildClientOutput(report)
    });
  }

  const summaryLines = [
    "QUESTFORGE IDENTITY POLISH VALIDATION",
    "",
    `Source: ${report.metadata.sourceFile}`,
    `Source matched: ${report.metadata.sourceMatched}`,
    `Accepted: ${report.metadata.acceptedCount}/${report.metadata.directionCount}`,
    ""
  ];

  for (const directionKey of DIRECTIONS) {
    const direction = report.directions[directionKey];
    summaryLines.push(
      `${directionKey.toUpperCase()}: ${
        direction.accepted ? "ACCEPTED" : "REVIEW REQUIRED"
      }`
    );

    for (const error of direction.errors) {
      summaryLines.push(`  - ${error}`);
    }
  }

  summaryLines.push(
    "",
    allAccepted
      ? "All three polished Identity Pitches passed validation."
      : "One or more directions failed validation. Review 03_VALIDATION_RESULT.json before using the output."
  );

  writeText(artifacts.summary, `${summaryLines.join("\n")}\n`);

  updateRoundTripStatus(artifacts, {
    stage: allAccepted ? "complete" : "validation_review_required",
    responseImported: true,
    validationRun: true,
    completed: allAccepted,
    acceptedCount: report.metadata.acceptedCount,
    directionCount: report.metadata.directionCount,
    nextAction: allAccepted
      ? "Review 04_VALIDATED_IDENTITY_PITCHES.json for client delivery."
      : "Review 03_VALIDATION_RESULT.json, correct or regenerate the failed direction content, and rerun this completion command."
  });

  console.log("");
  console.log(`✅ Source matched: ${report.metadata.sourceFile}`);
  console.log(
    `${allAccepted ? "✅" : "⚠️"} Accepted ${report.metadata.acceptedCount}/${report.metadata.directionCount} AI responses`
  );
  console.log(`📄 Validation result: ${artifacts.validation}`);
  console.log(`📄 Summary: ${artifacts.summary}`);

  if (allAccepted) {
    console.log(`📦 Validated Identity Pitches: ${artifacts.validated}`);
  } else {
    process.exitCode = 1;
  }
}

try {
  main();
} catch (error) {
  console.error("❌ Could not complete Identity Pitch round trip");
  console.error(error.message);
  process.exitCode = 1;
}
