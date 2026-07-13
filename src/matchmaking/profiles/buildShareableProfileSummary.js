function joinNatural(values = [], fallback = "") {
    const items = (Array.isArray(values) ? values : []).filter(Boolean);
    if (!items.length) return fallback;
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} and ${items[1]}`;
    return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function titleCase(value) {
    return String(value || "")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function buildAvailabilitySummary(logistics = {}) {
    const windows = logistics.availability || [];
    if (!windows.length) return "Availability has not yet been confirmed.";

    const rendered = windows.map((window) => {
        const day = titleCase(window.day);
        return `${day} ${window.start}–${window.end}`;
    });

    const timezone = logistics.timezone ? ` (${logistics.timezone})` : "";
    return `${joinNatural(rendered)}${timezone}`;
}

function buildSystemSummary(systems = {}, campaignPreferences = {}) {
    const preferred = systems.preferred || [];
    const acceptable = systems.acceptable || [];
    const legacyPreference = campaignPreferences.systemPreference;

    if (preferred.length) {
        const additional = acceptable.length
            ? `; also open to ${joinNatural(acceptable.map(titleCase))}`
            : "";
        return `Prefers ${joinNatural(preferred.map(titleCase))}${additional}.`;
    }

    if (acceptable.length) {
        return `Open to ${joinNatural(acceptable.map(titleCase))}.`;
    }

    if (legacyPreference) {
        return `Interested in ${legacyPreference}.`;
    }

    return "System preferences are still open for discussion.";
}

function buildTableStyleSummary(tablePreferences = {}) {
    const parts = [];
    if (tablePreferences.roleplayIntensity) {
        parts.push(`${titleCase(tablePreferences.roleplayIntensity)} roleplay interest`);
    }
    if (tablePreferences.tacticalIntensity) {
        parts.push(`${titleCase(tablePreferences.tacticalIntensity)} tactical interest`);
    }
    if (tablePreferences.rulesApproach) {
        parts.push(`${titleCase(tablePreferences.rulesApproach)} rules approach`);
    }
    if (tablePreferences.communicationStyles?.length) {
        parts.push(`${joinNatural(tablePreferences.communicationStyles.map(titleCase))} communication`);
    }

    return parts.length
        ? `${joinNatural(parts)}.`
        : "Table-style preferences should be discussed before play.";
}

function buildCommitmentSummary(commitment = {}, logistics = {}) {
    const parts = [];
    if (commitment.campaignLengths?.length) {
        parts.push(`${joinNatural(commitment.campaignLengths.map(titleCase))} campaign length`);
    }
    if (logistics.frequencyPreferences?.length) {
        parts.push(`${joinNatural(logistics.frequencyPreferences.map(titleCase))} sessions`);
    }
    if (commitment.attendanceExpectation) {
        parts.push(`${titleCase(commitment.attendanceExpectation)} attendance expectation`);
    }

    return parts.length
        ? `${joinNatural(parts)}.`
        : "Commitment expectations have not yet been fully confirmed.";
}

function buildSessionZeroTopics(profile = {}) {
    const topics = [];

    if (!profile.systems?.preferred?.length) {
        topics.push("Choose a mutually acceptable game system.");
    }
    if (!profile.logistics?.availability?.length) {
        topics.push("Confirm a recurring session schedule.");
    }
    if (!profile.commitment?.attendanceExpectation) {
        topics.push("Agree on attendance and cancellation expectations.");
    }
    if (profile.tablePreferences?.voiceRequired === null) {
        topics.push("Confirm voice and video expectations.");
    }
    if (profile.safety?.boundaries?.length || profile.safety?.hardExclusions?.length) {
        topics.push("Agree on safety tools and how boundaries will be handled.");
    }

    return topics;
}

function buildShareableProfileSummary(profile = {}) {
    const preferences = profile.campaignPreferences || {};
    const interests = [
        ...(preferences.experiences || []),
        ...(preferences.gameplayInterests || []),
        ...(preferences.setups || [])
    ];

    return {
        campaignInterests: [...new Set(interests)].slice(0, 8),
        availabilitySummary: buildAvailabilitySummary(profile.logistics),
        systemSummary: buildSystemSummary(profile.systems, preferences),
        tableStyleSummary: buildTableStyleSummary(profile.tablePreferences),
        commitmentSummary: buildCommitmentSummary(profile.commitment, profile.logistics),
        sessionZeroTopics: buildSessionZeroTopics(profile)
    };
}

module.exports = {
    buildShareableProfileSummary
};
