const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require("fs");
const path = require("path");
const configuration = require('./configuration');

let mainWindow
let settingsWindow
let settingFileExt

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

///////////////////////////////////////////////////////////////////////////////
// Main Window
///////////////////////////////////////////////////////////////////////////////
function createWindow() {
  if (!configuration.readSettings('fileExt')) {
    configuration.saveSettings('fileExt', 'txt');
  }
  settingFileExt = configuration.readSettings('fileExt');

  // Create the browser window.
  mainWindow = new BrowserWindow({
    frame: false,
    width: 720,
    height: 480,
    resizable: true,
    minHeight: 320,
    minWidth: 480,
    icon: path.join(__dirname, 'app/img/app-icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  mainWindow.loadFile(__dirname + '/app/index.html')

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

ipcMain.on('close-main-window', function () {
  app.quit();
});

///////////////////////////////////////////////////////////////////////////////
// Setting Window
///////////////////////////////////////////////////////////////////////////////
ipcMain.on('open-settings-window', function () {
  if (settingsWindow) {
    return;
  }
  settingsWindow = new BrowserWindow({
    frame: false,
    height: 320,
    width: 480,
    resizable: false,
    parent: mainWindow,
    modal: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  settingsWindow.loadFile(__dirname + '/app/settings.html');

  settingsWindow.on('closed', function () {
    settingsWindow = null;
  });
});

ipcMain.on('close-settings-window', function () {
  if (settingsWindow) {
    settingsWindow.close();
  }
});

ipcMain.on('set-file-ext', function () {
  settingFileExt = configuration.readSettings('fileExt');
});

///////////////////////////////////////////////////////////////////////////////
// Dialog Select Directory
///////////////////////////////////////////////////////////////////////////////
async function selectDirectory() {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  if (result && typeof result !== 'undefined' && typeof result.canceled !== 'undefined' && !result.canceled) {
    const folder = result && typeof result !== 'undefined' && typeof result.filePaths !== 'undefined' && typeof result.filePaths[0] !== 'undefined' ? result.filePaths[0] : false;
    let resultFile = "";
    if (folder) {
      resultFile = path.join(folder, "result." + settingFileExt);
      const filter = "**." + settingFileExt;
      fs.readdir(folder, [filter], function (err, files) {
        let row = 0;
        if (files.length > 0) {
          fs.writeFile(resultFile, '', function (err, data) {
            if (err) console.log(err);
            console.log("Successfully create " + resultFile);
          });
        }
        for (let i in files) {
          const fileName = files[i]
          const extention = fileName.split('.').pop();
          filePath = path.join(folder, fileName)
          if (filePath !== resultFile) {
            if (extention == settingFileExt) {
              row++;
              fs.readFile(filePath, function (err, buf) {
                if (err) console.log(err);
                fs.appendFile(resultFile, buf, function (err, data) {
                  if (err) console.log(err);
                  console.log("Successfully Written to File.");
                });
              });
            }
          }
        }
        mainWindow.webContents.send('files-reply', row);
      });
    }
    return [folder, resultFile, settingFileExt];
  }
  else {
    return [false, false, false];
  }
}

ipcMain.on('select-directory', async (event) => {
  event.sender.send('directory-reply', await selectDirectory());
});
