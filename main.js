// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const fs = require("fs");
const path = require("path");
const configuration = require('./configuration');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let settingsWindow
let settingFileExt

function setFileExt(){
  settingFileExt = configuration.readSettings('fileExt');
}

function createWindow () {
  if (!configuration.readSettings('fileExt')) {
    configuration.saveSettings('fileExt', 'txt');
  }

  // Create the browser window.
  mainWindow = new BrowserWindow({
    frame:false,
    width: 720,
    height: 480,
    resizable: true,
    minHeight: 320,
    minWidth: 480,
    icon: path.join(__dirname, 'app/img/app-icon.png')
  })

  // and load the index.html of the app.
  mainWindow.loadFile(__dirname + '/app/index.html')

  setFileExt()

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
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

ipcMain.on('close-main-window', function () {
  app.quit();
});

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
        modal: true
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
  setFileExt();
});

function selectDirectory() {
  var result = dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  var folder = result && typeof(result) !== 'undefined' && typeof(result[0])!== 'undefined' ? result[0] : false;
  var resultFile = "";

  if(folder){
    resultFile = path.join(folder, "result."+settingFileExt);
    var filter = "**."+settingFileExt;
    fs.readdir(folder, [filter], function(err, files) {
      var row = 0;
      if(files.length > 0){
        fs.writeFile(resultFile, '', function(err, data){
          if (err) console.log(err);
          console.log("Successfully create " + resultFile);
        });
      }
      for(i in files) {
        var fileName = files[i]
        var extention = fileName.split('.').pop();
        filePath = path.join(folder, fileName)
        if(filePath !== resultFile){
          if(extention == settingFileExt){
            row++;
            console.log(filePath);
            fs.readFile(filePath, function(err, buf) {
              if (err) console.log(err);
              fs.appendFile(resultFile, buf, function(err, data){
                if (err) console.log(err);
                console.log("Successfully Written to File.");
              });
            });
          }
        }
      }
      console.log(row + ' files processed')
      mainWindow.webContents.send('files-reply', row);
    });
  }
  return [folder, resultFile, settingFileExt];
}

ipcMain.on('select-directory', (event, arg) => {
  event.sender.send('directory-reply', selectDirectory());
});
