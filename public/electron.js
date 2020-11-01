const electron = require('electron');
const { Notification } = require('electron')
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const isDev = require('electron-is-dev');

const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;

const {ipcMain} = require('electron')

ipcMain.on('print-order', (event, arg) => {
  // event.sender.send('asynchronous-reply', 'pong')
  const notification = {
    title: 'Print',
    body: `So ${JSON.stringify(arg)}`
  }
  new Notification(notification).show();
})

let mainWindow;

const local_database = `${app.getPath('userData')}/db.json`
global.settings = { 
  database_path: local_database,
};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 750,
    minWidth: 900,
    minHeight: 750,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  ).then(() => {
    mainWindow.maximize()
  });

  mainWindow.on('closed', () => (mainWindow = null));

  const notification = {
    title: 'Database',
    body: `Local database ${local_database}`
  }
  new Notification(notification).show();
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

