// scripts/identityPolishRoundTripUtils.js

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const { runCampaignPipelineFromForm } = require("../../src");
const {
  DIRECTIONS,
  exportPitchExpansionPrompts
} = require("../../src/ai/exportPitchExpansionPrompts");

const CONTRACT_VERSION = "0.9.1";

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function isPipelineResult(value) {
  return Boolean(
    value &&
    typeof value === "object" &&
    value.clientPitch &&
    (value.resolved || value.selected)
  );
}

function resolvePipelineOutput(inputValue) {
  return isPipelineResult(inputValue)
    ? inputValue
    : runCampaignPipelineFromForm(inputValue);
}

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

function buildFingerprintPayload(promptExport = {}) {
  const directions = {};

  for (const directionKey of DIRECTIONS) {
    const expansionInput = promptExport[directionKey]?.expansionInput || {};

    directions[directionKey] = {
      direction: expansionInput.direction || {},
      source: expansionInput.source || {},
      context: expansionInput.context || {},
      constraints: expansionInput.constraints || {}
    };
  }

  return {
    contractVersion: CONTRACT_VERSION,
    directions
  };
}

function createSourceFingerprint(promptExport = {}) {
  const payload = stableValue(buildFingerprintPayload(promptExport));
  const serialized = JSON.stringify(payload);
  const digest = crypto.createHash("sha256").update(serialized).digest("hex");
  return `sha256:${digest}`;
}

function emptyDirection() {
  return {
    pitch: "",
    about: "",
    playersDo: "",
    hook: ""
  };
}

function createResponseEnvelope(inputFile, sourceFingerprint) {
  return {
    metadata: {
      contractVersion: CONTRACT_VERSION,
      sourceFile: path.basename(inputFile),
      sourceFingerprint
    },
    responses: {
      primary: emptyDirection(),
      adjacent: emptyDirection(),
      wildcard: emptyDirection()
    }
  };
}

function assertResponseEnvelope(responseEnvelope, expected) {
  const errors = [];

  if (
    !responseEnvelope ||
    typeof responseEnvelope !== "object" ||
    Array.isArray(responseEnvelope)
  ) {
    return ["Response file must contain a JSON object."];
  }

  if (
    !responseEnvelope.metadata ||
    typeof responseEnvelope.metadata !== "object" ||
    Array.isArray(responseEnvelope.metadata)
  ) {
    errors.push("Missing metadata object.");
  }

  if (
    !responseEnvelope.responses ||
    typeof responseEnvelope.responses !== "object" ||
    Array.isArray(responseEnvelope.responses)
  ) {
    errors.push("Missing responses object.");
  }

  const metadata = responseEnvelope.metadata || {};

  if (metadata.contractVersion !== expected.contractVersion) {
    errors.push(
      `Contract version mismatch. Expected ${expected.contractVersion}; received ${metadata.contractVersion || "missing"}.`
    );
  }

  if (metadata.sourceFingerprint !== expected.sourceFingerprint) {
    errors.push(
      `Response source mismatch. Expected ${expected.sourceFingerprint}; received ${metadata.sourceFingerprint || "missing"}.`
    );
  }

  for (const directionKey of DIRECTIONS) {
    if (!(directionKey in (responseEnvelope.responses || {}))) {
      errors.push(`Missing responses.${directionKey}.`);
    }
  }

  return errors;
}

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
    } else if (char === "}") {
      depth -= 1;

      if (depth === 0 && start >= 0) {
        const candidate = source.slice(start, index + 1);
        return JSON.parse(candidate);
      }
    }
  }

  throw new Error("Could not locate a valid JSON object in the ChatGPT response.");
}

