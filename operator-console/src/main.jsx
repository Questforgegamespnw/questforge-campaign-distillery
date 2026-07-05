import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const api = window.questforge;
const directions = ["primary", "adjacent", "wildcard"];

function parseStructuredPaste(text) {
  const result = {};
  const lines = String(text || "").split(/\r?\n/);
  let currentKey = "";

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const match = trimmed.match(/^([^:]{2,80}):\s*(.*)$/);
    if (match) {
      currentKey = normalizeKey(match[1]);
      result[currentKey] = match[2].trim();
      continue;
    }

    if (currentKey) {
      result[currentKey] = `${result[currentKey]}\n${trimmed}`.trim();
    }
  }

  return result;
}



const knownMultiSelectOptions = {
  experience: [
    "Big heroic action and epic moments",
    "Surviving against dangerous odds",
    "Solving mysteries and uncovering secrets",
    "Exploration and discovering strange places",
    "Character-driven drama and meaningful personal arcs"
  ],
  setup: [
    "Mercenaries for Hire",
    "Wandering Adventurers",
    "Rebels and Resistance",
    "Escaped or Chosen Survivors",
    "Criminal Crew or Heist Team",
    "Starship Crew"
  ],
  genre: [
    "Classic Fantasy",
    "Dark Fantasy",
    "Heroic / Mythic Fantasy",
    "Heroic",
    "Mythic / Divine",
    "Gothic / Victorian",
    "Western Frontier",
    "Feudal Eastern",
    "Sci-Fi / Spacefaring",
    "Post-Apocalyptic",
    "Weird / Surreal / Otherworldly"
  ],
  environment: [
    "Dense Cities & Urban Intrigue",
    "Jungles & Overgrown Ruins",
    "Frozen Wastes",
    "Deserts & Wastelands",
    "Coastlines, Islands & Oceans",
    "Mountains & Wild Frontiers",
    "Underground Caverns & Deep Places",
    "Ancient Ruins & Fallen Civilizations",
    "Dreamlike or Reality-Warped Places",
    "Strange, Dreamlike, or Reality-Warped Places",
    "Volcanic Lands & Fire-Scarred Regions"
  ],
  gameplay: [
    "Tactical combat",
    "Dangerous boss fights",
    "Investigation and clue-solving",
    "Exploration and discovery",
    "Social intrigue and negotiations",
    "Resource management and survival pressure",
    "Building alliances or choosing factions",
    "Character growth and transformation"
  ],
  fantasy: [
    "Becoming heroes",
    "Surviving impossible odds",
    "Mastering dangerous power",
    "Uncovering forbidden truth",
    "Changing the world",
    "Holding the line against disaster",
    "Deciding who to trust and betray",
    "Discovering who we really are"
  ]
};

function normalizeOptionText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractKnownOptions(chunk, knownOptions = []) {
  const source = String(chunk || "");
  const normalizedSource = normalizeOptionText(source);

  if (!normalizedSource || knownOptions.length === 0) return [];

  return knownOptions
    .map((option) => ({
      option,
      index: normalizedSource.indexOf(normalizeOptionText(option))
    }))
    .filter((entry) => entry.index >= 0)
    .sort((a, b) => a.index - b.index)
    .map((entry) => entry.option);
}

function splitListValue(value, knownOptions = []) {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);

  const chunks = String(value || "")
    .split(/\r?\n|;|\|/)
    .map((item) => item.trim())
    .filter(Boolean);

  const results = [];

  for (const chunk of chunks) {
    const knownMatches = extractKnownOptions(chunk, knownOptions);

    if (knownMatches.length > 0) {
      results.push(...knownMatches);
      continue;
    }

    results.push(
      ...chunk
        .split(/,/)
        .map((item) => item.trim())
        .filter(Boolean)
    );
  }

  return Array.from(new Set(results));
}

