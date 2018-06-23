//process call handler
const {
    ipcMain
} = require('electron');

const path = require('path');

const {
    ipcRenderer,
    remote
} = require('electron');

const BrowserWindow = remote.BrowserWindow;
const _os = require('os');
const axios = require('axios');
const _settings = require('electron-settings');

var _sqlite3 = require('sqlite3').verbose();
var _db = new _sqlite3.Database(_os.homedir() + '/dbotwl.db');

const _globalApiProd = "http://otwlfrt3.azurewebsites.net/api/otwlreminder/";
const _globalApiDev = "http://localhost:56259/api/otwlreminder/";

const _globalApi = _globalApiProd;

const isOnline = require('is-online');

app.controller('MasterController', function ($rootScope, $scope, $http, ab, c, $mdSidenav, $interval) {
    $rootScope.pending = 'Feature Pending. Currently Under Development.';
    $rootScope.mainapp = {
        showWait: false,
    };

    $scope.masterc = {};
    $scope.masterc.switchHard = function (value) {
        $scope.masterc.toShow = value;

    };



    if (_settings.get('timer_init_otwl') == 1) {
        _settings.set('timer_init_otwl', 2);
        //will fetch reminders every 10 mins ie. 10min*60sec*1000ms
        $interval(() => {
            $scope.masterc.sync.DbReminders();
        }, 600000);

        $interval(() => {
            $scope.masterc.sync.LocalReminderTimer();
        }, 180000);
    }

    if (_settings.has('auth_token')) {
        //do autologin
        $scope.masterc.switchHard('landing');

    } else {
        //open login form 
        $scope.masterc.toShow = 'login';

    }


    $scope.close = function () {
        // $mdSidenav('left').close();
    };

    $scope.masterc.toggleSideNav = function () {
        //  $mdSidenav("left").toggle();
    };

    $scope.masterc.minimizeWindow = function () {
        remote.BrowserWindow.getFocusedWindow().minimize();
    };

    $scope.masterc.closeWindow = function () {
        ipcRenderer.send('close-window-main');
    };

    $scope.masterc.sync = {
        DbReminders: () => {
            if (_settings.has('auth_token') && _settings.get('auth_token') != '') {
                ipcRenderer.send('refresh-reminder-resync-data-1', {});

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

                        for (let iRows = 0; iRows < rows.length; iRows++) {

                            const modalPath = path.join('file://', __dirname, 'notif.html?rtxt=' + encodeURIComponent(rows[iRows]['r_text']) + '&rid=' + encodeURIComponent(rows[iRows]['r_id']));
                            let winN = new BrowserWindow({
                                width: 450,
                                height: 280,
                                frame: false,
                                alwaysOnTop: true,
                            });

                            winN.on('close', function () {
                                winN = null;
                            });

                            winN.loadURL(modalPath);
                            winN.show();
                        }



                    });


                });

            }
        }
    }


    ipcRenderer.on('snooze-postpone', function (e, arg) {

        let intv_rem = Number(arg.nt_postponeval);
        let update_rem_valid = 1;
        if (intv_rem > 60) {
            intv_rem = 60;
        }

        _db.serialize(function () {

            if (arg.nt_rid != "") {
                _db.all("SELECT * FROM tblreminders where r_id = ?", [arg.nt_rid], function (err, rows) {
                    if (rows.length > 0) {

                        let time_tbm = rows[0]['r_time'].split(":");

                        if (intv_rem == 60) {
                            if (Number(time_tbm[0]) < 23) {
                                time_tbm[0] = Number(time_tbm[0]) + 1;
                            } else {
                                update_rem_valid = 0;
                            }
                        } else if (intv_rem < 60 && intv_rem > 0) {
                            let mins_tot = Number(time_tbm[1]) + intv_rem;
                            if (mins_tot >= 60) {
                                if (Number(time_tbm[0]) < 23) {
                                    time_tbm[0] = Number(time_tbm[0]) + 1;
                                    time_tbm[1] = Number(mins_tot) % 60;

                                } else {
                                    update_rem_valid = 0;
                                }

                            } else {
                                time_tbm[1] = Number(mins_tot);
                            }
                        }


                        let stmt = _db.prepare(`
                        Update tblreminders 
                        SET r_time = ?
                        WHERE r_id = ? `);

                        stmt.run(
                            addZero(time_tbm[0]) + ':' + addZero(time_tbm[1]),
                            arg.nt_rid
                        )

                        stmt.finalize();
                        ipcRenderer.send('refresh-reminder-table-1', {});



                        ab.httpPost(_globalApi + 'usr_postpone_reminder', {
                                'r_id': arg.nt_rid,
                                'r_intv': addZero(time_tbm[0]) + ':' + addZero(time_tbm[1]),
                                'auth_token': _settings.get('auth_token'),

                            })
                            .then(r => {
                                if (r.data.db_status == "true") {

                                } else {
                                    let myNotificationErreU = new window.Notification('Error Occured', {
                                        body: 'Could Not Submit Data to Server'
                                    });

                                }
                            })
                            .catch(error => {
                                $scope.$apply(function () {
                                    $scope.masterc.switchHard('login');
                                });

                            });


                    }
                });
            }

        });





    });

    ipcRenderer.on('reminder-main-logout', function (e, arg) {
        $scope.$apply(function () {
            $scope.masterc.switchHard('login');
            _settings.set('auth_token', '');

        });
    });
});

function addZero(i) {
    if (parseInt(i) < 10) {
        i = "0" + parseInt(i);
    }
    return i;
}