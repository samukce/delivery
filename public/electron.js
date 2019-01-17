const {app, BrowserWindow, webContents, ipcMain} = require('electron');
// const electron = require("electron");
// const app = electron.app;
// const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const fs = require('fs')
const isDev = require("electron-is-dev");

let mainWindow;

require("update-electron-app")({
  repo: "samukce/delivery",
  updateInterval: "1 hour"
});

function createWindow() {
  mainWindow = new BrowserWindow({ width: 900, height: 680 });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("closed", () => (mainWindow = null));

  // ipcMain.on('print', data => {
  //   mainWindow.webContents.print({
  //     // deviceName: 'Officejet_Pro_8600_314EB2_',
  //     silent: true
  //   }, flag => {
  //     mainWindow.webContents.send('printed');
  //   });
  // })

  mainWindow.webContents.openDevTools();


  workerWindow = new BrowserWindow();
  workerWindow.loadURL("file://" + __dirname + "/printerWindow.html");
  workerWindow.hide();
}

function print(text){
  let win = new BrowserWindow({show: false})
  fs.writeFile(path.join(__dirname,'print.txt'), text, () => {})
  win.loadURL('file://'+__dirname+'/print.txt')
  win.webContents.on('did-finish-load', () => {
    console.log('did-finish-load');
      // win.webContents.printToPDF( {landscape: false});

      const printOptions = {
        silent: false,
        printBackground: true,
        deviceName: ''
      };

      win.webContents.print(printOptions, (success) => {
        console.log('print............');
        if (!success) {
          console.log('!success');
        }
      });
      // setTimeout(function(){
        // win.close();
      // }, 5000);
  })
}


// retransmit it to workerWindow
ipcMain.on("printPDF", function(event, content){
  console.log('printPDF ' + content);
  print(content);
  // workerWindow.webContents.send("printPDF", content);
  // mainWindow.webContents.print({silent: false});
});

// when worker window is ready
ipcMain.on("readyToPrintPDF", (event) => {
  console.log('readyToPrintPDF');
  workerWindow.webContents.print({silent: false});
})

function printContents(arg) {

  printWin = new BrowserWindow({
    show: false
  });

  // const html = 'data:text/html,' + encodeURIComponent(arg.page);
  printWin.loadURL("www.google.com");

  console.log(`print ...`);
  for (const i of printWin.webContents.getPrinters()) {
    console.log(`print ${printer}`);
  }

  printWin.webContents.on('did-finish-load', () => {
    // Use default printer when printer is not given explicitly
    let printer = arg.printer;
    if (!printer) {
      for (const i of printWin.webContents.getPrinters()) {
        console.log(`print ${printer}`);
        if (i.isDefault) {
          printer = i.name;
        }
      }
    }

    printWin.webContents.print({silent: true, deviceName: printer}, () => {
      printWin.close();
    }, () => {
      printWin.close();
    });
  })
}

ipcMain.on('printContent', (event, arg) => {
  printContents(arg);
});

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