function pickField(fields, aliases) {
  for (const alias of aliases) {
    const key = normalizeKey(alias);
    if (fields[key] !== undefined && String(fields[key]).trim()) return fields[key];
  }
  return "";
}

function mapStructuredFieldsToRawForm(fields = {}) {
  return {
    name: pickField(fields, ["name", "client name", "group name", "contact name"]),
    email: pickField(fields, ["email", "email address", "contact email"]),
    group_size: pickField(fields, ["group_size", "group size", "party size", "party/group size", "party or group size", "player count", "number of players", "players", "how many players", "current group size", "desired group size", "currentgroupsize", "desiredgroupsize"]),
    system: pickField(fields, ["system", "preferred system", "system preference", "game system"]),
    audience: pickField(fields, ["audience", "who is this for", "age audience"]),
    age_band: pickField(fields, ["age band", "age_band", "age range", "player age band"]),
    "experience[]": splitListValue(pickField(fields, ["experience", "experiences", "desired experience", "campaign experience", "what experience do you want"]), knownMultiSelectOptions.experience),
    "setup[]": splitListValue(pickField(fields, ["setup", "setups", "campaign setup", "starting setup", "premise setup"]), knownMultiSelectOptions.setup),
    tone: pickField(fields, ["tone", "campaign tone", "vibe"]),
    choice_weight: pickField(fields, ["choice weight", "choice_weight", "player choice", "decision weight", "how much should choices matter"]),
    "genre[]": splitListValue(pickField(fields, ["genre", "genres", "genre interests", "world aesthetic"]), knownMultiSelectOptions.genre),
    "environment[]": splitListValue(pickField(fields, ["environment", "environments", "locations", "setting environments"]), knownMultiSelectOptions.environment),
    "gameplay[]": splitListValue(pickField(fields, ["gameplay", "gameplay interests", "playstyle", "play style"]), knownMultiSelectOptions.gameplay),
    "fantasy[]": splitListValue(pickField(fields, ["fantasy", "player fantasy", "power fantasy", "what do you want to feel"]), knownMultiSelectOptions.fantasy),
    must_haves: pickField(fields, ["must haves", "must_haves", "must include", "include", "include notes"]),
    avoid: pickField(fields, ["avoid", "avoidances", "do not include", "exclude", "exclude notes", "boundaries"]),
    "content_boundaries[]": splitListValue(pickField(fields, ["content boundaries", "content_boundaries", "safety", "safety boundaries", "content safety", "content safety mode", "safety notes", "lines and veils"]))
  };
}

