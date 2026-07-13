const fs = require("node:fs");
const path = require("node:path");

const DEMO_DATASET_ID = "questforge-matchmaking-demo-v1";

function load(root, ...parts) {
  return require(path.join(root, ...parts));
}

function safeJson(filePath, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

function listJson(directory) {
  try {
    return fs.readdirSync(directory)
      .filter((name) => name.endsWith(".json"))
      .sort();
  } catch {
    return [];
  }
}

function removeDirectory(directory) {
  fs.rmSync(directory, { recursive: true, force: true });
}

function demoRoot(projectRoot) {
  return path.join(projectRoot, "misc", "matchmaking-demo");
}

function readDemoWrappers(projectRoot) {
  const profileRoot = path.join(demoRoot(projectRoot), "profiles");

  return listJson(profileRoot).map((name) => {
    const filePath = path.join(profileRoot, name);
    const wrapper = safeJson(filePath, null);

    if (!wrapper || wrapper.fixture?.isDemo !== true || !wrapper.profile) {
      throw new Error(`Invalid demo wrapper: ${filePath}`);
    }

    if (wrapper.fixture.datasetId !== DEMO_DATASET_ID) {
      throw new Error(
        `Unexpected demo dataset "${wrapper.fixture.datasetId}" in ${filePath}`
      );
    }

    return {
      filePath,
      fixture: wrapper.fixture,
      profile: wrapper.profile
    };
  });
}

function demoPlayerIds(projectRoot) {
  try {
    return readDemoWrappers(projectRoot)
      .map((wrapper) => wrapper.profile.playerId)
      .filter(Boolean);
  } catch {
    return [];
  }
}

function isDemoPair(result, playerIds) {
  return (result?.members || []).some((member) => playerIds.has(member));
}

function clearDemoRuntimeData(projectRoot) {
  const storageRoot = path.join(projectRoot, "matchmaking");
  const ids = new Set(demoPlayerIds(projectRoot));
  const removedProfiles = [];
  const removedPairEvaluations = [];
  const removedGroupEvaluations = [];

  for (const playerId of ids) {
    const directory = path.join(storageRoot, "profiles", playerId);
    if (fs.existsSync(directory)) {
      removeDirectory(directory);
      removedProfiles.push(playerId);
    }
  }

  const pairRoot = path.join(storageRoot, "evaluations", "pairs");
  for (const name of listJson(pairRoot)) {
    const filePath = path.join(pairRoot, name);
    const result = safeJson(filePath, null);

    if (isDemoPair(result, ids)) {
      fs.rmSync(filePath, { force: true });
      removedPairEvaluations.push(name);
    }
  }

  const groupRoot = path.join(storageRoot, "evaluations", "groups");
  for (const name of listJson(groupRoot)) {
    const filePath = path.join(groupRoot, name);
    const result = safeJson(filePath, null);

    if (isDemoPair(result, ids)) {
      fs.rmSync(filePath, { force: true });
      removedGroupEvaluations.push(name);
    }
  }

  const { rebuildMatchmakingPoolIndex } = load(
    projectRoot,
    "src",
    "matchmaking",
    "storage",
    "rebuildMatchmakingPoolIndex.js"
  );

  const index = rebuildMatchmakingPoolIndex({ storageRoot });

  return {
    datasetId: DEMO_DATASET_ID,
    removedProfiles,
    removedPairEvaluations,
    removedGroupEvaluations,
    indexPath: index.filePath
  };
}

function loadDemoDataset(projectRoot) {
  const storageRoot = path.join(projectRoot, "matchmaking");
  const wrappers = readDemoWrappers(projectRoot);

  const { saveCompatibilityProfile } = load(
    projectRoot,
    "src",
    "matchmaking",
    "storage",
    "saveCompatibilityProfile.js"
  );
  const { rebuildMatchmakingPoolIndex } = load(
    projectRoot,
    "src",
    "matchmaking",
    "storage",
    "rebuildMatchmakingPoolIndex.js"
  );
  const { compareProfileAgainstPool } = load(
    projectRoot,
    "src",
    "matchmaking",
    "pool",
    "compareProfileAgainstPool.js"
  );

  // Remove prior records from this specific dataset before importing again.
  clearDemoRuntimeData(projectRoot);

  const importedProfiles = [];

  for (const wrapper of wrappers) {
    saveCompatibilityProfile(wrapper.profile, { storageRoot });
    importedProfiles.push({
      playerId: wrapper.profile.playerId,
      fixtureId: wrapper.fixture.fixtureId,
      scenarioTags: wrapper.fixture.scenarioTags || []
    });
  }

  rebuildMatchmakingPoolIndex({ storageRoot });

  // Comparing every active demo profile creates the complete pair set.
  for (const wrapper of wrappers) {
    if (wrapper.profile.status !== "active") continue;

    compareProfileAgainstPool(wrapper.profile, {
      storageRoot,
      scoringModelVersion: "1.0"
    });
  }

  const scenarioPath = path.join(
    demoRoot(projectRoot),
    "scenarios",
    "weak-link-group.json"
  );
  const groupScenario = safeJson(scenarioPath, null);
  let groupEvaluation = null;

  if (groupScenario?.members?.length >= 3) {
    const { loadCompatibilityProfile } = load(
      projectRoot,
      "src",
      "matchmaking",
      "storage",
      "loadCompatibilityProfile.js"
    );
    const { buildGroupMatchResult } = load(
      projectRoot,
      "src",
      "matchmaking",
      "groups",
      "buildGroupMatchResult.js"
    );
    const { validateGroupMatchResult } = load(
      projectRoot,
      "src",
      "matchmaking",
      "data",
      "validators",
      "validateGroupMatchResult.js"
    );

    const profiles = groupScenario.members.map(
      (playerId) =>
        loadCompatibilityProfile(playerId, { storageRoot }).profile
    );

    groupEvaluation = buildGroupMatchResult(profiles, {
      scoringModelVersion: "1.0"
    });

    const validation = validateGroupMatchResult(groupEvaluation);

    if (!validation.isValid) {
      throw new Error(
        `Demo group evaluation failed validation:\n${validation.errors.join("\n")}`
      );
    }

    const groupRoot = path.join(storageRoot, "evaluations", "groups");
    fs.mkdirSync(groupRoot, { recursive: true });
    fs.writeFileSync(
      path.join(groupRoot, `${groupEvaluation.matchId}.json`),
      `${JSON.stringify(groupEvaluation, null, 2)}\n`,
      "utf8"
    );
  }

  const pairCount = listJson(
    path.join(storageRoot, "evaluations", "pairs")
  ).filter((name) => {
    const result = safeJson(
      path.join(storageRoot, "evaluations", "pairs", name),
      null
    );
    return isDemoPair(
      result,
      new Set(importedProfiles.map((profile) => profile.playerId))
    );
  }).length;

  return {
    datasetId: DEMO_DATASET_ID,
    importedProfiles,
    pairEvaluationCount: pairCount,
    groupEvaluation: groupEvaluation
      ? {
          matchId: groupEvaluation.matchId,
          classification: groupEvaluation.classification,
          score: groupEvaluation.score?.overall ?? null
        }
      : null
  };
}

function registerMatchmakingHandlers({ ipcMain, getProjectRoot }) {
  ipcMain.handle("qf:getMatchmakingOverview", () => {
    const root = getProjectRoot();
    const storageRoot = path.join(root, "matchmaking");
    const { getActiveProfiles } = load(
      root,
      "src",
      "matchmaking",
      "pool",
      "getActiveProfiles.js"
    );
    const pool = getActiveProfiles({ storageRoot });
    const allProfiles = load(
      root,
      "src",
      "matchmaking",
      "storage",
      "listCompatibilityProfiles.js"
    ).listCompatibilityProfiles({ storageRoot });
    const pairFiles = listJson(
      path.join(storageRoot, "evaluations", "pairs")
    );
    const pairs = pairFiles.map((name) =>
      safeJson(path.join(storageRoot, "evaluations", "pairs", name), {})
    );
    const groupFiles = listJson(
      path.join(storageRoot, "evaluations", "groups")
    );
    const introductionFiles = listJson(
      path.join(storageRoot, "introductions")
    );
    const statuses = allProfiles.profiles.reduce((map, profile) => {
      map[profile.status] = (map[profile.status] || 0) + 1;
      return map;
    }, {});

    const demoIds = new Set(demoPlayerIds(root));
    const demoProfiles = allProfiles.profiles.filter((profile) =>
      demoIds.has(profile.playerId)
    ).length;

    return {
      counts: {
        active: pool.activeProfiles.length,
        paused: statuses.paused || 0,
        invalid: allProfiles.invalidProfiles.length,
        pairEvaluations: pairs.length,
        strongPairs: pairs.filter(
          (pair) => pair.classification === "strong_match"
        ).length,
        blockedPairs: pairs.filter(
          (pair) => pair.eligibility?.eligible === false
        ).length,
        stalePairs: 0,
        groupEvaluations: groupFiles.length,
        introductions: introductionFiles.length,
        demoProfiles
      },
      demo: {
        datasetAvailable: fs.existsSync(demoRoot(root)),
        loadedProfiles: demoProfiles,
        datasetId: DEMO_DATASET_ID
      }
    };
  });

  ipcMain.handle("qf:listMatchmakingProfiles", () => {
    const root = getProjectRoot();
    const storageRoot = path.join(root, "matchmaking");
    const { listCompatibilityProfiles } = load(
      root,
      "src",
      "matchmaking",
      "storage",
      "listCompatibilityProfiles.js"
    );
    const result = listCompatibilityProfiles({ storageRoot });
    const demoIds = new Set(demoPlayerIds(root));

    return {
      profiles: result.profiles.map((profile) => ({
        playerId: profile.playerId,
        displayName: profile.identity?.displayName,
        status: profile.status,
        timezone: profile.logistics?.timezone,
        playFormats: profile.logistics?.playFormats || [],
        completeness: profile.completeness?.percentage || 0,
        profileVersion: profile.provenance?.profileVersion || 1,
        isDemo: demoIds.has(profile.playerId)
      })),
      invalidProfiles: result.invalidProfiles
    };
  });

  ipcMain.handle("qf:getMatchmakingProfile", (_event, playerId) => {
    const root = getProjectRoot();
    const storageRoot = path.join(root, "matchmaking");
    const { loadCompatibilityProfile } = load(
      root,
      "src",
      "matchmaking",
      "storage",
      "loadCompatibilityProfile.js"
    );
    return loadCompatibilityProfile(String(playerId), { storageRoot });
  });

  ipcMain.handle("qf:listPairEvaluations", () => {
    const root = getProjectRoot();
    const directory = path.join(
      root,
      "matchmaking",
      "evaluations",
      "pairs"
    );
    const demoIds = new Set(demoPlayerIds(root));
    const evaluations = listJson(directory)
      .map((name) => safeJson(path.join(directory, name), null))
      .filter(Boolean)
      .map((pair) => ({
        matchId: pair.matchId,
        members: pair.members || [],
        classification: pair.classification,
        score: pair.score?.overall ?? null,
        confidence: pair.score?.confidence || "insufficient",
        evaluatedAt: pair.provenance?.evaluatedAt || "",
        isDemo: (pair.members || []).some((member) => demoIds.has(member))
      }));

    evaluations.sort(
      (a, b) =>
        (b.score ?? -1) - (a.score ?? -1) ||
        a.matchId.localeCompare(b.matchId)
    );

    return { evaluations };
  });

  ipcMain.handle("qf:getPairEvaluation", (_event, matchId) => {
    const root = getProjectRoot();
    const storageRoot = path.join(root, "matchmaking");
    const { loadPairEvaluation } = load(
      root,
      "src",
      "matchmaking",
      "storage",
      "loadPairEvaluation.js"
    );
    return loadPairEvaluation(String(matchId), { storageRoot });
  });

  ipcMain.handle("qf:rebuildMatchmakingPool", () => {
    const root = getProjectRoot();
    const storageRoot = path.join(root, "matchmaking");
    const { rebuildMatchmakingPoolIndex } = load(
      root,
      "src",
      "matchmaking",
      "storage",
      "rebuildMatchmakingPoolIndex.js"
    );
    return rebuildMatchmakingPoolIndex({ storageRoot });
  });

  ipcMain.handle("qf:compareProfileAgainstPool", (_event, playerId) => {
    const root = getProjectRoot();
    const storageRoot = path.join(root, "matchmaking");
    const { loadCompatibilityProfile } = load(
      root,
      "src",
      "matchmaking",
      "storage",
      "loadCompatibilityProfile.js"
    );
    const { compareProfileAgainstPool } = load(
      root,
      "src",
      "matchmaking",
      "pool",
      "compareProfileAgainstPool.js"
    );
    const loaded = loadCompatibilityProfile(String(playerId), {
      storageRoot
    });
    return compareProfileAgainstPool(loaded.profile, {
      storageRoot,
      scoringModelVersion: "1.0"
    });
  });

  ipcMain.handle("qf:buildGroupEvaluation", (_event, playerIds = []) => {
    const root = getProjectRoot();
    const storageRoot = path.join(root, "matchmaking");
    const { loadCompatibilityProfile } = load(
      root,
      "src",
      "matchmaking",
      "storage",
      "loadCompatibilityProfile.js"
    );
    const { buildGroupMatchResult } = load(
      root,
      "src",
      "matchmaking",
      "groups",
      "buildGroupMatchResult.js"
    );
    const profiles = [...new Set(playerIds.map(String))].map(
      (id) => loadCompatibilityProfile(id, { storageRoot }).profile
    );
    return buildGroupMatchResult(profiles, {
      scoringModelVersion: "1.0"
    });
  });

  ipcMain.handle("qf:loadMatchmakingDemoDataset", () =>
    loadDemoDataset(getProjectRoot())
  );

  ipcMain.handle("qf:clearMatchmakingDemoDataset", () =>
    clearDemoRuntimeData(getProjectRoot())
  );
}

module.exports = {
  registerMatchmakingHandlers,
  loadDemoDataset,
  clearDemoRuntimeData
};
