// app/main.js

const electron = require('electron')
// Module to control application life.
const app = electron.app
// browser-window creates a native window
const BrowserWindow = electron.BrowserWindow

var mainWindow = null;

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function () {

  // Initialize the window to our specified dimensions
  mainWindow = new BrowserWindow({ width: 1200, height: 900 });

  let url = require('url').format({
    protocol: 'file',
    slashes: true,
    pathname: require('path').join(__dirname, 'www', 'index.html')
  });

  mainWindow.loadURL(url);

  mainWindow.webContents.openDevTools()

  // Clear out the main window when the app is closed
  mainWindow.on('closed', function () {

    mainWindow = null;

  });

});
