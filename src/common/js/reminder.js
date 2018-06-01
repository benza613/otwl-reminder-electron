app.controller('reminder', function ($rootScope, $scope, ab, c, $timeout, uiGridConstants) {
    $scope.reminder = {};

    $scope.reminder.init = function () {
        let rem_token = _settings.get('auth_token');

        if (rem_token == undefined || rem_token == '') {

            $scope.masterc.switchHard('login');
        } else {
            $scope.reminder.set.rem_grid();
            $rootScope.mainapp.showWait = false;

            $timeout(() => {
                $scope.reminder.get.reminders();
            }, 1000);

        }
        alert('1')
    };

    $scope.reminder.get = {
        reminders: () => {
            $rootScope.mainapp.showWait = true;
            c('here')


            ab.httpPost(_globalApi + 'usr_get_reminders', {
                    'auth_token': _settings.get('auth_token'),
                })
                .then(r => {
                    c(r);


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

    $scope.reminder.set = {
        rem_grid: () => {
            $scope.reminder.gridOptions = {
                enableColumnResizing: true,
                enableSorting: true,
                enableFiltering: true,
                enableCellEdit: false,
                flatEntityAccess: true,
                fastWatch: true,
                showGridFooter: true,
                rowHeight: 32,
                columnDefs: [{
                        name: 'subDepartment',
                        field: "0",
                        width: '14%',
                    },
                    {
                        name: 'reminderText',
                        displayName: 'Reminder',
                        field: "1",
                        width: '35%',
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
                        width: '13%',

                    },
                    {
                        displayName: 'Type',
                        name: 'reminderType',
                        field: "4",
                        width: '10%',
                    },
                    {
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
                        name: 'E',
                        cellTemplate: '<span role="button" class="grid-span-edit glyphicon glyphicon-pencil btn-xs" ng-click="grid.appScope.edit(row, rowRenderIndex)"></span>',
                        width: '6%',
                        enableFiltering: false,

                    }, {
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

    $scope.reminder.init();
});