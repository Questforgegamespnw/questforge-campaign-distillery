// src/ai/buildExpansionInput.js

function summarizeNames(entries) {
  return (entries || []).map((entry) => entry.name).filter(Boolean);
}

function buildExpansionInput(directionBundle, basePitch) {
  return {
    directionLabel: directionBundle.label || "",
    coreNames: summarizeNames(directionBundle.coreFrames),
    systemNames: summarizeNames(directionBundle.systemFrames),
    genreName: summarizeNames(directionBundle.genreSkin)[0] || "",
    toneName: summarizeNames(directionBundle.toneSkin)[0] || "",
    environmentNames: summarizeNames(directionBundle.environmentSkins),
    includeNotes: directionBundle.includeNotes || "",
    excludeNotes: directionBundle.excludeNotes || "",
    basePitch: basePitch || ""
  };
}

module.exports = {
  buildExpansionInput
};