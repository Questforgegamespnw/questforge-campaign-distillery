const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("questforge", {
  getProjectRoot: () => ipcRenderer.invoke("qf:getProjectRoot"),
  setProjectRoot: (projectRoot) => ipcRenderer.invoke("qf:setProjectRoot", projectRoot),
  listSubmissions: () => ipcRenderer.invoke("qf:listSubmissions"),
  getSubmissionSnapshot: (slug) => ipcRenderer.invoke("qf:getSubmissionSnapshot", slug),
  readTextFile: (filePath) => ipcRenderer.invoke("qf:readTextFile", filePath),
  writeTextFile: (filePath, value) => ipcRenderer.invoke("qf:writeTextFile", filePath, value),
  copyText: (value) => ipcRenderer.invoke("qf:copyText", value),
  openPath: (filePath) => ipcRenderer.invoke("qf:openPath", filePath),
  runAction: (action) => ipcRenderer.invoke("qf:runAction", action),
  createStagedSubmission: (payload) => ipcRenderer.invoke("qf:createStagedSubmission", payload),

  getMatchmakingOverview: () => ipcRenderer.invoke("qf:getMatchmakingOverview"),
  listMatchmakingProfiles: () => ipcRenderer.invoke("qf:listMatchmakingProfiles"),
  getMatchmakingProfile: (playerId) => ipcRenderer.invoke("qf:getMatchmakingProfile", playerId),
  listPairEvaluations: () => ipcRenderer.invoke("qf:listPairEvaluations"),
  getPairEvaluation: (matchId) => ipcRenderer.invoke("qf:getPairEvaluation", matchId),
  rebuildMatchmakingPool: () => ipcRenderer.invoke("qf:rebuildMatchmakingPool"),
  compareProfileAgainstPool: (playerId) => ipcRenderer.invoke("qf:compareProfileAgainstPool", playerId),
  buildGroupEvaluation: (playerIds) => ipcRenderer.invoke("qf:buildGroupEvaluation", playerIds),
  loadMatchmakingDemoDataset: () => ipcRenderer.invoke("qf:loadMatchmakingDemoDataset"),
  clearMatchmakingDemoDataset: () => ipcRenderer.invoke("qf:clearMatchmakingDemoDataset"),

  listIntroductionRecords: () => ipcRenderer.invoke("qf:listIntroductionRecords"),
  getIntroductionRecord: (introductionId) => ipcRenderer.invoke("qf:getIntroductionRecord", introductionId),
  createIntroductionDraft: (sourceMatch) => ipcRenderer.invoke("qf:createIntroductionDraft", sourceMatch),
  approveIntroduction: (introductionId, note) => ipcRenderer.invoke("qf:approveIntroduction", introductionId, note),
  recordIntroductionParticipantResponse: (introductionId, playerId, response, note) =>
    ipcRenderer.invoke("qf:recordIntroductionParticipantResponse", introductionId, playerId, response, note),
  releaseIntroductionContacts: (introductionId) =>
    ipcRenderer.invoke("qf:releaseIntroductionContacts", introductionId),
  completeIntroduction: (introductionId) =>
    ipcRenderer.invoke("qf:completeIntroduction", introductionId),
  declineIntroduction: (introductionId, reason) =>
    ipcRenderer.invoke("qf:declineIntroduction", introductionId, reason),
  archiveIntroduction: (introductionId) =>
    ipcRenderer.invoke("qf:archiveIntroduction", introductionId)
});
