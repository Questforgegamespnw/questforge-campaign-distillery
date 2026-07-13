const {
    intersection,
    normalizeSet,
    findAvailabilityOverlaps,
    numericRangeOverlap,
    arraysConflict,
    profileLabel
} = require("./pairUtils");

const INACTIVE_CLASSIFICATIONS = Object.freeze({
    paused: "not_currently_viable",
    matched: "not_currently_viable",
    archived: "not_currently_viable",
    expired: "not_currently_viable"
});

function addBlock(blockingConflicts, dimension, classification, reason, evidence = []) {
    blockingConflicts.push({
        dimension,
        classification,
        reason,
        evidence
    });
}

function hasFlexible(values = []) {
    const normalized = normalizeSet(values);
    return normalized.has("flexible") || normalized.has("either") || normalized.has("any");
}

function evaluatePairEligibility(profileA = {}, profileB = {}, options = {}) {
    const referenceDate = options.referenceDate
        ? new Date(options.referenceDate)
        : new Date();

    const blockingConflicts = [];
    const labels = [profileLabel(profileA), profileLabel(profileB)];

    for (const profile of [profileA, profileB]) {
        if (profile.status !== "active") {
            addBlock(
                blockingConflicts,
                "profile_state",
                INACTIVE_CLASSIFICATIONS[profile.status] || "not_currently_viable",
                `${profileLabel(profile)} is not in active matchmaking status.`,
                [`Current status: ${profile.status || "unknown"}.`]
            );
        }

        if (profile.consent?.matchmaking !== true) {
            addBlock(
                blockingConflicts,
                "consent",
                "blocked_by_hard_conflict",
                `${profileLabel(profile)} has not provided matchmaking consent.`
            );
        }

        if (profile.consent?.profileRetention !== true) {
            addBlock(
                blockingConflicts,
                "consent",
                "blocked_by_hard_conflict",
                `${profileLabel(profile)} has not provided profile-retention consent.`
            );
        }

        if (profile.consent?.operatorReview !== true) {
            addBlock(
                blockingConflicts,
                "consent",
                "blocked_by_hard_conflict",
                `${profileLabel(profile)} has not provided operator-review consent.`
            );
        }
    }

    const formatOverlap = intersection(
        profileA.logistics?.playFormats,
        profileB.logistics?.playFormats
    );

    if (
        formatOverlap.length === 0 &&
        !hasFlexible(profileA.logistics?.playFormats) &&
        !hasFlexible(profileB.logistics?.playFormats)
    ) {
        addBlock(
            blockingConflicts,
            "format",
            "blocked_by_format",
            "The applicants do not share a compatible play format.",
            [
                `${labels[0]}: ${(profileA.logistics?.playFormats || []).join(", ") || "not supplied"}.`,
                `${labels[1]}: ${(profileB.logistics?.playFormats || []).join(", ") || "not supplied"}.`
            ]
        );
    }

    const overlaps = findAvailabilityOverlaps(profileA, profileB, referenceDate);
    if (overlaps.length === 0) {
        addBlock(
            blockingConflicts,
            "schedule",
            "blocked_by_schedule",
            "No recurring availability overlap was found."
        );
    }

    const durationOverlap = numericRangeOverlap(
        profileA.logistics?.sessionDuration?.minimumHours,
        profileA.logistics?.sessionDuration?.maximumHours,
        profileB.logistics?.sessionDuration?.minimumHours,
        profileB.logistics?.sessionDuration?.maximumHours
    );

    if (
        durationOverlap === null &&
        [
            profileA.logistics?.sessionDuration?.minimumHours,
            profileA.logistics?.sessionDuration?.maximumHours,
            profileB.logistics?.sessionDuration?.minimumHours,
            profileB.logistics?.sessionDuration?.maximumHours
        ].every((value) => value !== null && value !== undefined)
    ) {
        addBlock(
            blockingConflicts,
            "schedule",
            "blocked_by_schedule",
            "The applicants' acceptable session-duration ranges do not overlap."
        );
    }

    const frequencyOverlap = intersection(
        profileA.logistics?.frequencyPreferences,
        profileB.logistics?.frequencyPreferences
    );

    if (
        frequencyOverlap.length === 0 &&
        !hasFlexible(profileA.logistics?.frequencyPreferences) &&
        !hasFlexible(profileB.logistics?.frequencyPreferences)
    ) {
        addBlock(
            blockingConflicts,
            "commitment",
            "blocked_by_commitment",
            "The applicants do not share an acceptable session frequency."
        );
    }

    const campaignLengthOverlap = intersection(
        profileA.commitment?.campaignLengths,
        profileB.commitment?.campaignLengths
    );

    if (
        campaignLengthOverlap.length === 0 &&
        !hasFlexible(profileA.commitment?.campaignLengths) &&
        !hasFlexible(profileB.commitment?.campaignLengths)
    ) {
        addBlock(
            blockingConflicts,
            "commitment",
            "blocked_by_commitment",
            "The applicants do not share an acceptable campaign length."
        );
    }

    const groupRange = numericRangeOverlap(
        profileA.groupPreferences?.minimumPlayers,
        profileA.groupPreferences?.maximumPlayers,
        profileB.groupPreferences?.minimumPlayers,
        profileB.groupPreferences?.maximumPlayers
    );

    if (
        groupRange === null &&
        [
            profileA.groupPreferences?.minimumPlayers,
            profileA.groupPreferences?.maximumPlayers,
            profileB.groupPreferences?.minimumPlayers,
            profileB.groupPreferences?.maximumPlayers
        ].every((value) => value !== null && value !== undefined)
    ) {
        addBlock(
            blockingConflicts,
            "group_size",
            "blocked_by_hard_conflict",
            "The applicants' acceptable final group-size ranges do not overlap."
        );
    }

    const safetyConflicts = [
        ...arraysConflict(profileA.requirements?.mustHaves, profileB.safety?.hardExclusions),
        ...arraysConflict(profileB.requirements?.mustHaves, profileA.safety?.hardExclusions),
        ...arraysConflict(
            profileA.requirements?.hardConstraints?.content,
            profileB.requirements?.mustHaves
        ),
        ...arraysConflict(
            profileB.requirements?.hardConstraints?.content,
            profileA.requirements?.mustHaves
        )
    ];

    if (safetyConflicts.length > 0) {
        addBlock(
            blockingConflicts,
            "safety",
            "blocked_by_hard_conflict",
            "A required campaign element conflicts with a hard content exclusion.",
            [...new Set(safetyConflicts)]
        );
    }

    const systemConflicts = [
        ...arraysConflict(profileA.systems?.preferred, profileB.systems?.excluded),
        ...arraysConflict(profileB.systems?.preferred, profileA.systems?.excluded),
        ...arraysConflict(
            profileA.requirements?.hardConstraints?.system,
            profileB.systems?.excluded
        ),
        ...arraysConflict(
            profileB.requirements?.hardConstraints?.system,
            profileA.systems?.excluded
        )
    ];

    if (systemConflicts.length > 0) {
        addBlock(
            blockingConflicts,
            "systems",
            "blocked_by_hard_conflict",
            "A required or preferred system is explicitly excluded by the other applicant.",
            [...new Set(systemConflicts)]
        );
    }

    const directConstraintCategories = [
        ["format", "format"],
        ["schedule", "schedule"],
        ["commitment", "commitment"],
        ["tableCulture", "table culture"]
    ];

    for (const [key, label] of directConstraintCategories) {
        const direct = intersection(
            profileA.requirements?.hardConstraints?.[key],
            profileB.requirements?.hardConstraints?.[key]
        );

        // Identical constraints are normally alignment rather than conflict.
        // Exact conflicts require explicit negation in one profile.
        const aValues = [...normalizeSet(profileA.requirements?.hardConstraints?.[key])];
        const bValues = [...normalizeSet(profileB.requirements?.hardConstraints?.[key])];
        const negated = [];

        for (const value of aValues) {
            const withoutNo = value.replace(/^(no|not|avoid)_/, "");
            if (bValues.includes(`no_${withoutNo}`) || bValues.includes(`avoid_${withoutNo}`)) {
                negated.push(withoutNo);
            }
        }
        for (const value of bValues) {
            const withoutNo = value.replace(/^(no|not|avoid)_/, "");
            if (aValues.includes(`no_${withoutNo}`) || aValues.includes(`avoid_${withoutNo}`)) {
                negated.push(withoutNo);
            }
        }

        if (negated.length > 0) {
            addBlock(
                blockingConflicts,
                key,
                key === "schedule"
                    ? "blocked_by_schedule"
                    : key === "commitment"
                        ? "blocked_by_commitment"
                        : "blocked_by_hard_conflict",
                `The applicants have directly incompatible ${label} requirements.`,
                [...new Set(negated)]
            );
        }
    }

    const classification = blockingConflicts[0]?.classification || "eligible";

    return {
        eligible: blockingConflicts.length === 0,
        status: classification,
        blockingConflicts,
        evidence: {
            availabilityOverlaps: overlaps,
            formatOverlap,
            frequencyOverlap,
            campaignLengthOverlap,
            durationOverlap,
            groupRange
        }
    };
}

module.exports = {
    evaluatePairEligibility
};
