function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function mergeMatchmakingAddendum(canonicalIntake = {}, mappedAddendum = {}) {
    const canonical = clone(canonicalIntake);
    const addendum = mappedAddendum.matchmaking || mappedAddendum;

    if (!canonical || typeof canonical !== "object") {
        throw new TypeError("Canonical intake must be an object.");
    }

    if (!addendum || typeof addendum !== "object") {
        throw new TypeError("Mapped matchmaking addendum must contain matchmaking data.");
    }

    const expectedReference = String(
        mappedAddendum.applicant?.submissionReference ||
        addendum.participation?.submissionReference ||
        ""
    ).trim();

    const existingReference = String(
        canonical.matchmaking?.participation?.submissionReference ||
        canonical.source?.subject ||
        ""
    ).trim();

    const diagnostics = [];
    if (expectedReference && existingReference && expectedReference !== existingReference) {
        diagnostics.push(
            `Addendum submission reference "${expectedReference}" does not match existing reference "${existingReference}".`
        );
    }

    canonical.matchmaking = clone(addendum);
    canonical.matchmaking.participation = {
        ...(canonical.matchmaking.participation || {}),
        source: "addendum_form",
        submissionReference: expectedReference || existingReference
    };

    canonical.diagnostics = canonical.diagnostics || {
        hasMinimumViableSignal: false,
        contradictionNotes: []
    };

    canonical.diagnostics.contradictionNotes = [
        ...(canonical.diagnostics.contradictionNotes || []),
        ...diagnostics
    ];

    return canonical;
}

module.exports = {
    mergeMatchmakingAddendum
};
