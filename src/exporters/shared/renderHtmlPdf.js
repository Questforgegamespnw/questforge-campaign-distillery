const path = require("node:path");
const { pathToFileURL } = require("node:url");

async function loadPuppeteer() {
  try {
    return require("puppeteer");
  } catch {
    throw new Error(
      "Puppeteer is not installed. Run `npm.cmd install puppeteer` in the project. The HTML preview may still have been created."
    );
  }
}

async function renderHtmlFileToPdf({
  htmlPath,
  pdfPath,
  format = "Letter",
  launchOptions = {},
  pdfOptions = {}
}) {
  const puppeteer = await loadPuppeteer();
  const browser = await puppeteer.launch({
    headless: true,
    ...launchOptions
  });

  try {
    const page = await browser.newPage();

    await page.goto(pathToFileURL(path.resolve(htmlPath)).href, {
      waitUntil: "networkidle0"
    });

    await page.emulateMediaType("print");

    await page.pdf({
      path: pdfPath,
      format,
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "0in",
        right: "0in",
        bottom: "0in",
        left: "0in"
      },
      ...pdfOptions
    });
  } finally {
    await browser.close();
  }

  return pdfPath;
}

module.exports = {
  loadPuppeteer,
  renderHtmlFileToPdf
};
