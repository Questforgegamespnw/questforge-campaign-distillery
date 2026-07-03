const fs = require("node:fs");
const path = require("node:path");

const {
  readJson,
  readText,
  writeText,
  ensureDirectory
} = require("../shared/exportFiles");
const {
  renderHtmlFileToPdf
} = require("../shared/renderHtmlPdf");
const {
  normalizeCampaignConceptDocument
} = require("./normalizeCampaignConceptDocument");
const {
  buildCampaignConceptHtml
} = require("./buildCampaignConceptHtml");

async function exportCampaignConceptDocument(options) {
  const {
    inputFile,
    cssPath,
    outputDirectory,
    outputStem,
    directionKey = "primary",
    clientName = "",
    reference = "",
    htmlOnly = false,
    preparedDate
  } = options;

  if (!fs.existsSync(inputFile)) {
    throw new Error(`Input file not found: ${inputFile}`);
  }

  if (!fs.existsSync(cssPath)) {
    throw new Error(`Missing PDF stylesheet: ${cssPath}`);
  }

  ensureDirectory(outputDirectory);

  const normalized = normalizeCampaignConceptDocument(
    readJson(inputFile)
  );
  const cssText = readText(cssPath);
  const html = buildCampaignConceptHtml(
    normalized,
    {
      clientName,
      reference,
      preparedDate
    },
    cssText
  );

  const safeDirection =
    String(
      directionKey ||
        normalized.selectedIdentityDirection ||
        "primary"
    )
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "-") || "primary";

  const htmlPath = path.join(
    outputDirectory,
    `${outputStem}_${safeDirection}_campaign-concepts-preview.html`
  );
  const pdfPath = path.join(
    outputDirectory,
    `${outputStem}_${safeDirection}_campaign-concepts.pdf`
  );

  writeText(htmlPath, html);

  if (!htmlOnly) {
    await renderHtmlFileToPdf({ htmlPath, pdfPath });
  }

  return {
    htmlPath,
    pdfPath: htmlOnly ? null : pdfPath,
    normalized
  };
}

module.exports = {
  exportCampaignConceptDocument
};
