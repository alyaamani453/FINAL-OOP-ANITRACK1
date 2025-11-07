const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'renderer', 'preload.js'), // Link to preload.js
      nodeIntegration: false
    }
  });

  win.loadURL('file://' + path.join(__dirname, 'renderer', 'index.html'));
  
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
