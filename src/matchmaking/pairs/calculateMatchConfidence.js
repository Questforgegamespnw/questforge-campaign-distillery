const { clamp } = require("./pairUtils");

const DAY_MS = 24 * 60 * 60 * 1000;

function ageInDays(timestamp, now) {
    const parsed = Date.parse(timestamp || "");
    if (!Number.isFinite(parsed)) return null;
    return Math.max(0, (now.getTime() - parsed) / DAY_MS);
}

function calculateMatchConfidence(profileA = {}, profileB = {}, options = {}) {
    const now = options.now ? new Date(options.now) : new Date();
    const reasons = [];

    const completenessA = Number(profileA.completeness?.percentage || 0);
    const completenessB = Number(profileB.completeness?.percentage || 0);
    const averageCompleteness = (completenessA + completenessB) / 2;

    let numeric = averageCompleteness * 0.7;

    const ageA = ageInDays(profileA.provenance?.lastConfirmedAt, now);
    const ageB = ageInDays(profileB.provenance?.lastConfirmedAt, now);
    const ages = [ageA, ageB].filter((value) => value !== null);
    const maximumAge = ages.length ? Math.max(...ages) : null;

    if (maximumAge === null) {
        reasons.push("One or both profiles do not have a usable confirmation date.");
    } else if (maximumAge <= 30) {
        numeric += 20;
        reasons.push("Both profiles were confirmed within the last 30 days.");
    } else if (maximumAge <= 90) {
        numeric += 14;
        reasons.push("The profiles were confirmed within the last 90 days.");
    } else if (maximumAge <= 180) {
        numeric += 7;
        reasons.push("At least one profile is more than 90 days old.");
    } else {
        reasons.push("At least one profile is more than 180 days old.");
    }

    const contradictions = [
        ...(profileA.completeness?.contradictions || []),
        ...(profileB.completeness?.contradictions || [])
    ];
    const warnings = [
        ...(profileA.completeness?.warnings || []),
        ...(profileB.completeness?.warnings || [])
    ];
    const inferred = Number(profileA.completeness?.inferredFieldCount || 0) +
        Number(profileB.completeness?.inferredFieldCount || 0);

    numeric -= Math.min(20, contradictions.length * 5);
    numeric -= Math.min(10, warnings.length * 2);
    numeric -= Math.min(10, inferred);

    if (contradictions.length > 0) {
        reasons.push(`${contradictions.length} profile contradiction(s) reduce confidence.`);
    }
    if (warnings.length > 0) {
        reasons.push(`${warnings.length} profile warning(s) reduce confidence.`);
    }
    if (averageCompleteness < 80) {
        reasons.push("One or both profiles are missing important matchmaking information.");
    } else {
        reasons.push(`Average profile completeness is ${Math.round(averageCompleteness)}%.`);
    }

    numeric = Number(clamp(numeric, 0, 100).toFixed(2));

    let level = "insufficient";
    if (numeric >= 85) level = "high";
    else if (numeric >= 65) level = "moderate";
    else if (numeric >= 40) level = "low";

    return {
        level,
        numeric,
        reasons,
        factors: {
            averageCompleteness: Number(averageCompleteness.toFixed(2)),
            maximumProfileAgeDays: maximumAge === null
                ? null
                : Number(maximumAge.toFixed(1)),
            contradictionCount: contradictions.length,
            warningCount: warnings.length,
            inferredFieldCount: inferred
        }
    };
}

module.exports = {
    calculateMatchConfidence
};
