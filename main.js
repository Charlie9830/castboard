'use strict';

// Import parts of electron to use
const {app, BrowserWindow, ipcMain, Menu, powerSaveBlocker} = require('electron');
const path = require('path')
const url = require('url')
const log = require('electron-log');
const os = require('os');
const appName = require('./package.json').name;
const Server = require('./src/server/Server');


// Remote Server
const RemoteServer = new Server();
let lastReturnDataCallback;

RemoteServer.on("connection-received", handleConnectionReceived);
RemoteServer.on("get-data", handleGetData);
RemoteServer.on("receive-data", handleReceiveData);
RemoteServer.on("playback-action", handlePlaybackAction);
RemoteServer.on("control-action", handleControlAction);
RemoteServer.on("receive-show-file", handleReceiveShowFile);

function handleReceiveShowFile(showfile) {
  if (showfile !== undefined) {
    log.info("New showfile received: " + showfile.fileName);
    mainWindow.webContents.send("receive-show-file", showfile);
  }
}

function handleControlAction(action) {
  if (action === "SOFT_RESET") {
    mainWindow.reload();
  }
}

function handlePlaybackAction(action) {
  mainWindow.webContents.send("playback-action", action);
  log.info("Received playback action: " + action);
}

function handleReceiveData(data) {
  mainWindow.webContents.send("receive-data", data);
  log.info("Received new Data");
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
    log.info("Sent data to Remote");
  }

  ipcMain.removeListener("receive-data", handleReceiveDataFromRenderer);
}

function handleConnectionReceived() {
  log.info("Remote connection received");
}

// Command Line Args.
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

// Logging.
setupLogging(dev);

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1920, height: 1080, show: false
  });

  mainWindow.maximize();

  // Setup Application Menu. (Without this, Copy/Paste/Undo/Redo/etc shortcuts won't work on MacosX)
  if (process.platform === "darwin") {
    setupApplicationMenu();
  }

  // and load the index.html of the app.
  let indexPath;
  if (process.argv.indexOf('--show-gpu-info') !== -1) {
    indexPath = url.format({
      protocol: 'chrome:',
      host: 'gpu',
      slashes: true,
    })
  }

  else if ( dev && process.argv.indexOf('--noDevServer') === -1 ) {
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

    // Enable the powerSaveBlocker if on Linux (Raspberry Pi).
    if (os.platform() === 'linux') {
      const id = powerSaveBlocker.start('prevent-display-sleep')
      
      if (powerSaveBlocker.isStarted(id)) {
        log.info("powerSaveBlocker started");
      }

      else {
        log.info("powerSaveBlocker did not start");
      }
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

function getElectronLogFilePath() {
  let home = app.getPath('home');
  let appData = app.getPath('appData');

  switch(os.platform()) {
    case 'linux':
      return path.join(home, '.config', appName, 'log.log');
    
    case 'darwin':
      return path.join(home, 'Library', 'Logs', appName, 'log.log');
    
    case 'win32':
      return path.join(appData, appName, 'log.log');
  }
}

function setupLogging(dev) {
  if (dev) {
    // Disable electron File Logging.
    log.transports.file.level = false;
  }

  log.transports.file.level = 'info';
  log.info("Main Process Started");

  let logFilePath = getElectronLogFilePath();
  RemoteServer.setElectronLogFilePath(logFilePath);
  log.info("Log File Path: " + logFilePath);
}

function setupApplicationMenu() {
  var template = [{
    label: "Handball",
    submenu: [
        { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
    ]},
    { label: "Edit",
    submenu: [
      { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
      { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
      { type: "separator" },
      { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
      { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
      { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
      { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
    ]
  }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}