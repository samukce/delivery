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
  whatsappBot.client(
    (qrCode) => {
      event.reply('whatsappBot-qrCode', qrCode);
    },
    (status) => {
      event.reply('whatsappBot-status', status);
    },
    (statusClient) => {
      event.reply('whatsapp-statusClient', statusClient);
    },
    (message) => {
      event.reply('whatsapp-message', message);
      event.reply(`whatsapp-message-${ message.from }`, message);
    }
  );
})

ipcMain.on('whatsappBot-sendMessage', (event, arg) => {
  const notifySendMessage = `whatsappBot-sendMessage-${ arg.telephone }`;
  whatsappBot.sendText(arg.telephone, arg.msg)
    .then((messageSent) => {
      console.log("return message sent:", messageSent);
      event.reply(notifySendMessage, (messageSent))
    })
    .catch((error) => {
      console.log(error);
      event.reply(notifySendMessage, {})
    });
  ;
})

ipcMain.on('whatsappBot-getAllChats', (event, arg) => {
  whatsappBot.getAllChats()
    .then((allChats) => event.reply('whatsappBot-setAllChats', (allChats ?? [])))
    .catch((error) => {
      console.log(error);
      event.reply('whatsappBot-setAllChats', [])
    });
})

ipcMain.on('whatsappBot-getProfilePicFromServer', (event, chatId) => {
  const setProfilePicFromServer = `whatsappBot-setProfilePicFromServer-${ chatId }`;
  whatsappBot.getProfilePicFromServer(chatId)
    .then((profileUrl) => event.reply(setProfilePicFromServer, profileUrl))
    .catch((error) => {
      console.log(error);
      event.reply(setProfilePicFromServer, "")
    });
})

ipcMain.on('whatsappBot-loadAndGetAllMessagesInChat', (event, chatId) => {
  const setAllMessagesInChat = `whatsappBot-setAllMessagesInChat-${ chatId }`;
  whatsappBot.loadAndGetAllMessagesInChat(chatId)
    .then((messages) => {
      console.log(messages);
      event.reply(setAllMessagesInChat, messages)
    })
    .catch((error) => {
      console.log(error);
      event.reply(setAllMessagesInChat, [])
    });
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

