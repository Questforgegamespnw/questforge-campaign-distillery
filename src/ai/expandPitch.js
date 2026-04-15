// src/ai/expandPitch.js

function buildExpansionPrompt(input) {
  const {
    directionLabel = "",
    coreNames = [],
    systemNames = [],
    genreName = "",
    toneName = "",
    environmentNames = [],
    includeNotes = "",
    excludeNotes = "",
    basePitch = ""
  } = input || {};

  return `
You are helping turn a structured tabletop campaign concept into polished, client-facing copy for a professional game master service.

Your job:
- Expand the material into evocative, readable prose
- Preserve the selected campaign identity
- Make it feel human and sellable
- Do not add major setting assumptions that conflict with the source
- Do not invent mechanics, factions, or plot specifics unless strongly implied
- Do not become melodramatic or purple-prose heavy
- Keep the result grounded, clear, and immersive
- Show the experience through implication rather than explaining it directly
- Avoid repetitive phrasing patterns (e.g., “new X, new Y, new Z”)
- Avoid repeating the same metaphor or concept using different wording (e.g., “cycle” and “pattern”)
- Avoid phrases like “this campaign is about” or “the experience is” unless absolutely necessary
- Avoid repeating similar concepts (e.g., “buried,” “hidden,” “silent”) across hook and body

Output requirements:
- Return valid JSON only
- Use this exact shape:
{
  "hook": "one short, punchy opening line grounded in the campaign’s core tension (avoid generic epic phrasing)",
  "brief": "one concise paragraph, 3-5 sentences",
  "expandedPitch": "one richer client-facing paragraph, 5-8 sentences"
}

Campaign direction:
${directionLabel}

Selected ingredients:
- Core: ${coreNames.join(" | ") || "None"}
- Systems: ${systemNames.join(" | ") || "None"}
- Genre: ${genreName || "None"}
- Tone: ${toneName || "None"}
- Environment: ${environmentNames.join(" | ") || "None"}

Must include / emphasize:
${includeNotes || "None"}

Avoid / de-emphasize:
${excludeNotes || "None"}

Base pitch backbone:
${basePitch || "None"}

Write in a polished QuestForge-style voice:
- immersive and grounded
- confident but not exaggerated
- client-facing and easy to understand
- focused on experience and stakes over lore
- clear and direct, not flowery or poetic
`.trim();
}

function parseExpansionResponse(rawText) {
  if (!rawText || typeof rawText !== "string") {
    return {
      hook: "",
      brief: "",
      expandedPitch: ""
    };
  }

  try {
    const parsed = JSON.parse(rawText);

    return {
      hook: typeof parsed.hook === "string" ? parsed.hook.trim() : "",
      brief: typeof parsed.brief === "string" ? parsed.brief.trim() : "",
      expandedPitch:
        typeof parsed.expandedPitch === "string"
          ? parsed.expandedPitch.trim()
          : ""
    };
  } catch (error) {
    return {
      hook: "",
      brief: "",
      expandedPitch: rawText.trim()
    };
  }
}

/**
 * Provider-agnostic expansion entry point.
 *
 * Pass a function in `generateText` that takes a prompt string and returns raw text.
 */
async function expandPitchWithAI(input, options = {}) {
  const { generateText } = options;

  if (typeof generateText !== "function") {
    throw new Error("expandPitchWithAI requires a generateText(prompt) function.");
  }

  const prompt = buildExpansionPrompt(input);
  const rawText = await generateText(prompt);

  return parseExpansionResponse(rawText);
}

module.exports = {
  buildExpansionPrompt,
  parseExpansionResponse,
  expandPitchWithAI
};