app.controller('landing', function ($rootScope, $scope, ab, c, $q, $timeout) {
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
        switch ($rootScope.toShowReason) {
            case "login-in-progress":
                $scope.landing.banner = "Kindly wait while we establish connection...";
                break;
            case "auto-login-in-progress":
                $scope.landing.banner = "Kindly wait while we authenticate your credentials...";
                break;
            case "1":
                $scope.landing.banner = "";
                break;
            default:
                $scope.landing.banner = "Kindly wait while we authenticate your credentials...";
                break;
        }

    };
    $scope.landing.init();


});