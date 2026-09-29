const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("disk", {
  load: () => ipcRenderer.invoke("disk:load"),
  save: (json) => ipcRenderer.invoke("disk:save", json),
  paths: () => ipcRenderer.invoke("disk:paths"),
  export: (json) => ipcRenderer.invoke("disk:export", json)
});
