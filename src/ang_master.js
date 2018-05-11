const { ipcRenderer, remote } = require('electron')

app.controller('MasterController', function ($rootScope, $scope, $http, ab, c, $mdSidenav) {

    $rootScope.pending = 'Feature Pending. Currently Under Development.';

    $scope.masterc = {};
    $scope.masterc.toShow = 'login';
    
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