const PROFILE_STATUSES = Object.freeze({
    ACTIVE: "active",
    PAUSED: "paused",
    MATCHED: "matched",
    ARCHIVED: "archived",
    EXPIRED: "expired"
});

const VALID_STATUSES = new Set(Object.values(PROFILE_STATUSES));

function isoNow(now) {
    if (now instanceof Date) return now.toISOString();
    if (typeof now === "string" && now.trim()) return new Date(now).toISOString();
    return new Date().toISOString();
}

function transitionProfile(profile, status, options = {}) {
    if (!profile || typeof profile !== "object") {
        throw new TypeError("A compatibility profile is required.");
    }
    if (!VALID_STATUSES.has(status)) {
        throw new Error(`Unsupported profile status: ${status}`);
    }

    const timestamp = isoNow(options.now);
    const reason = String(options.reason || "").trim();
    const version = Number(profile.provenance?.profileVersion || 1) + 1;

    return {
        ...profile,
        status,
        statusReason: reason,
        provenance: {
            ...(profile.provenance || {}),
            profileVersion: version,
            updatedAt: timestamp,
            lastConfirmedAt: options.confirmed === true
                ? timestamp
                : profile.provenance?.lastConfirmedAt || ""
        },
        lifecycle: {
            ...(profile.lifecycle || {}),
            statusChangedAt: timestamp,
            matchedReference: status === PROFILE_STATUSES.MATCHED
                ? String(options.matchReference || "").trim()
                : profile.lifecycle?.matchedReference || "",
            history: [
                ...(profile.lifecycle?.history || []),
                { status, reason, timestamp }
            ]
        }
    };
}

function activateProfile(profile, options = {}) {
    if (profile.consent?.matchmaking !== true || profile.consent?.profileRetention !== true) {
        throw new Error("Profile cannot be activated without matchmaking and retention consent.");
    }
    if ((profile.completeness?.missingRequiredFields || []).length > 0) {
        throw new Error("Profile cannot be activated while required fields are missing.");
    }
    return transitionProfile(profile, PROFILE_STATUSES.ACTIVE, options);
}

function pauseProfile(profile, reason = "", options = {}) {
    return transitionProfile(profile, PROFILE_STATUSES.PAUSED, { ...options, reason });
}

function markProfileMatched(profile, matchReference, options = {}) {
    return transitionProfile(profile, PROFILE_STATUSES.MATCHED, {
        ...options,
        reason: options.reason || "Applicant joined a group.",
        matchReference
    });
}

function archiveProfile(profile, reason = "", options = {}) {
    return transitionProfile(profile, PROFILE_STATUSES.ARCHIVED, { ...options, reason });
}

function expireProfile(profile, reason = "Profile requires reconfirmation.", options = {}) {
    return transitionProfile(profile, PROFILE_STATUSES.EXPIRED, { ...options, reason });
}

function reconfirmProfile(profile, options = {}) {
    const timestamp = isoNow(options.now);
    return {
        ...profile,
        provenance: {
            ...(profile.provenance || {}),
            profileVersion: Number(profile.provenance?.profileVersion || 1) + 1,
            updatedAt: timestamp,
            lastConfirmedAt: timestamp
        }
    };
}

module.exports = {
    PROFILE_STATUSES,
    transitionProfile,
    activateProfile,
    pauseProfile,
    markProfileMatched,
    archiveProfile,
    expireProfile,
    reconfirmProfile
};
