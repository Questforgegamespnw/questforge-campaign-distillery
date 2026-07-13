const { app, BrowserWindow, ipcMain, shell, clipboard } = require("electron");
const path = require("node:path");
const fs = require("node:fs");
const { spawn } = require("node:child_process");
const { registerMatchmakingHandlers } = require("./ipc/matchmakingHandlers");
const { registerIntroductionHandlers } = require("./ipc/introductionHandlers");

const isDev = !app.isPackaged;

function defaultProjectRoot() {
  // operator-console/electron/main.js -> questforge-campaign-distillery/
  return path.resolve(__dirname, "..", "..");
}

function settingsPath() {
  return path.join(app.getPath("userData"), "settings.json");
}

function readSettings() {
  try {
    return JSON.parse(fs.readFileSync(settingsPath(), "utf8"));
  } catch {
    return {};
  }
}

function writeSettings(settings) {
  fs.mkdirSync(path.dirname(settingsPath()), { recursive: true });
  fs.writeFileSync(settingsPath(), `${JSON.stringify(settings, null, 2)}\n`, "utf8");
}

function getProjectRoot() {
  return readSettings().projectRoot || defaultProjectRoot();
}

function assertInsideProjectRoot(filePath) {
  const root = path.resolve(getProjectRoot());
  const resolved = path.resolve(root, filePath);
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
    throw new Error(`Path is outside project root: ${filePath}`);
  }
  return resolved;
}

function safeJson(filePath, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

function safeText(filePath, fallback = "") {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return fallback;
  }
}

function fileInfo(filePath) {
  const exists = fs.existsSync(filePath);
  return {
    path: filePath,
    exists,
    basename: path.basename(filePath),
    size: exists ? fs.statSync(filePath).size : 0
  };
}

function firstPdfIn(directory) {
  try {
    const found = fs.readdirSync(directory)
      .filter((name) => name.toLowerCase().endsWith(".pdf"))
      .sort()[0];
    return found ? path.join(directory, found) : "";
  } catch {
    return "";
  }
}

function firstExistingFile(candidates = []) {
  return candidates.find((candidate) => candidate && fs.existsSync(candidate)) || candidates[0] || "";
}

function findLegacySubmissionFiles(recordsRoot, slug) {
  try {
    const files = fs.readdirSync(recordsRoot)
      .filter((name) => name.toLowerCase().endsWith(".json"))
      .sort();

    const raw = files.find((name) =>
      !name.toLowerCase().endsWith(".result.json") &&
      !/^\d+_/.test(name) &&
      name !== "submission-status.json"
    );

    const result = files.find((name) => name.toLowerCase().endsWith(".result.json"));

    return {
      raw: raw ? path.join(recordsRoot, raw) : path.join(recordsRoot, `${slug}.json`),
      result: result ? path.join(recordsRoot, result) : path.join(recordsRoot, `${slug}.result.json`)
    };
  } catch {
    return {
      raw: path.join(recordsRoot, `${slug}.json`),
      result: path.join(recordsRoot, `${slug}.result.json`)
    };
  }
}

