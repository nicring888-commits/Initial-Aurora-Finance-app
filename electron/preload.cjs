const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("finance", {
  exportCsv: (csv, filename) => ipcRenderer.invoke("finance:exportCsv", csv, filename)
});
