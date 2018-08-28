'use strict';

const {ipcRenderer} = require('electron');
const configuration = require('../configuration');

var radioEl = document.querySelectorAll('.file-extention-radio');
var closeEl = document.getElementById('close');

closeEl.addEventListener('click', function (e) {
    ipcRenderer.send('close-settings-window');
});
var fileExtSelected = configuration.readSettings('fileExt');
for (var i = 0; i < radioEl.length; i++) {
    var thisFileExt = radioEl[i].attributes['file-ext'].value;
    if(thisFileExt == fileExtSelected){
        radioEl[i].checked = true;
    }
    else{
        radioEl[i].checked = false;
    }

    radioEl[i].addEventListener('click', function (e) {
        bindRadioButton(e);
    });
}

function bindRadioButton(e) {
    var thisFileExt = e.target.attributes['file-ext'].value;
    configuration.saveSettings('fileExt', thisFileExt);
    ipcRenderer.send('set-file-ext');
}
