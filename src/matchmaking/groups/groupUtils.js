const crypto = require("crypto");
const {
    intersection,
    availabilityIntervals,
    normalizeToken
} = require("../pairs/pairUtils");

function stableMembers(profiles = []) {
    return [...new Set(
        profiles.map((profile) => profile?.playerId).filter(Boolean)
    )].sort();
}

function groupId(profiles = []) {
    const members = stableMembers(profiles);
    const digest = crypto
        .createHash("sha256")
        .update(JSON.stringify(members))
        .digest("hex")
        .slice(0, 16);

    return `group-${digest}`;
}

function allPairs(profiles = []) {
    const pairs = [];

    for (let indexA = 0; indexA < profiles.length; indexA += 1) {
        for (let indexB = indexA + 1; indexB < profiles.length; indexB += 1) {
            pairs.push([profiles[indexA], profiles[indexB]]);
        }
    }

    return pairs;
}

function intersectMany(collections = []) {
    if (collections.length === 0) return [];

    return collections
        .map((values) => Array.isArray(values) ? values : [])
        .reduce((current, values) => intersection(current, values));
}

function intersectIntervalSets(intervalSets = []) {
    if (intervalSets.length === 0) return [];

    let current = intervalSets[0].map((interval) => ({
        start: interval.start,
        end: interval.end
    }));

    for (const intervals of intervalSets.slice(1)) {
        const next = [];

        for (const existing of current) {
            for (const candidate of intervals) {
                const start = Math.max(existing.start, candidate.start);
                const end = Math.min(existing.end, candidate.end);

                if (end > start) {
                    next.push({ start, end });
                }
            }
        }

        current = next;
        if (current.length === 0) break;
    }

    return current
        .map((interval) => ({
            start: new Date(interval.start).toISOString(),
            end: new Date(interval.end).toISOString(),
            durationHours: Number(
                ((interval.end - interval.start) / 3600000).toFixed(2)
            )
        }))
        .sort((a, b) => b.durationHours - a.durationHours);
}

function findGroupAvailabilityOverlaps(profiles = [], referenceDate = new Date()) {
    const intervalSets = profiles.map((profile) =>
        availabilityIntervals(profile, referenceDate)
    );

    if (intervalSets.some((intervals) => intervals.length === 0)) {
        return [];
    }

    return intersectIntervalSets(intervalSets);
}

function average(values = []) {
    if (values.length === 0) return 0;
    return values.reduce((sum, value) => sum + Number(value || 0), 0) / values.length;
}

function standardDeviation(values = []) {
    if (values.length <= 1) return 0;
    const mean = average(values);
    const variance = average(
        values.map((value) => (Number(value) - mean) ** 2)
    );
    return Math.sqrt(variance);
}

function uniqueStrings(values = []) {
    return [...new Set(values.filter(Boolean))];
}

function commonPreference(profiles = [], path = []) {
    const collections = profiles.map((profile) => {
        let value = profile;

        for (const key of path) {
            value = value?.[key];
        }

        return Array.isArray(value) ? value : [];
    });

    return intersectMany(collections);
}

function hasFlexible(values = []) {
    const normalized = new Set(values.map(normalizeToken));
    return normalized.has("flexible") ||
        normalized.has("either") ||
        normalized.has("any");
}

module.exports = {
    stableMembers,
    groupId,
    allPairs,
    intersectMany,
    intersectIntervalSets,
    findGroupAvailabilityOverlaps,
    average,
    standardDeviation,
    uniqueStrings,
    commonPreference,
    hasFlexible
};
