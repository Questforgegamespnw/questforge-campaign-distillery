// src/ai/phase2/evaluateCampaignConceptResponse.js

const { validateCampaignConceptOutput } = require("./validateCampaignConceptOutput");

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
    // Continue with balanced-object extraction for accidental wrapper text.
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
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0 && start >= 0) {
        return JSON.parse(source.slice(start, index + 1));
      }
    }
  }

  throw new Error("Could not locate a valid JSON object in the AI response.");
}

function evaluateCampaignConceptResponse(input, rawText) {
  let parsed;

  try {
    parsed = extractFirstJsonObject(rawText);
  } catch (error) {
    return {
      attempted: true,
      parsed: false,
      accepted: false,
      fallbackUsed: true,
      errors: [error.message],
      warnings: [],
      output: null
    };
  }

  const validation = validateCampaignConceptOutput(parsed, {
    sourceInput: input
  });

  return {
    attempted: true,
    parsed: true,
    accepted: validation.isValid,
    fallbackUsed: !validation.isValid,
    errors: validation.errors,
    warnings: validation.warnings,
    output: validation.isValid ? validation.value : null,
    rejectedCandidate: validation.isValid ? null : parsed
  };
}

async function generateCampaignConceptsWithAI(input, options = {}) {
  const { generateText, buildPrompt } = options;

  if (typeof generateText !== "function") {
    return {
      attempted: false,
      parsed: false,
      accepted: false,
      fallbackUsed: true,
      errors: ["No generateText(prompt) provider was supplied."],
      warnings: [],
      output: null
    };
  }

  const prompt = typeof buildPrompt === "function"
    ? buildPrompt(input)
    : require("./buildCampaignConceptPrompt").buildCampaignConceptPrompt(input);

  try {
    const rawText = await generateText(prompt);
    return evaluateCampaignConceptResponse(input, rawText);
  } catch (error) {
    return {
      attempted: true,
      parsed: false,
      accepted: false,
      fallbackUsed: true,
      errors: [error.message],
      warnings: [],
      output: null
    };
  }
}

module.exports = {
  stripMarkdownFence,
  extractFirstJsonObject,
  evaluateCampaignConceptResponse,
  generateCampaignConceptsWithAI
};
