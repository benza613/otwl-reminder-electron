//process call handler
const {
    ipcMain
} = require('electron');
const {
    ipcRenderer,
    remote
} = require('electron');
const _os = require('os');
const axios = require('axios');
const _settings = require('electron-settings');

const _globalApi = "http://otwlfrt4.azurewebsites.net/api/otwlreminder/";
const _globalApiDev = "http://localhost:56259/api/otwlreminder/";

app.controller('MasterController', function ($rootScope, $scope, $http, ab, c, $mdSidenav) {
    $rootScope.pending = 'Feature Pending. Currently Under Development.';



    $scope.masterc = {};
    $rootScope.toShowReason = "";

    $scope.masterc.switchHard = function (value, reason) {
        console.log('here');
        $scope.masterc.toShow = value;

        if (reason != undefined)
            $rootScope.toShowReason = reason;

    };



    if (_settings.has('auth_token')) {
        //do autologin
        $scope.masterc.switchHard('landing', 'auto-login-in-progress');

    } else {
        //open login form 
        $scope.masterc.toShow = 'login';

    }


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