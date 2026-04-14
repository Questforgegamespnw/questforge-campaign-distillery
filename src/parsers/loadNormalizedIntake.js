const fs = require("fs");
const path = require("path");
const { validateNormalizedIntake } = require("./validateNormalizedIntake");

/**
 * Loads and validates a normalized intake JSON file from disk.
 * @param {string} relativeFilePath
 * @returns {any}
 * @throws {Error}
 */
function loadNormalizedIntake(relativeFilePath) {
  const filePath = path.isAbsolute(relativeFilePath)
    ? relativeFilePath
    : path.resolve(process.cwd(), relativeFilePath);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Normalized intake file not found: ${filePath}`);
  }

  let parsed;

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error(
      `Failed to read or parse JSON file: ${filePath}\n${error.message}`
    );
  }

  const result = validateNormalizedIntake(parsed);

  if (!result.isValid) {
    const formattedErrors = result.errors.map((err) => `- ${err}`).join("\n");
    throw new Error(
      `Normalized intake validation failed for file: ${filePath}\n${formattedErrors}`
    );
  }

  return result.data;
}

module.exports = {
  loadNormalizedIntake
};