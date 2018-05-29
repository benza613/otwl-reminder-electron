app.controller('landing', function ($rootScope, $scope, ab, c, $q) {
    $scope.close();

    $scope.landing = {};

    $scope.landing.circularProg = false;
    $scope.landing.init = function () {
        $scope.landing.fnautologin();
    }


    $scope.landing.fnautologin = () => {
        c(_settings.has('auth_token'));

    }

    $scope.landing.init();


});