// src/ai/phase2/buildCampaignConceptPrompt.js

const { validateCampaignConceptInput } = require("./validateCampaignConceptInput");

function expectedConceptCount(generationMode) {
  return generationMode === "single" ? 1 : 3;
}

function buildOutputSkeleton(input) {
  const variantTypes = input.generationMode === "single"
    ? ["core_interpretation"]
    : [
        "core_interpretation",
        "alternate_situation",
        "distinctive_interpretation"
      ];

  return {
    schemaVersion: input.schemaVersion,
    submissionId: input.submissionId,
    selectedIdentityDirection: input.selectedIdentityDirection,
    generationMode: input.generationMode,
    identitySummary: input.identitySummary,
    genreContext: input.genreContext,
    systemContext: input.systemContext,
    settingContext: input.settingContext,
    concepts: variantTypes.map((variantType) => ({
      variantType,
      conceptTitle: "",
      oneSentencePremise: "",
      campaignPitch: "",
      startingSituation: "",
      centralConflict: "",
      playersDo: "",
      recurringCampaignEngine: "",
      whyNow: "",
      factionsOrForces: [
        {
          name: "",
          role: "",
          wants: "",
          pressureOnPlayers: ""
        },
        {
          name: "",
          role: "",
          wants: "",
          pressureOnPlayers: ""
        }
      ],
      escalation: "",
      distinctiveElement: "",
      meaningfulChoices: [
        {
          choice: "",
          whatItChanges: ""
        },
        {
          choice: "",
          whatItChanges: ""
        }
      ],
      hook: "",
      systemImplementationNotes: "",
      settingImplementationNotes: ""
    })),
    validationSummary: {
      schemaValid: true,
      identityAligned: true,
      inventionBoundariesRespected: true,
      playablePremisePresent: true,
      warnings: []
    }
  };
}

function buildCampaignConceptPrompt(input) {
  const validation = validateCampaignConceptInput(input);

  if (!validation.isValid) {
    throw new Error(
      `Cannot build Phase 2 prompt from invalid input:\n- ${validation.errors.join("\n- ")}`
    );
  }

  const count = expectedConceptCount(input.generationMode);
  const skeleton = buildOutputSkeleton(input);

  return `You are developing Phase 2 Campaign Concept Pitches for QuestForge Games PNW.

Phase 1 has already determined the approved campaign identity. Do not reinterpret, replace, or broaden that identity. Your task is to turn it into ${count === 1 ? "one concrete, playable campaign premise" : "three concrete, playable campaign premises"} through bounded invention.

CORE PRINCIPLE:
Phase 1 discovered what the campaign wants to be. Phase 2 decides what is actually happening and what the players can change.

PRESERVE:
- The selected identity's thematic promise and emotional center.
- The approved style of play and recurring activity.
- Tone, genre, and environment signals.
- Decomposed genre context, including era, aesthetic, and world-condition guidance.
- Client-liked elements and requested changes.
- Audience, safety, inclusion, and exclusion constraints.
- Confirmed system or setting decisions.

YOU MAY INVENT:
- Factions, institutions, communities, locations, and threats.
- A starting crisis and immediate trigger.
- Contested resources, political or social pressures, and public misunderstandings.
- Recurring mission structures, escalation paths, and meaningful player choices.
- Concise names and details needed to communicate a playable premise.

YOU MUST NOT INVENT:
- A complete campaign plot or predetermined ending.
- A required adventure sequence, fixed solution, or mandatory twist.
- Mandatory character backstories or relationships.
- Decisions already assigned to the players.
- Excessive historical lore or a large named NPC cast.
- Detailed rules subsystems unless the supplied context explicitly requires them.
- A different genre, tone, identity, or play emphasis.
- Any excluded or restricted content.

AGENCY REQUIREMENT:
Each concept must leave room for players to choose alliances, reject expected solutions, change which forces gain power, and alter the campaign's long-term direction. Describe consequences without deciding the players' choices.

PLAYABILITY REQUIREMENT:
Every concept must include:
- A concrete starting situation.
- A central conflict active at campaign start.
- A clear reason the crisis is happening now.
- Recurring player activities that can sustain multiple sessions.
- A repeatable campaign engine rather than a one-shot plot.
- At least two active factions or forces with incompatible pressures.
- Visible escalation.
- At least two meaningful choices that change the campaign.

VARIANT REQUIREMENTS:
${input.generationMode === "single"
    ? `- Produce exactly one concept with variantType "core_interpretation".
- Use the most direct and legible implementation of the identity.`
    : `- Produce exactly three concepts in this order:
  1. "core_interpretation": the most direct and legible implementation.
  2. "alternate_situation": change at least three of the starting crisis, faction arrangement, player starting position, recurring engine, contested resource, or setting condition.
  3. "distinctive_interpretation": add one bold but compatible and understandable campaign feature.
- The variants must differ in concrete situation without becoming different campaign identities.`}

GENRE CONTEXT REQUIREMENT:
Use genreContext as implementation guidance for concrete Phase 2 premises. It may shape the era texture, aesthetic presentation, and setting pressures, but it must not replace or broaden the approved identitySummary. If genreContext is sparse, do not invent a rigid setting package just to fill it.

SPECIFICITY LIMIT:
Invent enough detail to make each premise concrete and playable, but do not pre-write the campaign. Prefer two to four active forces, one immediate crisis, a clear recurring structure, and concise setting detail.

OUTPUT CONTRACT:
- Return valid JSON only.
- Return exactly the required object structure and no additional properties.
- Preserve schemaVersion, submissionId, selectedIdentityDirection, generationMode, identitySummary, systemContext, and settingContext exactly as supplied.
- Every required prose field must be a non-empty string.
- conceptTitle must be 120 characters or fewer.
- oneSentencePremise must be 320 characters or fewer.
- hook must be 280 characters or fewer.
- factionsOrForces must contain 2-6 entries.
- meaningfulChoices must contain 2-5 entries.
- Do not include Markdown, code fences, commentary, or explanations outside the JSON.

REQUIRED OUTPUT SHAPE:
${JSON.stringify(skeleton, null, 2)}

CANONICAL PHASE 2 INPUT:
${JSON.stringify(input, null, 2)}

Before returning the JSON, verify that all concepts preserve the approved identity, remain player-driven, and can support an ongoing campaign.`;
}

module.exports = {
  buildCampaignConceptPrompt,
  buildOutputSkeleton,
  expectedConceptCount
};
