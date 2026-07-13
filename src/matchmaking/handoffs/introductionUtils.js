const crypto = require("crypto");

function isoNow(now) {
    if (now instanceof Date) return now.toISOString();
    if (typeof now === "string" && now.trim()) {
        return new Date(now).toISOString();
    }
    return new Date().toISOString();
}

function stableMembers(profiles = []) {
    return [...new Set(
        profiles.map((profile) => profile?.playerId).filter(Boolean)
    )].sort();
}

function introductionId(sourceMatchId, members = []) {
    const digest = crypto
        .createHash("sha256")
        .update(JSON.stringify({
            sourceMatchId: String(sourceMatchId || ""),
            members: [...members].sort()
        }))
        .digest("hex")
        .slice(0, 16);

    return `intro-${digest}`;
}

function appendHistory(record, event, options = {}) {
    const timestamp = isoNow(options.now);
    const actor = String(options.actor || "operator");
    const note = String(options.note || "").trim();

    return {
        ...record,
        updatedAt: timestamp,
        history: [
            ...(record.history || []),
            {
                event,
                actor,
                note,
                timestamp
            }
        ]
    };
}

function currentConsentSnapshot(profile = {}) {
    return {
        matchmaking: profile.consent?.matchmaking === true,
        profileRetention: profile.consent?.profileRetention === true,
        operatorReview: profile.consent?.operatorReview === true,
        contactForIntroduction:
            profile.consent?.contactForIntroduction === true,
        shareableSummary: profile.consent?.shareableSummary === true,
        profileVersion: Number(profile.provenance?.profileVersion || 1),
        capturedAt: ""
    };
}

module.exports = {
    isoNow,
    stableMembers,
    introductionId,
    appendHistory,
    currentConsentSnapshot
};
