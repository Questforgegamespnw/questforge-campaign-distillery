const DIRECTIONS = ["primary", "adjacent", "wildcard"];

function requireText(value, label) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${label} must be a non-empty string.`);
  }

  return value.trim();
}

function normalizeIdentityPitchDocument(raw = {}) {
  const source = raw.identityPitches || raw.directions;

  if (!source || typeof source !== "object" || Array.isArray(source)) {
    throw new Error(
      "Expected identityPitches or directions in the validated JSON."
    );
  }

  const identityPitches = {};

  for (const directionKey of DIRECTIONS) {
    const entry = source[directionKey];
    const content = entry?.output || entry;

    if (!entry || !content) {
      throw new Error(`Missing ${directionKey} Identity Pitch.`);
    }

    identityPitches[directionKey] = {
      title: requireText(
        entry.title || content.title,
        `${directionKey}.title`
      ),
      pitch: requireText(content.pitch, `${directionKey}.pitch`),
      about: requireText(content.about, `${directionKey}.about`),
      playersDo: requireText(
        content.playersDo,
        `${directionKey}.playersDo`
      ),
      hook: requireText(
        content.hook || content.distinctHook,
        `${directionKey}.hook`
      )
    };
  }

  const metadata = raw.metadata || {};

  if (
    Number.isFinite(metadata.acceptedCount) &&
    Number.isFinite(metadata.directionCount) &&
    metadata.acceptedCount !== metadata.directionCount
  ) {
    throw new Error(
      `Validated input is incomplete: ${metadata.acceptedCount}/${metadata.directionCount} directions accepted.`
    );
  }

  return {
    metadata,
    identityPitches
  };
}

module.exports = {
  DIRECTIONS,
  normalizeIdentityPitchDocument
};
