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

function normalizeArray(values = []) {
    return (Array.isArray(values) ? values : [])
        .map(normalizeValue)
        .filter(Boolean);
}

/**
 * Builds translator-ready input from canonical intake.
 * This is a derived adapter layer — NOT part of canonical intake.
 *
 * Phase 1 identity remains core/system-first. Genre stays available as light
 * client-facing flavor. Era/aesthetic/world-condition context is preserved for
 * audit and Phase 2 handoff.
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

    const overallExperiences = normalizeArray(preferences.experiences);
    const conflicts = normalizeArray(preferences.setups);
    const legacyGenres = normalizeArray(preferences.genres);
    const eras = normalizeArray(preferences.eras);
    const aesthetics = normalizeArray(preferences.aesthetics);
    const worldConditions = normalizeArray(preferences.worldConditions);
    const playerFantasies = normalizeArray(preferences.playerFantasy);

    return {
        experienceProfile: safety.experienceProfile || "standard",
        contentSafetyMode: safety.contentSafetyMode || "standard",

        // Backward-compatible boolean used by older translation logic.
        youthMode: Boolean(safety.inferredYouthSafe || safety.youthSafeMode),

        softerThemesMode: Boolean(safety.softerThemesMode),
        fullSafeMode: Boolean(safety.fullSafeMode),
        youthSafeMode: Boolean(safety.youthSafeMode),

        ageBand: group.ageBand || "",
        system: group.systemPreference || "",

        respondentType: group.respondentType || "",
        currentGroupSize: group.currentGroupSize || "",
        desiredGroupSize: group.desiredGroupSize || "",
        groupSize: group.groupSize || "",

        // Legacy scalar fields kept for compatibility.
        overallExperience: firstItem(overallExperiences),
        tone: normalizeValue(preferences.tone),
        worldAesthetic: firstItem(legacyGenres),
        conflict: firstItem(conflicts),
        choiceWeight: normalizeValue(preferences.choiceWeight),
        playerFantasy: firstItem(playerFantasies),

        // Expanded fields used by the current translator.
        overallExperiences,
        conflicts,
        legacyGenres,
        eras,
        aesthetics,
        worldConditions,
        playerFantasies,

        // Phase 2-forward context. Prefer explicit aesthetic selections when
        // present, then fall back to legacy genre flavor.
        activeAesthetics: aesthetics.length > 0 ? aesthetics : legacyGenres,

        gameplay: normalizeArray(preferences.gameplayInterests),
        environments: normalizeArray(preferences.environments),

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
