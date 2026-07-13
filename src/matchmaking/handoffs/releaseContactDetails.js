const {
    INTRODUCTION_STATUSES
} = require("./introductionStatus");

const {
    isoNow,
    appendHistory
} = require("./introductionUtils");

function verifyCurrentConsent(profile = {}, record = {}) {
    const errors = [];
    const playerId = profile.playerId;
    const expectedVersion = Number(record.profileVersions?.[playerId] || 0);
    const currentVersion = Number(profile.provenance?.profileVersion || 0);

    if (profile.status !== "active") {
        errors.push(`${playerId} is no longer active.`);
    }
    if (currentVersion !== expectedVersion) {
        errors.push(
            `${playerId} changed from profile version ${expectedVersion} to ${currentVersion}.`
        );
    }
    if (profile.consent?.contactForIntroduction !== true) {
        errors.push(`${playerId} no longer consents to contact release.`);
    }
    if (profile.consent?.matchmaking !== true) {
        errors.push(`${playerId} no longer consents to matchmaking.`);
    }

    return errors;
}

function releaseContactDetails(
    record = {},
    profiles = [],
    resolveContact,
    options = {}
) {
    if (record.status !== INTRODUCTION_STATUSES.APPROVED) {
        throw new Error(
            `Contact details cannot be released from status ${record.status}.`
        );
    }

    if (typeof resolveContact !== "function") {
        throw new TypeError("A contact resolver function is required.");
    }

    const consentErrors = profiles.flatMap((profile) =>
        verifyCurrentConsent(profile, record)
    );

    if (consentErrors.length > 0) {
        const error = new Error(
            `Current consent check failed:\n${consentErrors.join("\n")}`
        );
        error.consentErrors = consentErrors;
        throw error;
    }

    const releasedContacts = {};

    for (const profile of profiles) {
        const contact = resolveContact(profile.identity?.contactRef, profile);

        if (!contact) {
            throw new Error(
                `No contact detail could be resolved for ${profile.playerId}.`
            );
        }

        releasedContacts[profile.playerId] = {
            displayName: profile.identity?.displayName || profile.playerId,
            contact: String(contact)
        };
    }

    const timestamp = isoNow(options.now);
    const updated = {
        ...record,
        status: INTRODUCTION_STATUSES.CONTACT_RELEASED,
        releasedContacts,
        contactReleasedAt: timestamp
    };

    return appendHistory(updated, "contact_details_released", {
        now: timestamp,
        actor: options.actor || "operator",
        note: "Contact details released after all approvals and current consent verification."
    });
}

module.exports = {
    releaseContactDetails,
    verifyCurrentConsent
};
