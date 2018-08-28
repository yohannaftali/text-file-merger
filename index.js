'use strict';
const {remote, ipcRenderer} = require('electron');
const path = require('path');
const configuration = require('../configuration');

var closeEl = document.getElementById('close');
var settingsEl = document.getElementById('settings');
var selectButton = document.getElementById('select-btn');
var folderInfo = document.getElementById('folder-info');
var instruction = document.getElementById('instruction');
var filesMessage = document.getElementById('files-message');
var resultMessage = document.getElementById('result-message');
var fileExtSelected = configuration.readSettings('fileExt');

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

var doneSound = function(){
    var audio = new Audio(__dirname + '/wav/money.wav');
    audio.currentTime = 0;
    audio.play();
}

ipcRenderer.on('directory-reply', (event, arg) => {
    var folder = arg && typeof(arg) !== 'undefined' && typeof(arg[0]) !== 'undefined' ? arg[0] : false;
    var resultFile = arg && typeof(arg) !== 'undefined' && typeof(arg[1]) !== 'undefined' ? arg[1] : false;
    var settingFileExt = arg && typeof(arg) !== 'undefined' && typeof(arg[2]) ? arg[2] : false;
    if(folder){
        folderInfo.innerHTML = 'Folder selected : ' + folder;
        filesMessage.innerHTML = "please wait...";
    }
    else{
        folderInfo.innerHTML = '';
        filesMessage.innerHTML = '';
    }
    if(resultFile && settingFileExt){
        resultMessage.innerHTML = 'File extention to be merge = ' + settingFileExt + '<br />Result: ' + resultFile;
    }
});
ipcRenderer.on('files-reply', (event, arg) => {
    if(arg){
        filesMessage.innerHTML = "Done, process " + arg + " files, see result in the selected folder";
        doneSound();
    }
    else{
        filesMessage.innerHTML = "something wrong, please check your files";
    }
});