function normalizeKey(label) {
  return String(label || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function StatusPill({ value }) {
  const text = value || "unknown";
  const type = /complete|exported|recorded|ready/i.test(text)
    ? "good"
    : /fail|error|mismatch|review|invalid/i.test(text)
      ? "bad"
      : /awaiting|prepared|initialized/i.test(text)
        ? "warn"
        : "neutral";
  return <span className={`pill ${type}`}>{text}</span>;
}

function FileRow({ label, info, onOpen, onRead }) {
  return (
    <div className="file-row">
      <div>
        <div className="file-label">{label}</div>
        <div className={info?.exists ? "file-path" : "file-path missing"}>{info?.basename || "missing"}</div>
      </div>
      <div className="file-actions">
        <button disabled={!info?.exists} onClick={() => onRead?.(info.path)}>View</button>
        <button disabled={!info?.exists} onClick={() => onOpen?.(info.path)}>Open</button>
      </div>
    </div>
  );
}

function SubmissionList({ submissions, selectedSlug, onSelect, onRefresh, onNew }) {
  return (
    <aside className="panel left-panel">
      <div className="panel-header">
        <div>
          <div className="eyebrow">QuestForge</div>
          <h1>Operator Console</h1>
        </div>
        <button onClick={onRefresh}>Refresh</button>
      </div>
      <button className="primary full" onClick={onNew}>+ New Submission</button>
      <div className="section-title">Submissions</div>
      <div className="submission-list">
        {submissions.length === 0 && <div className="empty">No submissions found.</div>}
        {submissions.map((item) => (
          <button
            key={item.slug}
            className={`submission-card ${selectedSlug === item.slug ? "selected" : ""}`}
            onClick={() => onSelect(item.slug)}
          >
            <div className="submission-slug">{item.slug}</div>
            <StatusPill value={item.currentStage} />
            <div className="submission-next">{item.nextAction}</div>
          </button>
        ))}
      </div>
    </aside>
  );
}

function NewSubmissionModal({ onClose, onCreated, initialSlug = "", initialRawPaste = "" }) {
  const [rawPaste, setRawPaste] = useState(initialRawPaste);
  const [slug, setSlug] = useState(initialSlug);
  const [jsonText, setJsonText] = useState("{}");
  const [message, setMessage] = useState("");

  function parsePaste() {
    const fields = parseStructuredPaste(rawPaste);
    const suggestedSlug = slug || slugify(fields.name || fields.client_name || fields.email || "submission");
    setSlug(suggestedSlug || "submission");
    setJsonText(JSON.stringify(mapStructuredFieldsToRawForm(fields), null, 2));
  }

  async function create() {
    try {
      const fields = JSON.parse(jsonText);
      const result = await api.createStagedSubmission({ slug, rawPaste, fields });
      setMessage(`Staged source JSON created: ${result.stagedPath}`);
      onCreated(result.slug, result.stagedPath);
    } catch (error) {
      setMessage(error.message || String(error));
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <div>
            <div className="eyebrow">New Submission</div>
            <h2>Paste Formspree Response</h2>
          </div>
          <button onClick={onClose}>Close</button>
        </div>
        <div className="legacy-note">Paste the original Formspree email/body here. The parser maps labeled fields into the raw form JSON shape expected by the current pipeline. Review before saving.</div>
        <label>Submission slug</label>
        <input value={slug} onChange={(event) => setSlug(slugify(event.target.value))} placeholder="acacia-smith" />
        <label>Raw Formspree paste</label>
        <textarea className="large" value={rawPaste} onChange={(event) => setRawPaste(event.target.value)} />
        <div className="row gap">
          <button onClick={parsePaste}>Parse Fields</button>
          <button className="primary" onClick={create}>Save Staged JSON</button>
        </div>
        <label>Reviewed source JSON</label>
        <textarea className="large mono" value={jsonText} onChange={(event) => setJsonText(event.target.value)} />
        {message && <pre className="console-output">{message}</pre>}
      </div>
    </div>
  );
}

function SubmissionStatus({ snapshot, onOpen, onView }) {
  if (!snapshot) {
    return <main className="panel center-panel"><div className="empty hero">Select or create a submission.</div></main>;
  }

  const status = snapshot.status || {};
  const phase1 = status.phase1 || {};
  const phase2 = status.phase2 || {};

  return (
    <main className="panel center-panel">
      <div className="panel-header">
        <div>
          <div className="eyebrow">Current Submission</div>
          <h2>{snapshot.slug}</h2>
        </div>
        <StatusPill value={status.currentStage || status.status} />
      </div>

      <div className="next-action">
        <div className="eyebrow">Next Action</div>
        <div>{status.nextAction || (snapshot.legacyMode ? "Run deterministic processing to create canonical records/status." : "Run the next production workflow step.")}</div>
      </div>

      {snapshot.legacyMode && (
        <div className="legacy-note">
          Legacy submission files detected. This folder has a raw submission/result JSON but no canonical <code>submission-status.json</code> yet. Run deterministic processing once to create <code>00_RAW_SUBMISSION.json</code>, <code>01_NORMALIZED_SUBMISSION.json</code>, <code>02_PIPELINE_RESULT.json</code>, and status tracking.
        </div>
      )}

      {snapshot.recovery?.invalidCanonicalIntake && (
        <div className="legacy-note danger">
          <strong>Re-intake recommended.</strong> The current pipeline result reports an invalid canonical intake, usually from an older GPT-made or hybrid JSON shape. Use the original Formspree text to create a new raw-form-shaped submission, then rerun deterministic processing.
        </div>
      )}

      <div className="grid two">
        <div className="card">
          <h3>Phase 1</h3>
          <Checklist items={[
            ["Raw captured", phase1.rawCaptured],
            ["Pipeline complete", phase1.pipelineComplete],
            ["AI polish prepared", phase1.aiPolishPrepared || snapshot.files.phase1Prompt.exists],
            ["AI polish complete", phase1.aiPolishComplete],
            ["PDF exported", phase1.clientDeliveryComplete || snapshot.files.phase1Pdf.exists],
            ["Selection recorded", phase1.identitySelectionRecorded || snapshot.files.identitySelectionRecord.exists]
          ]} />
        </div>
        <div className="card">
          <h3>Phase 2</h3>
          <Checklist items={[
            ["Handoff prepared", phase2.handoffPrepared || snapshot.phase2Directions.some((d) => d.files.handoff.exists)],
            ["Round trip prepared", phase2.conceptRoundTripPrepared || snapshot.phase2Directions.some((d) => d.files.prompt.exists)],
            ["Concept validation complete", phase2.conceptGenerationComplete],
            ["PDF exported", phase2.clientDeliveryComplete || snapshot.phase2Directions.some((d) => d.files.pdf.exists)]
          ]} />
        </div>
      </div>

      <section className="card">
        <h3>Submission Records</h3>
        <FileRow label="Raw submission" info={snapshot.files.rawSubmission} onOpen={onOpen} onRead={onView} />
        {snapshot.files.legacyRawSubmission?.exists && <FileRow label="Legacy raw JSON" info={snapshot.files.legacyRawSubmission} onOpen={onOpen} onRead={onView} />}
        {snapshot.files.canonicalRawSubmission?.exists && <FileRow label="Canonical raw JSON" info={snapshot.files.canonicalRawSubmission} onOpen={onOpen} onRead={onView} />}
        <FileRow label="Normalized submission" info={snapshot.files.normalizedSubmission} onOpen={onOpen} onRead={onView} />
        <FileRow label="Pipeline result" info={snapshot.files.pipelineResult} onOpen={onOpen} onRead={onView} />
        {snapshot.files.legacyPipelineResult?.exists && <FileRow label="Legacy result JSON" info={snapshot.files.legacyPipelineResult} onOpen={onOpen} onRead={onView} />}
        {snapshot.files.canonicalPipelineResult?.exists && <FileRow label="Canonical pipeline result" info={snapshot.files.canonicalPipelineResult} onOpen={onOpen} onRead={onView} />}
        <FileRow label="Submission status" info={snapshot.files.submissionStatus} onOpen={onOpen} onRead={onView} />
      </section>

      <section className="card">
        <h3>Phase 1 Round Trip</h3>
        <FileRow label="Prompt" info={snapshot.files.phase1Prompt} onOpen={onOpen} onRead={onView} />
        <FileRow label="Response bucket" info={snapshot.files.phase1Response} onOpen={onOpen} onRead={onView} />
        <FileRow label="Validation result" info={snapshot.files.phase1Validation} onOpen={onOpen} onRead={onView} />
        <FileRow label="Validated identity pitches" info={snapshot.files.phase1Validated} onOpen={onOpen} onRead={onView} />
        <FileRow label="Identity pitch PDF" info={snapshot.files.phase1Pdf} onOpen={onOpen} onRead={onView} />
        {snapshot.phase1ValidationSummary && <pre className="summary">{snapshot.phase1ValidationSummary}</pre>}
      </section>

      <section className="card">
        <h3>Phase 2 Directions</h3>
        {snapshot.phase2Directions.length === 0 && <div className="empty">No Phase 2 direction folders yet.</div>}
        {snapshot.phase2Directions.map((direction) => (
          <details key={direction.direction} className="direction-details">
            <summary>{direction.direction} <StatusPill value={direction.status?.stage || "found"} /></summary>
            <FileRow label="Handoff" info={direction.files.handoff} onOpen={onOpen} onRead={onView} />
            <FileRow label="Prompt" info={direction.files.prompt} onOpen={onOpen} onRead={onView} />
            <FileRow label="Response bucket" info={direction.files.response} onOpen={onOpen} onRead={onView} />
            <FileRow label="Validation result" info={direction.files.validation} onOpen={onOpen} onRead={onView} />
            <FileRow label="Validated concepts" info={direction.files.validated} onOpen={onOpen} onRead={onView} />
            <FileRow label="Campaign concept PDF" info={direction.files.pdf} onOpen={onOpen} onRead={onView} />
            {direction.validationSummary && <pre className="summary">{direction.validationSummary}</pre>}
          </details>
        ))}
      </section>
    </main>
  );
}

function Checklist({ items }) {
  return <ul className="checklist">{items.map(([label, done]) => <li key={label} className={done ? "done" : ""}><span>{done ? "✓" : "○"}</span>{label}</li>)}</ul>;
}

function ActionPanel({ snapshot, selectedSlug, selectedDirection, setSelectedDirection, onRun, onOpen, onRefresh, onView, onSaveResponse, onNew }) {
  const [clientName, setClientName] = useState("");
  const [reference, setReference] = useState("");
  const [selection, setSelection] = useState({ selectedBy: "", notes: "", liked: "", concerns: "", requestedAdjustments: "", mustPreserve: "", flexible: "", avoid: "" });

  if (!selectedSlug) {
    return <aside className="panel right-panel"><div className="empty">Actions appear after selecting a submission.</div></aside>;
  }

  return (
    <aside className="panel right-panel">
      <div className="panel-header compact">
        <div>
          <div className="eyebrow">Actions</div>
          <h2>Operator Controls</h2>
        </div>
      </div>

      <div className="action-group">
        <h3>Submission</h3>
        <button onClick={() => onRun({ type: "processSubmission", slug: selectedSlug })}>Run Deterministic Processing</button>
        {snapshot?.recovery?.invalidCanonicalIntake && <button className="primary" onClick={() => onNew?.({ slug: selectedSlug })}>Recreate From Formspree Paste</button>}
        <button onClick={() => onOpen(snapshot?.recordsRoot)}>Open Submission Folder</button>
        <button onClick={() => onOpen(snapshot?.exportsRoot)}>Open Export Folder</button>
      </div>

      <div className="action-group">
        <h3>Phase 1</h3>
        <button onClick={() => onRun({ type: "preparePhase1", slug: selectedSlug })}>Prepare Phase 1 Prompt</button>
        <button disabled={!snapshot?.files.phase1Prompt.exists} onClick={() => onView(snapshot.files.phase1Prompt.path)}>View Prompt</button>
        <button disabled={!snapshot?.files.phase1Prompt.exists} onClick={async () => api.copyText(await api.readTextFile(snapshot.files.phase1Prompt.path))}>Copy Prompt</button>
        <button disabled={!snapshot?.files.phase1Response.exists} onClick={() => onSaveResponse(snapshot.files.phase1Response.path)}>Paste/Save Response</button>
        <button onClick={() => onRun({ type: "completePhase1", slug: selectedSlug })}>Validate Phase 1</button>
        <button disabled={!snapshot?.files.phase1Validated.exists} onClick={() => onRun({ type: "buildIdentityPitchHandoff", slug: selectedSlug })}>Build Identity Pitch Handoff</button>
        <button disabled={!snapshot?.files.phase1Enriched.exists} onClick={() => onView(snapshot.files.phase1Enriched.path)}>View Enriched Handoff</button>
        <input placeholder="Client name for PDF" value={clientName} onChange={(event) => setClientName(event.target.value)} />
        <input placeholder="Reference" value={reference} onChange={(event) => setReference(event.target.value)} />
        <button onClick={() => onRun({ type: "exportPhase1Pdf", slug: selectedSlug, clientName, reference })}>Export Phase 1 PDF</button>
        <button onClick={() => onOpen(snapshot?.paths.phase1RoundTrip)}>Open Phase 1 Round Trip</button>
        <button onClick={() => onOpen(snapshot?.paths.phase1Delivery)}>Open Phase 1 Delivery</button>
      </div>

      <div className="action-group">
        <h3>Client Selection</h3>
        <select value={selectedDirection} onChange={(event) => setSelectedDirection(event.target.value)}>
          {directions.map((direction) => <option key={direction} value={direction}>{direction}</option>)}
        </select>
        {Object.entries(selection).map(([key, value]) => (
          <input key={key} placeholder={key} value={value} onChange={(event) => setSelection({ ...selection, [key]: event.target.value })} />
        ))}
        <button disabled={!snapshot?.files.phase1Enriched.exists} onClick={() => onRun({ type: "createIdentitySelectionRecord", slug: selectedSlug, direction: selectedDirection, ...selection })}>Record Identity Selection</button>
      </div>

      <div className="action-group">
        <h3>Phase 2</h3>
        <button onClick={() => onRun({ type: "preparePhase2", slug: selectedSlug, direction: selectedDirection })}>Prepare Phase 2 Prompt</button>
        <button onClick={() => {
          const found = snapshot?.phase2Directions.find((d) => d.direction === selectedDirection);
          if (found?.files.prompt.exists) onView(found.files.prompt.path);
        }}>View Phase 2 Prompt</button>
        <button onClick={async () => {
          const found = snapshot?.phase2Directions.find((d) => d.direction === selectedDirection);
          if (found?.files.prompt.exists) api.copyText(await api.readTextFile(found.files.prompt.path));
        }}>Copy Phase 2 Prompt</button>
        <button onClick={() => {
          const found = snapshot?.phase2Directions.find((d) => d.direction === selectedDirection);
          if (found?.files.response.exists) onSaveResponse(found.files.response.path);
        }}>Paste/Save Phase 2 Response</button>
        <button onClick={() => onRun({ type: "completePhase2", slug: selectedSlug, direction: selectedDirection })}>Validate Phase 2</button>
        <button onClick={() => onRun({ type: "exportPhase2Pdf", slug: selectedSlug, direction: selectedDirection, clientName, reference })}>Export Phase 2 PDF</button>
        <button onClick={() => onOpen(snapshot?.phase2Directions.find((d) => d.direction === selectedDirection)?.roundTrip)}>Open Phase 2 Round Trip</button>
        <button onClick={() => onOpen(snapshot?.phase2Directions.find((d) => d.direction === selectedDirection)?.delivery)}>Open Phase 2 Delivery</button>
      </div>

      <button className="full" onClick={onRefresh}>Refresh Status</button>
    </aside>
  );
}

function ViewerModal({ title, value, path, onClose, onSave }) {
  const [text, setText] = useState(value || "");
  return (
    <div className="modal-backdrop">
      <div className="modal wide">
        <div className="modal-header">
          <div>
            <div className="eyebrow">{path}</div>
            <h2>{title}</h2>
          </div>
          <div className="row gap">
            {onSave && <button className="primary" onClick={() => onSave(path, text)}>Save</button>}
            <button onClick={onClose}>Close</button>
          </div>
        </div>
        <textarea className="viewer mono" value={text} onChange={(event) => setText(event.target.value)} />
      </div>
    </div>
  );
}

function App() {
  const [projectRoot, setProjectRoot] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [snapshot, setSnapshot] = useState(null);
  const [selectedDirection, setSelectedDirection] = useState("primary");
  const [consoleOutput, setConsoleOutput] = useState("");
  const [newModal, setNewModal] = useState(null);
  const [viewer, setViewer] = useState(null);

  async function refreshList() {
    setProjectRoot(await api.getProjectRoot());
    const list = await api.listSubmissions();
    setSubmissions(list);
  }

  async function refreshSnapshot(slug = selectedSlug) {
    if (!slug) return;
    const next = await api.getSubmissionSnapshot(slug);
    setSnapshot(next);
  }

  useEffect(() => { refreshList(); }, []);
  useEffect(() => { refreshSnapshot(selectedSlug); }, [selectedSlug]);

  async function run(action) {
    setConsoleOutput(`Running ${action.type}...`);

    try {
      const result = await api.runAction(action);
      const duration = typeof result.durationMs === "number"
        ? `Duration: ${(result.durationMs / 1000).toFixed(1)}s`
        : "";
      const statusLine = result.ok
        ? `Done: ${action.type}`
        : `Finished with errors: ${action.type}`;

      setConsoleOutput([
        statusLine,
        result.command ? `Command: ${result.command}` : "",
        duration,
        result.stdout,
        result.stderr,
        `Exit code: ${result.code}`
      ].filter(Boolean).join("\n"));
    } catch (error) {
      setConsoleOutput([
        `Action failed before process exit: ${action.type}`,
        error?.message || String(error)
      ].join("\n"));
    } finally {
      await refreshList();
      await refreshSnapshot(action.slug || selectedSlug);
    }
  }

  async function openPath(filePath) {
    if (!filePath) return;
    await api.openPath(filePath);
  }

  async function viewFile(filePath) {
    const text = await api.readTextFile(filePath);
    setViewer({ title: filePath.split(/[\\/]/).pop(), path: filePath, value: text, editable: false });
  }

  async function saveResponse(filePath) {
    const text = await api.readTextFile(filePath);
    setViewer({ title: "Paste AI Response", path: filePath, value: text, editable: true });
  }

  async function saveViewer(path, text) {
    await api.writeTextFile(path, text);
    setViewer(null);
    await refreshSnapshot();
  }

  const stage = snapshot?.status?.currentStage || "No submission selected";

  return (
    <div className="app-shell">
      <div className="topbar">
        <div><strong>Project Root:</strong> {projectRoot}</div>
        <div><StatusPill value={stage} /></div>
      </div>
      <div className="workspace">
        <SubmissionList
          submissions={submissions}
          selectedSlug={selectedSlug}
          onSelect={setSelectedSlug}
          onRefresh={refreshList}
          onNew={() => setNewModal({})}
        />
        <SubmissionStatus snapshot={snapshot} onOpen={openPath} onView={viewFile} />
        <ActionPanel
          snapshot={snapshot}
          selectedSlug={selectedSlug}
          selectedDirection={selectedDirection}
          setSelectedDirection={setSelectedDirection}
          onRun={run}
          onOpen={openPath}
          onRefresh={() => { refreshList(); refreshSnapshot(); }}
          onView={viewFile}
          onSaveResponse={saveResponse}
          onNew={(options) => setNewModal(options || {})}
        />
      </div>
      {consoleOutput && <pre className="bottom-console">{consoleOutput}</pre>}
      {newModal && (
        <NewSubmissionModal
          initialSlug={newModal.slug || ""}
          initialRawPaste={newModal.rawPaste || ""}
          onClose={() => setNewModal(null)}
          onCreated={async (slug) => {
            await refreshList();
            setSelectedSlug(slug);
          }}
        />
      )}
      {viewer && (
        <ViewerModal
          title={viewer.title}
          path={viewer.path}
          value={viewer.value}
          onClose={() => setViewer(null)}
          onSave={viewer.editable ? saveViewer : null}
        />
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(api ? <App /> : <MissingBridgeScreen />);
