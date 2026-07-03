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
  normalizeIdentityPitchDocument
} = require("./normalizeIdentityPitchDocument");
const {
  buildIdentityPitchHtml
} = require("./buildIdentityPitchHtml");

async function exportIdentityPitchDocument(options) {
  const {
    inputFile,
    cssPath,
    outputDirectory,
    outputStem,
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

  const normalized = normalizeIdentityPitchDocument(readJson(inputFile));
  const cssText = readText(cssPath);
  const html = buildIdentityPitchHtml(
    normalized,
    {
      clientName,
      reference,
      preparedDate
    },
    cssText
  );

  const htmlPath = path.join(
    outputDirectory,
    `${outputStem}_identity-pitches-preview.html`
  );
  const pdfPath = path.join(
    outputDirectory,
    `${outputStem}_identity-pitches.pdf`
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
  exportIdentityPitchDocument
};
