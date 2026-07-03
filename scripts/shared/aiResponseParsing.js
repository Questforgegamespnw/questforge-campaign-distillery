function stripMarkdownFence(text) {
  const trimmed = String(text || "").trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fenced ? fenced[1].trim() : trimmed;
}

function extractFirstJsonObject(text) {
  const source = stripMarkdownFence(text);

  try {
    return JSON.parse(source);
  } catch {
    // Continue into balanced-object extraction.
  }

  let depth = 0;
  let start = -1;
  let inString = false;
  let escaped = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === "{") {
      if (depth === 0) start = index;
      depth += 1;
      continue;
    }

    if (char === "}") {
      depth -= 1;

      if (depth === 0 && start >= 0) {
        const candidate = source.slice(start, index + 1);

        try {
          return JSON.parse(candidate);
        } catch (error) {
          throw new Error(
            `Located a JSON-like object but could not parse it: ${error.message}`
          );
        }
      }
    }
  }

  throw new Error("Could not locate a valid JSON object in the AI response.");
}

function normalizeResponseValue(value) {
  return typeof value === "string" ? value : JSON.stringify(value);
}

module.exports = {
  stripMarkdownFence,
  extractFirstJsonObject,
  normalizeResponseValue
};
