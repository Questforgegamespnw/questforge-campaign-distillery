/**
 * Finds an item by id in a collection.
 *
 * @param {Array<{id: string}>} collection
 * @param {string} id
 * @returns {object | null}
 */
function lookupById(collection, id) {
  if (!Array.isArray(collection) || !id) {
    return null;
  }

  return collection.find((item) => item.id === id) || null;
}

/**
 * Resolves weighted selections into full objects with metadata.
 *
 * This intentionally preserves extra metadata fields from the source library
 * so newer taxonomy layers can carry fields such as techLevel, commonTech,
 * socialFrame, visualLanguage, techFlavor, pressureType, and compatibleEraHints.
 *
 * @param {Array<{id: string, weight: number}>} selections
 * @param {Array<object>} collection
 * @returns {Array<object>}
 */
function resolveSelections(selections, collection) {
  if (!Array.isArray(selections)) {
    return [];
  }

  return selections.map((selection) => {
    const match = lookupById(collection, selection.id) || {};

    return {
      ...match,
      id: selection.id,
      weight: selection.weight,
      name: match.name || selection.id,
      description: match.description || "",
      pitchText: match.pitchText || "",
      tags: match.tags || [],
      family: match.family || "",
      archetype: match.archetype || ""
    };
  });
}

module.exports = {
  lookupById,
  resolveSelections
};

