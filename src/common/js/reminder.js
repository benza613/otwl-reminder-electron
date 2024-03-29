app.controller('reminder', function ($rootScope, $scope, ab, c, $timeout, $uibModal, uiGridConstants) {
    $scope.reminder = {
        remData: [],
        startDate: new Date(),
        endDate: new Date(),

        popupStartDate: {
            opened: false
        },
        popupEndDate: {
            opened: false
        },

        dateOptionsRange: {
            formatYear: 'yy',
            maxDate: new Date(2022, 5, 22),
            startingDay: 1
        },

        openDateS: function () {
            $scope.reminder.popupStartDate.opened = true;
        },

        openDateE: function () {
            $scope.reminder.popupEndDate.opened = true;
        }
    };

    $scope.reminder.init = function () {
        let rem_token = _settings.get('auth_token');

        if (rem_token == undefined || rem_token == '') {

            $scope.masterc.switchHard('login');
        } else {
            $scope.reminder.set.rem_grid();

            $scope.reminder.gridOptions.data = $scope.reminder.remData;

            $scope.reminder.get.reminders();

        }
    };

    $scope.reminder.get = {
        reminders: () => {

            isOnline({
                timeout: 5000,
            }).then(online => {
                if (online) {
                    $rootScope.mainapp.showWait = true;

                    _db.serialize(function () {

                        _db.run(`CREATE TABLE if not exists
                        tblreminders (r_id INTEGER, r_sd TEXT, r_text TEXT, r_date TEXT,
                       r_time TEXT, r_type TEXT, r_priority INTEGER, r_refid TEXT, r_synced INTEGER )`);
                        _db.all("SELECT * FROM tblreminders where r_synced = ? or r_synced = ? ", ["0", "-1"], function (err, rows_send_server) {


                            ab.httpPost(_globalApi + 'usr_get_reminders', {
                                    'auth_token': _settings.get('auth_token'),
                                })
                                .then(r => {
                                    console.log(r);
                                    if (r != null && r.data != null) {
                                        //auto login valid
                                        
                                        if (r.data.db_status == "true") {

                                            _db.serialize(function () {
                                                _db.run("DELETE FROM tblreminders WHERE r_synced = 0");

                                                let stmt = _db.prepare("INSERT INTO tblreminders VALUES (?,?,?,?,?,?,?,?,?)");

                                                for (let rowIndex = 0; rowIndex < r.data.db_data.length; rowIndex++) {

                                                    stmt.run(
                                                        r.data.db_data[rowIndex][6],
                                                        r.data.db_data[rowIndex][0],
                                                        r.data.db_data[rowIndex][1],
                                                        r.data.db_data[rowIndex][2],
                                                        r.data.db_data[rowIndex][3],
                                                        r.data.db_data[rowIndex][4],
                                                        r.data.db_data[rowIndex][5],
                                                        r.data.db_data[rowIndex][7],
                                                        "0"
                                                    )

                                                }
                                                stmt.finalize();

                                                $scope.reminder.readLocalData();

                                            });
                                            //_db.close();


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



                        });
                    });
                }
            });
        }
    }

    $scope.reminder.set = {
        rem_grid: () => {
            $scope.reminder.gridOptions = {
                enableColumnResizing: true,
                enableSorting: true,
                enableFiltering: true,
                enableCellEdit: false,
                paginationPageSizes: [5, 10, 25],
                paginationPageSize: 5,
                flatEntityAccess: true,
                fastWatch: true,
                showGridFooter: true,
                rowHeight: 32,
                columnDefs: [{
                        displayName: 'Priority',
                        name: 'reminderPriority',
                        field: "5",
                        filter: {
                            type: uiGridConstants.filter.SELECT, // <- move this to here
                            selectOptions: [{
                                    value: '0',
                                    label: 'Normal'
                                },
                                {
                                    value: '1',
                                    label: 'Urgent'
                                }
                            ]
                        },
                        width: '10%',
                        cellTemplate: '<div>{{COL_FIELD == "0" ? "Normal" : "Urgent"}}</div>',
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            if (row.entity.remPriority == "1") {
                                return 'impReminder';
                            }
                            return 'normalReminder';
                        },
                    },

                    {
                        name: 'reminderText',
                        displayName: 'Reminder',
                        field: "1",
                        width: '45%',
                    },
                    {
                        name: 'E',
                        cellTemplate: '<span role="button" class="grid-span-edit glyphicon glyphicon-pencil btn-xs" ng-click="grid.appScope.reminder.formAction.editReminder(row, rowRenderIndex)"></span>',
                        width: '6%',
                        enableFiltering: false,

                    },
                    {
                        displayName: 'Date',
                        name: 'reminderDate',
                        field: "2",
                        width: '17%',

                    },
                    {
                        displayName: 'Time',
                        name: 'reminderTime',
                        field: "3",
                        width: '10%',

                    },
                    {
                        displayName: 'Type',
                        name: 'reminderType',
                        field: "4",
                        width: '13%',
                    },
                    {
                        name: 'subDepartment',
                        field: "0",
                        width: '14%',
                    },
                    {
                        name: 'R',
                        cellTemplate: '<span role="button" class="grid-span-redirect glyphicon glyphicon-arrow-right btn-xs" ng-click="grid.appScope.showdynamicDiv(row)"></span>',
                        width: '6%',
                        enableFiltering: false,

                    }
                ],
                onRegisterApi: function (gridApi) {

                    $scope.reminder.gridApi = gridApi;

                },
            };

        }
    }

    $scope.reminder.formAction = {
        insertReminder: () => {
            $scope.reminder.row = {};
            $scope.reminder.row.entity = {
                remText: "",
                remDate: null,
                remTime: "14:00",
                remType: "General",
                remID: "0",
                remPriority: "0",
            };

            var modalInstanceI = $uibModal.open({
                animation: true,
                templateUrl: 'common/html/reminderForm.html',
                controller: 'reminderFormController',
                backdrop: 'static',
                windowClass: 'app-modal-window',
                resolve: {
                    row: function () {

                        return $scope.reminder.row;

                    },
                }
            });

            modalInstanceI.result.then(function (data) {
                if (data.result === 1) {

                    isOnline({
                        timeout: 5000,
                    }).then(online => {
                        if (online) {
                            ab.httpPost(_globalApi + 'usr_ins_reminder', data.formdata)
                                .then(r => {
                                    if (r != null && r.data != null) {
                                        //auto login valid
                                        if (r.data.db_status == "true") {

                                            _db.serialize(function () {
                                                let stmt = _db.prepare("INSERT INTO tblreminders VALUES (?,?,?,?,?,?,?,?)");

                                                for (let rowIndex = 0; rowIndex < r.data.db_data.length; rowIndex++) {

                                                    stmt.run(
                                                        r.data.db_data[rowIndex][6],
                                                        r.data.db_data[rowIndex][0],
                                                        r.data.db_data[rowIndex][1],
                                                        r.data.db_data[rowIndex][2],
                                                        r.data.db_data[rowIndex][3],
                                                        r.data.db_data[rowIndex][4],
                                                        r.data.db_data[rowIndex][5],
                                                        r.data.db_data[rowIndex][7]
                                                    )

                                                }
                                                stmt.finalize();

                                                $scope.reminder.readLocalData();

                                            });
                                            //_db.close();


                                        } else {
                                            let myNotificationErr = new window.Notification('Error Occured', {
                                                body: 'Could Not sync Data'
                                            });

                                        }
                                    }

                                })
                                .catch(error => {
                                    $scope.$apply(function () {
                                        $scope.masterc.switchHard('login');
                                    });

                                });

                        } else {
                            alert('No Internet Connection');

                        }
                    });



                }
            }).catch(function () {
                //restore since "esc" was clicked

            });


        },
        editReminder: (rowx, index) => {
            $scope.reminder.row = {};

            $scope.reminder.row.entity = {
                remText: angular.copy(rowx.entity[1]),
                remDate: angular.copy(rowx.entity[2]),
                remTime: angular.copy(rowx.entity[3]),
                remType: angular.copy(rowx.entity[4]),
                remID: angular.copy(rowx.entity[6]),
                remPriority: angular.copy(rowx.entity[5]),
            };

            var modalInstanceI = $uibModal.open({
                animation: true,
                templateUrl: 'common/html/reminderForm.html',
                controller: 'reminderFormController',
                backdrop: 'static',
                windowClass: 'app-modal-window',
                resolve: {
                    row: function () {

                        return $scope.reminder.row;

                    },
                }
            });

            modalInstanceI.result.then(function (data) {
                if (data.result === 1) {

                    isOnline({
                        timeout: 5000,
                    }).then(online => {
                        if (online) {
                            $rootScope.mainapp.showWait = true;

                            ab.httpPost(_globalApi + 'usr_ins_update', data.formdata)
                                .then(r => {
                                    c(r);
                                    if (r.data.db_status == "true") {

                                        _db.serialize(function () {
                                            let stmt = _db.prepare(`
                                    Update tblreminders 
                                    SET r_text = ? , r_date = ? , r_time = ? , r_priority = ?
                                    WHERE r_id = ? `);
                                            for (let rowIndex = 0; rowIndex < r.data.db_data.length; rowIndex++) {

                                                stmt.run(
                                                    r.data.db_data[rowIndex][1],
                                                    r.data.db_data[rowIndex][2],
                                                    r.data.db_data[rowIndex][3],
                                                    r.data.db_data[rowIndex][5],
                                                    r.data.db_data[rowIndex][6],
                                                )

                                            }
                                            stmt.finalize();

                                            $scope.reminder.readLocalData();

                                        });
                                        //_db.close();


                                    } else {
                                        let myNotificationErrU = new window.Notification('Error Occured', {
                                            body: 'Could Not Update Data'
                                        });

                                        myNotificationErrU.onclick = () => {
                                            console.log('Notification clicked');
                                        };
                                    }
                                })
                                .catch(error => {
                                    $scope.$apply(function () {
                                        $scope.masterc.switchHard('login');
                                    });

                                });

                        } else {
                            alert('No Internet Connection');

                        }
                    });

                } else if (data.result === 2) {
                    //restore since "esc" was clicked

                    isOnline({
                        timeout: 5000,
                    }).then(online => {

                        if (online) {
                            $rootScope.mainapp.showWait = true;

                            ab.httpPost(_globalApi + 'usr_ins_delete', data.formdata)
                                .then(r => {
                                    c(r);
                                    if (r.data.db_status == "true") {

                                        _db.serialize(function () {
                                            let stmt = _db.prepare(`DELETE FROM tblreminders WHERE r_id = ? `);
                                            stmt.run(r.data.db_data);

                                            stmt.finalize();

                                            $scope.reminder.readLocalData();

                                        });

                                    } else {
                                        let myNotificationErrU = new window.Notification('Error Occured', {
                                            body: 'Could Not Delete Data'
                                        });

                                    }
                                })
                                .catch(error => {
                                    $scope.$apply(function () {
                                        $scope.masterc.switchHard('login');
                                    });

                                });

                        } else {
                            alert('No Internet Connection');

                        }
                    });
                }
            }).catch(function () {

            });

        },
        refreshReminders: () => {
            $scope.reminder.get.reminders();
        },
    }

    $scope.reminder.readLocalData = () => {
        console.log('readLocalData')
        $scope.reminder.remData = [];
        _db.serialize(function () {

            _db.all("SELECT * FROM tblreminders", function (err, rows) {
                _db.all("SELECT * FROM tblreminders", function (err, rows) {

                    for (let i = 0; i < rows.length; i++) {
                        $scope.reminder.remData.push([
                            rows[i]["r_sd"],
                            rows[i]["r_text"],
                            rows[i]["r_date"],
                            rows[i]["r_time"],
                            rows[i]["r_type"],
                            rows[i]["r_priority"],
                            rows[i]["r_id"],
                            rows[i]["r_refid"]
                        ]);
                    }

                    $scope.$apply(function () {
                        $rootScope.mainapp.showWait = false;
                        $scope.reminder.gridOptions.data = $scope.reminder.remData;

                    });

                });
            });


        });


    }

    $scope.reminder.init();

    ipcRenderer.on('refresh-reminder-table', function (e, arg) {
        $rootScope.mainapp.showWait = true;

        $scope.reminder.readLocalData();
    });

    ipcRenderer.on('refresh-reminder-resync-data', function (e, arg) {


        $scope.$apply(function () {
            $scope.reminder.formAction.refreshReminders();
        });
    });

});