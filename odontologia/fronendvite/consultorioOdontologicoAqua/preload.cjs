const { contextBridge, ipcRenderer } = require('electron');

// Expose minimal surface to renderer process
// Keeps contextIsolation: true while allowing future IPC if needed
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  isElectron: true,
});
