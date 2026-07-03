// src/ai/phase2/validateCampaignConceptOutput.js

const {
  SCHEMA_VERSION,
  IDENTITY_DIRECTIONS,
  GENERATION_MODES,
  CONTEXT_STATUSES,
  VARIANT_TYPES,
  CONCEPT_REQUIRED_FIELDS,
  CONCEPT_OPTIONAL_FIELDS,
  FACTION_REQUIRED_FIELDS,
  CHOICE_REQUIRED_FIELDS
} = require("./campaignConceptSchema");

const TOP_LEVEL_FIELDS = Object.freeze([
  "schemaVersion",
  "submissionId",
  "selectedIdentityDirection",
  "generationMode",
  "identitySummary",
  "systemContext",
  "settingContext",
  "concepts",
  "validationSummary"
]);

const IDENTITY_FIELDS = Object.freeze([
  "identityTitle",
  "identityPitch",
  "corePromise",
  "playEmphasis",
  "tone",
  "genre",
  "environment",
  "mustPreserve",
  "mustAvoid"
]);

const VALIDATION_SUMMARY_FIELDS = Object.freeze([
  "schemaValid",
  "identityAligned",
  "inventionBoundariesRespected",
  "playablePremisePresent",
  "warnings"
]);

function isObject(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function pushUnexpectedKeys(value, allowed, path, errors) {
  if (!isObject(value)) return;
  const unexpected = Object.keys(value).filter((key) => !allowed.includes(key));
  if (unexpected.length) {
    errors.push(`${path} contains unexpected keys: ${unexpected.join(", ")}.`);
  }
}

function validateRequiredStrings(value, fields, path, errors) {
  for (const field of fields) {
    if (!isNonEmptyString(value?.[field])) {
      errors.push(`${path}.${field} must be a non-empty string.`);
    }
  }
}

function validateStringArray(value, path, errors, options = {}) {
  const { minItems = 0, maxItems = Infinity } = options;

  if (!Array.isArray(value)) {
    errors.push(`${path} must be an array.`);
    return;
  }

  if (value.length < minItems || value.length > maxItems) {
    errors.push(`${path} must contain ${minItems}-${maxItems} item(s).`);
  }

  value.forEach((entry, index) => {
    if (!isNonEmptyString(entry)) {
      errors.push(`${path}[${index}] must be a non-empty string.`);
    }
  });
}

function validateIdentitySummary(identity, errors) {
  if (!isObject(identity)) {
    errors.push("identitySummary must be an object.");
    return;
  }

  pushUnexpectedKeys(identity, IDENTITY_FIELDS, "identitySummary", errors);
  validateRequiredStrings(
    identity,
    ["identityTitle", "identityPitch", "corePromise"],
    "identitySummary",
    errors
  );
  validateStringArray(identity.playEmphasis, "identitySummary.playEmphasis", errors, { minItems: 1 });
  validateStringArray(identity.tone, "identitySummary.tone", errors, { minItems: 1 });
  validateStringArray(identity.genre, "identitySummary.genre", errors, { minItems: 1 });
  validateStringArray(identity.environment, "identitySummary.environment", errors);
  validateStringArray(identity.mustPreserve, "identitySummary.mustPreserve", errors);
  validateStringArray(identity.mustAvoid, "identitySummary.mustAvoid", errors);
}

function validateSystemContext(context, errors) {
  const path = "systemContext";
  if (!isObject(context)) {
    errors.push(`${path} must be an object.`);
    return;
  }

  pushUnexpectedKeys(context, ["status", "preferredSystem", "systemsToAvoid"], path, errors);
  if (!CONTEXT_STATUSES.includes(context.status)) {
    errors.push(`${path}.status is invalid.`);
  }
  if (typeof context.preferredSystem !== "string") {
    errors.push(`${path}.preferredSystem must be a string.`);
  }
  validateStringArray(context.systemsToAvoid, `${path}.systemsToAvoid`, errors);
}

function validateSettingContext(context, errors) {
  const path = "settingContext";
  if (!isObject(context)) {
    errors.push(`${path} must be an object.`);
    return;
  }

  pushUnexpectedKeys(context, ["status", "preferredSetting", "settingConstraints"], path, errors);
  if (!CONTEXT_STATUSES.includes(context.status)) {
    errors.push(`${path}.status is invalid.`);
  }
  if (typeof context.preferredSetting !== "string") {
    errors.push(`${path}.preferredSetting must be a string.`);
  }
  validateStringArray(context.settingConstraints, `${path}.settingConstraints`, errors);
}

function validateFaction(faction, path, errors) {
  if (!isObject(faction)) {
    errors.push(`${path} must be an object.`);
    return;
  }
  pushUnexpectedKeys(faction, FACTION_REQUIRED_FIELDS, path, errors);
  validateRequiredStrings(faction, FACTION_REQUIRED_FIELDS, path, errors);
}

function validateChoice(choice, path, errors) {
  if (!isObject(choice)) {
    errors.push(`${path} must be an object.`);
    return;
  }
  pushUnexpectedKeys(choice, CHOICE_REQUIRED_FIELDS, path, errors);
  validateRequiredStrings(choice, CHOICE_REQUIRED_FIELDS, path, errors);
}

function validateConcept(concept, index, errors) {
  const path = `concepts[${index}]`;
  if (!isObject(concept)) {
    errors.push(`${path} must be an object.`);
    return;
  }

  pushUnexpectedKeys(
    concept,
    [...CONCEPT_REQUIRED_FIELDS, ...CONCEPT_OPTIONAL_FIELDS],
    path,
    errors
  );

  if (!VARIANT_TYPES.includes(concept.variantType)) {
    errors.push(`${path}.variantType is invalid.`);
  }

  const proseFields = CONCEPT_REQUIRED_FIELDS.filter(
    (field) => !["variantType", "factionsOrForces", "meaningfulChoices"].includes(field)
  );
  validateRequiredStrings(concept, proseFields, path, errors);

  if (isNonEmptyString(concept.conceptTitle) && concept.conceptTitle.length > 120) {
    errors.push(`${path}.conceptTitle must be 120 characters or fewer.`);
  }
  if (
    isNonEmptyString(concept.oneSentencePremise) &&
    concept.oneSentencePremise.length > 320
  ) {
    errors.push(`${path}.oneSentencePremise must be 320 characters or fewer.`);
  }
  if (isNonEmptyString(concept.hook) && concept.hook.length > 280) {
    errors.push(`${path}.hook must be 280 characters or fewer.`);
  }

  if (!Array.isArray(concept.factionsOrForces)) {
    errors.push(`${path}.factionsOrForces must be an array.`);
  } else {
    if (concept.factionsOrForces.length < 2 || concept.factionsOrForces.length > 6) {
      errors.push(`${path}.factionsOrForces must contain 2-6 entries.`);
    }
    concept.factionsOrForces.forEach((entry, factionIndex) => {
      validateFaction(entry, `${path}.factionsOrForces[${factionIndex}]`, errors);
    });
  }

  if (!Array.isArray(concept.meaningfulChoices)) {
    errors.push(`${path}.meaningfulChoices must be an array.`);
  } else {
    if (concept.meaningfulChoices.length < 2 || concept.meaningfulChoices.length > 5) {
      errors.push(`${path}.meaningfulChoices must contain 2-5 entries.`);
    }
    concept.meaningfulChoices.forEach((entry, choiceIndex) => {
      validateChoice(entry, `${path}.meaningfulChoices[${choiceIndex}]`, errors);
    });
  }

  for (const optional of CONCEPT_OPTIONAL_FIELDS) {
    if (optional in concept && typeof concept[optional] !== "string") {
      errors.push(`${path}.${optional} must be a string when supplied.`);
    }
  }
}

function validateValidationSummary(summary, errors) {
  if (!isObject(summary)) {
    errors.push("validationSummary must be an object.");
    return;
  }

  pushUnexpectedKeys(
    summary,
    VALIDATION_SUMMARY_FIELDS,
    "validationSummary",
    errors
  );

  for (const field of [
    "schemaValid",
    "identityAligned",
    "inventionBoundariesRespected",
    "playablePremisePresent"
  ]) {
    if (typeof summary[field] !== "boolean") {
      errors.push(`validationSummary.${field} must be a boolean.`);
    }
  }
  validateStringArray(summary.warnings, "validationSummary.warnings", errors);
}

function validateVariantSet(output, errors) {
  if (!Array.isArray(output.concepts)) return;

  const types = output.concepts.map((concept) => concept?.variantType);

  if (output.generationMode === "single") {
    if (output.concepts.length !== 1) {
      errors.push("generationMode single requires exactly 1 concept.");
    }
    if (types[0] !== "core_interpretation") {
      errors.push("Single mode concept must use core_interpretation.");
    }
  }

  if (output.generationMode === "three_variants") {
    const expected = [
      "core_interpretation",
      "alternate_situation",
      "distinctive_interpretation"
    ];
    if (output.concepts.length !== 3) {
      errors.push("generationMode three_variants requires exactly 3 concepts.");
    }
    expected.forEach((type, index) => {
      if (types[index] !== type) {
        errors.push(`concepts[${index}].variantType must be ${type}.`);
      }
    });
  }
}

function compareCanonicalFields(output, sourceInput, errors) {
  if (!sourceInput) return;

  const exactFields = [
    "schemaVersion",
    "submissionId",
    "selectedIdentityDirection",
    "generationMode",
    "identitySummary",
    "systemContext",
    "settingContext"
  ];

  for (const field of exactFields) {
    if (JSON.stringify(output[field]) !== JSON.stringify(sourceInput[field])) {
      errors.push(`${field} does not exactly match the canonical Phase 2 input.`);
    }
  }
}

function semanticWarnings(output) {
  const warnings = [];
  const railroadTerms = [
    /must eventually/i,
    /destined to/i,
    /the only solution/i,
    /final boss/i,
    /predetermined/i,
    /fixed ending/i
  ];

  for (const [index, concept] of (output.concepts || []).entries()) {
    const combined = [
      concept.campaignPitch,
      concept.startingSituation,
      concept.centralConflict,
      concept.recurringCampaignEngine,
      concept.escalation,
      concept.distinctiveElement
    ].filter(Boolean).join(" ");

    if (railroadTerms.some((pattern) => pattern.test(combined))) {
      warnings.push(
        `concepts[${index}] may contain predetermined or railroaded language.`
      );
    }

    if ((concept.factionsOrForces || []).length > 4) {
      warnings.push(
        `concepts[${index}] uses more than four factions or forces; review for unnecessary complexity.`
      );
    }
  }

  return warnings;
}

function validateCampaignConceptOutput(output, options = {}) {
  const errors = [];

  if (!isObject(output)) {
    return {
      isValid: false,
      errors: ["Campaign Concept output must be a JSON object."],
      warnings: [],
      value: null
    };
  }

  pushUnexpectedKeys(output, TOP_LEVEL_FIELDS, "output", errors);

  if (output.schemaVersion !== SCHEMA_VERSION) {
    errors.push(`schemaVersion must be ${SCHEMA_VERSION}.`);
  }
  if (!isNonEmptyString(output.submissionId)) {
    errors.push("submissionId must be a non-empty string.");
  }
  if (!IDENTITY_DIRECTIONS.includes(output.selectedIdentityDirection)) {
    errors.push("selectedIdentityDirection is invalid.");
  }
  if (!GENERATION_MODES.includes(output.generationMode)) {
    errors.push("generationMode is invalid.");
  }

  validateIdentitySummary(output.identitySummary, errors);
  validateSystemContext(output.systemContext, errors);
  validateSettingContext(output.settingContext, errors);

  if (!Array.isArray(output.concepts)) {
    errors.push("concepts must be an array.");
  } else {
    output.concepts.forEach((concept, index) => {
      validateConcept(concept, index, errors);
    });
  }

  validateVariantSet(output, errors);
  validateValidationSummary(output.validationSummary, errors);
  compareCanonicalFields(output, options.sourceInput, errors);

  const warnings = semanticWarnings(output);

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    value: errors.length === 0 ? output : null
  };
}

module.exports = {
  validateCampaignConceptOutput,
  semanticWarnings,
  isObject,
  isNonEmptyString
};
