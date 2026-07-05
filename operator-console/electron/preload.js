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
  createStagedSubmission: (payload) => ipcRenderer.invoke("qf:createStagedSubmission", payload)
});
