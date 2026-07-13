const path = require("node:path");

function load(root, ...parts) {
  return require(path.join(root, ...parts));
}

function registerIntroductionHandlers({ ipcMain, getProjectRoot }) {
  function context() {
    const root = getProjectRoot();
    return {
      root,
      storageRoot: path.join(root, "matchmaking")
    };
  }

  function loadProfiles(root, storageRoot, memberIds = []) {
    const { loadCompatibilityProfile } = load(
      root,
      "src",
      "matchmaking",
      "storage",
      "loadCompatibilityProfile.js"
    );

    return memberIds.map(
      (playerId) =>
        loadCompatibilityProfile(playerId, { storageRoot }).profile
    );
  }

  ipcMain.handle("qf:listIntroductionRecords", () => {
    const { root, storageRoot } = context();
    const { listIntroductionRecords } = load(
      root,
      "src",
      "matchmaking",
      "storage",
      "listIntroductionRecords.js"
    );

    const result = listIntroductionRecords({ storageRoot });

    return {
      records: result.records.map((record) => ({
        introductionId: record.introductionId,
        status: record.status,
        members: record.members,
        matchType: record.sourceMatch.matchType,
        classification: record.sourceMatch.classification,
        score: record.sourceMatch.score,
        confidence: record.sourceMatch.confidence,
        updatedAt: record.updatedAt
      })),
      invalidRecords: result.invalidRecords
    };
  });

  ipcMain.handle("qf:getIntroductionRecord", (_event, introductionId) => {
    const { root, storageRoot } = context();
    const { loadIntroductionRecord } = load(
      root,
      "src",
      "matchmaking",
      "storage",
      "loadIntroductionRecord.js"
    );

    return loadIntroductionRecord(String(introductionId), {
      storageRoot
    });
  });

  ipcMain.handle("qf:createIntroductionDraft", (_event, sourceMatch) => {
    const { root, storageRoot } = context();
    const members = sourceMatch?.members || [];
    const profiles = loadProfiles(root, storageRoot, members);

    const { buildIntroductionRecord } = load(
      root,
      "src",
      "matchmaking",
      "handoffs",
      "buildIntroductionRecord.js"
    );
    const { saveIntroductionRecord } = load(
      root,
      "src",
      "matchmaking",
      "storage",
      "saveIntroductionRecord.js"
    );

    const record = buildIntroductionRecord(profiles, sourceMatch, {
      actor: "operator-console"
    });

    return saveIntroductionRecord(record, { storageRoot });
  });

  ipcMain.handle("qf:approveIntroduction", (_event, introductionId, note = "") => {
    const { root, storageRoot } = context();
    const { loadIntroductionRecord } = load(
      root,
      "src",
      "matchmaking",
      "storage",
      "loadIntroductionRecord.js"
    );
    const { saveIntroductionRecord } = load(
      root,
      "src",
      "matchmaking",
      "storage",
      "saveIntroductionRecord.js"
    );
    const { approveIntroduction } = load(
      root,
      "src",
      "matchmaking",
      "handoffs",
      "approveIntroduction.js"
    );

    const current = loadIntroductionRecord(
      String(introductionId),
      { storageRoot }
    ).record;

    const updated = approveIntroduction(current, {
      approvedBy: "operator-console",
      note
    });

    return saveIntroductionRecord(updated, { storageRoot });
  });

  ipcMain.handle(
    "qf:recordIntroductionParticipantResponse",
    (_event, introductionId, playerId, response, note = "") => {
      const { root, storageRoot } = context();
      const { loadIntroductionRecord } = load(
        root,
        "src",
        "matchmaking",
        "storage",
        "loadIntroductionRecord.js"
      );
      const { saveIntroductionRecord } = load(
        root,
        "src",
        "matchmaking",
        "storage",
        "saveIntroductionRecord.js"
      );
      const { recordParticipantResponse } = load(
        root,
        "src",
        "matchmaking",
        "handoffs",
        "recordParticipantResponse.js"
      );

      const current = loadIntroductionRecord(
        String(introductionId),
        { storageRoot }
      ).record;

      const updated = recordParticipantResponse(
        current,
        String(playerId),
        String(response),
        { note }
      );

      return saveIntroductionRecord(updated, { storageRoot });
    }
  );

  ipcMain.handle("qf:releaseIntroductionContacts", (_event, introductionId) => {
    const { root, storageRoot } = context();
    const { loadIntroductionRecord } = load(
      root,
      "src",
      "matchmaking",
      "storage",
      "loadIntroductionRecord.js"
    );
    const { saveIntroductionRecord } = load(
      root,
      "src",
      "matchmaking",
      "storage",
      "saveIntroductionRecord.js"
    );
    const { releaseContactDetails } = load(
      root,
      "src",
      "matchmaking",
      "handoffs",
      "releaseContactDetails.js"
    );

    const current = loadIntroductionRecord(
      String(introductionId),
      { storageRoot }
    ).record;
    const profiles = loadProfiles(root, storageRoot, current.members);

    // The current profile stores an opaque contactRef rather than raw contact data.
    // The console exposes that reference only after all approvals. A later contact
    // directory integration can replace this resolver without changing lifecycle logic.
    const updated = releaseContactDetails(
      current,
      profiles,
      (contactRef) => contactRef,
      { actor: "operator-console" }
    );

    return saveIntroductionRecord(updated, { storageRoot });
  });

  ipcMain.handle("qf:completeIntroduction", (_event, introductionId) => {
    const { root, storageRoot } = context();
    const { loadIntroductionRecord } = load(
      root,
      "src",
      "matchmaking",
      "storage",
      "loadIntroductionRecord.js"
    );
    const { saveIntroductionRecord } = load(
      root,
      "src",
      "matchmaking",
      "storage",
      "saveIntroductionRecord.js"
    );
    const { saveCompatibilityProfile } = load(
      root,
      "src",
      "matchmaking",
      "storage",
      "saveCompatibilityProfile.js"
    );
    const { completeIntroduction } = load(
      root,
      "src",
      "matchmaking",
      "handoffs",
      "completeIntroduction.js"
    );

    const current = loadIntroductionRecord(
      String(introductionId),
      { storageRoot }
    ).record;
    const profiles = loadProfiles(root, storageRoot, current.members);
    const completed = completeIntroduction(current, profiles, {
      actor: "operator-console"
    });

    for (const profile of completed.profiles) {
      saveCompatibilityProfile(profile, { storageRoot });
    }

    return saveIntroductionRecord(completed.record, { storageRoot });
  });

  ipcMain.handle("qf:declineIntroduction", (_event, introductionId, reason = "") => {
    const { root, storageRoot } = context();
    const { loadIntroductionRecord } = load(
      root,
      "src",
      "matchmaking",
      "storage",
      "loadIntroductionRecord.js"
    );
    const { saveIntroductionRecord } = load(
      root,
      "src",
      "matchmaking",
      "storage",
      "saveIntroductionRecord.js"
    );
    const { declineIntroduction } = load(
      root,
      "src",
      "matchmaking",
      "handoffs",
      "declineIntroduction.js"
    );

    const current = loadIntroductionRecord(
      String(introductionId),
      { storageRoot }
    ).record;
    const updated = declineIntroduction(current, {
      actor: "operator-console",
      reason
    });

    return saveIntroductionRecord(updated, { storageRoot });
  });

  ipcMain.handle("qf:archiveIntroduction", (_event, introductionId) => {
    const { root, storageRoot } = context();
    const { loadIntroductionRecord } = load(
      root,
      "src",
      "matchmaking",
      "storage",
      "loadIntroductionRecord.js"
    );
    const { saveIntroductionRecord } = load(
      root,
      "src",
      "matchmaking",
      "storage",
      "saveIntroductionRecord.js"
    );
    const { archiveIntroduction } = load(
      root,
      "src",
      "matchmaking",
      "handoffs",
      "archiveIntroduction.js"
    );

    const current = loadIntroductionRecord(
      String(introductionId),
      { storageRoot }
    ).record;
    const updated = archiveIntroduction(current, {
      actor: "operator-console"
    });

    return saveIntroductionRecord(updated, { storageRoot });
  });
}

module.exports = {
  registerIntroductionHandlers
};
