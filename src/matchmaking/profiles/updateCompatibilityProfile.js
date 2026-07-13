const { buildCompatibilityProfile } = require("./buildCompatibilityProfile");

function updateCompatibilityProfile(existingProfile, canonicalIntake, metadata = {}) {
    if (!existingProfile || typeof existingProfile !== "object") {
        throw new TypeError("An existing compatibility profile is required.");
    }

    const rebuilt = buildCompatibilityProfile(canonicalIntake, {
        ...metadata,
        playerId: existingProfile.playerId,
        submissionId: metadata.submissionId || existingProfile.submissionId,
        contactRef: metadata.contactRef || existingProfile.identity?.contactRef,
        displayName: metadata.displayName || existingProfile.identity?.displayName,
        now: metadata.now,
        lastConfirmedAt: metadata.lastConfirmedAt || existingProfile.provenance?.lastConfirmedAt
    });

    if (!rebuilt) return null;

    const timestamp = rebuilt.provenance.updatedAt;
    const nextVersion = Number(existingProfile.provenance?.profileVersion || 1) + 1;

    return {
        ...rebuilt,
        provenance: {
            ...rebuilt.provenance,
            profileVersion: nextVersion,
            createdAt: existingProfile.provenance?.createdAt || rebuilt.provenance.createdAt,
            updatedAt: timestamp
        },
        lifecycle: {
            ...rebuilt.lifecycle,
            history: [
                ...(existingProfile.lifecycle?.history || []),
                {
                    status: rebuilt.status,
                    reason: "Profile rebuilt from updated canonical intake.",
                    timestamp
                }
            ]
        }
    };
}

module.exports = {
    updateCompatibilityProfile
};
