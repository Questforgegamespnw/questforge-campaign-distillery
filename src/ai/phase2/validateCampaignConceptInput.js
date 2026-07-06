// src/ai/phase2/validateCampaignConceptInput.js

const {
  CONTRACT_VERSION,
  IDENTITY_DIRECTIONS,
  GENERATION_MODES,
  CONTEXT_STATUSES,
  GENRE_CONTEXT_FIELDS
} = require("./campaignConceptSchema");

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateStringArray(value, path, errors, options = {}) {
  const { minItems = 0 } = options;

  if (!Array.isArray(value)) {
    errors.push(`${path} must be an array.`);
    return;
  }

  if (value.length < minItems) {
    errors.push(`${path} must contain at least ${minItems} item(s).`);
  }

  value.forEach((entry, index) => {
    if (!isNonEmptyString(entry)) {
      errors.push(`${path}[${index}] must be a non-empty string.`);
    }
  });
}


function validateGenreContext(value, path, errors) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    errors.push(`${path} must be an object.`);
    return;
  }

  const unexpected = Object.keys(value).filter((key) => !GENRE_CONTEXT_FIELDS.includes(key));
  if (unexpected.length) {
    errors.push(`${path} contains unexpected keys: ${unexpected.join(", ")}.`);
  }

  for (const field of GENRE_CONTEXT_FIELDS) {
    validateStringArray(value[field], `${path}.${field}`, errors);
  }
}

function validateCampaignConceptInput(input) {
  const errors = [];
  const warnings = [];

  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return {
      isValid: false,
      errors: ["Phase 2 input must be an object."],
      warnings
    };
  }

  if (input.contractVersion !== CONTRACT_VERSION) {
    errors.push(
      `contractVersion must be ${CONTRACT_VERSION}; received ${input.contractVersion || "missing"}.`
    );
  }

  if (!isNonEmptyString(input.submissionId)) {
    errors.push("submissionId must be a non-empty string.");
  }

  if (!IDENTITY_DIRECTIONS.includes(input.selectedIdentityDirection)) {
    errors.push(
      `selectedIdentityDirection must be one of: ${IDENTITY_DIRECTIONS.join(", ")}.`
    );
  }

  if (!GENERATION_MODES.includes(input.generationMode)) {
    errors.push(
      `generationMode must be one of: ${GENERATION_MODES.join(", ")}.`
    );
  }

  const identity = input.identitySummary;
  if (!identity || typeof identity !== "object" || Array.isArray(identity)) {
    errors.push("identitySummary must be an object.");
  } else {
    for (const field of ["identityTitle", "identityPitch", "corePromise"]) {
      if (!isNonEmptyString(identity[field])) {
        errors.push(`identitySummary.${field} must be a non-empty string.`);
      }
    }

    validateStringArray(identity.playEmphasis, "identitySummary.playEmphasis", errors, {
      minItems: 1
    });
    validateStringArray(identity.tone, "identitySummary.tone", errors, {
      minItems: 1
    });
    validateStringArray(identity.genre, "identitySummary.genre", errors, {
      minItems: 1
    });
    validateStringArray(identity.environment, "identitySummary.environment", errors);
    validateStringArray(identity.mustPreserve, "identitySummary.mustPreserve", errors);
    validateStringArray(identity.mustAvoid, "identitySummary.mustAvoid", errors);
  }

  validateGenreContext(input.genreContext, "genreContext", errors);

  for (const [path, context] of [
    ["systemContext", input.systemContext],
    ["settingContext", input.settingContext]
  ]) {
    if (!context || typeof context !== "object" || Array.isArray(context)) {
      errors.push(`${path} must be an object.`);
      continue;
    }

    if (!CONTEXT_STATUSES.includes(context.status)) {
      errors.push(
        `${path}.status must be one of: ${CONTEXT_STATUSES.join(", ")}.`
      );
    }
  }

  if (input.systemContext) {
    if (typeof input.systemContext.preferredSystem !== "string") {
      errors.push("systemContext.preferredSystem must be a string.");
    }
    validateStringArray(
      input.systemContext.systemsToAvoid,
      "systemContext.systemsToAvoid",
      errors
    );
  }

  if (input.settingContext) {
    if (typeof input.settingContext.preferredSetting !== "string") {
      errors.push("settingContext.preferredSetting must be a string.");
    }
    validateStringArray(
      input.settingContext.settingConstraints,
      "settingContext.settingConstraints",
      errors
    );
  }

  if (
    input.systemContext?.status === "confirmed" &&
    !isNonEmptyString(input.systemContext.preferredSystem)
  ) {
    errors.push(
      "systemContext.preferredSystem is required when systemContext.status is confirmed."
    );
  }

  if (
    input.settingContext?.status === "confirmed" &&
    !isNonEmptyString(input.settingContext.preferredSetting)
  ) {
    errors.push(
      "settingContext.preferredSetting is required when settingContext.status is confirmed."
    );
  }

  if ((identity?.mustPreserve || []).length === 0) {
    warnings.push(
      "No explicit must-preserve elements were supplied beyond the identity summary."
    );
  }

  if (
    input.systemContext?.status === "undecided" ||
    input.settingContext?.status === "undecided"
  ) {
    warnings.push(
      "System or setting context remains undecided; concepts should avoid unnecessary implementation commitments."
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    value: errors.length === 0 ? input : null
  };
}

module.exports = {
  validateCampaignConceptInput,
  isNonEmptyString,
  validateStringArray,
  validateGenreContext
};
