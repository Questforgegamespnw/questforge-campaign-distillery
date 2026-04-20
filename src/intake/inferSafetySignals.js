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

    const explicitYouthMode =
        youthModeValues.some((value) => normalizeText(value) === "yes");

    const audienceSuggestsYouth = [
        "teens (13–17)",
        "mixed ages",
        "kids (under 13)",
        "family-friendly / kid-safe experience"
    ].includes(normalizedAudience);

    const ageBandSuggestsYouth = [
        "teens_14_17",
        "kids_11_13",
        "kids_8_10",
        "kids_5_7",
        "mixed_age"
    ].includes(normalizedAgeBand);

    const familyFriendlyBoundary =
        includesAny(normalizedBoundaryText, [
            "family-friendly",
            "kid-safe",
            "avoid horror",
            "avoid dark",
            "positive outcomes",
            "non-lethal",
            "low danger"
        ]);

    const softYouthCueCount =
        [
            audienceSuggestsYouth,
            ageBandSuggestsYouth,
            familyFriendlyBoundary
        ].filter(Boolean).length;

    const textSuggestsYouth =
        includesAny(normalizedMustHaves, [
            "family friendly",
            "family-friendly",
            "kid friendly",
            "kid-friendly",
            "lighthearted",
            "heroic",
            "teamwork",
            "positive"
        ]) ||
        includesAny(normalizedAvoid, [
            "gore",
            "body horror",
            "grimdark",
            "hopeless",
            "too scary",
            "excessive violence",
            "mature themes"
        ]);

    const inferredYouthSafe =
        explicitYouthMode ||
        softYouthCueCount >= 2 ||
        (softYouthCueCount >= 1 && textSuggestsYouth);

    const youthSafeMode = explicitYouthMode || inferredYouthSafe;

    const contradictionNotes = [];

    if (
        normalizedAudience === "adults" &&
        (explicitYouthMode || familyFriendlyBoundary || ageBandSuggestsYouth)
    ) {
        contradictionNotes.push(
            "Audience is marked as Adults, but other safety signals suggest a youth-safe or clean-content preference."
        );
    }

    if (
        normalizedAgeBand === "adult" &&
        (explicitYouthMode || familyFriendlyBoundary)
    ) {
        contradictionNotes.push(
            "Age band is adult, but safety inputs still indicate a youth-safe or family-friendly mode."
        );
    }

    return {
        explicitYouthMode,
        audienceSuggestsYouth,
        ageBandSuggestsYouth,
        familyFriendlyBoundary,
        textSuggestsYouth,
        inferredYouthSafe,
        youthSafeMode,
        softYouthCueCount,
        contradictionNotes
    };
}

module.exports = {
    inferSafetySignals
};