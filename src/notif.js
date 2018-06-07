const electron = require('electron');
const path = require('path');
const remote = electron.remote;

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

document.getElementById("notifyVal").value = getParams(window.location.href).rtxt.toUpperCase();

const closeBtn = document.getElementById('closeBtn');


closeBtn.addEventListener('click', function (e) {

    var wind = remote.getCurrentWindow()

    wind.close()

})