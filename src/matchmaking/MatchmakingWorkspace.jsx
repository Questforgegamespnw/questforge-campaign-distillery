import React, { useEffect, useMemo, useState } from "react";
import StatusBadge from "../shared/StatusBadge";
import EmptyState from "../shared/EmptyState";
import {
  buildDiscussionPresentation,
  buildBlockerPresentation
} from "./groupPresentation";

const api = window.questforge;
const tabs = [
  ["overview", "Overview"],
  ["profiles", "Profiles"],
  ["pairs", "Pair Matches"],
  ["groups", "Group Builder"]
];

function Metric({ label, value, emphasis = false }) {
  return <div className={`metric-card ${emphasis ? "emphasis" : ""}`}><span>{label}</span><strong>{value ?? 0}</strong></div>;
}

function Overview({
  overview,
  onRefresh,
  onRebuild,
  onLoadDemo,
  onClearDemo,
  busy
}) {
  return (
    <section className="matchmaking-content">
      <div className="section-heading">
        <div><div className="eyebrow">Matchmaking</div><h2>Operational Overview</h2></div>
        <div className="button-row">
          <button disabled={busy} onClick={onRefresh}>Refresh</button>
          <button disabled={busy} onClick={onRebuild}>Rebuild Pool Index</button>
          <button
            className="primary"
            disabled={busy || !overview?.demo?.datasetAvailable}
            onClick={onLoadDemo}
          >
            Load Demo Dataset
          </button>
          <button
            className="danger"
            disabled={busy || !overview?.demo?.loadedProfiles}
            onClick={onClearDemo}
          >
            Clear Demo Data
          </button>
        </div>
      </div>
      <div className="metric-grid">
        <Metric label="Active profiles" value={overview?.counts?.active} emphasis />
        <Metric label="Paused profiles" value={overview?.counts?.paused} />
        <Metric label="Invalid profiles" value={overview?.counts?.invalid} />
        <Metric label="Pair evaluations" value={overview?.counts?.pairEvaluations} />
        <Metric label="Strong pairs" value={overview?.counts?.strongPairs} />
        <Metric label="Blocked pairs" value={overview?.counts?.blockedPairs} />
        <Metric label="Stale evaluations" value={overview?.counts?.stalePairs} />
        <Metric label="Group evaluations" value={overview?.counts?.groupEvaluations} />
        <Metric label="Demo profiles loaded" value={overview?.counts?.demoProfiles} />
      </div>
      <div className="privacy-callout">
        <strong>Privacy boundary:</strong> this mode displays operator-reviewed profile data. Contact information remains hidden from match summaries and is not released by this console patch.
      </div>
      <div className="demo-callout">
        <strong>Demo fixtures:</strong> preserved wrappers live under
        <code> misc/matchmaking-demo/</code>. Loading them validates and copies
        their profile payloads into runtime storage, generates pair evaluations,
        and creates the weak-link group example. Clearing removes only records
        associated with this demo dataset.
      </div>
    </section>
  );
}

function ProfileDetail({ detail, onCompare }) {
  if (!detail) return <EmptyState title="Select a profile">Choose an applicant to review their current compatibility profile.</EmptyState>;
  const p = detail.profile;
  return (
    <div className="detail-stack">
      <div className="detail-title"><div><h2>{p.identity?.displayName || p.playerId}</h2><div className="muted">{p.playerId}</div></div><StatusBadge value={p.status} /></div>
      <div className="detail-actions"><button className="primary" disabled={p.status !== "active"} onClick={() => onCompare(p.playerId)}>Compare Against Pool</button></div>
      <section><h3>Consent</h3><dl className="key-values">
        {Object.entries(p.consent || {}).map(([key, value]) => <React.Fragment key={key}><dt>{key}</dt><dd>{value ? "Yes" : "No"}</dd></React.Fragment>)}
      </dl></section>
      <section><h3>Logistics</h3><p>{p.logistics?.timezone || "No timezone"} · {(p.logistics?.playFormats || []).join(", ") || "No format"}</p><p>{(p.logistics?.frequencyPreferences || []).join(", ")}</p></section>
      <section><h3>Systems</h3><p><strong>Preferred:</strong> {(p.systems?.preferred || []).join(", ") || "None"}</p><p><strong>Acceptable:</strong> {(p.systems?.acceptable || []).join(", ") || "None"}</p><p><strong>Excluded:</strong> {(p.systems?.excluded || []).join(", ") || "None"}</p></section>
      <section><h3>Campaign interests</h3><p>{[...(p.campaignPreferences?.genres || []), ...(p.campaignPreferences?.gameplayInterests || [])].join(", ")}</p></section>
      <section><h3>Table preferences</h3><p>Roleplay: {p.tablePreferences?.roleplayIntensity || "—"} · Tactical: {p.tablePreferences?.tacticalIntensity || "—"} · Rules: {p.tablePreferences?.rulesApproach || "—"}</p></section>
      <section><h3>Safety and hard constraints</h3><p><strong>Hard exclusions:</strong> {(p.safety?.hardExclusions || []).join(", ") || "None recorded"}</p><p><strong>Missing required fields:</strong> {(p.completeness?.missingRequiredFields || []).join(", ") || "None"}</p></section>
    </div>
  );
}

