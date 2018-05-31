app.controller('reminder', function ($rootScope, $scope, ab, c, $timeout, uiGridConstants) {
    $scope.reminder = {};

    $scope.reminder.init = function () {

        let rem_token = _settings.get('auth_token');

        if (rem_token == undefined || rem_token == '') {
            $scope.masterc.switchHard('login');
        } else {
            $scope.reminder.get.reminders();
        }
    };

    $scope.reminder.init();
});