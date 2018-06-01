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

var _sqlite3 = require('sqlite3').verbose();
var _db = new _sqlite3.Database(_os.homedir() + '/dbotwl.db');

const _globalApiProd = "http://otwlfrt4.azurewebsites.net/api/otwlreminder/";
const _globalApiDev = "http://localhost:56259/api/otwlreminder/";

const _globalApi = _globalApiDev;

app.controller('MasterController', function ($rootScope, $scope, $http, ab, c, $mdSidenav, $interval) {
    $rootScope.pending = 'Feature Pending. Currently Under Development.';
    $rootScope.mainapp = {
        showWait: false,
    };

    $scope.masterc = {};
    c(_os.homedir())
    $scope.masterc.switchHard = function (value) {
        $scope.masterc.toShow = value;

    };

    //is in 720 P 
    $interval(() => {
        $scope.masterc.sync.DbReminders();
    }, 600000);

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

    $scope.masterc.sync = {
        DbReminders: () => {
            if (_settings.has('auth_token')) {
                //do autologin
                ab.httpPost(_globalApi + 'usr_get_reminders', {
                        'auth_token': _settings.get('auth_token'),
                    })
                    .then(r => {

                        if (r != null && r.data != null) {
                            //auto login valid
                            if (r.data.db_status == "true") {

                                // _db.serialize(function(){

                                //_db.run("CREATE TABLE if not exists tblreminders (rid TEXT, info TEXT, info12 TEXT)");

                                // });


                                $scope.$apply(function () {
                                    $rootScope.mainapp.showWait = false;
                                    $scope.reminder.gridOptions.data = r.data.db_data;
                                });

                            } else {
                                let myNotificationErr = new window.Notification('Error Occured', {
                                    body: 'Could Not sync Data'
                                });

                                myNotificationErr.onclick = () => {
                                    console.log('Notification clicked');
                                };
                            }
                        }

                    })
                    .catch(error => {
                        $scope.$apply(function () {
                            $scope.masterc.switchHard('login');
                        });

                    });
            }
        }
    }
});