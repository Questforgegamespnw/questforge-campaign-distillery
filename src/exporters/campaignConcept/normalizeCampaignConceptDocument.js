function requireText(value, label) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${label} must be a non-empty string.`);
  }

  return value.trim();
}

function cleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanStringArray(value) {
  if (!Array.isArray(value)) return [];

  return [...new Set(
    value
      .map(cleanString)
      .filter(Boolean)
  )];
}

function normalizeGenreContext(value = {}) {
  const source = value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};

  return {
    legacyGenre: cleanStringArray(source.legacyGenre),
    eras: cleanStringArray(source.eras),
    aesthetics: cleanStringArray(source.aesthetics),
    worldConditions: cleanStringArray(source.worldConditions)
  };
}

function normalizeCampaignConceptDocument(raw = {}) {
  const payload =
    raw.campaignConcepts ||
    raw.validatedCampaignConcepts ||
    raw;
  const concepts = payload.concepts;

  if (!Array.isArray(concepts) || concepts.length < 1) {
    throw new Error(
      "Expected a concepts array in the validated Phase 2 JSON."
    );
  }

  const normalizedConcepts = concepts.map((concept, index) => {
    const base = `concepts[${index}]`;
    const factions = Array.isArray(concept.factionsOrForces)
      ? concept.factionsOrForces
      : [];
    const choices = Array.isArray(concept.meaningfulChoices)
      ? concept.meaningfulChoices
      : [];

    if (factions.length < 2) {
      throw new Error(
        `${base}.factionsOrForces must contain at least two entries.`
      );
    }

    if (choices.length < 2) {
      throw new Error(
        `${base}.meaningfulChoices must contain at least two entries.`
      );
    }

    return {
      variantType: requireText(
        concept.variantType,
        `${base}.variantType`
      ),
      conceptTitle: requireText(
        concept.conceptTitle,
        `${base}.conceptTitle`
      ),
      oneSentencePremise: requireText(
        concept.oneSentencePremise,
        `${base}.oneSentencePremise`
      ),
      campaignPitch: requireText(
        concept.campaignPitch,
        `${base}.campaignPitch`
      ),
      startingSituation: requireText(
        concept.startingSituation,
        `${base}.startingSituation`
      ),
      centralConflict: requireText(
        concept.centralConflict,
        `${base}.centralConflict`
      ),
      playersDo: requireText(
        concept.playersDo,
        `${base}.playersDo`
      ),
      recurringCampaignEngine: requireText(
        concept.recurringCampaignEngine,
        `${base}.recurringCampaignEngine`
      ),
      whyNow: requireText(concept.whyNow, `${base}.whyNow`),
      factionsOrForces: factions.map((entry, factionIndex) => ({
        name: requireText(
          entry.name,
          `${base}.factionsOrForces[${factionIndex}].name`
        ),
        role: requireText(
          entry.role,
          `${base}.factionsOrForces[${factionIndex}].role`
        ),
        wants: requireText(
          entry.wants,
          `${base}.factionsOrForces[${factionIndex}].wants`
        ),
        pressureOnPlayers: requireText(
          entry.pressureOnPlayers,
          `${base}.factionsOrForces[${factionIndex}].pressureOnPlayers`
        )
      })),
      escalation: requireText(
        concept.escalation,
        `${base}.escalation`
      ),
      distinctiveElement: requireText(
        concept.distinctiveElement,
        `${base}.distinctiveElement`
      ),
      meaningfulChoices: choices.map((entry, choiceIndex) => ({
        choice: requireText(
          entry.choice,
          `${base}.meaningfulChoices[${choiceIndex}].choice`
        ),
        whatItChanges: requireText(
          entry.whatItChanges,
          `${base}.meaningfulChoices[${choiceIndex}].whatItChanges`
        )
      })),
      hook: requireText(concept.hook, `${base}.hook`),
      systemImplementationNotes:
        typeof concept.systemImplementationNotes === "string"
          ? concept.systemImplementationNotes.trim()
          : "",
      settingImplementationNotes:
        typeof concept.settingImplementationNotes === "string"
          ? concept.settingImplementationNotes.trim()
          : ""
    };
  });

  return {
    schemaVersion: payload.schemaVersion || "",
    submissionId: payload.submissionId || "",
    selectedIdentityDirection:
      payload.selectedIdentityDirection || "",
    generationMode: payload.generationMode || "",
    identitySummary: payload.identitySummary || {},
    genreContext: normalizeGenreContext(payload.genreContext),
    systemContext: payload.systemContext || {},
    settingContext: payload.settingContext || {},
    validationSummary: payload.validationSummary || {},
    concepts: normalizedConcepts
  };
}

module.exports = {
  cleanStringArray,
  normalizeGenreContext,
  normalizeCampaignConceptDocument
};