function listPhase2Directions(phase2Root) {
  try {
    return fs.readdirSync(phase2Root, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();
  } catch {
    return [];
  }
}



function detectRecoveryState(pipelineResultPath) {
  const result = safeJson(pipelineResultPath, null);
  const errors = result?.validation?.errors || [];
  const invalidCanonicalIntake = Boolean(
    result?.error === "Invalid canonical intake" ||
    errors.some((error) => /unexpected property|missing required property|Invalid canonical intake/i.test(String(error)))
  );

  return {
    invalidCanonicalIntake,
    error: result?.error || "",
    errors: Array.isArray(errors) ? errors : []
  };
}

function buildSnapshot(slug) {
  const root = getProjectRoot();
  const recordsRoot = path.join(root, "submissions", slug);
  const exportsRoot = path.join(root, "exports", "submissions", slug);
  const phase1Root = path.join(exportsRoot, "phase-1");
  const phase1RoundTrip = path.join(phase1Root, "round-trip");
  const phase1Delivery = path.join(phase1Root, "client-delivery");
  const phase2Root = path.join(exportsRoot, "phase-2");

  const legacy = findLegacySubmissionFiles(recordsRoot, slug);
  const canonicalRaw = path.join(recordsRoot, "00_RAW_SUBMISSION.json");
  const canonicalNormalized = path.join(recordsRoot, "01_NORMALIZED_SUBMISSION.json");
  const canonicalResult = path.join(recordsRoot, "02_PIPELINE_RESULT.json");
  const effectiveRaw = firstExistingFile([canonicalRaw, legacy.raw]);
  const effectivePipelineResult = firstExistingFile([canonicalResult, legacy.result]);
  const recovery = detectRecoveryState(effectivePipelineResult);
  const statusPath = path.join(recordsRoot, "submission-status.json");
  const phase1RoundTripStatusPath = path.join(phase1RoundTrip, "round-trip-status.json");
  const legacyMode = !fs.existsSync(statusPath) && (fs.existsSync(legacy.raw) || fs.existsSync(legacy.result));

  const phase2Directions = listPhase2Directions(phase2Root).map((direction) => {
    const directionRoot = path.join(phase2Root, direction);
    const roundTrip = path.join(directionRoot, "round-trip");
    const delivery = path.join(directionRoot, "client-delivery");
    return {
      direction,
      root: directionRoot,
      roundTrip,
      delivery,
      status: safeJson(path.join(roundTrip, "round-trip-status.json"), null),
      files: {
        handoff: fileInfo(path.join(roundTrip, "00_PHASE2_HANDOFF.json")),
        prompt: fileInfo(path.join(roundTrip, "01_CAMPAIGN_CONCEPT_PROMPT.md")),
        response: fileInfo(path.join(roundTrip, "02_PASTE_CHATGPT_RESPONSE_HERE.json")),
        validation: fileInfo(path.join(roundTrip, "03_VALIDATION_RESULT.json")),
        validated: fileInfo(path.join(roundTrip, "04_VALIDATED_CAMPAIGN_CONCEPTS.json")),
        summary: fileInfo(path.join(roundTrip, "05_VALIDATION_SUMMARY.txt")),
        pdf: fileInfo(firstPdfIn(delivery))
      },
      validationSummary: safeText(path.join(roundTrip, "05_VALIDATION_SUMMARY.txt"), "")
    };
  });

  return {
    slug,
    projectRoot: root,
    recordsRoot,
    exportsRoot,
    status: safeJson(statusPath, null),
    phase1RoundTripStatus: safeJson(phase1RoundTripStatusPath, null),
    phase1ValidationSummary: safeText(path.join(phase1RoundTrip, "05_VALIDATION_SUMMARY.txt"), ""),
    legacyMode,
    recovery,
    paths: {
      rawSubmission: effectiveRaw,
      normalizedSubmission: canonicalNormalized,
      pipelineResult: effectivePipelineResult,
      canonicalRawSubmission: canonicalRaw,
      canonicalNormalizedSubmission: canonicalNormalized,
      canonicalPipelineResult: canonicalResult,
      legacyRawSubmission: legacy.raw,
      legacyPipelineResult: legacy.result,
      submissionStatus: statusPath,
      phase1Root,
      phase1RoundTrip,
      phase1Delivery,
      identitySelectionRecord: path.join(phase1Root, "identity-selection-record.json"),
      phase2Root
    },
    files: {
      rawSubmission: fileInfo(effectiveRaw),
      canonicalRawSubmission: fileInfo(canonicalRaw),
      legacyRawSubmission: fileInfo(legacy.raw),
      normalizedSubmission: fileInfo(canonicalNormalized),
      pipelineResult: fileInfo(effectivePipelineResult),
      canonicalPipelineResult: fileInfo(canonicalResult),
      legacyPipelineResult: fileInfo(legacy.result),
      submissionStatus: fileInfo(statusPath),
      phase1Prompt: fileInfo(path.join(phase1RoundTrip, "01_IDENTITY_POLISH_PROMPT.md")),
      phase1Response: fileInfo(path.join(phase1RoundTrip, "02_PASTE_CHATGPT_RESPONSE_HERE.json")),
      phase1Validation: fileInfo(path.join(phase1RoundTrip, "03_VALIDATION_RESULT.json")),
      phase1Validated: fileInfo(path.join(phase1RoundTrip, "04_VALIDATED_IDENTITY_PITCHES.json")),
      phase1Enriched: fileInfo(path.join(phase1RoundTrip, "05_ENRICHED_IDENTITY_PITCHES.json")),
      phase1Summary: fileInfo(path.join(phase1RoundTrip, "05_VALIDATION_SUMMARY.txt")),
      phase1Pdf: fileInfo(firstPdfIn(phase1Delivery)),
      identitySelectionRecord: fileInfo(path.join(phase1Root, "identity-selection-record.json"))
    },
    phase2Directions
  };
}

function runNodeScript(scriptPath, args = []) {
  const root = getProjectRoot();
  const nodeExecutable = process.platform === "win32" ? "node.exe" : "node";

  return new Promise((resolve) => {
    const startedAt = Date.now();
    const child = spawn(nodeExecutable, [scriptPath, ...args], {
      cwd: root,
      shell: false,
      env: process.env
    });

    let stdout = "";
    let stderr = "";
    let settled = false;

    function finish(payload) {
      if (settled) return;
      settled = true;
      resolve({
        ...payload,
        command: [nodeExecutable, scriptPath, ...args].join(" "),
        durationMs: Date.now() - startedAt
      });
    }

    child.stdout?.on("data", (chunk) => { stdout += chunk.toString(); });
    child.stderr?.on("data", (chunk) => { stderr += chunk.toString(); });

    child.on("error", (error) => {
      finish({
        ok: false,
        code: -1,
        stdout,
        stderr: `${stderr}${stderr ? "\n" : ""}${error.message}`
      });
    });

    child.on("close", (code) => {
      finish({ ok: code === 0, code, stdout, stderr });
    });
  });
}

function relativeToProject(filePath) {
  const root = getProjectRoot();
  return path.relative(root, path.resolve(filePath));
}

async function handleAction(action = {}) {
  const root = getProjectRoot();
  const slug = action.slug || "";
  const direction = action.direction || "primary";
  const clientName = action.clientName || "";
  const reference = action.reference || "";

  const scripts = {
    processSubmission: path.join(root, "scripts", "workflows", "runSubmission.js"),
    preparePhase1: path.join(root, "scripts", "phase1", "prepareIdentityPolishRoundTrip.js"),
    completePhase1: path.join(root, "scripts", "phase1", "completeIdentityPolishRoundTrip.js"),
    exportPhase1Pdf: path.join(root, "scripts", "phase1", "exportIdentityPitchPdf.js"),
    buildIdentityPitchHandoff: path.join(root, "scripts", "phase1", "buildIdentityPitchHandoff.js"),
    createIdentitySelectionRecord: path.join(root, "scripts", "phase1", "createIdentitySelectionRecord.js"),
    preparePhase2: path.join(root, "scripts", "phase2", "prepareCampaignConceptRoundTrip.js"),
    completePhase2: path.join(root, "scripts", "phase2", "completeCampaignConceptRoundTrip.js"),
    exportPhase2Pdf: path.join(root, "scripts", "phase2", "exportCampaignConceptPdf.js")
  };

  const paths = slug ? buildSnapshot(slug).paths : {};
  const phase1RoundTrip = slug ? paths.phase1RoundTrip : "";
  const phase2RoundTrip = slug ? path.join(paths.phase2Root, direction, "round-trip") : "";

  switch (action.type) {
    case "processSubmission": {
      const snapshot = slug ? buildSnapshot(slug) : null;
      const inputFile = action.inputFile ||
        (snapshot?.files.rawSubmission.exists ? snapshot.paths.rawSubmission : "") ||
        path.join(root, "operator-console", "staging", `${slug}.input.json`);
      return runNodeScript(scripts.processSubmission, [relativeToProject(inputFile), "--submission-slug", slug]);
    }
    case "preparePhase1":
      return runNodeScript(scripts.preparePhase1, [relativeToProject(paths.pipelineResult), "--submission-slug", slug]);
    case "completePhase1":
      return runNodeScript(scripts.completePhase1, [relativeToProject(phase1RoundTrip)]);
    case "exportPhase1Pdf": {
      const args = [relativeToProject(path.join(phase1RoundTrip, "04_VALIDATED_IDENTITY_PITCHES.json"))];
      if (clientName) args.push("--client", clientName);
      if (reference) args.push("--reference", reference);
      return runNodeScript(scripts.exportPhase1Pdf, args);
    }
    case "buildIdentityPitchHandoff": {
      const args = [relativeToProject(path.join(phase1RoundTrip, "04_VALIDATED_IDENTITY_PITCHES.json")), "--submission-slug", slug];
      return runNodeScript(scripts.buildIdentityPitchHandoff, args);
    }
    case "createIdentitySelectionRecord": {
      const enrichedIdentityPitches = path.join(phase1RoundTrip, "05_ENRICHED_IDENTITY_PITCHES.json");
      const fallbackValidatedPitches = path.join(phase1RoundTrip, "04_VALIDATED_IDENTITY_PITCHES.json");
      const identitySelectionSource = fs.existsSync(enrichedIdentityPitches)
        ? enrichedIdentityPitches
        : fallbackValidatedPitches;
      const args = [relativeToProject(identitySelectionSource), "--direction", direction, "--submission-slug", slug];
      if (action.selectedBy) args.push("--selected-by", action.selectedBy);
      if (action.notes) args.push("--notes", action.notes);
      if (action.liked) args.push("--liked", action.liked);
      if (action.concerns) args.push("--concerns", action.concerns);
      if (action.requestedAdjustments) args.push("--requested-adjustments", action.requestedAdjustments);
      if (action.mustPreserve) args.push("--must-preserve", action.mustPreserve);
      if (action.flexible) args.push("--flexible", action.flexible);
      if (action.avoid) args.push("--avoid", action.avoid);
      return runNodeScript(scripts.createIdentitySelectionRecord, args);
    }
    case "preparePhase2": {
      const enrichedIdentityPitches = path.join(phase1RoundTrip, "05_ENRICHED_IDENTITY_PITCHES.json");
      const source = fs.existsSync(paths.identitySelectionRecord)
        ? paths.identitySelectionRecord
        : fs.existsSync(enrichedIdentityPitches)
          ? enrichedIdentityPitches
          : path.join(phase1RoundTrip, "04_VALIDATED_IDENTITY_PITCHES.json");
      const args = [relativeToProject(source), "--submission-slug", slug];
      if (!fs.existsSync(paths.identitySelectionRecord)) args.push("--direction", direction);
      return runNodeScript(scripts.preparePhase2, args);
    }
    case "completePhase2":
      return runNodeScript(scripts.completePhase2, [relativeToProject(phase2RoundTrip)]);
    case "exportPhase2Pdf": {
      const args = [relativeToProject(path.join(phase2RoundTrip, "04_VALIDATED_CAMPAIGN_CONCEPTS.json"))];
      if (clientName) args.push("--client", clientName);
      if (reference) args.push("--reference", reference);
      return runNodeScript(scripts.exportPhase2Pdf, args);
    }
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 940,
    minWidth: 1120,
    minHeight: 760,
    title: "QuestForge Campaign Distillery – Operator Console",
    backgroundColor: "#17131f",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (isDev) {
    win.loadURL("http://127.0.0.1:5173");
  } else {
    win.loadFile(path.join(__dirname, "..", "dist", "index.html"));
  }
}

app.whenReady().then(() => {
  ipcMain.handle("qf:getProjectRoot", () => getProjectRoot());
  ipcMain.handle("qf:setProjectRoot", (_event, projectRoot) => {
    const resolved = path.resolve(String(projectRoot || ""));
    if (!fs.existsSync(resolved)) throw new Error(`Project root does not exist: ${resolved}`);
    writeSettings({ ...readSettings(), projectRoot: resolved });
    return resolved;
  });

  ipcMain.handle("qf:listSubmissions", () => {
    const submissionsRoot = path.join(getProjectRoot(), "submissions");
    try {
      return fs.readdirSync(submissionsRoot, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => {
          const slug = entry.name;
          const status = safeJson(path.join(submissionsRoot, slug, "submission-status.json"), null);
          const legacy = findLegacySubmissionFiles(path.join(submissionsRoot, slug), slug);
          const legacyFound = fs.existsSync(legacy.raw) || fs.existsSync(legacy.result);
          return {
            slug,
            currentStage: status?.currentStage || status?.status || (legacyFound ? "legacy_files_found" : "unknown"),
            nextAction: status?.nextAction || (legacyFound ? "Run deterministic processing to create canonical records/status." : "Open submission status.")
          };
        })
        .sort((a, b) => a.slug.localeCompare(b.slug));
    } catch {
      return [];
    }
  });

  ipcMain.handle("qf:getSubmissionSnapshot", (_event, slug) => buildSnapshot(slug));
  ipcMain.handle("qf:readTextFile", (_event, filePath) => safeText(assertInsideProjectRoot(filePath), ""));
  ipcMain.handle("qf:writeTextFile", (_event, filePath, value) => {
    const resolved = assertInsideProjectRoot(filePath);
    fs.mkdirSync(path.dirname(resolved), { recursive: true });
    fs.writeFileSync(resolved, String(value || ""), "utf8");
    return { ok: true, path: resolved };
  });
  ipcMain.handle("qf:copyText", (_event, value) => {
    clipboard.writeText(String(value || ""));
    return { ok: true };
  });
  ipcMain.handle("qf:openPath", async (_event, filePath) => {
    const resolved = assertInsideProjectRoot(filePath);
    const result = await shell.openPath(resolved);
    return { ok: !result, message: result };
  });
  ipcMain.handle("qf:runAction", (_event, action) => handleAction(action));
  ipcMain.handle("qf:createStagedSubmission", (_event, payload = {}) => {
    const root = getProjectRoot();
    const slug = String(payload.slug || "submission").trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "submission";
    const stagedPath = path.join(root, "operator-console", "staging", `${slug}.input.json`);
    const record = {
      ...(payload.fields || {}),
      _operatorConsole: {
        rawPaste: payload.rawPaste || "",
        createdAt: new Date().toISOString(),
        parser: "deterministic_label_mapper_v0"
      }
    };
    fs.mkdirSync(path.dirname(stagedPath), { recursive: true });
    fs.writeFileSync(stagedPath, `${JSON.stringify(record, null, 2)}\n`, "utf8");
    return { slug, stagedPath };
  });

  registerMatchmakingHandlers({ ipcMain, getProjectRoot });
  registerIntroductionHandlers({ ipcMain, getProjectRoot });

  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
