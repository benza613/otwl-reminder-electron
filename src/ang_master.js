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

const _globalApiProd = "http://otwlfrt4.azurewebsites.net/api/otwlreminder/";
const _globalApiDev = "http://localhost:56259/api/otwlreminder/";

const _globalApi = _globalApiDev;

app.controller('MasterController', function ($rootScope, $scope, $http, ab, c, $mdSidenav) {
    $rootScope.pending = 'Feature Pending. Currently Under Development.';

    $rootScope.mainapp = {
        showWait: false,
    };

    $scope.masterc = {};

    $scope.masterc.switchHard = function (value) {
        $scope.masterc.toShow = value;

    };



    if (_settings.has('auth_token')) {
        //do autologin
        $scope.masterc.switchHard('landing');

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