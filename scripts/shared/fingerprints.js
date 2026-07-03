const crypto = require("node:crypto");

function stableValue(value) {
  if (Array.isArray(value)) {
    return value.map(stableValue);
  }

  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((result, key) => {
        result[key] = stableValue(value[key]);
        return result;
      }, {});
  }

  return value;
}

function stableSerialize(value) {
  return JSON.stringify(stableValue(value));
}

function createFingerprint(value, algorithm = "sha256") {
  const digest = crypto
    .createHash(algorithm)
    .update(stableSerialize(value))
    .digest("hex");

  return `${algorithm}:${digest}`;
}

module.exports = {
  stableValue,
  stableSerialize,
  createFingerprint
};