function Profiles({ profiles, selectedId, onSelect, detail, onCompare }) {
  return <div className="split-view">
    <section className="list-panel">
      <div className="section-heading"><div><div className="eyebrow">Pool</div><h2>Compatibility Profiles</h2></div></div>
      {profiles.length === 0 ? <EmptyState title="No profiles found" /> : profiles.map((p) => (
        <button key={p.playerId} className={`record-row ${selectedId === p.playerId ? "selected" : ""}`} onClick={() => onSelect(p.playerId)}>
          <div><strong>{p.displayName || p.playerId} {p.isDemo && <span className="demo-chip">Demo</span>}</strong><span>{p.timezone || "No timezone"} · {(p.playFormats || []).join(", ")}</span></div>
          <div className="record-meta"><StatusBadge value={p.status} /><span>{p.completeness}%</span></div>
        </button>
      ))}
    </section>
    <aside className="detail-panel"><ProfileDetail detail={detail} onCompare={onCompare} /></aside>
  </div>;
}

function PairDetail({ pair }) {
  if (!pair) return <EmptyState title="Select a pair evaluation" />;
  return <div className="detail-stack">
    <div className="detail-title"><div><h2>{pair.members.join(" + ")}</h2><div className="muted">{pair.matchId}</div></div><StatusBadge value={pair.classification} /></div>
    <div className="score-hero"><strong>{pair.score?.overall ?? "—"}</strong><span>Compatibility</span><small>Confidence: {pair.score?.confidence}</small></div>
    <section><h3>Strong alignment</h3><ul>{(pair.strongAlignment || []).map((v) => <li key={v}>{v}</li>)}</ul></section>
    <section><h3>Manageable differences</h3><ul>{(pair.manageableDifferences || []).map((v) => <li key={v}>{v}</li>)}</ul></section>
    <section><h3>Session Zero discussion</h3><ul>{(pair.discussionPoints || []).map((v) => <li key={v}>{v}</li>)}</ul></section>
    <section><h3>Blocking conflicts</h3><ul>{(pair.eligibility?.blockingConflicts || []).map((v, i) => <li key={`${v.dimension}-${i}`}>{v.reason}</li>)}</ul></section>
  </div>;
}

function Pairs({ pairs, selectedId, onSelect, detail }) {
  return <div className="split-view">
    <section className="list-panel"><div className="section-heading"><div><div className="eyebrow">Review</div><h2>Pair Evaluations</h2></div></div>
      {pairs.length === 0 ? <EmptyState title="No pair evaluations" /> : pairs.map((p) => <button key={p.matchId} className={`record-row ${selectedId === p.matchId ? "selected" : ""}`} onClick={() => onSelect(p.matchId)}><div><strong>{p.members.join(" + ")} {p.isDemo && <span className="demo-chip">Demo</span>}</strong><span>{p.classification.replace(/_/g, " ")}</span></div><div className="record-meta"><strong>{p.score ?? "—"}</strong><StatusBadge value={p.confidence} /></div></button>)}
    </section><aside className="detail-panel"><PairDetail pair={detail} /></aside>
  </div>;
}


