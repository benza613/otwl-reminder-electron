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

    //will fetch reminders every 10 mins ie. 10min*60sec*1000ms
    $interval(() => {
        $scope.masterc.sync.DbReminders();
    }, 600000);

    $interval(() => {
        $scope.masterc.sync.LocalReminderTimer();
    }, 120000);

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
        },
        LocalReminderTimer: () => {
            if (_settings.has('auth_token')) {
                _db.serialize(function () {

                    let today = new Date();
                    let dd = today.getDate();
                    let mm = today.getMonth() + 1;
                    let yyyy = today.getFullYear();
                    if (dd < 10) {
                        dd = '0' + dd;
                    }

                    if (mm < 10) {
                        mm = '0' + mm;
                    }

                    let hh = today.getHours();
                    let mn = today.getMinutes();

                    today = dd + '/' + mm + '/' + yyyy;


                    let tTime_minus1 = addZero(hh) + ':' + addZero(mn - 1);
                    let tTime_plus1 = addZero(hh) + ':' + addZero(mn + 1);
                    _db.all("SELECT * FROM tblreminders where r_date = ? and r_time BETWEEN ? and ? ", [today, tTime_minus1, tTime_plus1], function (err, rows) {

                        if (rows.length > 0) {

                            let myNotificationNotif = {};
                            for (let idn = 0; idn < rows.length; idn++) {
                                myNotificationNotif[idn] = new window.Notification(rows[idn]['r_text'], {
                                    body: 'Reminder Alert'
                                });

                                myNotificationNotif[idn].onclick = () => {
                                    console.log('Notification clicked');
                                };
                            }


                            //alert(rows.length + '  --  ' + rows[0]['r_text']);
                        }


                    });


                });

            }
        }
    }
});

function addZero(i) {
    if (parseInt(i) < 10) {
        i = "0" + parseInt(i);
    }
    return i;
}