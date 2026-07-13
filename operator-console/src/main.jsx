import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";
import "./styles/app-shell.css";
import "./styles/matchmaking.css";

const api = window.questforge;

function MissingBridgeScreen() {
  return (
    <div className="missing-bridge">
      <h1>QuestForge Operator Console</h1>
      <p>The Electron preload bridge is unavailable. Start the console through Electron rather than a standalone browser.</p>
    </div>
  );
}

createRoot(document.getElementById("root")).render(api ? <App /> : <MissingBridgeScreen />);
