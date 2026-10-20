'use strict';
const { ipcRenderer } = require('electron');
const configuration = require('../configuration');

const closeEl = document.getElementById('close');
const settingsEl = document.getElementById('settings');
const selectButton = document.getElementById('select-btn');
const instruction = document.getElementById('instruction');
const resultCard = document.getElementById('result');
const folderInfo = document.getElementById('folder-info');
const extInfo = document.getElementById('ext-info');
const resultInfo = document.getElementById('result-info');
const filesMessage = document.getElementById('files-message');

const showInstruction = function () {
    const fileExtSelected = configuration.readSettings('fileExt');
    instruction.textContent = 'Select the folder where your .' + fileExtSelected + ' files are located. They will be merged into a single result file.';
}

const setStatus = function (text, type) {
    filesMessage.className = 'status' + (type ? ' ' + type : '');
    filesMessage.textContent = text;
}

showInstruction();

// Refresh when returning from the settings window
window.addEventListener('focus', showInstruction);

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
    const audio = new Audio('wav/money.wav');
    audio.currentTime = 0;
    audio.play();
}

ipcRenderer.on('directory-reply', (event, arg) => {
    const folder = arg && typeof (arg[0]) !== 'undefined' ? arg[0] : false;
    const resultFile = arg && typeof (arg[1]) !== 'undefined' ? arg[1] : false;
    const settingFileExt = arg && typeof (arg[2]) !== 'undefined' ? arg[2] : false;
    if (!folder) {
        return;
    }
    resultCard.hidden = false;
    folderInfo.textContent = folder;
    extInfo.textContent = settingFileExt ? '.' + settingFileExt : '';
    resultInfo.textContent = resultFile || '';
    setStatus('Please wait…');
});

ipcRenderer.on('files-reply', (event, arg) => {
    if (arg) {
        setStatus('Done, merged ' + arg + ' files. See the result in the selected folder.', 'success');
        doneSound();
    }
    else {
        setStatus('No matching files found, please check your folder.', 'error');
    }
});
