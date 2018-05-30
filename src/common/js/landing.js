app.controller('landing', function ($rootScope, $scope, ab, c, $q,$timeout) {
    $scope.close();

    $scope.landing = {
        banner: "Kindly wait while we authenticate your credentials...",
    };

    $scope.landing.circularProg = false;

    $scope.landing.init = function () {
        $scope.landing.checkReason();
        // $scope.landing.fnautologin();
    };


    $scope.landing.fnautologin = () => {

        $scope.landing.banner = "";
        c(_settings.has('auth_token'));

    };

    $scope.landing.checkReason = () => {
        alert($scope.masterc.toShowReason);
     
    };

    $rootScope.$on('login-in-progress', function (evt, args) {
        alert('why');

        $scope.landing.circularProg = false;
        $scope.masterc.toShow = "landing";
        $scope.landing.banner = "Kindly wait while we authenticate your credentials...";

    });

    $rootScope.$on('auto-login-in-progress', function (evt, args) {

        $scope.landing.circularProg = false;
        $scope.masterc.toShow = "landing";
        $scope.landing.banner = "Kindly wait while we validate your credentials...";

    });



    $scope.landing.init();


});