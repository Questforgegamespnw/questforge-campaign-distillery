#!/usr/bin/env node

const fs = require("node:fs");

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
  readJson
} = require("../shared/jsonFiles");
const {
  exportCampaignConceptDocument
} = require("../../src/exporters/phase2/exportCampaignConceptDocument");

const USAGE =
  'Usage: node scripts/phase2/exportCampaignConceptPdf.js <validated-json> [--client "Client Name"] [--reference "Submission 03"] [--html-only]';

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

  const raw = readJson(options.inputFile);
  const directionKey =
    raw.selectedIdentityDirection || "primary";
  const outputDirectory =
    resolveSiblingClientDelivery(options.inputFile);
  const outputStem = deriveSubmissionSlug(options.inputFile);
  const cssPath = fromProjectRoot(
    "templates",
    "campaign-concept-pdf.css"
  );

  const result = await exportCampaignConceptDocument({
    ...options,
    cssPath,
    outputDirectory,
    outputStem,
    directionKey
  });

  console.log(`✅ HTML preview written to: ${result.htmlPath}`);

  if (result.pdfPath) {
    console.log(
      `📦 Campaign Concept PDF written to: ${result.pdfPath}`
    );
  } else {
    console.log("ℹ️ HTML-only mode selected; PDF rendering skipped.");
  }
}

main().catch((error) => {
  console.error("❌ Campaign Concept PDF export failed");
  console.error(error.message);
  process.exitCode = 1;
});

module.exports = {
  parseArgs
};