function buildCombinedPrompt(promptExport, metadata) {
  const directionsPayload = {};

  for (const directionKey of DIRECTIONS) {
    const input = promptExport[directionKey]?.expansionInput || {};

    directionsPayload[directionKey] = {
      direction: input.direction || {},
      source: input.source || {},
      context: input.context || {},
      constraints: input.constraints || {}
    };
  }

  const expectedEnvelope = {
    metadata,
    responses: {
      primary: emptyDirection(),
      adjacent: emptyDirection(),
      wildcard: emptyDirection()
    }
  };

  return `# QuestForge Phase 1 Identity Pitch Polish — Combined Round Trip

You are a controlled editorial collaborator for QuestForge Campaign Distillery.

Polish all three supplied Phase 1 Identity Pitch directions in one response. Treat Primary, Adjacent, and Wildcard as distinct directions. Improve their prose without changing their underlying decisions.

## Preserve

- Preserve each selected campaign identity and direction label.
- Preserve the meaning and purpose of every source section.
- Preserve audience, safety, inclusion, and exclusion constraints.
- Preserve the distinction between Primary, Adjacent, and Wildcard.
- Keep all deterministic titles unchanged. Titles are not editable output.

## Allowed edits

- Improve clarity, cadence, transitions, and client-facing readability.
- Deepen ideas already present in each source.
- Add restrained sensory or emotional specificity only when directly supported by supplied genre, tone, or environments.
- Vary phrasing while preserving intent and scope.

## Forbidden

- Do not invent mechanics, rules, subsystems, or character options.
- Do not invent named NPCs, factions, locations, villains, artifacts, or historical events.
- Do not add plot outlines, quest chains, twists, or campaign endings.
- Do not change selected frames, genre, tone, environments, or safety boundaries.
- Do not make prose more extreme, hopeless, violent, frightening, or psychologically heavy than the source permits.
- Do not omit or alter the supplied metadata.
- Do not add keys beyond the required response envelope.

## Voice

- Use a grounded, confident, client-facing QuestForge voice.
- Favor clear experience and stakes over lore exposition.
- Avoid purple prose, melodrama, generic epic claims, and promotional filler.
- Use varied sentence rhythm without becoming verbose.
- Do not repeat the same metaphor or idea in slightly different words.
- Do not flatten all three directions into the same cadence or emphasis.

## Section purposes

For every direction:

- \`pitch\`: Clarify the campaign promise in one concise paragraph of 2–4 sentences. Lead with campaign identity, not mechanics.
- \`about\`: Deepen existing meaning, tension, and stakes in one paragraph of 2–4 sentences without introducing lore.
- \`playersDo\`: Make recurring table activity concrete in one paragraph of 2–4 sentences. Use only selected systems and activities.
- \`hook\`: Sharpen curiosity, urgency, or tension in one or two short sentences without named setting facts.

## Direction requirements

- **Primary:** the clearest and most marketable expression of the campaign's core fantasy.
- **Adjacent:** a meaningful shift in gameplay emphasis that preserves the core promise.
- **Wildcard:** a bolder thematic or conceptual reframing that still fits the intake.

## Safety and audience requirements

Treat every supplied constraint as binding.

- Do not intensify restricted material.
- For youth-safe or family-friendly input, favor teamwork, curiosity, agency, and manageable stakes.
- If horror is restricted, mystery may remain but dread-heavy framing may not.

## Output contract

Return valid JSON only.

Return exactly this top-level structure:

\`\`\`json
${JSON.stringify(expectedEnvelope, null, 2)}
\`\`\`

Rules:

- Preserve \`metadata\` exactly as supplied.
- Populate all four response fields for all three directions.
- Every response field must be a non-empty string.
- Do not include titles inside the response objects.
- Do not wrap the final JSON in Markdown fences.
- Do not include commentary before or after the JSON.

## Source payload

\`\`\`json
${JSON.stringify(
    {
      metadata,
      directions: directionsPayload
    },
    null,
    2
  )}
\`\`\`
`;
}

module.exports = {
  CONTRACT_VERSION,
  DIRECTIONS,
  readJson,
  writeJson,
  resolvePipelineOutput,
  buildFingerprintPayload,
  createSourceFingerprint,
  createResponseEnvelope,
  assertResponseEnvelope,
  extractFirstJsonObject,
  buildCombinedPrompt,
  exportPitchExpansionPrompts
};
