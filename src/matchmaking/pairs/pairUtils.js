const DAY_INDEX = Object.freeze({
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6
});

function normalizeToken(value) {
    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
}

function normalizeSet(values = []) {
    return new Set(
        (Array.isArray(values) ? values : [values])
            .map(normalizeToken)
            .filter(Boolean)
    );
}

function intersection(valuesA = [], valuesB = []) {
    const setB = normalizeSet(valuesB);
    return [...normalizeSet(valuesA)].filter((value) => setB.has(value));
}

function union(valuesA = [], valuesB = []) {
    return [...new Set([...normalizeSet(valuesA), ...normalizeSet(valuesB)])];
}

function jaccard(valuesA = [], valuesB = []) {
    const shared = intersection(valuesA, valuesB).length;
    const total = union(valuesA, valuesB).length;
    if (total === 0) return null;
    return shared / total;
}

function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, Number(value) || 0));
}

function minutesFromTime(value) {
    const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(String(value || ""));
    if (!match) return null;
    return Number(match[1]) * 60 + Number(match[2]);
}

function dateForWeekday(referenceDate, weekday) {
    const target = DAY_INDEX[normalizeToken(weekday)];
    if (target === undefined) return null;

    const date = new Date(referenceDate);
    const current = date.getUTCDay();
    const delta = (target - current + 7) % 7;
    date.setUTCDate(date.getUTCDate() + delta);
    date.setUTCHours(12, 0, 0, 0);
    return date;
}

function timezoneOffsetMinutes(timezone, date) {
    if (!timezone) return 0;

    try {
        const formatter = new Intl.DateTimeFormat("en-US", {
            timeZone: timezone,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hourCycle: "h23"
        });

        const parts = Object.fromEntries(
            formatter.formatToParts(date)
                .filter((part) => part.type !== "literal")
                .map((part) => [part.type, part.value])
        );

        const asUtc = Date.UTC(
            Number(parts.year),
            Number(parts.month) - 1,
            Number(parts.day),
            Number(parts.hour),
            Number(parts.minute),
            Number(parts.second)
        );

        return Math.round((asUtc - date.getTime()) / 60000);
    } catch (error) {
        return 0;
    }
}

function availabilityIntervals(profile = {}, referenceDate = new Date()) {
    const timezone = profile.logistics?.timezone || "UTC";
    const windows = profile.logistics?.availability || [];
    const intervals = [];

    for (const window of windows) {
        const localDate = dateForWeekday(referenceDate, window.day);
        const startMinutes = minutesFromTime(window.start);
        const endMinutes = minutesFromTime(window.end);

        if (!localDate || startMinutes === null || endMinutes === null) continue;

        const localMidnight = new Date(localDate);
        localMidnight.setUTCHours(0, 0, 0, 0);
        const offset = timezoneOffsetMinutes(timezone, localDate);

        let start = localMidnight.getTime() + (startMinutes - offset) * 60000;
        let end = localMidnight.getTime() + (endMinutes - offset) * 60000;

        if (end <= start) {
            end += 24 * 60 * 60000;
        }

        intervals.push({
            start,
            end,
            timezone,
            day: normalizeToken(window.day),
            localStart: window.start,
            localEnd: window.end
        });
    }

    return intervals;
}

function findAvailabilityOverlaps(profileA = {}, profileB = {}, referenceDate = new Date()) {
    const intervalsA = availabilityIntervals(profileA, referenceDate);
    const intervalsB = availabilityIntervals(profileB, referenceDate);
    const overlaps = [];

    for (const a of intervalsA) {
        for (const b of intervalsB) {
            const start = Math.max(a.start, b.start);
            const end = Math.min(a.end, b.end);

            if (end > start) {
                overlaps.push({
                    start: new Date(start).toISOString(),
                    end: new Date(end).toISOString(),
                    durationHours: Number(((end - start) / 3600000).toFixed(2)),
                    sourceA: a,
                    sourceB: b
                });
            }
        }
    }

    return overlaps.sort((a, b) => b.durationHours - a.durationHours);
}

function numericRangeOverlap(minA, maxA, minB, maxB) {
    if ([minA, maxA, minB, maxB].some((value) => value === null || value === undefined)) {
        return null;
    }

    const minimum = Math.max(Number(minA), Number(minB));
    const maximum = Math.min(Number(maxA), Number(maxB));

    return maximum >= minimum
        ? { minimum, maximum }
        : null;
}

function arraysConflict(required = [], excluded = []) {
    return intersection(required, excluded);
}

function profileLabel(profile = {}) {
    return profile.identity?.displayName || profile.playerId || "Applicant";
}

function scoreStatus(score, maximum) {
    const ratio = maximum > 0 ? score / maximum : 0;
    if (ratio >= 0.85) return "strong_alignment";
    if (ratio >= 0.65) return "aligned";
    if (ratio >= 0.45) return "mostly_aligned";
    if (ratio > 0) return "discussion_recommended";
    return "insufficient_information";
}

module.exports = {
    normalizeToken,
    normalizeSet,
    intersection,
    union,
    jaccard,
    clamp,
    minutesFromTime,
    availabilityIntervals,
    findAvailabilityOverlaps,
    numericRangeOverlap,
    arraysConflict,
    profileLabel,
    scoreStatus
};
