const {
    buildPairMatchResult
} = require("../pairs/buildPairMatchResult");

const {
    allPairs,
    commonPreference,
    findGroupAvailabilityOverlaps,
    hasFlexible
} = require("./groupUtils");

function addBlock(blockingConflicts, dimension, classification, reason, evidence = []) {
    blockingConflicts.push({
        dimension,
        classification,
        reason,
        evidence
    });
}

function evaluateGroupEligibility(profiles = [], options = {}) {
    const referenceDate = options.now
        ? new Date(options.now)
        : new Date();

    const blockingConflicts = [];
    const pairResults = [];
    const memberCount = profiles.length;

    if (memberCount < 3) {
        addBlock(
            blockingConflicts,
            "group_size",
            "blocked_by_group_size",
            "A candidate group requires at least three distinct members."
        );
    }

    const playerIds = profiles.map((profile) => profile?.playerId).filter(Boolean);
    if (new Set(playerIds).size !== profiles.length) {
        addBlock(
            blockingConflicts,
            "identity",
            "blocked_by_hard_conflict",
            "The candidate group contains duplicate or missing player IDs."
        );
    }

    for (const profile of profiles) {
        if (profile?.status !== "active") {
            addBlock(
                blockingConflicts,
                "profile_state",
                "not_currently_viable",
                `${profile?.identity?.displayName || profile?.playerId || "A member"} is not active.`,
                [`Current status: ${profile?.status || "unknown"}.`]
            );
        }

        const minimum = Number(profile?.groupPreferences?.minimumPlayers);
        const maximum = Number(profile?.groupPreferences?.maximumPlayers);

        if (Number.isFinite(minimum) && memberCount < minimum) {
            addBlock(
                blockingConflicts,
                "group_size",
                "blocked_by_group_size",
                `${profile.identity?.displayName || profile.playerId} requires at least ${minimum} players.`,
                [`Candidate group size: ${memberCount}.`]
            );
        }

        if (Number.isFinite(maximum) && memberCount > maximum) {
            addBlock(
                blockingConflicts,
                "group_size",
                "blocked_by_group_size",
                `${profile.identity?.displayName || profile.playerId} accepts no more than ${maximum} players.`,
                [`Candidate group size: ${memberCount}.`]
            );
        }
    }

    for (const [profileA, profileB] of allPairs(profiles)) {
        const result = buildPairMatchResult(profileA, profileB, {
            now: options.now,
            scoringModelVersion: options.scoringModelVersion || "1.0",
            thresholds: options.pairThresholds
        });

        pairResults.push(result);

        if (!result.eligibility.eligible) {
            for (const conflict of result.eligibility.blockingConflicts) {
                addBlock(
                    blockingConflicts,
                    conflict.dimension,
                    conflict.classification,
                    `Pair ${profileA.playerId} / ${profileB.playerId}: ${conflict.reason}`,
                    conflict.evidence || []
                );
            }
        }
    }

    const availabilityOverlaps = findGroupAvailabilityOverlaps(
        profiles,
        referenceDate
    );

    if (profiles.length >= 3 && availabilityOverlaps.length === 0) {
        addBlock(
            blockingConflicts,
            "schedule",
            "blocked_by_schedule",
            "No recurring availability window is shared by every member."
        );
    }

    const sharedFormats = commonPreference(
        profiles,
        ["logistics", "playFormats"]
    );

    const allFormatFlexible = profiles.every((profile) =>
        hasFlexible(profile.logistics?.playFormats || [])
    );

    if (
        profiles.length >= 3 &&
        sharedFormats.length === 0 &&
        !allFormatFlexible
    ) {
        addBlock(
            blockingConflicts,
            "format",
            "blocked_by_format",
            "The full group does not share a common play format."
        );
    }

    const sharedFrequencies = commonPreference(
        profiles,
        ["logistics", "frequencyPreferences"]
    );

    const allFrequencyFlexible = profiles.every((profile) =>
        hasFlexible(profile.logistics?.frequencyPreferences || [])
    );

    if (
        profiles.length >= 3 &&
        sharedFrequencies.length === 0 &&
        !allFrequencyFlexible
    ) {
        addBlock(
            blockingConflicts,
            "commitment",
            "blocked_by_commitment",
            "The full group does not share a common session frequency."
        );
    }

    const sharedCampaignLengths = commonPreference(
        profiles,
        ["commitment", "campaignLengths"]
    );

    const allLengthFlexible = profiles.every((profile) =>
        hasFlexible(profile.commitment?.campaignLengths || [])
    );

    if (
        profiles.length >= 3 &&
        sharedCampaignLengths.length === 0 &&
        !allLengthFlexible
    ) {
        addBlock(
            blockingConflicts,
            "commitment",
            "blocked_by_commitment",
            "The full group does not share a common campaign length."
        );
    }

    const status = blockingConflicts[0]?.classification || "eligible";

    return {
        eligible: blockingConflicts.length === 0,
        status,
        blockingConflicts,
        pairResults,
        evidence: {
            availabilityOverlaps,
            sharedFormats,
            sharedFrequencies,
            sharedCampaignLengths,
            memberCount
        }
    };
}

module.exports = {
    evaluateGroupEligibility
};
