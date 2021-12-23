'use strict';
const { ipcRenderer } = require('electron');
const configuration = require('../configuration');

const closeEl = document.getElementById('close');
const settingsEl = document.getElementById('settings');
const selectButton = document.getElementById('select-btn');
const folderInfo = document.getElementById('folder-info');
const instruction = document.getElementById('instruction');
const filesMessage = document.getElementById('files-message');
const resultMessage = document.getElementById('result-message');
const fileExtSelected = configuration.readSettings('fileExt');

instruction.innerHTML = "Please select folder where your " + fileExtSelected + " files is located <br /> Warning: result file will be overwrite"
folderInfo.innerHTML = "";
filesMessage.innerHTML = "";
resultMessage.innerHTML = "";

closeEl.addEventListener('click', function () {
    ipcRenderer.send('close-main-window');
});

settingsEl.addEventListener('click', function () {
    ipcRenderer.send('open-settings-window');
});

selectButton.addEventListener('click', function () {
    ipcRenderer.send('select-directory');
});

const doneSound = function () {
    const audio = new Audio(__dirname + '/wav/money.wav');
    audio.currentTime = 0;
    audio.play();
}

ipcRenderer.on('directory-reply', (event, arg) => {

    const folder = arg && typeof (arg) !== 'undefined' && typeof (arg[0]) !== 'undefined' ? arg[0] : false;
    const resultFile = arg && typeof (arg) !== 'undefined' && typeof (arg[1]) !== 'undefined' ? arg[1] : false;
    const settingFileExt = arg && typeof (arg) !== 'undefined' && typeof (arg[2]) ? arg[2] : false;
    if (folder) {
        folderInfo.innerHTML = 'Folder selected : ' + folder;
        filesMessage.innerHTML = "please wait...";
    }
    else {
        folderInfo.innerHTML = '';
        filesMessage.innerHTML = '';
    }
    if (resultFile && settingFileExt) {
        resultMessage.innerHTML = 'File extention to be merge = ' + settingFileExt + '<br />Result: ' + resultFile;
    }
});
ipcRenderer.on('files-reply', (event, arg) => {
    if (arg) {
        filesMessage.innerHTML = "Done, process " + arg + " files, see result in the selected folder";
        doneSound();
    }
    else {
        filesMessage.innerHTML = "something wrong, please check your files";
    }
});
