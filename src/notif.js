const electron = require('electron');
const path = require('path');
const remote = electron.remote;
const ipc = electron.ipcRenderer;

var nt_rid = "";
var getParams = function (url) {
    var params = {};
    var parser = document.createElement('a');
    parser.href = url;
    var query = parser.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
};

document.getElementById("remtextval").innerHTML = getParams(window.location.href).rtxt.toUpperCase();
nt_rid = getParams(window.location.href).rid;

const closeBtn = document.getElementById('closeBtn');
closeBtn.addEventListener('click', function (e) {

    var wind = remote.getCurrentWindow()
    wind.close()

})

const postponeBtn = document.getElementById('PostPoneBtn');
postponeBtn.addEventListener('click', function (e) {

    var wind = remote.getCurrentWindow();

    ipc.send('snooze-specific-rem', {
        nt_rid: nt_rid,
        nt_postponeval: document.getElementById("postponeVal").value.replace(/\D/g,''),
    });
    wind.close()

})