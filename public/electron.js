const electron = require('electron');
const { Notification } = require('electron')
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;

const local_database = `${ app.getPath('userData') }/db.json`
global.settings = {
  database_path: local_database,
};

const { ipcMain } = require('electron')
const whatsappBot = require('./whatsapp');

ipcMain.once('whatsappBot-start', (event, arg) => {
  console.log('whatsappBot-start', arg);

  whatsappBot.client(
    (qrCode) => {
      event.reply('whatsappBot-qrCode', qrCode);
    },
    (status) => {
      event.reply('whatsappBot-status', status);
    },
    (message) => {
      event.reply('whatsapp-message', message);
    }
  );
})

ipcMain.on('whatsappBot-sendMessage', (event, arg) => {
  console.log('whatsappBot-sendMessage', arg);

  whatsappBot.sendText(arg.telephone, arg.msg);
})

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
      : `file://${ path.join(__dirname, '../build/index.html') }`
  );
  mainWindow.on('closed', () => (mainWindow = null));

  const notification = {
    title: 'Database',
    body: `Local database ${ local_database }`
  }
  new Notification(notification).show()

  mainWindow.maximize();
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  whatsappBot.stopClient();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

