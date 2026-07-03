const fs = require("node:fs");
const path = require("node:path");

function ensureDirectory(directoryPath) {
  fs.mkdirSync(directoryPath, { recursive: true });
  return directoryPath;
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function readText(filePath, encoding = "utf8") {
  return fs.readFileSync(filePath, encoding);
}

function writeText(filePath, value, encoding = "utf8") {
  ensureDirectory(path.dirname(filePath));
  fs.writeFileSync(filePath, String(value), encoding);
  return filePath;
}

function readJson(filePath) {
  const raw = readText(filePath, "utf8");

  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`Could not parse JSON file ${filePath}: ${error.message}`);
  }
}

function writeJson(filePath, value) {
  return writeText(
    filePath,
    `${JSON.stringify(value, null, 2)}\n`,
    "utf8"
  );
}

module.exports = {
  ensureDirectory,
  fileExists,
  readText,
  writeText,
  readJson,
  writeJson
};
