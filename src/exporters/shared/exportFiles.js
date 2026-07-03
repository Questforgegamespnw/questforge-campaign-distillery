const fs = require("node:fs");
const path = require("node:path");

function ensureDirectory(directoryPath) {
  fs.mkdirSync(directoryPath, { recursive: true });
  return directoryPath;
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(`Could not read JSON file ${filePath}: ${error.message}`);
  }
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function writeText(filePath, value) {
  ensureDirectory(path.dirname(filePath));
  fs.writeFileSync(filePath, String(value), "utf8");
  return filePath;
}

module.exports = {
  ensureDirectory,
  readJson,
  readText,
  writeText
};
