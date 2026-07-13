import React, { useEffect, useState } from "react";
import CampaignWorkspace from "./campaign/CampaignWorkspace";
import MatchmakingWorkspace from "./matchmaking/MatchmakingWorkspace";

const api = window.questforge;

function ModeButton({ active, children, onClick }) {
  return (
    <button className={`mode-button ${active ? "active" : ""}`} onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [mode, setMode] = useState("campaigns");
  const [projectRoot, setProjectRoot] = useState("");
  const [status, setStatus] = useState("Ready");

  useEffect(() => {
    api.getProjectRoot().then(setProjectRoot);
  }, []);

  return (
    <div className="operator-app">
      <header className="app-header">
        <div>
          <div className="eyebrow">QuestForge Campaign Distillery</div>
          <h1>Operations Console</h1>
        </div>
        <nav className="mode-switch" aria-label="Console mode">
          <ModeButton active={mode === "campaigns"} onClick={() => setMode("campaigns")}>Campaign Operations</ModeButton>
          <ModeButton active={mode === "matchmaking"} onClick={() => setMode("matchmaking")}>Matchmaking</ModeButton>
        </nav>
      </header>

      <div className="app-context-bar">
        <div><strong>Project Root:</strong> {projectRoot}</div>
        <div className="context-status">{status}</div>
      </div>

      <main className="mode-content">
        {mode === "campaigns" ? (
          <CampaignWorkspace onStatusChange={setStatus} />
        ) : (
          <MatchmakingWorkspace onStatusChange={setStatus} />
        )}
      </main>
    </div>
  );
}
