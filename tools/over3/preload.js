const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('overlayAPI', {
  toggleOverlay: (shouldShow) => ipcRenderer.send('toggle-overlay', shouldShow),
  updateWindowSize: (width, height) => ipcRenderer.send('update-window-size', { width, height }),
  updateZoomFactor: (zoom) => ipcRenderer.send('update-zoom-factor', zoom)
});
