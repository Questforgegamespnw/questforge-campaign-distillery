const VALID_DAYS = new Set([
    "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"
]);

const VALID_STATUSES = new Set([
    "not_eligible", "not_asked", "declined", "opted_in", "conditional", "withdrawn"
]);

function isTime(value) {
    return /^([01]\d|2[0-3]):[0-5]\d$/.test(String(value || ""));
}

function validateMatchmakingIntake(matchmaking = {}) {
    const errors = [];
    const warnings = [];
    const participation = matchmaking.participation || {};
    const consent = matchmaking.consent || {};
    const logistics = matchmaking.logistics || {};
    const systems = matchmaking.systems || {};
    const groupPreferences = matchmaking.groupPreferences || {};
    const status = participation.status || "not_asked";

    if (!VALID_STATUSES.has(status)) {
        errors.push(`participation.status: unsupported status "${status}".`);
    }

    for (const [index, window] of (logistics.availability || []).entries()) {
        if (!VALID_DAYS.has(window.day)) {
            errors.push(`logistics.availability[${index}].day: invalid day "${window.day}".`);
        }
        if (!isTime(window.start)) {
            errors.push(`logistics.availability[${index}].start: expected HH:MM time.`);
        }
        if (!isTime(window.end)) {
            errors.push(`logistics.availability[${index}].end: expected HH:MM time.`);
        }
        if (isTime(window.start) && isTime(window.end) && window.start === window.end) {
            errors.push(`logistics.availability[${index}]: start and end times cannot match.`);
        }
    }

    const minHours = logistics.sessionDuration?.minimumHours;
    const maxHours = logistics.sessionDuration?.maximumHours;
    if (minHours !== null && maxHours !== null && minHours > maxHours) {
        errors.push("logistics.sessionDuration: minimumHours cannot exceed maximumHours.");
    }

    const minPlayers = groupPreferences.minimumPlayers;
    const preferredPlayers = groupPreferences.preferredPlayers;
    const maxPlayers = groupPreferences.maximumPlayers;

    if (minPlayers !== null && preferredPlayers !== null && minPlayers > preferredPlayers) {
        errors.push("groupPreferences: minimumPlayers cannot exceed preferredPlayers.");
    }
    if (preferredPlayers !== null && maxPlayers !== null && preferredPlayers > maxPlayers) {
        errors.push("groupPreferences: preferredPlayers cannot exceed maximumPlayers.");
    }
    if (minPlayers !== null && maxPlayers !== null && minPlayers > maxPlayers) {
        errors.push("groupPreferences: minimumPlayers cannot exceed maximumPlayers.");
    }

    const preferred = new Set(systems.preferred || []);
    const acceptable = new Set(systems.acceptable || []);
    const excluded = new Set(systems.excluded || []);
    for (const id of [...preferred, ...acceptable]) {
        if (excluded.has(id)) {
            errors.push(`systems: "${id}" cannot be both allowed and excluded.`);
        }
    }

    if (status === "opted_in") {
        if (consent.matchmaking !== true) {
            errors.push("consent.matchmaking: active opt-in requires explicit participation consent.");
        }
        if (consent.profileRetention !== true) {
            warnings.push("consent.profileRetention: profile cannot become active without retention consent.");
        }
        if (!(logistics.availability || []).length) {
            warnings.push("logistics.availability: opted-in applicant has no availability windows.");
        }
        if (!logistics.timezone) {
            warnings.push("logistics.timezone: opted-in applicant has no timezone.");
        }
    }

    if (status === "declined" && participation.requested === true) {
        errors.push("participation.requested: declined participation cannot be marked requested.");
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
        data: errors.length === 0 ? matchmaking : null
    };
}

module.exports = {
    validateMatchmakingIntake
};
