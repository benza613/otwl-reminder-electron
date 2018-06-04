app.controller('reminderFormController', function ($rootScope, $scope, $http, $uibModalInstance, ab, row, c) {


    //current row data
    $scope.row = row.entity;
    //make a copy to restore to original
    $scope.original_row = angular.copy(row.entity);

    //time-binding-to-parent-model
    var d = new Date();
    d.setHours($scope.row.remTime.substring(0, 2));
    d.setMinutes($scope.row.remTime.substring(3, 5));
    $scope.formTime = d;

    $scope.timeChanged = function () {
        $scope.row.remTime = addZero($scope.formTime.getHours()) + ':' + addZero($scope.formTime.getMinutes());
    };

    //date-binding-to-parent-model
    if ($scope.row.remDate != null) {
        var dateParts = $scope.row.remDate.split("/")
        $scope.formDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]); // month is 0-based
    } else {
        $scope.formDate = new Date();
        $scope.row.remDate = formatDate($scope.formDate);
    }


    $scope.dateOptions = {
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
    };
    $scope.openDt = function () {
        $scope.popup1.opened = true;
    };
    $scope.popup1 = {
        opened: false
    };
    $scope.dateChanged = function () {

        $scope.row.remDate = formatDate($scope.formDate);
    }

    if (parseInt($scope.row.remID) > 0) {
        $scope.isExistingRem = false;
    } else {
        $scope.isExistingRem = true;
    }

    //use the modulus operation incase you want higher priority levels on same button
    $scope.priority = {
        toggle: $scope.row.remPriority,
        text: function () {
            if (this.toggle == '1') {
                return "Urgent ";
            }
            return "Normal ";
        },
        up: function () {
            this.toggle = ((parseInt(this.toggle) + 1) % 2).toString();
            $scope.row.remPriority = this.toggle;
            this.text();
        }
    }

    //modal submit or discard
    $scope.yes = function (form) {

        //if required fields are empty then dont proced
        if (!form.$valid) {

            return;
        }
        //ab.reset_form(form);

      
        if ($scope.row.remTime != null) {
            $uibModalInstance.close({
                result: 1,
                formdata: {
                    remTx: $scope.row.remText,
                    remDt: $scope.row.remDate,
                    remTm: $scope.row.remTime,
                    rID: $scope.row.remID,
                    remPriority: $scope.row.remPriority,
                    auth_token: _settings.get('auth_token')
                }
            });


        } else {
            alert('Please correct Reminder Time');
        }

    };
    $scope.discard = function () {

        restoreFields($scope.row, $scope.original_row);

        $uibModalInstance.close({
            result: -1,
            text: 'No sql :) '
        });
    };

   

    function formatDate(d) {
        return addZero(d.getDate()) +
            "/" + addZero((d.getMonth() + 1)) +
            "/" + d.getFullYear();
    }
});