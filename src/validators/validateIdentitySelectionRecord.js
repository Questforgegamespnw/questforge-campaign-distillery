const ALLOWED_DIRECTIONS = Object.freeze(["primary", "adjacent", "wildcard"]);
const REQUIRED_PITCH_FIELDS = Object.freeze(["title", "pitch", "about", "playersDo", "hook"]);

function cleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function isPlainObject(value) {
  return Boolean(
    value &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

function isStringArray(value) {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}

function requireStringField(source, fieldPath, errors, missingFields) {
  const segments = fieldPath.split(".");
  let cursor = source;

  for (const segment of segments) {
    cursor = cursor?.[segment];
  }

  if (!cleanString(cursor)) {
    errors.push(`Missing required field: ${fieldPath}`);
    missingFields.push(fieldPath);
  }
}

function validateStringArrayField(source, fieldPath, errors) {
  const segments = fieldPath.split(".");
  let cursor = source;

  for (const segment of segments) {
    cursor = cursor?.[segment];
  }

  if (!isStringArray(cursor)) {
    errors.push(`Expected ${fieldPath} to be an array of strings.`);
  }
}

function validateIdentitySelectionRecord(record = {}) {
  const errors = [];
  const warnings = [];
  const missingFields = [];

  if (!isPlainObject(record)) {
    return {
      isValid: false,
      errors: ["Identity Selection Record must be a JSON object."],
      warnings,
      missingFields: ["record"]
    };
  }

  if (record.recordType !== "identity_selection_record") {
    errors.push("recordType must be identity_selection_record.");
  }

  requireStringField(record, "schemaVersion", errors, missingFields);
  requireStringField(record, "submissionId", errors, missingFields);
  requireStringField(record, "selectedIdentityDirection", errors, missingFields);

  if (
    cleanString(record.selectedIdentityDirection) &&
    !ALLOWED_DIRECTIONS.includes(record.selectedIdentityDirection)
  ) {
    errors.push(
      `selectedIdentityDirection must be one of: ${ALLOWED_DIRECTIONS.join(", ")}.`
    );
  }

  if (!isPlainObject(record.selectedIdentityPitch)) {
    errors.push("selectedIdentityPitch must be an object.");
    missingFields.push("selectedIdentityPitch");
  } else {
    for (const field of REQUIRED_PITCH_FIELDS) {
      requireStringField(
        record,
        `selectedIdentityPitch.${field}`,
        errors,
        missingFields
      );
    }
  }

  if (!isPlainObject(record.identitySummary)) {
    errors.push("identitySummary must be an object.");
    missingFields.push("identitySummary");
  } else {
    requireStringField(record, "identitySummary.identityTitle", errors, missingFields);
    requireStringField(record, "identitySummary.identityPitch", errors, missingFields);
    requireStringField(record, "identitySummary.corePromise", errors, missingFields);
    validateStringArrayField(record, "identitySummary.playEmphasis", errors);
    validateStringArrayField(record, "identitySummary.tone", errors);
    validateStringArrayField(record, "identitySummary.genre", errors);
    validateStringArrayField(record, "identitySummary.environment", errors);
    validateStringArrayField(record, "identitySummary.mustPreserve", errors);
    validateStringArrayField(record, "identitySummary.mustAvoid", errors);
  }

  if (!isPlainObject(record.selectionRecord)) {
    errors.push("selectionRecord must be an object.");
    missingFields.push("selectionRecord");
  } else {
    requireStringField(record, "selectionRecord.selectedDirection", errors, missingFields);

    if (record.selectionRecord.selectedDirection !== record.selectedIdentityDirection) {
      errors.push("selectionRecord.selectedDirection must match selectedIdentityDirection.");
    }

    validateStringArrayField(record, "selectionRecord.likedElements", errors);
    validateStringArrayField(record, "selectionRecord.elementsToAvoid", errors);
  }

  if (!isPlainObject(record.clientResponse)) {
    errors.push("clientResponse must be an object.");
    missingFields.push("clientResponse");
  }

  if (!isPlainObject(record.preservationGuidance)) {
    errors.push("preservationGuidance must be an object.");
    missingFields.push("preservationGuidance");
  } else {
    validateStringArrayField(record, "preservationGuidance.mustPreserve", errors);
    validateStringArrayField(record, "preservationGuidance.flexible", errors);
    validateStringArrayField(record, "preservationGuidance.avoid", errors);
  }

  if (!isPlainObject(record.source)) {
    errors.push("source must be an object.");
    missingFields.push("source");
  } else {
    if (!cleanString(record.source.sourceFile)) {
      warnings.push("source.sourceFile is empty; record will be harder to trace later.");
    }

    if (!cleanString(record.source.sourceFingerprint)) {
      warnings.push("source.sourceFingerprint is empty; source matching cannot be enforced.");
    }
  }

  if (!cleanString(record.createdAt)) {
    warnings.push("createdAt is empty; record creation time was not captured.");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    missingFields
  };
}

module.exports = {
  ALLOWED_DIRECTIONS,
  REQUIRED_PITCH_FIELDS,
  validateIdentitySelectionRecord
};
