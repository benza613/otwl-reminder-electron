app.controller('login', function ($rootScope, $scope, ab, c, $timeout) {


    $scope.vm = {
        formData: {
            username: '',
            password: '',
        }
    };

    $scope.vm.submit = () => {

        $scope.switchHard('landing');

        $timeout(() => {
            $scope.switchHard('login');

        }, 4000);
        // ab.httpPost('http://otwlfrt4.azurewebsites.net/api/oceanreminder/desk_rem_login', {
        //         'uname': $scope.vm.formData.username,
        //         'upass': $scope.vm.formData.password,
        //     })
        //     .then(response => {
        //         console.log(response);

        //         if (response != null) {
        //             alert(response.resultmessage);

        //             if (response.resultnumber == 1) {
        //                 $scope.$broadcast('login-success');
        //                 _settings.set('auth_token', response.auth_token);

        //                 $scope.masterc.toShow = "landing";


        //             }
        //         }

        //     })
        //     .catch(error => {
        //         console.log(error);
        //         alert('hi');
        //         $scope.masterc.toShow = "login";

        //     });
    };


});