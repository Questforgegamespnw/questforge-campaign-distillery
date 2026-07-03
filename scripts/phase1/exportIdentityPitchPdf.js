#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const {
  parseCliArgs,
  resolvedPositionalPath,
  stringOption,
  booleanOption
} = require("../shared/cliArgs");
const {
  deriveSubmissionSlug,
  resolveSiblingClientDelivery
} = require("../shared/submissionPathUtils");
const {
  fromProjectRoot
} = require("../shared/projectPaths");
const {
  exportIdentityPitchDocument
} = require("../../src/exporters/phase1/exportIdentityPitchDocument");
const {
  markSubmissionWorkflowStep,
  relativePath
} = require("../shared/submissionStatusUtils");

const USAGE =
  'Usage: node scripts/phase1/exportIdentityPitchPdf.js <validated-json> [--client "Client Name"] [--reference "Submission 03"] [--html-only]';

function parseArgs(argv = process.argv.slice(2)) {
  const parsed = parseCliArgs(argv);

  return {
    inputFile: resolvedPositionalPath(parsed, 0, USAGE),
    clientName: stringOption(parsed, "client"),
    reference: stringOption(parsed, "reference"),
    htmlOnly: booleanOption(parsed, "html-only")
  };
}

async function main() {
  const options = parseArgs();

  if (!fs.existsSync(options.inputFile)) {
    throw new Error(`Input file not found: ${options.inputFile}`);
  }

  const outputDirectory =
    resolveSiblingClientDelivery(options.inputFile);
  const outputStem = deriveSubmissionSlug(options.inputFile);
  const cssPath = fromProjectRoot(
    "templates",
    "identity-pitch-pdf.css"
  );

  const result = await exportIdentityPitchDocument({
    ...options,
    cssPath,
    outputDirectory,
    outputStem
  });

  console.log(`✅ HTML preview written to: ${result.htmlPath}`);

  markSubmissionWorkflowStep({
    inputFile: options.inputFile,
    sourceFile: options.inputFile,
    submissionSlug: deriveSubmissionSlug(options.inputFile),
    stage: result.pdfPath ? "phase_1_pdf_exported" : "phase_1_html_exported",
    phase: "phase1",
    phasePatch: {
      clientDeliveryComplete: Boolean(result.pdfPath)
    },
    artifacts: {
      identityPitchHtml: relativePath(result.htmlPath),
      identityPitchPdf: result.pdfPath ? relativePath(result.pdfPath) : ""
    },
    nextAction: result.pdfPath
      ? "Send the Phase 1 Identity Pitch PDF to the client or record the selected identity direction when received."
      : "Review the HTML preview and rerun without --html-only when ready to export the client PDF.",
    message: result.pdfPath
      ? "Phase 1 Identity Pitch PDF exported."
      : "Phase 1 Identity Pitch HTML preview exported."
  });

  if (result.pdfPath) {
    console.log(`✅ Client PDF written to: ${result.pdfPath}`);
  } else {
    console.log("ℹ️ HTML-only mode selected; PDF rendering skipped.");
  }
}

main().catch((error) => {
  console.error("❌ Identity Pitch PDF export failed");
  console.error(error.message);
  process.exitCode = 1;
});

module.exports = {
  parseArgs
};
