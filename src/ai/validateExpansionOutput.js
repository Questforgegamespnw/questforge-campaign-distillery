// src/ai/validateExpansionOutput.js

const { OUTPUT_FIELDS } = require("./expansionContract");

const DEFAULT_LIMITS = Object.freeze({
  pitch: 1600,
  about: 1600,
  playersDo: 1600,
  hook: 500
});

function validateExpansionOutput(candidate, options = {}) {
  const errors = [];
  const limits = { ...DEFAULT_LIMITS, ...(options.maxLengths || {}) };

  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
    return {
      isValid: false,
      errors: ["Expansion output must be a JSON object."],
      value: null
    };
  }

  const keys = Object.keys(candidate);
  const unexpected = keys.filter((key) => !OUTPUT_FIELDS.includes(key));
  const missing = OUTPUT_FIELDS.filter((key) => !keys.includes(key));

  if (unexpected.length) {
    errors.push(`Unexpected output keys: ${unexpected.join(", ")}.`);
  }

  if (missing.length) {
    errors.push(`Missing required output keys: ${missing.join(", ")}.`);
  }

  const value = {};

  for (const field of OUTPUT_FIELDS) {
    const raw = candidate[field];

    if (typeof raw !== "string") {
      errors.push(`${field} must be a string.`);
      value[field] = "";
      continue;
    }

    const text = raw.trim();
    value[field] = text;

    if (!text) {
      errors.push(`${field} must not be empty.`);
    }

    if (text.length > limits[field]) {
      errors.push(`${field} exceeds the ${limits[field]} character limit.`);
    }

    if (/```|^\s*(?:json|javascript)\s*$/im.test(text)) {
      errors.push(`${field} contains markdown or code-fence formatting.`);
    }

    if (/\b(?:here(?:'s| is)|as an ai|i have)\b/i.test(text)) {
      errors.push(`${field} contains assistant-facing commentary.`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    value
  };
}

module.exports = {
  DEFAULT_LIMITS,
  validateExpansionOutput
};
