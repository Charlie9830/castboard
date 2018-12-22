'use strict';

// Import parts of electron to use
const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path')
const url = require('url')
const Server = require('./src/server/Server');


// Remote Server
const RemoteServer = new Server();
let lastReturnDataCallback;

RemoteServer.on("connection-received", handleConnectionReceived);
RemoteServer.on("get-data", handleGetData);
RemoteServer.on("receive-data", handleReceiveData);

function handleReceiveData(data) {
  mainWindow.webContents.send("receive-data", data);
}

function handleGetData(returnDataCallback) {
  // Save the returnDataCallback out of Scope so it can be accessed from handleReceiveDataFromRenderer.
  lastReturnDataCallback = returnDataCallback;

  // Register a listener to listen for the Reply from the Renderer.
  ipcMain.on("receive-data", handleReceiveDataFromRenderer)

  // Collect Data from Renderer Process.
  mainWindow.webContents.send("get-data");
}

function handleReceiveDataFromRenderer(event, data) {
  if (lastReturnDataCallback !== undefined) {
    lastReturnDataCallback(data);
  }

  ipcMain.removeListener("receive-data", handleReceiveDataFromRenderer);
}



function handleConnectionReceived() {
  console.log("Holy Shit It Worked!");
}


app.commandLine.appendSwitch('high-dpi-support', 1);
app.commandLine.appendSwitch('force-device-scale-factor', 1);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Keep a reference for dev mode
let dev = false;
if ( process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath) ) {
  dev = true;
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024, height: 768, show: false
  });

  mainWindow.maximize();

  // and load the index.html of the app.
  let indexPath;
  if ( dev && process.argv.indexOf('--noDevServer') === -1 ) {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:8080',
      pathname: 'index.html',
      slashes: true
    });
  } else {
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'index.html'),
      slashes: true
    });
  }
  mainWindow.loadURL( indexPath );

  // Don't show until we are ready and loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    // Open the DevTools automatically if developing
    if ( dev ) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