function DiscussionSections({ result, namesById }) {
  const presentation = useMemo(
    () => buildDiscussionPresentation(result?.discussionPoints || [], namesById),
    [result, namesById]
  );

  const hasContent =
    presentation.reconfirm.length > 0 ||
    presentation.pairReviews.length > 0 ||
    presentation.sessionZero.length > 0;

  if (!hasContent) {
    return (
      <section>
        <h3>Discussion points</h3>
        <p className="muted">No additional discussion points were generated.</p>
      </section>
    );
  }

  return (
    <div className="analysis-sections">
      {presentation.reconfirm.length > 0 && (
        <section>
          <h3>Information to reconfirm</h3>
          <ul>
            {presentation.reconfirm.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </section>
      )}

      {presentation.pairReviews.length > 0 && (
        <section>
          <h3>Pair review</h3>
          <div className="pair-review-list">
            {presentation.pairReviews.map((entry) => (
              <div className="pair-review-card" key={entry.members.join("::")}>
                <strong>{entry.members.join(" ↔ ")}</strong>
                <span>Review the pair-level alignment before introduction.</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {presentation.sessionZero.length > 0 && (
        <section>
          <h3>Session Zero topics</h3>
          <ul>
            {presentation.sessionZero.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function BlockingConflictSections({ conflicts, namesById }) {
  const presentation = useMemo(
    () => buildBlockerPresentation(conflicts || [], namesById),
    [conflicts, namesById]
  );

  const hasContent =
    presentation.groupLevel.length > 0 ||
    presentation.pairGroups.length > 0;

  if (!hasContent) {
    return (
      <section>
        <h3>Blocking conflicts</h3>
        <p className="muted">No blocking conflicts were found.</p>
      </section>
    );
  }

  return (
    <div className="analysis-sections blocker-sections">
      {presentation.groupLevel.length > 0 && (
        <section>
          <h3>Group-level blockers</h3>
          <ul>
            {presentation.groupLevel.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </section>
      )}

      {presentation.pairGroups.length > 0 && (
        <section>
          <h3>Pair blockers</h3>
          <div className="blocker-dimensions">
            {presentation.pairGroups.map((group) => (
              <div className="blocker-dimension" key={group.dimension}>
                <h4>{group.dimension.replace(/_/g, " ")}</h4>
                <div className="pair-blocker-list">
                  {group.pairs.map((pair) => (
                    <div
                      className="pair-blocker-card"
                      key={`${group.dimension}-${pair.members.join("::")}`}
                    >
                      <strong>{pair.members.join(" ↔ ")}</strong>
                      {pair.reasons.map((reason) => (
                        <span key={reason}>{reason}</span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Groups({ profiles, result, onBuild }) {
  const [selected, setSelected] = useState([]);

  function toggle(id) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id]
    );
  }

  const namesById = useMemo(
    () =>
      Object.fromEntries(
        profiles.map((profile) => [
          profile.playerId,
          profile.displayName || profile.playerId
        ])
      ),
    [profiles]
  );

  const memberLabel = (result?.members || [])
    .map((member) => namesById[member] || member)
    .join(" + ");

  return (
    <section className="matchmaking-content">
      <div className="section-heading">
        <div>
          <div className="eyebrow">Candidate Analysis</div>
          <h2>Group Builder</h2>
        </div>
        <button
          className="primary"
          disabled={selected.length < 3}
          onClick={() => onBuild(selected)}
        >
          Evaluate Selected Group
        </button>
      </div>

      <div className="group-builder-grid">
        <div className="group-selector">
          {profiles
            .filter((profile) => profile.status === "active")
            .map((profile) => (
              <label key={profile.playerId} className="profile-check">
                <input
                  type="checkbox"
                  checked={selected.includes(profile.playerId)}
                  onChange={() => toggle(profile.playerId)}
                />
                <span>
                  <strong>{profile.displayName || profile.playerId}</strong>
                  <small>
                    {profile.timezone} · {(profile.playFormats || []).join(", ")}
                  </small>
                </span>
              </label>
            ))}
        </div>

        <div className="group-result">
          {!result ? (
            <EmptyState title="No group evaluated">
              Select at least three active profiles.
            </EmptyState>
          ) : (
            <>
              <div className="detail-title">
                <div>
                  <h2>{memberLabel}</h2>
                  <div className="muted">{result.matchId}</div>
                </div>
                <StatusBadge value={result.classification} />
              </div>

              <div className="group-metrics">
                <Metric label="Overall" value={result.score?.overall ?? "—"} />
                <Metric
                  label="Weakest pair"
                  value={result.score?.weakestPairScore ?? "—"}
                />
                <Metric
                  label="Pair average"
                  value={result.score?.pairAverage ?? "—"}
                />
                <Metric
                  label="Confidence"
                  value={result.score?.confidence}
                />
              </div>

              <DiscussionSections result={result} namesById={namesById} />
              <BlockingConflictSections
                conflicts={result.eligibility?.blockingConflicts || []}
                namesById={namesById}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default function MatchmakingWorkspace({ onStatusChange }) {
  const [tab, setTab] = useState("overview");
  const [overview, setOverview] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [pairs, setPairs] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState("");
  const [profileDetail, setProfileDetail] = useState(null);
  const [selectedPair, setSelectedPair] = useState("");
  const [pairDetail, setPairDetail] = useState(null);
  const [groupResult, setGroupResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function refresh() {
    setBusy(true);
    try {
      const [nextOverview, nextProfiles, nextPairs] = await Promise.all([api.getMatchmakingOverview(), api.listMatchmakingProfiles(), api.listPairEvaluations()]);
      setOverview(nextOverview); setProfiles(nextProfiles.profiles || []); setPairs(nextPairs.evaluations || []);
      setMessage(""); onStatusChange?.("Matchmaking ready");
    } catch (error) { setMessage(error.message || String(error)); onStatusChange?.("Matchmaking error"); }
    finally { setBusy(false); }
  }

  useEffect(() => { refresh(); }, []);
  useEffect(() => { if (!selectedProfile) return; api.getMatchmakingProfile(selectedProfile).then(setProfileDetail).catch((e) => setMessage(e.message)); }, [selectedProfile]);
  useEffect(() => { if (!selectedPair) return; api.getPairEvaluation(selectedPair).then((v) => setPairDetail(v.result)).catch((e) => setMessage(e.message)); }, [selectedPair]);

  async function rebuild() { setBusy(true); try { await api.rebuildMatchmakingPool(); await refresh(); } finally { setBusy(false); } }
  async function compare(playerId) { setBusy(true); try { await api.compareProfileAgainstPool(playerId); setTab("pairs"); await refresh(); } catch (e) { setMessage(e.message); } finally { setBusy(false); } }
  async function buildGroup(playerIds) { setBusy(true); try { setGroupResult(await api.buildGroupEvaluation(playerIds)); } catch (e) { setMessage(e.message); } finally { setBusy(false); } }

  async function loadDemo() {
    setBusy(true);
    try {
      const result = await api.loadMatchmakingDemoDataset();
      setMessage(
        `Loaded ${result.importedProfiles.length} demo profiles and ${result.pairEvaluationCount} demo pair evaluations.`
      );
      await refresh();
    } catch (error) {
      setMessage(error.message || String(error));
    } finally {
      setBusy(false);
    }
  }

  async function clearDemo() {
    setBusy(true);
    try {
      const result = await api.clearMatchmakingDemoDataset();
      setSelectedProfile("");
      setProfileDetail(null);
      setSelectedPair("");
      setPairDetail(null);
      setGroupResult(null);
      setMessage(
        `Removed ${result.removedProfiles.length} demo profiles and ${result.removedPairEvaluations.length} related pair evaluations.`
      );
      await refresh();
    } catch (error) {
      setMessage(error.message || String(error));
    } finally {
      setBusy(false);
    }
  }

  const activeLabel = useMemo(() => tabs.find(([id]) => id === tab)?.[1] || "Matchmaking", [tab]);
  useEffect(() => { onStatusChange?.(busy ? `Working: ${activeLabel}` : `Matchmaking: ${activeLabel}`); }, [busy, activeLabel, onStatusChange]);

  return <div className="matchmaking-workspace"><aside className="matchmaking-nav">{tabs.map(([id, label]) => <button key={id} className={tab === id ? "active" : ""} onClick={() => setTab(id)}>{label}</button>)}</aside><div className="matchmaking-main">{message && <div className="error-banner">{message}</div>}{tab === "overview" && <Overview
        overview={overview}
        onRefresh={refresh}
        onRebuild={rebuild}
        onLoadDemo={loadDemo}
        onClearDemo={clearDemo}
        busy={busy}
      />}{tab === "profiles" && <Profiles profiles={profiles} selectedId={selectedProfile} onSelect={setSelectedProfile} detail={profileDetail} onCompare={compare} />}{tab === "pairs" && <Pairs pairs={pairs} selectedId={selectedPair} onSelect={setSelectedPair} detail={pairDetail} />}{tab === "groups" && <Groups profiles={profiles} result={groupResult} onBuild={buildGroup} />}</div></div>;
}
