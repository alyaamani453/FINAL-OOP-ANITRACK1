const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // Expose necessary Node.js functionality to the renderer
});
