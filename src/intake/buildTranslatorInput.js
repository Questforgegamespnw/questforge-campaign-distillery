function firstItem(array) {
    return Array.isArray(array) && array.length > 0 ? array[0] : "";
}

function joinNotes(...parts) {
    return parts
        .map((value) => String(value || "").trim())
        .filter(Boolean)
        .join("; ");
}

function normalizeValue(value) {
    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
}

/**
 * Builds translator-ready input from canonical intake.
 * This is a derived adapter layer — NOT part of canonical intake.
 *
 * @param {object} canonical
 * @returns {object}
 */
function buildTranslatorInput(canonical = {}) {
    const group = canonical.group || {};
    const preferences = canonical.preferences || {};
    const notes = canonical.notes || {};
    const boundaries = canonical.boundaries || {};
    const safety = canonical.safety || {};

    return {
        youthMode: Boolean(safety.youthSafeMode),
        ageBand: group.ageBand || "",
        system: group.systemPreference || "",

        overallExperience: normalizeValue(firstItem(preferences.experiences)),
        tone: normalizeValue(preferences.tone),
        worldAesthetic: normalizeValue(firstItem(preferences.genres)),
        conflict: normalizeValue(firstItem(preferences.setups)),
        choiceWeight: normalizeValue(preferences.choiceWeight),
        playerFantasy: normalizeValue(firstItem(preferences.playerFantasy)),

        gameplay: (preferences.gameplayInterests || []).map(normalizeValue),
        environments: (preferences.environments || []).map(normalizeValue),

        includeNotes: joinNotes(
            notes.mustHaves,
            ...(boundaries.contentBoundaries || [])
        ),

        excludeNotes: joinNotes(notes.avoid)
    };
}

module.exports = {
    buildTranslatorInput
};