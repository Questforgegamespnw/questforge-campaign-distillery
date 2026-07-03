const fs = require("node:fs");
const path = require("node:path");
const { PROJECT_ROOT } = require("../shared/projectPaths");

function findExistingPath(candidates = []) {
  for (const candidate of candidates) {
    const resolved = path.isAbsolute(candidate)
      ? candidate
      : path.join(PROJECT_ROOT, candidate);

    if (fs.existsSync(resolved)) {
      return resolved;
    }
  }

  return "";
}

function requireFixture(candidates, description) {
  const found = findExistingPath(candidates);

  if (!found) {
    throw new Error(
      `Could not locate ${description}. Checked:\n- ${candidates.join("\n- ")}`
    );
  }

  return found;
}

function collectJsonFiles(rootDirectory) {
  if (!fs.existsSync(rootDirectory)) {
    return [];
  }

  const results = [];
  const stack = [rootDirectory];

  while (stack.length > 0) {
    const current = stack.pop();

    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);

      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".json")) {
        results.push(fullPath);
      }
    }
  }

  return results.sort();
}

module.exports = {
  findExistingPath,
  requireFixture,
  collectJsonFiles
};
