function toArray(value) {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (value === undefined || value === null || value === "") return [];
    return [value];
}

function normalizeText(value) {
    return String(value || "").trim().toLowerCase();
}

function includesAny(text, phrases) {
    return phrases.some((phrase) => text.includes(phrase));
}

function inferSafetySignals(raw = {}) {
    const normalizedAudience = normalizeText(raw.audience);
    const normalizedAgeBand = normalizeText(raw.age_band);
    const youthModeValues = toArray(raw.youth_mode);
    const contentBoundaries = toArray(raw.content_boundaries);
    const mustHaves = String(raw.must_haves || "").trim();
    const avoid = String(raw.avoid || "").trim();

    const normalizedBoundaryText = contentBoundaries.join(" | ").toLowerCase();
    const normalizedMustHaves = mustHaves.toLowerCase();
    const normalizedAvoid = avoid.toLowerCase();

    // Legacy binary switch: "yes" historically meant the full kid-safe / Hero Kids route.
    const explicitYouthMode =
        youthModeValues.some((value) => normalizeText(value) === "yes");

    const audienceSuggestsKids = [
        "kids (under 13)",
        "family-friendly / kid-safe experience"
    ].includes(normalizedAudience);

    const audienceSuggestsYouth = [
        "teens (13–17)",
        "mixed ages"
    ].includes(normalizedAudience);

    const ageBandSuggestsKids = [
        "kids_11_13",
        "kids_8_10",
        "kids_5_7"
    ].includes(normalizedAgeBand);

    const ageBandSuggestsYouth = [
        "teens_14_17",
        "mixed_age"
    ].includes(normalizedAgeBand);

    const textSuggestsKids =
        includesAny(normalizedMustHaves, [
            "for kids",
            "for children",
            "younger children",
            "hero kids",
            "kid friendly",
            "kid-friendly",
            "kid safe",
            "kid-safe"
        ]);

    const textSuggestsYouth =
        includesAny(normalizedMustHaves, [
            "for teens",
            "teen players",
            "teen audience",
            "younger players",
            "mixed age",
            "mixed-age"
        ]);

    const familyFriendlyBoundary = includesAny(normalizedBoundaryText, [
        "family-friendly",
        "kid-safe",
        "positive outcomes",
        "non-lethal",
        "low danger"
    ]);

    const horrorRestricted =
        includesAny(normalizedBoundaryText, [
            "avoid horror",
            "no horror",
            "not scary",
            "too scary"
        ]) ||
        includesAny(normalizedAvoid, [
            "no horror",
            "avoid horror",
            "body horror",
            "too scary"
        ]);

    const graphicContentRestricted =
        includesAny(normalizedBoundaryText, [
            "avoid gore",
            "no gore",
            "non-lethal",
            "low violence",
            "no graphic violence"
        ]) ||
        includesAny(normalizedAvoid, [
            "gore",
            "graphic violence",
            "excessive violence"
        ]);

    const oppressiveToneRestricted =
        includesAny(normalizedBoundaryText, [
            "avoid dark",
            "positive outcomes",
            "low danger",
            "not hopeless"
        ]) ||
        includesAny(normalizedAvoid, [
            "grimdark",
            "hopeless",
            "oppressive",
            "bleak"
        ]);

    const experienceProfile =
        explicitYouthMode || audienceSuggestsKids || ageBandSuggestsKids || textSuggestsKids
            ? "kids"
            : audienceSuggestsYouth || ageBandSuggestsYouth || textSuggestsYouth
                ? "youth"
                : "standard";

    const inferredYouthSafe = experienceProfile !== "standard";
    const softerThemesMode = experienceProfile === "youth";
    const fullSafeMode = experienceProfile === "kids";
    const heroKidsMode = fullSafeMode;

    // Backward compatibility: the old safe-mode switch represented the full kid-safe path.
    const youthSafeMode = fullSafeMode;

    const softYouthCueCount = [
        audienceSuggestsYouth,
        ageBandSuggestsYouth,
        textSuggestsYouth
    ].filter(Boolean).length;

    const contradictionNotes = [];

    if (
        normalizedAudience === "adults" &&
        (experienceProfile === "youth" || experienceProfile === "kids")
    ) {
        contradictionNotes.push(
            "Audience is marked as Adults, but other audience signals select a youth or kids experience profile."
        );
    }

    if (
        normalizedAgeBand === "adult" &&
        (experienceProfile === "youth" || experienceProfile === "kids")
    ) {
        contradictionNotes.push(
            "Age band is adult, but other audience signals select a youth or kids experience profile."
        );
    }

    return {
        experienceProfile,
        explicitYouthMode,
        audienceSuggestsYouth,
        audienceSuggestsKids,
        ageBandSuggestsYouth,
        ageBandSuggestsKids,
        familyFriendlyBoundary,
        textSuggestsYouth,
        textSuggestsKids,
        inferredYouthSafe,
        youthSafeMode,
        softerThemesMode,
        fullSafeMode,
        heroKidsMode,
        horrorRestricted,
        graphicContentRestricted,
        oppressiveToneRestricted,
        softYouthCueCount,
        contradictionNotes
    };
}

module.exports = {
    inferSafetySignals
};
