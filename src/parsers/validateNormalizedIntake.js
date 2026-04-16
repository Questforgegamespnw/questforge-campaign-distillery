const fs = require("fs");
const path = require("path");
const Ajv2020 = require("ajv/dist/2020");

/**
 * Loads the normalized intake schema from disk.
 */
function loadSchema() {
  const schemaPath = path.resolve(
    __dirname,
    "../../misc/normalized-intake-schema.json"
  );

  const rawSchema = fs.readFileSync(schemaPath, "utf-8");
  return JSON.parse(rawSchema);
}

/**
 * Creates and returns a compiled Ajv validator.
 */
function createValidator() {
  
  const ajv = new Ajv2020({
  allErrors: true,
  strict: false
});

  const schema = loadSchema();
  return ajv.compile(schema);
}

/**
 * Converts Ajv errors into readable messages.
 * @param {import("ajv").ErrorObject[] | null | undefined} errors
 * @returns {string[]}
 */
function formatErrors(errors) {
  if (!errors || errors.length === 0) {
    return [];
  }

  return errors.map((error) => {
    const location =
      error.instancePath && error.instancePath.length > 0
        ? error.instancePath
        : "(root)";

    if (
      error.keyword === "required" &&
      error.params &&
      error.params.missingProperty
    ) {
      return `${location}: missing required property "${error.params.missingProperty}"`;
    }

    if (
      error.keyword === "enum" &&
      error.params &&
      Array.isArray(error.params.allowedValues)
    ) {
      return `${location}: value must be one of [${error.params.allowedValues.join(", ")}]`;
    }

    if (
      error.keyword === "additionalProperties" &&
      error.params &&
      error.params.additionalProperty
    ) {
      return `${location}: unexpected property "${error.params.additionalProperty}"`;
    }

    return `${location}: ${error.message || "validation error"}`;
  });
}

/**
 * Validates a normalized intake object.
 * @param {unknown} intake
 * @returns {{
 *   isValid: boolean,
 *   errors: string[],
 *   data: any | null
 * }}
 */
function validateNormalizedIntake(intake) {
  const validator = createValidator();
  const isValid = validator(intake);

  return {
    isValid: Boolean(isValid),
    errors: isValid ? [] : formatErrors(validator.errors),
    data: isValid ? intake : null
  };
}

module.exports = {
  validateNormalizedIntake
};