//process call handler
const { ipcMain } = require('electron');
const {
    ipcRenderer,
    remote
} = require('electron');
const axios = require('axios');
const _settings = require('electron-settings');

app.controller('MasterController', function ($rootScope, $scope, $http, ab, c, $mdSidenav) {
    $rootScope.pending = 'Feature Pending. Currently Under Development.';

    $scope.masterc = {};
    $scope.masterc.toShowReason = "";

    if (_settings.has('auth_token')) {
        //do autologin
        $scope.masterc.toShow = 'landing';

    } else {
        //open login form 
        $scope.masterc.toShow = 'login';

    }

    $scope.switchHard = function (value) {
        $scope.masterc.toShowReason = value;
        $scope.masterc.toShow = value;

    };

    $scope.close = function () {
        $mdSidenav('left').close();
    };

    $scope.masterc.toggleSideNav = function () {
        $mdSidenav("left").toggle();
    };

    $scope.masterc.minimizeWindow = function () {
        remote.BrowserWindow.getFocusedWindow().minimize();
    };

    $scope.masterc.closeWindow = function () {
        ipcRenderer.send('close-window-main');
    };

});