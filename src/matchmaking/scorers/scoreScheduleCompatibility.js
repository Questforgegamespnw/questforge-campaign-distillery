const {
    intersection,
    findAvailabilityOverlaps,
    numericRangeOverlap
} = require("../pairs/pairUtils");
const { dimensionResult } = require("./scorerUtils");

function scoreScheduleCompatibility(profileA = {}, profileB = {}, context = {}) {
    const evidence = [];
    const overlaps = context.eligibility?.evidence?.availabilityOverlaps ||
        findAvailabilityOverlaps(profileA, profileB, context.referenceDate || new Date());

    let score = 0;

    if (overlaps.length > 0) {
        const best = overlaps[0];
        score += Math.min(12, 6 + best.durationHours * 1.5);
        evidence.push(
            `A recurring availability overlap of approximately ${best.durationHours} hours was found.`
        );
    }

    const formats = intersection(
        profileA.logistics?.playFormats,
        profileB.logistics?.playFormats
    );
    if (formats.length > 0) {
        score += 4;
        evidence.push(`Shared play format: ${formats.join(", ")}.`);
    }

    const frequency = intersection(
        profileA.logistics?.frequencyPreferences,
        profileB.logistics?.frequencyPreferences
    );
    if (frequency.length > 0) {
        score += 3;
        evidence.push(`Shared session frequency: ${frequency.join(", ")}.`);
    }

    const duration = numericRangeOverlap(
        profileA.logistics?.sessionDuration?.minimumHours,
        profileA.logistics?.sessionDuration?.maximumHours,
        profileB.logistics?.sessionDuration?.minimumHours,
        profileB.logistics?.sessionDuration?.maximumHours
    );
    if (duration) {
        score += 3;
        evidence.push(
            `Compatible session duration: ${duration.minimum}–${duration.maximum} hours.`
        );
    }

    if (
        profileA.logistics?.timezone &&
        profileB.logistics?.timezone &&
        profileA.logistics.timezone === profileB.logistics.timezone
    ) {
        score += 1;
        evidence.push("Both applicants use the same timezone.");
    }

    const flexibilityValues = new Set([
        profileA.logistics?.scheduleFlexibility,
        profileB.logistics?.scheduleFlexibility
    ]);
    if (flexibilityValues.has("high")) score += 2;
    else if (flexibilityValues.has("moderate")) score += 1;

    return dimensionResult(score, 25, evidence, {
        overlaps,
        formats,
        frequency,
        duration
    });
}

module.exports = {
    scoreScheduleCompatibility
};
