// src/ai/expandPitch.js

const {
  SECTION_RULES,
  PRESERVE_RULES,
  ALLOWED_CHANGES,
  FORBIDDEN_CHANGES,
  VOICE_RULES
} = require("./expansionContract");
const { validateExpansionOutput } = require("./validateExpansionOutput");

function listRules(rules) {
  return rules.map((rule) => `- ${rule}`).join("\n");
}

function sectionInstructions() {
  return Object.entries(SECTION_RULES)
    .map(([field, rule]) => `- ${field}: ${rule.purpose} ${rule.limits}`)
    .join("\n");
}

function buildExpansionPrompt(input = {}) {
  const direction = input.direction || {};
  const source = input.source || {};
  const context = input.context || {};
  const constraints = input.constraints || {};

  const payload = {
    direction,
    source,
    context,
    constraints
  };

  return `
You are a controlled editorial collaborator for QuestForge Campaign Distillery.
Improve deterministic campaign copy without changing its underlying decisions.

PRESERVE:
${listRules(PRESERVE_RULES)}

ALLOWED EDITS:
${listRules(ALLOWED_CHANGES)}

FORBIDDEN:
${listRules(FORBIDDEN_CHANGES)}

VOICE:
${listRules(VOICE_RULES)}

SECTION PURPOSES:
${sectionInstructions()}

DIRECTION REQUIREMENT:
- Current direction: ${direction.key || "unspecified"}
- Intended distinction: ${direction.intent || "preserve the supplied direction"}
- The result must retain this direction's structural and thematic emphasis.

SAFETY AND AUDIENCE REQUIREMENT:
- Treat every value in constraints as binding.
- Do not intensify restricted material.
- For youth-safe or family-friendly input, favor teamwork, curiosity, agency, and manageable stakes.
- If horror is restricted, mystery may remain but dread-heavy framing may not.

OUTPUT CONTRACT:
- Return valid JSON only.
- Return exactly these four keys and no others:
{
  "pitch": "expanded pitch paragraph",
  "about": "expanded about paragraph",
  "playersDo": "expanded player-activity paragraph",
  "hook": "sharpened hook"
}
- Do not wrap the JSON in markdown fences.
- Do not include the title. The deterministic title is preserved separately.
- Every field must be a non-empty string.

SOURCE PAYLOAD:
${JSON.stringify(payload, null, 2)}
`.trim();
}

function emptyOutput() {
  return {
    pitch: "",
    about: "",
    playersDo: "",
    hook: ""
  };
}

function sourceFallback(input = {}) {
  const source = input.source || {};
  return {
    pitch: typeof source.pitch === "string" ? source.pitch.trim() : "",
    about: typeof source.about === "string" ? source.about.trim() : "",
    playersDo: typeof source.playersDo === "string" ? source.playersDo.trim() : "",
    hook: typeof source.hook === "string" ? source.hook.trim() : ""
  };
}

function parseExpansionResponse(rawText, options = {}) {
  if (!rawText || typeof rawText !== "string") {
    return {
      isValid: false,
      output: emptyOutput(),
      errors: ["AI response was empty or not text."],
      rawText: ""
    };
  }

  let parsed;

  try {
    parsed = JSON.parse(rawText);
  } catch (error) {
    return {
      isValid: false,
      output: emptyOutput(),
      errors: [`AI response was not valid JSON: ${error.message}`],
      rawText
    };
  }

  const validation = validateExpansionOutput(parsed, options);

  return {
    isValid: validation.isValid,
    output: validation.value || emptyOutput(),
    errors: validation.errors,
    rawText
  };
}

function evaluateExpansionResponse(input, rawText, options = {}) {
  const fallback = sourceFallback(input);
  const parsed = parseExpansionResponse(rawText, options);

  if (!parsed.isValid) {
    return {
      attempted: true,
      accepted: false,
      fallbackUsed: true,
      output: fallback,
      candidate: parsed.output,
      errors: parsed.errors,
      rawText: parsed.rawText
    };
  }

  return {
    attempted: true,
    accepted: true,
    fallbackUsed: false,
    output: parsed.output,
    errors: [],
    rawText: parsed.rawText
  };
}

/**
 * Provider-agnostic expansion entry point.
 *
 * Pass a function in `generateText` that takes a prompt string and returns raw text.
 * Invalid or unavailable AI output falls back to the deterministic source sections.
 */
async function expandPitchWithAI(input, options = {}) {
  const { generateText } = options;
  const fallback = sourceFallback(input);

  if (typeof generateText !== "function") {
    return {
      attempted: false,
      accepted: false,
      fallbackUsed: true,
      output: fallback,
      errors: ["No generateText(prompt) function was supplied."],
      rawText: ""
    };
  }

  const prompt = buildExpansionPrompt(input);

  try {
    const rawText = await generateText(prompt);
    return evaluateExpansionResponse(input, rawText, options);
  } catch (error) {
    return {
      attempted: true,
      accepted: false,
      fallbackUsed: true,
      output: fallback,
      errors: [`AI expansion failed: ${error.message}`],
      rawText: ""
    };
  }
}

module.exports = {
  buildExpansionPrompt,
  parseExpansionResponse,
  evaluateExpansionResponse,
  expandPitchWithAI,
  sourceFallback
};
