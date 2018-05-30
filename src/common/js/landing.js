app.controller('landing', function ($rootScope, $scope, ab, c, $q, $timeout) {
    $scope.close();

    $scope.landing = {
        banner: "Kindly wait while we authenticate your credentials...",
    };

    $scope.landing.circularProg = false;

    $scope.landing.init = function () {

        // $scope.landing.fnautologin();
    };


    $scope.landing.fnautologin = () => {

        $scope.landing.banner = "";
    };


    $scope.landing.init();


});